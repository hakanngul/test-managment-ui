const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AgentSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => uuidv4()
  },
  launcherId: { type: String, required: true, ref: 'AgentLauncher' },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['IDLE', 'BUSY', 'OFFLINE', 'STARTING', 'STOPPING', 'ERROR'],
    default: 'STARTING'
  },
  capabilities: {
    browsers: [{ 
      name: { type: String, enum: ['chrome', 'firefox', 'safari', 'edge'] },
      version: String
    }],
    supportedFeatures: [String]
  },
  currentTest: {
    testId: { type: String, ref: 'QueuedRequest' },
    startTime: Date,
    progress: Number // 0-100
  },
  performance: {
    cpuUsage: Number, // %
    memoryUsage: Number, // MB
    activeConnections: Number,
    testCount: { type: Number, default: 0 },
    successRate: { type: Number, default: 100 } // %
  },
  healthStatus: {
    healthy: { type: Boolean, default: true },
    lastHealthCheck: { type: Date, default: Date.now },
    issues: [{
      type: String,
      message: String,
      timestamp: Date
    }]
  },
  lastHeartbeat: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps before save
AgentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Agent', AgentSchema);
