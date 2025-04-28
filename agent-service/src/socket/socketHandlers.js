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
  // Agent change stream
  const agentChangeStream = Agent.watch();
  agentChangeStream.on('change', (change) => {
    if (change.operationType === 'update' || change.operationType === 'replace') {
      // Get updated document
      Agent.findById(change.documentKey._id).lean()
        .then(agent => {
          io.to('agents').emit('agent_update', agent);
        })
        .catch(err => logger.error(`Error fetching updated agent: ${err.message}`));
    } else if (change.operationType === 'insert') {
      io.to('agents').emit('agent_created', change.fullDocument);
    } else if (change.operationType === 'delete') {
      io.to('agents').emit('agent_deleted', { id: change.documentKey._id });
    }
  });

  // Queued requests change stream
  const queueChangeStream = QueuedRequest.watch();
  queueChangeStream.on('change', (change) => {
    if (change.operationType === 'update' || change.operationType === 'replace') {
      // Get updated document
      QueuedRequest.findById(change.documentKey._id).lean()
        .then(request => {
          io.to('queue').emit('queue_update', request);
        })
        .catch(err => logger.error(`Error fetching updated queue request: ${err.message}`));
    } else if (change.operationType === 'insert') {
      io.to('queue').emit('queue_created', change.fullDocument);
    } else if (change.operationType === 'delete') {
      io.to('queue').emit('queue_deleted', { id: change.documentKey._id });
    }
  });

  // System resources change stream
  const systemResourcesChangeStream = SystemResources.watch();
  systemResourcesChangeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      io.to('system').emit('system_resources_update', change.fullDocument);
    }
  });

  // Agent launcher change stream
  const launcherChangeStream = AgentLauncher.watch();
  launcherChangeStream.on('change', (change) => {
    if (change.operationType === 'update' || change.operationType === 'replace') {
      // Get updated document
      AgentLauncher.findById(change.documentKey._id).lean()
        .then(launcher => {
          io.to('launcher').emit('launcher_update', launcher);
        })
        .catch(err => logger.error(`Error fetching updated launcher: ${err.message}`));
    }
  });
};

module.exports = { setupSocketHandlers };
