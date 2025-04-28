const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AgentLauncherSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => uuidv4()
  },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['ONLINE', 'OFFLINE', 'STARTING', 'STOPPING', 'ERROR'],
    default: 'OFFLINE'
  },
  maxAgents: { type: Number, required: true, default: 5 },
  activeAgents: { type: Number, default: 0 },
  config: {
    autoScaling: { type: Boolean, default: true },
    minAgents: { type: Number, default: 1 },
    scaleUpThreshold: { type: Number, default: 80 }, // % kuyruk doluluk oranı
    scaleDownThreshold: { type: Number, default: 20 }, // % kuyruk doluluk oranı
    agentStartupTimeout: { type: Number, default: 30000 }, // ms
    healthCheckInterval: { type: Number, default: 10000 } // ms
  },
  systemInfo: {
    hostname: String,
    platform: String,
    arch: String,
    cpuCores: Number,
    totalMemory: Number,
    uptime: Number
  },
  lastHeartbeat: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps before save
AgentLauncherSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('AgentLauncher', AgentLauncherSchema);
