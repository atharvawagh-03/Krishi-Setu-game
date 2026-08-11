const User = require('../models/User');
const FarmPlot = require('../models/FarmPlot');
const HarvestLog = require('../models/HarvestLog');
const axios = require('axios');

const CROPS = FarmPlot.CROPS;
const USER_ID = process.env.DEFAULT_USER_ID || 'default_player';

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

// ─── Helper: get or create default user ───────────────────────────────────────
const getOrCreateUser = async () => {
  let user = await User.findOne({ userId: USER_ID });
  if (!user) {
    user = await User.create({ userId: USER_ID });
    // Initialize 9 empty farm plots
    const plots = Array.from({ length: 9 }, (_, i) => ({
      userId: USER_ID,
      plotIndex: i,
      state: 'empty',
    }));
    await FarmPlot.insertMany(plots);
  }
  return user;
};

// ─── Helper: sync plot states (check if any growing plots are now ready) ───────
const syncPlotStates = async () => {
  const now = new Date();
  await FarmPlot.updateMany(
    { userId: USER_ID, state: 'growing', readyAt: { $lte: now } },
    { $set: { state: 'ready' } }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/farm
// ─────────────────────────────────────────────────────────────────────────────
exports.getFarm = async (req, res, next) => {
  try {
    const user = await getOrCreateUser();
    await syncPlotStates();
    const plots = await FarmPlot.find({ userId: USER_ID }).sort('plotIndex');

    res.json({
      success: true,
      user: {
        coins: user.coins,
        level: user.level,
        experience: user.experience,
        waterLevel: user.waterLevel,
        totalHarvests: user.totalHarvests,
        totalEarnings: user.totalEarnings,
      },
      plots: plots.map((p) => ({
        plotIndex: p.plotIndex,
        state: p.state,
        cropType: p.cropType,
        plantedAt: p.plantedAt,
        readyAt: p.readyAt,
        progress: p.progress,
        secondsRemaining: p.secondsRemaining,
        cropInfo: p.cropType ? CROPS[p.cropType] : null,
      })),
      crops: CROPS,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/plant  { plotIndex, cropType }
// ─────────────────────────────────────────────────────────────────────────────
exports.plantCrop = async (req, res, next) => {
  try {
    const { plotIndex, cropType } = req.body;

    if (plotIndex === undefined || !cropType) {
      return res.status(400).json({ success: false, error: 'plotIndex and cropType are required' });
    }
    if (!CROPS[cropType]) {
      return res.status(400).json({ success: false, error: 'Invalid crop type' });
    }

    const season = getCurrentSeason();
    const crop = CROPS[cropType];
    if (crop.season && crop.season !== season) {
      return res.status(400).json({
        success: false,
        error: `${crop.name} can only be planted in ${crop.season}.`,
      });
    }

    const user = await getOrCreateUser();

    if (user.coins < crop.cost) {
      return res.status(400).json({ success: false, error: 'Not enough coins to plant this crop' });
    }

    const plot = await FarmPlot.findOne({ userId: USER_ID, plotIndex });
    if (!plot) {
      return res.status(404).json({ success: false, error: 'Plot not found' });
    }
    if (plot.state !== 'empty' && plot.state !== 'harvested') {
      return res.status(400).json({ success: false, error: 'Plot is already occupied' });
    }
    if (user.waterLevel < crop.waterCost) {
      return res.status(400).json({ success: false, error: 'Not enough water. Please refill first.' });
    }

    // Deduct coins and water
    user.coins -= crop.cost;
    user.waterLevel = Math.max(0, user.waterLevel - crop.waterCost);

    // Set growth timestamps
    const now = new Date();
    const readyAt = new Date(now.getTime() + crop.growthTime * 1000);

    plot.state = 'growing';
    plot.cropType = cropType;
    plot.plantedAt = now;
    plot.readyAt = readyAt;
    plot.wateredAt = now;

    await Promise.all([user.save(), plot.save()]);

    res.json({
      success: true,
      message: `🌱 ${crop.name} planted successfully!`,
      plot: {
        plotIndex: plot.plotIndex,
        state: plot.state,
        cropType: plot.cropType,
        plantedAt: plot.plantedAt,
        readyAt: plot.readyAt,
        progress: plot.progress,
        secondsRemaining: plot.secondsRemaining,
        cropInfo: crop,
      },
      user: { coins: user.coins, waterLevel: user.waterLevel },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/harvest  { plotIndex }
// ─────────────────────────────────────────────────────────────────────────────
exports.harvestCrop = async (req, res, next) => {
  try {
    const { plotIndex } = req.body;

    if (plotIndex === undefined) {
      return res.status(400).json({ success: false, error: 'plotIndex is required' });
    }

    await syncPlotStates();

    const user = await getOrCreateUser();
    const plot = await FarmPlot.findOne({ userId: USER_ID, plotIndex });

    if (!plot) return res.status(404).json({ success: false, error: 'Plot not found' });
    if (plot.state !== 'ready') {
      return res.status(400).json({ success: false, error: 'Crop is not ready to harvest yet' });
    }

    const crop = CROPS[plot.cropType];
    // Level bonus: +2% per level above 1
    const levelBonus = 1 + (user.level - 1) * 0.02;
    const coinsEarned = Math.floor(crop.reward * levelBonus);
    const xpEarned = crop.xpReward;
    const growthDuration = Math.floor((Date.now() - plot.plantedAt) / 1000);

    // Update user
    user.coins += coinsEarned;
    user.experience += xpEarned;
    user.totalHarvests += 1;
    user.totalEarnings += coinsEarned;
    user.checkLevelUp();

    // Reset plot
    const prevCropType = plot.cropType;
    const prevEmoji = crop.emoji;
    plot.state = 'harvested';
    plot.cropType = null;
    plot.plantedAt = null;
    plot.readyAt = null;

    // Log harvest
    const log = new HarvestLog({
      userId: USER_ID,
      cropType: prevCropType,
      cropEmoji: prevEmoji,
      plotIndex,
      coinsEarned,
      xpEarned,
      growthDuration,
    });

    await Promise.all([user.save(), plot.save(), log.save()]);

    // Reset plot to empty after a brief delay (handled client-side via state)
    plot.state = 'empty';
    await plot.save();

    res.json({
      success: true,
      message: `🎉 Harvested ${crop.name}! Earned ${coinsEarned} coins!`,
      coinsEarned,
      xpEarned,
      user: {
        coins: user.coins,
        level: user.level,
        experience: user.experience,
        totalHarvests: user.totalHarvests,
        totalEarnings: user.totalEarnings,
      },
      plot: { plotIndex, state: 'empty', cropType: null, progress: 0 },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/water
// ─────────────────────────────────────────────────────────────────────────────
exports.waterFarm = async (req, res, next) => {
  try {
    const user = await getOrCreateUser();
    user.waterLevel = 100;
    await user.save();

    res.json({
      success: true,
      message: '💧 Water refilled to 100%!',
      waterLevel: user.waterLevel,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/stats
// ─────────────────────────────────────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const user = await getOrCreateUser();
    const logs = await HarvestLog.find({ userId: USER_ID })
      .sort({ harvestedAt: -1 })
      .limit(20);

    // Aggregate by crop type
    const byType = await HarvestLog.aggregate([
      { $match: { userId: USER_ID } },
      { $group: { _id: '$cropType', total: { $sum: '$coinsEarned' }, count: { $sum: 1 } } },
    ]);

    // Last 7 days earnings
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const daily = await HarvestLog.aggregate([
      { $match: { userId: USER_ID, harvestedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$harvestedAt' } },
          earnings: { $sum: '$coinsEarned' },
          harvests: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      user: {
        coins: user.coins,
        level: user.level,
        experience: user.experience,
        totalHarvests: user.totalHarvests,
        totalEarnings: user.totalEarnings,
      },
      recentHarvests: logs,
      byType,
      daily,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/advisor
// ─────────────────────────────────────────────────────────────────────────────
exports.getAdvisor = async (req, res, next) => {
  try {
    const user = await getOrCreateUser();
    await syncPlotStates();
    const plots = await FarmPlot.find({ userId: USER_ID });

    const emptyPlots = plots.filter((p) => p.state === 'empty' || p.state === 'harvested').length;
    const readyPlots = plots.filter((p) => p.state === 'ready').length;
    const growingPlots = plots.filter((p) => p.state === 'growing').length;

    // Try to get AI recommendation
    let aiRecommendation = null;
    try {
      const temperature = 20 + Math.floor(Math.random() * 15);
      const rainfall = Math.floor(Math.random() * 100);
      const aiRes = await axios.post(
        `${process.env.AI_SERVICE_URL || 'http://localhost:5001'}/predict`,
        {
          temperature,
          rainfall,
          water_level: user.waterLevel,
          coins: user.coins,
        },
        { timeout: 2000 }
      );
      aiRecommendation = aiRes.data;
    } catch {
      // AI service unavailable – use rule-based fallback
      aiRecommendation = null;
    }

    // Build advice messages
    const advice = [];

    if (readyPlots > 0) {
      advice.push({
        type: 'harvest',
        icon: '🎉',
        message: `You have ${readyPlots} crop${readyPlots > 1 ? 's' : ''} ready to harvest! Don't wait too long!`,
      });
    }

    if (user.waterLevel < 30) {
      advice.push({
        type: 'water',
        icon: '💧',
        message: `Your water level is at ${user.waterLevel}%. Consider refilling soon!`,
      });
    }

    if (emptyPlots > 0 && user.coins >= 20) {
      const rec = aiRecommendation?.recommended_crop || 'Wheat';
      advice.push({
        type: 'plant',
        icon: '🌱',
        message: `You have ${emptyPlots} empty plot${emptyPlots > 1 ? 's' : ''}. AI recommends planting ${rec}!`,
        crop: rec,
        expectedProfit: aiRecommendation?.expected_profit,
      });
    }

    if (growingPlots > 0) {
      advice.push({
        type: 'growing',
        icon: '⏳',
        message: `${growingPlots} crop${growingPlots > 1 ? 's are' : ' is'} growing. Check back soon!`,
      });
    }

    if (user.coins < 50) {
      advice.push({
        type: 'economy',
        icon: '💰',
        message: `Coins are running low (${user.coins}). Try harvesting to earn more!`,
      });
    }

    if (advice.length === 0) {
      advice.push({
        type: 'idle',
        icon: '😊',
        message: 'Your farm looks great! Keep planting to level up faster.',
      });
    }

    res.json({
      success: true,
      advice,
      aiRecommendation,
      farmSummary: { emptyPlots, growingPlots, readyPlots },
    });
  } catch (err) {
    next(err);
  }
};
