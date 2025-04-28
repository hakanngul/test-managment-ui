const express = require('express');
const router = express.Router();
const {
  initialize,
  getStatus,
  updateConfig,
  startNewAgent,
  stopExistingAgent,
  scaleToTargetCount
} = require('../controllers/agentLauncherController');

// Agent launcher routes
router.post('/initialize', initialize);
router.get('/status', getStatus);
router.put('/config', updateConfig);
router.post('/agents', startNewAgent);
router.delete('/agents/:id', stopExistingAgent);
router.post('/scale', scaleToTargetCount);

module.exports = router;
