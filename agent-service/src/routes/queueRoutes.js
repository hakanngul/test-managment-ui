const express = require('express');
const router = express.Router();
const {
  addRequest,
  getQueue,
  getProcessed,
  cancelQueuedRequest,
  updateProgress,
  completeQueuedRequest
} = require('../controllers/queueController');

// Queue routes
router.post('/', addRequest);
router.get('/', getQueue);
router.get('/processed', getProcessed);
router.delete('/:id', cancelQueuedRequest);
router.put('/:id/progress', updateProgress);
router.put('/:id/complete', completeQueuedRequest);

module.exports = router;
