require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agent-service',
  nodeEnv: process.env.NODE_ENV || 'development',
  maxAgents: parseInt(process.env.MAX_AGENTS || '5', 10),
  minAgents: parseInt(process.env.MIN_AGENTS || '1', 10),
  healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '10000', 10),
  metricsCollectionInterval: parseInt(process.env.METRICS_COLLECTION_INTERVAL || '60000', 10)
};
