const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const agentLauncherRoutes = require('./routes/agentLauncherRoutes');
const agentRoutes = require('./routes/agentRoutes');
const queueRoutes = require('./routes/queueRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const logger = require('./utils/logger');
const config = require('./config/config');
const { startMetricsCollection } = require('./services/metricsService');
const { setupSocketHandlers } = require('./socket/socketHandlers');
const { initializeLauncher } = require('./services/agentLauncherService');
const { checkStaleAgents } = require('./services/agentService');
const cron = require('node-cron');

// Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Routes
app.use('/api/launcher', agentLauncherRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/metrics', metricsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Not found middleware
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Start server
const PORT = config.port || 3001;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize agent launcher
    await initializeLauncher();

    // Start metrics collection
    startMetricsCollection();

    // Temporarily disable stale agent check for development
    logger.info('Stale agent check is temporarily disabled');
    // cron.schedule('*/30 * * * * *', async () => { // Every 30 seconds
    //   try {
    //     await checkStaleAgents();
    //   } catch (error) {
    //     logger.error(`Error checking stale agents: ${error.message}`);
    //   }
    // });

    // Start the server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`WebSocket server initialized`);
    });

  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  // Close server & exit process
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});
