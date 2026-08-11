const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: 'default_player',
    },
    username: {
      type: String,
      default: 'Farmer',
    },
    coins: {
      type: Number,
      default: 500,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    waterLevel: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    totalHarvests: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Level up logic: every 100 XP
userSchema.methods.checkLevelUp = function () {
  const xpNeeded = this.level * 100;
  if (this.experience >= xpNeeded) {
    this.level += 1;
    this.experience -= xpNeeded;
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
