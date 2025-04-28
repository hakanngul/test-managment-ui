const express = require('express');
const router = express.Router();
const {
  getAgents,
  getAgent,
  updateStatus,
  updateCapabilities,
  updateHealth,
  heartbeat
} = require('../controllers/agentController');

// Agent routes
router.get('/', getAgents);
router.get('/:id', getAgent);
router.put('/:id/status', updateStatus);
router.put('/:id/capabilities', updateCapabilities);
router.put('/:id/health', updateHealth);
router.post('/:id/heartbeat', heartbeat);

module.exports = router;
