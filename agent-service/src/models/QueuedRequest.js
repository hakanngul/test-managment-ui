const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const QueuedRequestSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => uuidv4()
  },
  testCaseId: { type: String, required: true },
  testName: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['QUEUED', 'ASSIGNED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'QUEUED'
  },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  queuePosition: Number,
  estimatedStartTime: Date,
  queuedAt: { type: Date, default: Date.now },
  assignedTo: { type: String, ref: 'Agent' },
  assignedAt: Date,
  startedAt: Date,
  completedAt: Date,
  waitTime: Number, // ms
  executionTime: Number, // ms
  browser: {
    name: { type: String, enum: ['chrome', 'firefox', 'safari', 'edge'] },
    version: String,
    headless: { type: Boolean, default: true }
  },
  testParameters: mongoose.Schema.Types.Mixed,
  tags: [String],
  requestedBy: String,
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 }
});

// Update queue positions before save
QueuedRequestSchema.pre('save', async function(next) {
  // Only update queue positions for new requests
  if (this.isNew) {
    try {
      // Get the highest queue position
      const highestPositionDoc = await this.constructor.findOne({
        status: 'QUEUED'
      }).sort({ queuePosition: -1 }).limit(1);
      
      // Set the queue position to the highest + 1, or 1 if no other requests
      this.queuePosition = highestPositionDoc ? highestPositionDoc.queuePosition + 1 : 1;
      
      // Set estimated start time based on queue position and average execution time
      // This is a simple estimation, can be improved with more sophisticated algorithms
      const avgExecutionTime = 60000; // 1 minute default
      this.estimatedStartTime = new Date(Date.now() + (this.queuePosition * avgExecutionTime));
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('QueuedRequest', QueuedRequestSchema);
