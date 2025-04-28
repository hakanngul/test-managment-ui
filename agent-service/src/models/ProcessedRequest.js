const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProcessedRequestSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => uuidv4()
  },
  originalRequestId: { type: String, required: true, ref: 'QueuedRequest' },
  testCaseId: { type: String, required: true },
  testName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT'],
    required: true
  },
  agentId: { type: String, ref: 'Agent' },
  launcherId: { type: String, ref: 'AgentLauncher' },
  queuedAt: Date,
  startedAt: Date,
  completedAt: Date,
  waitTime: Number, // ms
  executionTime: Number, // ms
  result: {
    success: Boolean,
    errorMessage: String,
    errorType: String,
    errorStack: String,
    screenshotUrl: String,
    videoUrl: String,
    logUrl: String
  },
  testSteps: [{
    name: String,
    status: { 
      type: String, 
      enum: ['PASSED', 'FAILED', 'SKIPPED', 'WARNING']
    },
    duration: Number, // ms
    screenshot: String,
    error: {
      message: String,
      type: String
    }
  }],
  performance: {
    loadTime: Number, // ms
    firstContentfulPaint: Number, // ms
    largestContentfulPaint: Number, // ms
    timeToInteractive: Number, // ms
    cumulativeLayoutShift: Number
  },
  browser: {
    name: String,
    version: String,
    headless: Boolean
  },
  retryCount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProcessedRequest', ProcessedRequestSchema);
