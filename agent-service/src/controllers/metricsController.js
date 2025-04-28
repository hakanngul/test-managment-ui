const asyncHandler = require('express-async-handler');
const {
  getSystemResources,
  getPerformanceMetrics,
  collectSystemResources
} = require('../services/metricsService');
const errorHandler = require('../utils/errorHandler');

/**
 * @desc    Get system resources
 * @route   GET /api/metrics/system
 * @access  Public
 */
const getResources = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const resources = await getSystemResources(limit ? parseInt(limit, 10) : 60);
  res.status(200).json(resources);
});

/**
 * @desc    Get latest system resources
 * @route   GET /api/metrics/system/latest
 * @access  Public
 */
const getLatestResources = asyncHandler(async (req, res) => {
  const resources = await getSystemResources(1);
  const resource = resources[0] || {};

  // Web UI'ın beklediği formata dönüştür
  const formattedResource = {
    _id: resource._id,
    launcherId: resource.launcherId,
    timestamp: resource.timestamp,
    cpu: resource.cpu?.usage || 0,
    memory: resource.memory?.usage || 0,
    disk: resource.disk?.usage || 0,
    network: resource.network ?
      (resource.network.bytesIn + resource.network.bytesOut) / (1024 * 1024) : 0, // MB
    loadAverage: resource.cpu?.loadAverage || [0, 0, 0],
    processes: resource.processes?.total || 0,
    uptime: process.uptime(),
    cpuDetails: {
      model: require('os').cpus()[0]?.model || 'Unknown',
      cores: require('os').cpus().length,
      speed: require('os').cpus()[0]?.speed || 0
    }
  };

  res.status(200).json(formattedResource);
});

/**
 * @desc    Collect system resources now
 * @route   POST /api/metrics/system/collect
 * @access  Public
 */
const collectResources = asyncHandler(async (req, res) => {
  const resources = await collectSystemResources();
  res.status(200).json(resources);
});

/**
 * @desc    Get performance metrics
 * @route   GET /api/metrics/performance
 * @access  Public
 */
const getMetrics = asyncHandler(async (req, res) => {
  const { period, limit } = req.query;

  // Validate period
  const validPeriods = ['MINUTE', 'HOUR', 'DAY'];
  if (period && !validPeriods.includes(period)) {
    throw errorHandler.badRequest(`Invalid period: ${period}. Must be one of: ${validPeriods.join(', ')}`);
  }

  const metrics = await getPerformanceMetrics(
    period || 'HOUR',
    limit ? parseInt(limit, 10) : 24
  );

  res.status(200).json(metrics);
});

/**
 * @desc    Get latest performance metrics
 * @route   GET /api/metrics/performance/latest
 * @access  Public
 */
const getLatestMetrics = asyncHandler(async (req, res) => {
  const { period } = req.query;

  // Validate period
  const validPeriods = ['MINUTE', 'HOUR', 'DAY'];
  if (period && !validPeriods.includes(period)) {
    throw errorHandler.badRequest(`Invalid period: ${period}. Must be one of: ${validPeriods.join(', ')}`);
  }

  const metrics = await getPerformanceMetrics(period || 'HOUR', 1);
  res.status(200).json(metrics[0] || {});
});

module.exports = {
  getResources,
  getLatestResources,
  collectResources,
  getMetrics,
  getLatestMetrics
};
