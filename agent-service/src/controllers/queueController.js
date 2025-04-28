const asyncHandler = require('express-async-handler');
const { 
  addToQueue, 
  getQueuedRequests, 
  getProcessedRequests, 
  cancelRequest, 
  updateRequestProgress, 
  completeRequest 
} = require('../services/queueService');
const { validateQueuedRequest } = require('../utils/validators');
const errorHandler = require('../utils/errorHandler');

/**
 * @desc    Add test request to queue
 * @route   POST /api/queue
 * @access  Public
 */
const addRequest = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = validateQueuedRequest(req.body);
  if (error) {
    throw errorHandler.badRequest(error.details[0].message);
  }
  
  const queuedRequest = await addToQueue(req.body);
  res.status(201).json(queuedRequest);
});

/**
 * @desc    Get queued requests
 * @route   GET /api/queue
 * @access  Public
 */
const getQueue = asyncHandler(async (req, res) => {
  const requests = await getQueuedRequests();
  res.status(200).json(requests);
});

/**
 * @desc    Get processed requests
 * @route   GET /api/queue/processed
 * @access  Public
 */
const getProcessed = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const requests = await getProcessedRequests(limit ? parseInt(limit, 10) : 100);
  res.status(200).json(requests);
});

/**
 * @desc    Cancel a queued request
 * @route   DELETE /api/queue/:id
 * @access  Public
 */
const cancelQueuedRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await cancelRequest(id);
  res.status(200).json(result);
});

/**
 * @desc    Update request progress
 * @route   PUT /api/queue/:id/progress
 * @access  Public
 */
const updateProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { progress, status } = req.body;
  
  if (progress === undefined || progress < 0 || progress > 100) {
    throw errorHandler.badRequest('Valid progress (0-100) is required');
  }
  
  const request = await updateRequestProgress(id, progress, status);
  res.status(200).json(request);
});

/**
 * @desc    Complete a request
 * @route   PUT /api/queue/:id/complete
 * @access  Public
 */
const completeQueuedRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = req.body;
  
  if (result === undefined || typeof result.success !== 'boolean') {
    throw errorHandler.badRequest('Valid result with success field is required');
  }
  
  const processedRequest = await completeRequest(id, result);
  res.status(200).json(processedRequest);
});

module.exports = {
  addRequest,
  getQueue,
  getProcessed,
  cancelQueuedRequest,
  updateProgress,
  completeQueuedRequest
};
