const logger = require('../utils/logger');
const Agent = require('../models/Agent');
const QueuedRequest = require('../models/QueuedRequest');
const SystemResources = require('../models/SystemResources');
const AgentLauncher = require('../models/AgentLauncher');

// Socket.IO event handlers
const setupSocketHandlers = (io) => {
  // Connected clients
  const connectedClients = new Map();

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    connectedClients.set(socket.id, { connected: true });

    // Send initial data to client
    sendInitialData(socket);

    // Handle client disconnect
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
      connectedClients.delete(socket.id);
    });

    // Subscribe to specific updates
    socket.on('subscribe', (channels) => {
      logger.info(`Client ${socket.id} subscribed to: ${channels.join(', ')}`);

      // Join specified channels
      if (Array.isArray(channels)) {
        channels.forEach(channel => {
          socket.join(channel);
        });
      }
    });

    // Unsubscribe from specific updates
    socket.on('unsubscribe', (channels) => {
      logger.info(`Client ${socket.id} unsubscribed from: ${channels.join(', ')}`);

      // Leave specified channels
      if (Array.isArray(channels)) {
        channels.forEach(channel => {
          socket.leave(channel);
        });
      }
    });
  });

  // Setup database change streams for real-time updates
  setupChangeStreams(io);

  return io;
};

// Send initial data to newly connected client
const sendInitialData = async (socket) => {
  try {
    // Get agents data
    const agents = await Agent.find({}).lean();

    // Get queue data
    const queuedRequests = await QueuedRequest.find({
      status: { $in: ['QUEUED', 'ASSIGNED', 'RUNNING'] }
    }).sort({ queuePosition: 1 }).lean();

    // Get latest system resources
    const systemResources = await SystemResources.findOne({})
      .sort({ timestamp: -1 })
      .lean();

    // Get agent launcher status
    const agentLauncher = await AgentLauncher.findOne({}).lean();

    // Send data to client
    socket.emit('initial_data', {
      agents,
      queuedRequests,
      systemResources,
      agentLauncher
    });

  } catch (error) {
    logger.error(`Error sending initial data: ${error.message}`);
  }
};

// Setup MongoDB change streams for real-time updates
const setupChangeStreams = (io) => {
  // Change streams are disabled because they require MongoDB replica set
  logger.info('Change streams are disabled because they require MongoDB replica set');

  // Instead, we'll use polling for updates
  // This is a temporary solution until we can set up a replica set

  // Poll for agent updates
  setInterval(async () => {
    try {
      const agents = await Agent.find({}).lean();
      // Hem eski hem de yeni event isimlerini gönder (geriye uyumluluk için)
      io.to('agents').emit('agents_update', agents);
      io.to('agents').emit('agent_update_all', agents);
    } catch (err) {
      logger.error(`Error polling agents: ${err.message}`);
    }
  }, 5000); // Poll every 5 seconds

  // Poll for queue updates
  setInterval(async () => {
    try {
      const queuedRequests = await QueuedRequest.find({
        status: { $in: ['QUEUED', 'ASSIGNED', 'RUNNING'] }
      }).sort({ queuePosition: 1 }).lean();
      // Hem eski hem de yeni event isimlerini gönder (geriye uyumluluk için)
      io.to('queue').emit('queue_update_all', queuedRequests);
    } catch (err) {
      logger.error(`Error polling queue: ${err.message}`);
    }
  }, 5000); // Poll every 5 seconds

  // Poll for system resources
  setInterval(async () => {
    try {
      const systemResources = await SystemResources.findOne({})
        .sort({ timestamp: -1 })
        .lean();
      if (systemResources) {
        io.to('system').emit('system_resources_update', systemResources);
      }
    } catch (err) {
      logger.error(`Error polling system resources: ${err.message}`);
    }
  }, 10000); // Poll every 10 seconds

  // Poll for launcher updates
  setInterval(async () => {
    try {
      const launcher = await AgentLauncher.findOne({}).lean();
      if (launcher) {
        io.to('launcher').emit('launcher_update', launcher);
      }
    } catch (err) {
      logger.error(`Error polling launcher: ${err.message}`);
    }
  }, 10000); // Poll every 10 seconds
};

module.exports = { setupSocketHandlers };
