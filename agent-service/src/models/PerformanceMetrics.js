const mongoose = require('mongoose');

const PerformanceMetricsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  launcherId: { type: String, required: true, ref: 'AgentLauncher' },
  agentId: { type: String, ref: 'Agent' },
  metrics: {
    testExecutionTime: {
      average: Number, // ms
      min: Number, // ms
      max: Number, // ms
      p50: Number, // ms
      p90: Number, // ms
      p95: Number, // ms
      p99: Number // ms
    },
    queueWaitTime: {
      average: Number, // ms
      min: Number, // ms
      max: Number, // ms
      p50: Number, // ms
      p90: Number, // ms
      p95: Number, // ms
      p99: Number // ms
    },
    successRate: Number, // %
    throughput: Number, // tests per minute
    concurrentTests: Number,
    resourceUtilization: {
      cpu: Number, // %
      memory: Number, // %
      network: Number // MB/s
    }
  },
  period: { 
    type: String, 
    enum: ['MINUTE', 'HOUR', 'DAY'],
    default: 'MINUTE'
  }
});

module.exports = mongoose.model('PerformanceMetrics', PerformanceMetricsSchema);
