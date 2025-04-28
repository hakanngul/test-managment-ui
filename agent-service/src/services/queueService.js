const QueuedRequest = require('../models/QueuedRequest');
const ProcessedRequest = require('../models/ProcessedRequest');
const Agent = require('../models/Agent');
const logger = require('../utils/logger');

/**
 * Add a test request to the queue
 */
const addToQueue = async (requestData) => {
  try {
    // Create queued request
    const queuedRequest = await QueuedRequest.create({
      ...requestData,
      status: 'QUEUED',
      queuedAt: new Date()
    });
    
    logger.info(`Added request to queue: ${queuedRequest.id} - ${queuedRequest.testName}`);
    
    // Trigger queue processing
    processQueue();
    
    return queuedRequest;
  } catch (error) {
    logger.error(`Error adding request to queue: ${error.message}`);
    throw error;
  }
};

/**
 * Process the queue
 */
const processQueue = async () => {
  try {
    // Get queued requests sorted by priority and queue position
    const queuedRequests = await QueuedRequest.find({ status: 'QUEUED' })
      .sort({ priority: 1, queuePosition: 1 })
      .limit(10); // Process 10 at a time
    
    if (queuedRequests.length === 0) {
      return;
    }
    
    // Get available agents
    const availableAgents = await Agent.find({ status: 'IDLE' });
    
    if (availableAgents.length === 0) {
      logger.debug('No available agents to process queue');
      return;
    }
    
    logger.info(`Processing queue: ${queuedRequests.length} requests, ${availableAgents.length} available agents`);
    
    // Assign requests to agents
    for (let i = 0; i < Math.min(queuedRequests.length, availableAgents.length); i++) {
      const request = queuedRequests[i];
      const agent = availableAgents[i];
      
      // Update request status
      request.status = 'ASSIGNED';
      request.assignedTo = agent.id;
      request.assignedAt = new Date();
      await request.save();
      
      // Update agent status
      agent.status = 'BUSY';
      agent.currentTest = {
        testId: request.id,
        startTime: new Date(),
        progress: 0
      };
      await agent.save();
      
      logger.info(`Assigned request ${request.id} to agent ${agent.id}`);
    }
    
    // Reorder remaining queue positions
    await reorderQueuePositions();
  } catch (error) {
    logger.error(`Error processing queue: ${error.message}`);
  }
};

/**
 * Reorder queue positions
 */
const reorderQueuePositions = async () => {
  try {
    // Get all queued requests
    const queuedRequests = await QueuedRequest.find({ status: 'QUEUED' })
      .sort({ priority: 1, queuePosition: 1 });
    
    // Update queue positions
    for (let i = 0; i < queuedRequests.length; i++) {
      if (queuedRequests[i].queuePosition !== i + 1) {
        await QueuedRequest.findByIdAndUpdate(queuedRequests[i]._id, {
          queuePosition: i + 1,
          // Update estimated start time
          estimatedStartTime: new Date(Date.now() + (i + 1) * 60000) // Simple estimation: 1 minute per position
        });
      }
    }
  } catch (error) {
    logger.error(`Error reordering queue positions: ${error.message}`);
  }
};

/**
 * Get queued requests
 */
const getQueuedRequests = async () => {
  try {
    const requests = await QueuedRequest.find({
      status: { $in: ['QUEUED', 'ASSIGNED', 'RUNNING'] }
    }).sort({ queuePosition: 1 });
    
    return requests;
  } catch (error) {
    logger.error(`Error getting queued requests: ${error.message}`);
    throw error;
  }
};

/**
 * Get processed requests
 */
const getProcessedRequests = async (limit = 100) => {
  try {
    const requests = await ProcessedRequest.find({})
      .sort({ completedAt: -1 })
      .limit(limit);
    
    return requests;
  } catch (error) {
    logger.error(`Error getting processed requests: ${error.message}`);
    throw error;
  }
};

/**
 * Cancel a queued request
 */
const cancelRequest = async (requestId) => {
  try {
    // Get request
    const request = await QueuedRequest.findOne({ id: requestId });
    
    if (!request) {
      throw new Error(`Request not found: ${requestId}`);
    }
    
    // Check if request can be cancelled
    if (request.status === 'COMPLETED' || request.status === 'FAILED' || request.status === 'CANCELLED') {
      throw new Error(`Cannot cancel request with status: ${request.status}`);
    }
    
    // If request is assigned or running, notify agent
    if (request.status === 'ASSIGNED' || request.status === 'RUNNING') {
      // Update agent status
      await Agent.findOneAndUpdate(
        { id: request.assignedTo },
        { 
          status: 'IDLE',
          currentTest: null
        }
      );
    }
    
    // Update request status
    request.status = 'CANCELLED';
    await request.save();
    
    // Create processed request
    await ProcessedRequest.create({
      id: `proc-${request.id}`,
      originalRequestId: request.id,
      testCaseId: request.testCaseId,
      testName: request.testName,
      status: 'CANCELLED',
      agentId: request.assignedTo,
      queuedAt: request.queuedAt,
      startedAt: request.startedAt,
      completedAt: new Date(),
      waitTime: request.assignedAt ? request.assignedAt - request.queuedAt : null,
      executionTime: request.startedAt ? new Date() - request.startedAt : null,
      browser: request.browser,
      retryCount: request.retryCount
    });
    
    // Reorder queue positions
    await reorderQueuePositions();
    
    // Trigger queue processing
    processQueue();
    
    return { success: true, message: `Request ${requestId} cancelled` };
  } catch (error) {
    logger.error(`Error cancelling request: ${error.message}`);
    throw error;
  }
};

/**
 * Update request progress
 */
const updateRequestProgress = async (requestId, progress, status) => {
  try {
    // Get request
    const request = await QueuedRequest.findOne({ id: requestId });
    
    if (!request) {
      throw new Error(`Request not found: ${requestId}`);
    }
    
    // Update request status if provided
    if (status) {
      request.status = status;
      
      // If starting, update startedAt
      if (status === 'RUNNING' && !request.startedAt) {
        request.startedAt = new Date();
      }
      
      // If completing, update completedAt
      if (status === 'COMPLETED' || status === 'FAILED') {
        request.completedAt = new Date();
        
        // Calculate times
        request.waitTime = request.startedAt - request.queuedAt;
        request.executionTime = request.completedAt - request.startedAt;
      }
    }
    
    await request.save();
    
    // Update agent progress
    if (request.assignedTo) {
      await Agent.findOneAndUpdate(
        { id: request.assignedTo },
        { 
          'currentTest.progress': progress
        }
      );
    }
    
    return request;
  } catch (error) {
    logger.error(`Error updating request progress: ${error.message}`);
    throw error;
  }
};

/**
 * Complete a request
 */
const completeRequest = async (requestId, result) => {
  try {
    // Get request
    const request = await QueuedRequest.findOne({ id: requestId });
    
    if (!request) {
      throw new Error(`Request not found: ${requestId}`);
    }
    
    // Check if request is running
    if (request.status !== 'RUNNING' && request.status !== 'ASSIGNED') {
      throw new Error(`Cannot complete request with status: ${request.status}`);
    }
    
    // Update request status
    request.status = result.success ? 'COMPLETED' : 'FAILED';
    request.completedAt = new Date();
    
    // Calculate times
    if (request.startedAt) {
      request.executionTime = new Date() - request.startedAt;
    }
    if (request.queuedAt && request.startedAt) {
      request.waitTime = request.startedAt - request.queuedAt;
    }
    
    await request.save();
    
    // Create processed request
    const processedRequest = await ProcessedRequest.create({
      id: `proc-${request.id}`,
      originalRequestId: request.id,
      testCaseId: request.testCaseId,
      testName: request.testName,
      status: request.status,
      agentId: request.assignedTo,
      queuedAt: request.queuedAt,
      startedAt: request.startedAt,
      completedAt: request.completedAt,
      waitTime: request.waitTime,
      executionTime: request.executionTime,
      result: {
        success: result.success,
        errorMessage: result.errorMessage,
        errorType: result.errorType,
        errorStack: result.errorStack,
        screenshotUrl: result.screenshotUrl,
        videoUrl: result.videoUrl,
        logUrl: result.logUrl
      },
      testSteps: result.testSteps || [],
      performance: result.performance || {},
      browser: request.browser,
      retryCount: request.retryCount
    });
    
    // Update agent status
    if (request.assignedTo) {
      // Update agent performance metrics
      const agent = await Agent.findOne({ id: request.assignedTo });
      
      if (agent) {
        agent.status = 'IDLE';
        agent.currentTest = null;
        agent.performance.testCount += 1;
        
        // Update success rate
        const successCount = agent.performance.successRate * (agent.performance.testCount - 1) / 100;
        const newSuccessCount = result.success ? successCount + 1 : successCount;
        agent.performance.successRate = (newSuccessCount / agent.performance.testCount) * 100;
        
        await agent.save();
      }
    }
    
    // Trigger queue processing
    processQueue();
    
    return processedRequest;
  } catch (error) {
    logger.error(`Error completing request: ${error.message}`);
    throw error;
  }
};

module.exports = {
  addToQueue,
  processQueue,
  getQueuedRequests,
  getProcessedRequests,
  cancelRequest,
  updateRequestProgress,
  completeRequest
};
