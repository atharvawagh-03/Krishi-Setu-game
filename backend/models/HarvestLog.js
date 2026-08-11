const mongoose = require('mongoose');

const harvestLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'default_player',
    },
    cropType: {
      type: String,
      enum: ['wheat', 'tomato', 'corn', 'strawberry'],
      required: true,
    },
    cropEmoji: {
      type: String,
      default: '🌾',
    },
    plotIndex: {
      type: Number,
      required: true,
    },
    coinsEarned: {
      type: Number,
      required: true,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    growthDuration: {
      type: Number, // seconds
      default: 0,
    },
    harvestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HarvestLog', harvestLogSchema);
