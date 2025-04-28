const Agent = require('../models/Agent');
const logger = require('../utils/logger');
const { processQueue } = require('./queueService');

/**
 * Get all agents
 */
const getAllAgents = async () => {
  try {
    const agents = await Agent.find({});
    return agents;
  } catch (error) {
    logger.error(`Error getting all agents: ${error.message}`);
    throw error;
  }
};

/**
 * Get agent by ID
 */
const getAgentById = async (agentId) => {
  try {
    const agent = await Agent.findOne({ id: agentId });
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    return agent;
  } catch (error) {
    logger.error(`Error getting agent by ID: ${error.message}`);
    throw error;
  }
};

/**
 * Update agent status
 */
const updateAgentStatus = async (agentId, status) => {
  try {
    const agent = await Agent.findOne({ id: agentId });
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    // Update status
    agent.status = status;
    agent.lastHeartbeat = new Date();
    
    // If agent becomes idle, clear current test
    if (status === 'IDLE') {
      agent.currentTest = null;
    }
    
    await agent.save();
    
    // If agent becomes idle, process queue
    if (status === 'IDLE') {
      processQueue();
    }
    
    return agent;
  } catch (error) {
    logger.error(`Error updating agent status: ${error.message}`);
    throw error;
  }
};

/**
 * Update agent capabilities
 */
const updateAgentCapabilities = async (agentId, capabilities) => {
  try {
    const agent = await Agent.findOne({ id: agentId });
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    // Update capabilities
    agent.capabilities = {
      ...agent.capabilities,
      ...capabilities
    };
    
    await agent.save();
    
    return agent;
  } catch (error) {
    logger.error(`Error updating agent capabilities: ${error.message}`);
    throw error;
  }
};

/**
 * Update agent health status
 */
const updateAgentHealth = async (agentId, healthData) => {
  try {
    const agent = await Agent.findOne({ id: agentId });
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    // Update health status
    agent.healthStatus = {
      healthy: healthData.healthy,
      lastHealthCheck: new Date(),
      issues: healthData.issues || []
    };
    
    // Update performance metrics
    if (healthData.performance) {
      agent.performance = {
        ...agent.performance,
        ...healthData.performance
      };
    }
    
    agent.lastHeartbeat = new Date();
    await agent.save();
    
    return agent;
  } catch (error) {
    logger.error(`Error updating agent health: ${error.message}`);
    throw error;
  }
};

/**
 * Agent heartbeat
 */
const agentHeartbeat = async (agentId) => {
  try {
    const agent = await Agent.findOne({ id: agentId });
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    // Update heartbeat timestamp
    agent.lastHeartbeat = new Date();
    await agent.save();
    
    return { success: true, timestamp: agent.lastHeartbeat };
  } catch (error) {
    logger.error(`Error updating agent heartbeat: ${error.message}`);
    throw error;
  }
};

/**
 * Check for stale agents
 */
const checkStaleAgents = async () => {
  try {
    const staleThreshold = new Date(Date.now() - 60000); // 1 minute
    
    // Find agents with old heartbeats
    const staleAgents = await Agent.find({
      status: { $in: ['IDLE', 'BUSY', 'STARTING'] },
      lastHeartbeat: { $lt: staleThreshold }
    });
    
    if (staleAgents.length === 0) {
      return { success: true, staleAgents: 0 };
    }
    
    logger.warn(`Found ${staleAgents.length} stale agents`);
    
    // Update stale agents to ERROR status
    for (const agent of staleAgents) {
      agent.status = 'ERROR';
      agent.healthStatus.healthy = false;
      agent.healthStatus.issues.push({
        type: 'HEARTBEAT_TIMEOUT',
        message: 'Agent failed to send heartbeat',
        timestamp: new Date()
      });
      
      await agent.save();
      
      logger.warn(`Marked agent as ERROR due to stale heartbeat: ${agent.id} (${agent.name})`);
    }
    
    return { success: true, staleAgents: staleAgents.length };
  } catch (error) {
    logger.error(`Error checking stale agents: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getAllAgents,
  getAgentById,
  updateAgentStatus,
  updateAgentCapabilities,
  updateAgentHealth,
  agentHeartbeat,
  checkStaleAgents
};
