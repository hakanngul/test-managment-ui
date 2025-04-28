const os = require('os');
const si = require('systeminformation');
const AgentLauncher = require('../models/AgentLauncher');
const SystemResources = require('../models/SystemResources');
const PerformanceMetrics = require('../models/PerformanceMetrics');
const ProcessedRequest = require('../models/ProcessedRequest');
const logger = require('../utils/logger');
const config = require('../config/config');

/**
 * Start metrics collection
 */
const startMetricsCollection = () => {
  const cron = require('node-cron');
  
  // Collect system resources every minute
  cron.schedule('* * * * *', async () => {
    try {
      await collectSystemResources();
    } catch (error) {
      logger.error(`Error collecting system resources: ${error.message}`);
    }
  });
  
  // Collect performance metrics every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      await collectPerformanceMetrics();
    } catch (error) {
      logger.error(`Error collecting performance metrics: ${error.message}`);
    }
  });
  
  logger.info('Metrics collection started');
};

/**
 * Collect system resources
 */
const collectSystemResources = async () => {
  try {
    // Get launcher ID
    const launcher = await AgentLauncher.findOne({});
    
    if (!launcher) {
      logger.warn('Cannot collect system resources: Launcher not found');
      return;
    }
    
    // Collect CPU info
    const cpuLoad = await si.currentLoad();
    const cpuTemp = await si.cpuTemperature();
    
    // Collect memory info
    const memInfo = await si.mem();
    
    // Collect disk info
    const diskInfo = await si.fsSize();
    const systemDisk = diskInfo.find(disk => disk.mount === '/') || diskInfo[0];
    
    // Collect network info
    const netStats = await si.networkStats();
    const netConnections = await si.networkConnections();
    
    // Collect process info
    const processes = await si.processes();
    
    // Create system resources document
    const systemResources = await SystemResources.create({
      launcherId: launcher.id,
      cpu: {
        usage: cpuLoad.currentLoad,
        loadAverage: os.loadavg(),
        temperature: cpuTemp.main || cpuTemp.cores?.[0] || null
      },
      memory: {
        total: Math.round(memInfo.total / (1024 * 1024)), // MB
        used: Math.round(memInfo.used / (1024 * 1024)), // MB
        free: Math.round(memInfo.free / (1024 * 1024)), // MB
        usage: Math.round((memInfo.used / memInfo.total) * 100) // %
      },
      disk: {
        total: Math.round(systemDisk.size / (1024 * 1024 * 1024)), // GB
        used: Math.round(systemDisk.used / (1024 * 1024 * 1024)), // GB
        free: Math.round(systemDisk.size - systemDisk.used) / (1024 * 1024 * 1024), // GB
        usage: systemDisk.use // %
      },
      network: {
        bytesIn: netStats.reduce((sum, net) => sum + net.rx_bytes, 0),
        bytesOut: netStats.reduce((sum, net) => sum + net.tx_bytes, 0),
        connections: netConnections.length
      },
      processes: {
        total: processes.all,
        running: processes.running,
        blocked: processes.blocked
      }
    });
    
    logger.debug(`System resources collected: ${systemResources._id}`);
    
    return systemResources;
  } catch (error) {
    logger.error(`Error collecting system resources: ${error.message}`);
    throw error;
  }
};

/**
 * Collect performance metrics
 */
const collectPerformanceMetrics = async () => {
  try {
    // Get launcher ID
    const launcher = await AgentLauncher.findOne({});
    
    if (!launcher) {
      logger.warn('Cannot collect performance metrics: Launcher not found');
      return;
    }
    
    // Get completed requests in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const completedRequests = await ProcessedRequest.find({
      completedAt: { $gte: oneHourAgo }
    });
    
    if (completedRequests.length === 0) {
      logger.debug('No completed requests in the last hour, skipping performance metrics collection');
      return;
    }
    
    // Calculate execution times
    const executionTimes = completedRequests.map(req => req.executionTime).filter(Boolean);
    executionTimes.sort((a, b) => a - b);
    
    // Calculate wait times
    const waitTimes = completedRequests.map(req => req.waitTime).filter(Boolean);
    waitTimes.sort((a, b) => a - b);
    
    // Calculate success rate
    const successCount = completedRequests.filter(req => req.status === 'COMPLETED' && req.result?.success).length;
    const successRate = (successCount / completedRequests.length) * 100;
    
    // Calculate throughput (tests per minute)
    const throughput = completedRequests.length / 60;
    
    // Get latest system resources
    const latestResources = await SystemResources.findOne({})
      .sort({ timestamp: -1 })
      .limit(1);
    
    // Create performance metrics document
    const performanceMetrics = await PerformanceMetrics.create({
      launcherId: launcher.id,
      metrics: {
        testExecutionTime: {
          average: calculateAverage(executionTimes),
          min: executionTimes[0] || 0,
          max: executionTimes[executionTimes.length - 1] || 0,
          p50: calculatePercentile(executionTimes, 50),
          p90: calculatePercentile(executionTimes, 90),
          p95: calculatePercentile(executionTimes, 95),
          p99: calculatePercentile(executionTimes, 99)
        },
        queueWaitTime: {
          average: calculateAverage(waitTimes),
          min: waitTimes[0] || 0,
          max: waitTimes[waitTimes.length - 1] || 0,
          p50: calculatePercentile(waitTimes, 50),
          p90: calculatePercentile(waitTimes, 90),
          p95: calculatePercentile(waitTimes, 95),
          p99: calculatePercentile(waitTimes, 99)
        },
        successRate,
        throughput,
        concurrentTests: launcher.activeAgents,
        resourceUtilization: latestResources ? {
          cpu: latestResources.cpu.usage,
          memory: latestResources.memory.usage,
          network: (latestResources.network.bytesIn + latestResources.network.bytesOut) / (1024 * 1024) // MB/s
        } : null
      },
      period: 'HOUR'
    });
    
    logger.debug(`Performance metrics collected: ${performanceMetrics._id}`);
    
    return performanceMetrics;
  } catch (error) {
    logger.error(`Error collecting performance metrics: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate average of an array
 */
const calculateAverage = (arr) => {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

/**
 * Calculate percentile of an array
 */
const calculatePercentile = (arr, percentile) => {
  if (!arr || arr.length === 0) return 0;
  
  const index = Math.ceil((percentile / 100) * arr.length) - 1;
  return arr[index] || 0;
};

/**
 * Get system resources
 */
const getSystemResources = async (limit = 60) => {
  try {
    const resources = await SystemResources.find({})
      .sort({ timestamp: -1 })
      .limit(limit);
    
    return resources;
  } catch (error) {
    logger.error(`Error getting system resources: ${error.message}`);
    throw error;
  }
};

/**
 * Get performance metrics
 */
const getPerformanceMetrics = async (period = 'HOUR', limit = 24) => {
  try {
    const metrics = await PerformanceMetrics.find({ period })
      .sort({ timestamp: -1 })
      .limit(limit);
    
    return metrics;
  } catch (error) {
    logger.error(`Error getting performance metrics: ${error.message}`);
    throw error;
  }
};

module.exports = {
  startMetricsCollection,
  collectSystemResources,
  collectPerformanceMetrics,
  getSystemResources,
  getPerformanceMetrics
};
