const mongoose = require('mongoose');

// Crop definitions with growth times, costs, and rewards
const CROP_DEFINITIONS = {
  wheat: {
    name: 'Wheat',
    emoji: '🌾',
    cost: 20,
    reward: 40,
    growthTime: 30,
    waterCost: 5,
    xpReward: 10,
    idealSeasons: ['winter', 'spring'],
    season: 'winter',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  tomato: {
    name: 'Tomato',
    emoji: '🍅',
    cost: 50,
    reward: 95,
    growthTime: 60,
    waterCost: 8,
    xpReward: 20,
    idealSeasons: ['spring', 'summer'],
    season: 'summer',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  corn: {
    name: 'Corn',
    emoji: '🌽',
    cost: 80,
    reward: 160,
    growthTime: 120,
    waterCost: 10,
    xpReward: 35,
    idealSeasons: ['monsoon', 'summer'],
    season: 'monsoon',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  strawberry: {
    name: 'Strawberry',
    emoji: '🍓',
    cost: 120,
    reward: 280,
    growthTime: 180,
    waterCost: 12,
    xpReward: 60,
    idealSeasons: ['winter', 'spring'],
    season: 'spring',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  sunflower: {
    name: 'Sunflower',
    emoji: '🌻',
    cost: 100,
    reward: 220,
    growthTime: 150,
    waterCost: 9,
    xpReward: 45,
    idealSeasons: ['summer', 'monsoon'],
    season: 'summer',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  rice: {
    name: 'Rice',
    emoji: '🌾',
    cost: 60,
    reward: 130,
    growthTime: 110,
    waterCost: 14,
    xpReward: 28,
    idealSeasons: ['monsoon', 'spring'],
    season: 'monsoon',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  potato: {
    name: 'Potato',
    emoji: '🥔',
    cost: 70,
    reward: 150,
    growthTime: 130,
    waterCost: 11,
    xpReward: 32,
    idealSeasons: ['winter', 'spring'],
    season: 'winter',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  spinach: {
    name: 'Spinach',
    emoji: '🌿',
    cost: 45,
    reward: 90,
    growthTime: 70,
    waterCost: 7,
    xpReward: 18,
    idealSeasons: ['winter', 'spring'],
    season: 'spring',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  chili: {
    name: 'Chili',
    emoji: '🌶️',
    cost: 90,
    reward: 200,
    growthTime: 140,
    waterCost: 10,
    xpReward: 40,
    idealSeasons: ['summer', 'monsoon'],
    season: 'summer',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  cotton: {
    name: 'Cotton',
    emoji: '🧵',
    cost: 110,
    reward: 250,
    growthTime: 170,
    waterCost: 12,
    xpReward: 50,
    idealSeasons: ['summer', 'monsoon'],
    season: 'monsoon',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
  sugarcane: {
    name: 'Sugarcane',
    emoji: '🎋',
    cost: 130,
    reward: 320,
    growthTime: 200,
    waterCost: 15,
    xpReward: 70,
    idealSeasons: ['monsoon', 'summer'],
    season: 'monsoon',
    growthStages: ['Seedling', 'Growing', 'Mature', 'Ready'],
  },
};

const farmPlotSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'default_player',
    },
    plotIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 8,
    },
    state: {
      type: String,
      enum: ['empty', 'growing', 'ready', 'harvested'],
      default: 'empty',
    },
    cropType: {
      type: String,
      enum: ['wheat', 'tomato', 'corn', 'strawberry', 'sunflower', 'rice', 'potato', 'spinach', 'chili', 'cotton', 'sugarcane', null],
      default: null,
    },
    plantedAt: {
      type: Date,
      default: null,
    },
    readyAt: {
      type: Date,
      default: null,
    },
    wateredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Virtual: progress percentage (0-100)
farmPlotSchema.virtual('progress').get(function () {
  if (this.state !== 'growing' || !this.plantedAt || !this.readyAt) return 0;
  const now = Date.now();
  const total = this.readyAt - this.plantedAt;
  const elapsed = now - this.plantedAt;
  return Math.min(100, Math.floor((elapsed / total) * 100));
});

// Virtual: seconds remaining
farmPlotSchema.virtual('secondsRemaining').get(function () {
  if (this.state !== 'growing' || !this.readyAt) return 0;
  const remaining = Math.max(0, Math.floor((this.readyAt - Date.now()) / 1000));
  return remaining;
});

farmPlotSchema.set('toJSON', { virtuals: true });
farmPlotSchema.set('toObject', { virtuals: true });

farmPlotSchema.statics.CROPS = CROP_DEFINITIONS;

module.exports = mongoose.model('FarmPlot', farmPlotSchema);
