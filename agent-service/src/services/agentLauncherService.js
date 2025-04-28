const { spawn } = require('child_process');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const AgentLauncher = require('../models/AgentLauncher');
const Agent = require('../models/Agent');
const QueuedRequest = require('../models/QueuedRequest');
const logger = require('../utils/logger');
const config = require('../config/config');

// Agent process map
const agentProcesses = new Map();

/**
 * Initialize the Agent Launcher
 */
const initializeLauncher = async () => {
  try {
    // Check if launcher already exists
    let launcher = await AgentLauncher.findOne({});
    
    if (!launcher) {
      // Create new launcher
      launcher = await AgentLauncher.create({
        name: 'Main Agent Launcher',
        status: 'STARTING',
        maxAgents: config.maxAgents,
        config: {
          minAgents: config.minAgents,
          autoScaling: true
        },
        systemInfo: await getSystemInfo()
      });
      
      logger.info(`Agent Launcher created with ID: ${launcher.id}`);
    } else {
      // Update existing launcher
      launcher.status = 'STARTING';
      launcher.lastHeartbeat = new Date();
      launcher.systemInfo = await getSystemInfo();
      await launcher.save();
      
      logger.info(`Agent Launcher updated with ID: ${launcher.id}`);
    }
    
    // Set launcher to ONLINE
    launcher.status = 'ONLINE';
    await launcher.save();
    
    // Start initial agents
    await scaleAgents(launcher.config.minAgents);
    
    // Start auto-scaling if enabled
    if (launcher.config.autoScaling) {
      startAutoScaling();
    }
    
    return launcher;
  } catch (error) {
    logger.error(`Error initializing launcher: ${error.message}`);
    throw error;
  }
};

/**
 * Get system information
 */
const getSystemInfo = async () => {
  const os = require('os');
  
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpuCores: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / (1024 * 1024 * 1024)), // GB
    uptime: os.uptime()
  };
};

/**
 * Start a new agent
 */
const startAgent = async (name = null) => {
  try {
    const agentId = uuidv4();
    const agentName = name || `Agent-${agentId.substring(0, 8)}`;
    
    // Create agent in database
    const agent = await Agent.create({
      id: agentId,
      launcherId: (await AgentLauncher.findOne({})).id,
      name: agentName,
      status: 'STARTING'
    });
    
    logger.info(`Starting agent: ${agentName} (${agentId})`);
    
    // Start agent process
    const agentProcess = spawn('node', [
      path.join(__dirname, '../../agent/index.js')
    ], {
      env: {
        ...process.env,
        AGENT_ID: agentId,
        AGENT_NAME: agentName,
        SERVICE_URL: `http://localhost:${config.port}`
      },
      detached: true,
      stdio: 'pipe'
    });
    
    // Store process reference
    agentProcesses.set(agentId, {
      process: agentProcess,
      startTime: new Date()
    });
    
    // Handle process events
    agentProcess.stdout.on('data', (data) => {
      logger.info(`[${agentName}] ${data.toString().trim()}`);
    });
    
    agentProcess.stderr.on('data', (data) => {
      logger.error(`[${agentName}] ${data.toString().trim()}`);
    });
    
    agentProcess.on('close', async (code) => {
      logger.info(`Agent ${agentName} exited with code ${code}`);
      
      // Update agent status in database
      await Agent.findOneAndUpdate(
        { id: agentId },
        { 
          status: code === 0 ? 'OFFLINE' : 'ERROR',
          updatedAt: new Date()
        }
      );
      
      // Remove from process map
      agentProcesses.delete(agentId);
      
      // Update launcher active agents count
      await updateLauncherAgentCount();
    });
    
    // Update launcher active agents count
    await updateLauncherAgentCount();
    
    return agent;
  } catch (error) {
    logger.error(`Error starting agent: ${error.message}`);
    throw error;
  }
};

/**
 * Stop an agent
 */
const stopAgent = async (agentId) => {
  try {
    // Get agent
    const agent = await Agent.findOne({ id: agentId });
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    logger.info(`Stopping agent: ${agent.name} (${agentId})`);
    
    // Update agent status
    agent.status = 'STOPPING';
    await agent.save();
    
    // Get process
    const agentProcess = agentProcesses.get(agentId);
    
    if (agentProcess && agentProcess.process) {
      // Send SIGTERM to process
      agentProcess.process.kill('SIGTERM');
      
      // Wait for process to exit
      setTimeout(async () => {
        if (agentProcesses.has(agentId)) {
          // Force kill if still running
          agentProcess.process.kill('SIGKILL');
          agentProcesses.delete(agentId);
          
          // Update agent status
          await Agent.findOneAndUpdate(
            { id: agentId },
            { 
              status: 'OFFLINE',
              updatedAt: new Date()
            }
          );
        }
      }, 5000);
    } else {
      // Update agent status if process not found
      await Agent.findOneAndUpdate(
        { id: agentId },
        { 
          status: 'OFFLINE',
          updatedAt: new Date()
        }
      );
    }
    
    // Update launcher active agents count
    await updateLauncherAgentCount();
    
    return { success: true, message: `Agent ${agentId} stopping` };
  } catch (error) {
    logger.error(`Error stopping agent: ${error.message}`);
    throw error;
  }
};

/**
 * Scale agents to target count
 */
const scaleAgents = async (targetCount) => {
  try {
    // Get current agents
    const agents = await Agent.find({
      status: { $in: ['IDLE', 'BUSY', 'STARTING'] }
    });
    
    const currentCount = agents.length;
    
    logger.info(`Scaling agents: current=${currentCount}, target=${targetCount}`);
    
    if (currentCount < targetCount) {
      // Scale up - start new agents
      const agentsToStart = targetCount - currentCount;
      
      for (let i = 0; i < agentsToStart; i++) {
        await startAgent();
      }
      
      logger.info(`Started ${agentsToStart} new agents`);
    } else if (currentCount > targetCount) {
      // Scale down - stop idle agents
      const agentsToStop = currentCount - targetCount;
      const idleAgents = agents.filter(a => a.status === 'IDLE');
      
      for (let i = 0; i < Math.min(agentsToStop, idleAgents.length); i++) {
        await stopAgent(idleAgents[i].id);
      }
      
      logger.info(`Stopped ${Math.min(agentsToStop, idleAgents.length)} idle agents`);
    }
    
    return { success: true, currentCount: targetCount };
  } catch (error) {
    logger.error(`Error scaling agents: ${error.message}`);
    throw error;
  }
};

/**
 * Update launcher active agents count
 */
const updateLauncherAgentCount = async () => {
  try {
    const activeAgentsCount = await Agent.countDocuments({
      status: { $in: ['IDLE', 'BUSY', 'STARTING'] }
    });
    
    await AgentLauncher.findOneAndUpdate(
      {},
      { 
        activeAgents: activeAgentsCount,
        updatedAt: new Date()
      }
    );
    
    return activeAgentsCount;
  } catch (error) {
    logger.error(`Error updating launcher agent count: ${error.message}`);
    throw error;
  }
};

/**
 * Start auto-scaling
 */
const startAutoScaling = () => {
  const cron = require('node-cron');
  
  // Run auto-scaling every minute
  cron.schedule('* * * * *', async () => {
    try {
      const launcher = await AgentLauncher.findOne({});
      
      if (!launcher || !launcher.config.autoScaling || launcher.status !== 'ONLINE') {
        return;
      }
      
      // Get queue size
      const queueSize = await QueuedRequest.countDocuments({ status: 'QUEUED' });
      
      // Get active agents
      const activeAgents = await Agent.countDocuments({
        status: { $in: ['IDLE', 'BUSY', 'STARTING'] }
      });
      
      // Calculate target agent count based on queue size and active agents
      let targetAgentCount = activeAgents;
      
      if (queueSize > 0) {
        // Simple scaling algorithm: 1 agent per 5 queued requests, within min/max limits
        const calculatedCount = Math.ceil(queueSize / 5);
        targetAgentCount = Math.min(
          launcher.maxAgents,
          Math.max(launcher.config.minAgents, calculatedCount)
        );
      } else {
        // No queued requests, scale down to minimum
        targetAgentCount = launcher.config.minAgents;
      }
      
      // Only scale if target count is different from current count
      if (targetAgentCount !== activeAgents) {
        logger.info(`Auto-scaling: queue=${queueSize}, active=${activeAgents}, target=${targetAgentCount}`);
        await scaleAgents(targetAgentCount);
      }
    } catch (error) {
      logger.error(`Auto-scaling error: ${error.message}`);
    }
  });
};

/**
 * Get launcher status
 */
const getLauncherStatus = async () => {
  try {
    const launcher = await AgentLauncher.findOne({});
    
    if (!launcher) {
      throw new Error('Agent Launcher not found');
    }
    
    // Update system info
    launcher.systemInfo = await getSystemInfo();
    launcher.lastHeartbeat = new Date();
    await launcher.save();
    
    return launcher;
  } catch (error) {
    logger.error(`Error getting launcher status: ${error.message}`);
    throw error;
  }
};

/**
 * Update launcher configuration
 */
const updateLauncherConfig = async (config) => {
  try {
    const launcher = await AgentLauncher.findOne({});
    
    if (!launcher) {
      throw new Error('Agent Launcher not found');
    }
    
    // Update fields
    if (config.name) launcher.name = config.name;
    if (config.maxAgents) launcher.maxAgents = config.maxAgents;
    
    // Update config object
    if (config.config) {
      launcher.config = {
        ...launcher.config,
        ...config.config
      };
    }
    
    await launcher.save();
    
    // Scale agents if min agents changed
    if (config.config && config.config.minAgents && launcher.status === 'ONLINE') {
      await scaleAgents(config.config.minAgents);
    }
    
    return launcher;
  } catch (error) {
    logger.error(`Error updating launcher config: ${error.message}`);
    throw error;
  }
};

module.exports = {
  initializeLauncher,
  startAgent,
  stopAgent,
  scaleAgents,
  getLauncherStatus,
  updateLauncherConfig
};
