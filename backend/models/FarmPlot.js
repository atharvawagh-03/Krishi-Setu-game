const mongoose = require('mongoose');

// Crop definitions with growth times, costs, and rewards
const CROP_DEFINITIONS = {
  wheat: {
    name: 'Wheat',
    emoji: '🌾',
    cost: 20,
    reward: 40,
    growthTime: 30, // seconds (30s for demo; set to 60+ for real)
    waterCost: 5,
    xpReward: 10,
  },
  tomato: {
    name: 'Tomato',
    emoji: '🍅',
    cost: 50,
    reward: 95,
    growthTime: 60,
    waterCost: 5,
    xpReward: 20,
  },
  corn: {
    name: 'Corn',
    emoji: '🌽',
    cost: 80,
    reward: 160,
    growthTime: 120,
    waterCost: 5,
    xpReward: 35,
  },
  strawberry: {
    name: 'Strawberry',
    emoji: '🍓',
    cost: 120,
    reward: 280,
    growthTime: 180,
    waterCost: 5,
    xpReward: 60,
  },
  sunflower: {
    name: 'Sunflower',
    emoji: '🌻',
    cost: 100,
    reward: 220,
    growthTime: 150,
    waterCost: 5,
    xpReward: 45,
    season: 'summer',
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
      enum: ['wheat', 'tomato', 'corn', 'strawberry', 'sunflower', null],
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
