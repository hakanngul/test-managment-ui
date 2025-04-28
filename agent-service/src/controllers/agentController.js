const asyncHandler = require('express-async-handler');
const { 
  getAllAgents, 
  getAgentById, 
  updateAgentStatus, 
  updateAgentCapabilities, 
  updateAgentHealth, 
  agentHeartbeat 
} = require('../services/agentService');
const { validateAgent } = require('../utils/validators');
const errorHandler = require('../utils/errorHandler');

/**
 * @desc    Get all agents
 * @route   GET /api/agents
 * @access  Public
 */
const getAgents = asyncHandler(async (req, res) => {
  const agents = await getAllAgents();
  res.status(200).json(agents);
});

/**
 * @desc    Get agent by ID
 * @route   GET /api/agents/:id
 * @access  Public
 */
const getAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const agent = await getAgentById(id);
  
  if (!agent) {
    throw errorHandler.notFound(`Agent not found with id: ${id}`);
  }
  
  res.status(200).json(agent);
});

/**
 * @desc    Update agent status
 * @route   PUT /api/agents/:id/status
 * @access  Public
 */
const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    throw errorHandler.badRequest('Status is required');
  }
  
  const validStatuses = ['IDLE', 'BUSY', 'OFFLINE', 'STARTING', 'STOPPING', 'ERROR'];
  if (!validStatuses.includes(status)) {
    throw errorHandler.badRequest(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  const agent = await updateAgentStatus(id, status);
  res.status(200).json(agent);
});

/**
 * @desc    Update agent capabilities
 * @route   PUT /api/agents/:id/capabilities
 * @access  Public
 */
const updateCapabilities = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const capabilities = req.body;
  
  if (!capabilities || Object.keys(capabilities).length === 0) {
    throw errorHandler.badRequest('Capabilities are required');
  }
  
  const agent = await updateAgentCapabilities(id, capabilities);
  res.status(200).json(agent);
});

/**
 * @desc    Update agent health
 * @route   PUT /api/agents/:id/health
 * @access  Public
 */
const updateHealth = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const healthData = req.body;
  
  if (!healthData || typeof healthData.healthy !== 'boolean') {
    throw errorHandler.badRequest('Valid health data is required');
  }
  
  const agent = await updateAgentHealth(id, healthData);
  res.status(200).json(agent);
});

/**
 * @desc    Agent heartbeat
 * @route   POST /api/agents/:id/heartbeat
 * @access  Public
 */
const heartbeat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await agentHeartbeat(id);
  res.status(200).json(result);
});

module.exports = {
  getAgents,
  getAgent,
  updateStatus,
  updateCapabilities,
  updateHealth,
  heartbeat
};
