const express = require('express');
const router = express.Router();
const {
  getResources,
  getLatestResources,
  collectResources,
  getMetrics,
  getLatestMetrics
} = require('../controllers/metricsController');

// Metrics routes
router.get('/system', getResources);
router.get('/system/latest', getLatestResources);
router.post('/system/collect', collectResources);
router.get('/performance', getMetrics);
router.get('/performance/latest', getLatestMetrics);

module.exports = router;
