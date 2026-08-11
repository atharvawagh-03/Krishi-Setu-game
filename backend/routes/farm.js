const express = require('express');
const router = express.Router();
const {
  getFarm,
  plantCrop,
  harvestCrop,
  waterFarm,
  getStats,
  getAdvisor,
} = require('../controllers/farmController');

// Farm state
router.get('/farm', getFarm);

// Farming actions
router.post('/plant', plantCrop);
router.post('/harvest', harvestCrop);
router.post('/water', waterFarm);

// Analytics and advisor
router.get('/stats', getStats);
router.get('/advisor', getAdvisor);

module.exports = router;
