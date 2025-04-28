const mongoose = require('mongoose');

const SystemResourcesSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  launcherId: { type: String, required: true, ref: 'AgentLauncher' },
  cpu: {
    usage: Number, // %
    loadAverage: [Number],
    temperature: Number // Celsius
  },
  memory: {
    total: Number, // MB
    used: Number, // MB
    free: Number, // MB
    usage: Number // %
  },
  disk: {
    total: Number, // GB
    used: Number, // GB
    free: Number, // GB
    usage: Number // %
  },
  network: {
    bytesIn: Number,
    bytesOut: Number,
    connections: Number
  },
  processes: {
    total: Number,
    running: Number,
    blocked: Number
  }
});

module.exports = mongoose.model('SystemResources', SystemResourcesSchema);
