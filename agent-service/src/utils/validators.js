const Joi = require('joi');

/**
 * Validate agent launcher data
 */
const validateAgentLauncher = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    maxAgents: Joi.number().integer().min(1).max(100),
    config: Joi.object({
      autoScaling: Joi.boolean(),
      minAgents: Joi.number().integer().min(1),
      scaleUpThreshold: Joi.number().integer().min(1).max(100),
      scaleDownThreshold: Joi.number().integer().min(1).max(100),
      agentStartupTimeout: Joi.number().integer().min(1000),
      healthCheckInterval: Joi.number().integer().min(1000)
    })
  });

  return schema.validate(data);
};

/**
 * Validate agent data
 */
const validateAgent = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    capabilities: Joi.object({
      browsers: Joi.array().items(Joi.object({
        name: Joi.string().valid('chrome', 'firefox', 'safari', 'edge').required(),
        version: Joi.string()
      })),
      supportedFeatures: Joi.array().items(Joi.string())
    })
  });

  return schema.validate(data);
};

/**
 * Validate queued request data
 */
const validateQueuedRequest = (data) => {
  const schema = Joi.object({
    testCaseId: Joi.string().required(),
    testName: Joi.string().required(),
    description: Joi.string(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    browser: Joi.object({
      name: Joi.string().valid('chrome', 'firefox', 'safari', 'edge').required(),
      version: Joi.string(),
      headless: Joi.boolean()
    }),
    testParameters: Joi.object(),
    tags: Joi.array().items(Joi.string()),
    requestedBy: Joi.string(),
    maxRetries: Joi.number().integer().min(0).max(10)
  });

  return schema.validate(data);
};

module.exports = {
  validateAgentLauncher,
  validateAgent,
  validateQueuedRequest
};
