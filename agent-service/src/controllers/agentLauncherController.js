const asyncHandler = require('express-async-handler');
const { 
  initializeLauncher, 
  startAgent, 
  stopAgent, 
  scaleAgents, 
  getLauncherStatus, 
  updateLauncherConfig 
} = require('../services/agentLauncherService');
const { validateAgentLauncher } = require('../utils/validators');
const errorHandler = require('../utils/errorHandler');

/**
 * @desc    Initialize agent launcher
 * @route   POST /api/launcher/initialize
 * @access  Public
 */
const initialize = asyncHandler(async (req, res) => {
  const launcher = await initializeLauncher();
  res.status(200).json(launcher);
});

/**
 * @desc    Get launcher status
 * @route   GET /api/launcher/status
 * @access  Public
 */
const getStatus = asyncHandler(async (req, res) => {
  const status = await getLauncherStatus();
  res.status(200).json(status);
});

/**
 * @desc    Update launcher configuration
 * @route   PUT /api/launcher/config
 * @access  Public
 */
const updateConfig = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = validateAgentLauncher(req.body);
  if (error) {
    throw errorHandler.badRequest(error.details[0].message);
  }
  
  const launcher = await updateLauncherConfig(req.body);
  res.status(200).json(launcher);
});

/**
 * @desc    Start a new agent
 * @route   POST /api/launcher/agents
 * @access  Public
 */
const startNewAgent = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const agent = await startAgent(name);
  res.status(201).json(agent);
});

/**
 * @desc    Stop an agent
 * @route   DELETE /api/launcher/agents/:id
 * @access  Public
 */
const stopExistingAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await stopAgent(id);
  res.status(200).json(result);
});

/**
 * @desc    Scale agents to target count
 * @route   POST /api/launcher/scale
 * @access  Public
 */
const scaleToTargetCount = asyncHandler(async (req, res) => {
  const { targetCount } = req.body;
  
  if (!targetCount || isNaN(targetCount) || targetCount < 0) {
    throw errorHandler.badRequest('Valid targetCount is required');
  }
  
  const result = await scaleAgents(parseInt(targetCount, 10));
  res.status(200).json(result);
});

module.exports = {
  initialize,
  getStatus,
  updateConfig,
  startNewAgent,
  stopExistingAgent,
  scaleToTargetCount
};
