import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { AgentManager } from './agent-manager';
import { QueueManager } from './queue-manager';
import { SystemMonitor } from './system-monitor';
import { MetricsPublisher } from './metrics-publisher';
import { HealthChecker } from './health-checker';
import connectDB from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { BrowserType } from '../models/Agent';
import { RequestPriority } from '../models/QueuedRequest';

export class AgentLauncher {
  private app: Application;
  private server: http.Server;
  private io: SocketIOServer;
  private agentManager: AgentManager;
  private queueManager: QueueManager;
  private systemMonitor: SystemMonitor;
  private metricsPublisher: MetricsPublisher;
  private healthChecker: HealthChecker;
  
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: { origin: '*', methods: ['GET', 'POST'] }
    });
    
    this.setupDatabase();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    
    this.agentManager = new AgentManager();
    this.queueManager = new QueueManager();
    this.systemMonitor = new SystemMonitor();
    this.healthChecker = new HealthChecker(this.agentManager);
    this.metricsPublisher = new MetricsPublisher(
      this.io, 
      this.systemMonitor, 
      this.agentManager, 
      this.queueManager,
      this.healthChecker
    );
  }
  
  public start(port: number): void {
    this.startPeriodicTasks();
    
    this.server.listen(port, () => {
      console.log(`Agent-Launcher running on port ${port}`);
    });
  }
  
  private setupDatabase(): void {
    connectDB()
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('MongoDB connection error:', err));
  }
  
  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
      }
      next();
    });
    
    // Loglama middleware'i
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });
  }
  
  private setupRoutes(): void {
    // Agent routes
    this.app.get('/api/agents', this.getAgents.bind(this));
    this.app.post('/api/agents', this.createAgent.bind(this));
    this.app.get('/api/agents/:id', this.getAgentById.bind(this));
    this.app.put('/api/agents/:id/status', this.updateAgentStatus.bind(this));
    
    // Queue routes
    this.app.get('/api/queue', this.getQueue.bind(this));
    this.app.post('/api/queue', this.addToQueue.bind(this));
    this.app.get('/api/queue/:id', this.getQueueItemById.bind(this));
    
    // Server metrics routes
    this.app.get('/api/server-agent', this.getServerMetrics.bind(this));
    this.app.get('/api/server-agent/health-status', this.getHealthStatus.bind(this));
    
    // Results routes
    this.app.get('/api/processed-requests', this.getProcessedRequests.bind(this));
    this.app.get('/api/processed-requests/:id', this.getProcessedRequestById.bind(this));
  }
  
  private setupWebSocket(): void {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      
      // İlk bağlantıda tüm verileri gönder
      this.sendInitialData(socket);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  
  private sendInitialData(socket: any): void {
    Promise.all([
      this.systemMonitor.getMetrics(),
      this.agentManager.getStatus(),
      this.queueManager.getStatus(),
      this.healthChecker.getStatus(),
      this.getDetailedData()
    ]).then(([
      systemMetrics,
      agentStatus,
      queueStatus,
      healthStatus,
      detailedData
    ]) => {
      socket.emit('system-metrics', systemMetrics);
      socket.emit('agent-status', agentStatus);
      socket.emit('queue-status', queueStatus);
      socket.emit('health-status', healthStatus);
      socket.emit('detailed-data', detailedData);
    }).catch(err => {
      console.error('Error sending initial data:', err);
    });
  }
  
  private startPeriodicTasks(): void {
    // Periodically check for new test requests and assign them to available agents
    setInterval(() => {
      this.processQueue();
    }, 1000);
    
    // Start metrics collection
    this.metricsPublisher.startPublishing();
  }
  
  private async processQueue(): Promise<void> {
    try {
      // Kuyruktan sıradaki isteği al
      const nextRequest = await this.queueManager.getNextRequest();
      if (!nextRequest) return;
      
      // Uygun agent'ı bul
      const availableAgent = await this.agentManager.findAvailableAgent(nextRequest.browser as BrowserType);
      if (!availableAgent) return;
      
      // Agent'a isteği gönder
      await this.agentManager.assignRequest(availableAgent.id, nextRequest.id);
      
      // İsteğin durumunu güncelle
      await this.queueManager.updateRequestStatus(nextRequest.id, 'PROCESSING' as any);
      
      console.log(`Assigned request ${nextRequest.id} to agent ${availableAgent.id}`);
      
    } catch (error) {
      console.error('Error processing queue:', error);
    }
  }
  
  private async getDetailedData(): Promise<any> {
    return {
      activeAgents: await this.agentManager.getDetailedAgents(),
      queuedRequests: await this.queueManager.getQueuedRequests(),
      processedRequests: await this.queueManager.getProcessedRequests(10) // son 10 işlenmiş istek
    };
  }
  
  // API Route Handler Methods
  private async getAgents(req: Request, res: Response): Promise<void> {
    try {
      const agents = await this.agentManager.getAllAgents();
      res.status(200).json({
        success: true,
        count: agents.length,
        data: agents
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching agents'
      });
    }
  }
  
  private async createAgent(req: Request, res: Response): Promise<void> {
    try {
      const { browserType } = req.body;
      
      if (!browserType) {
        res.status(400).json({
          success: false,
          message: 'Browser type is required'
        });
        return;
      }
      
      const agent = await this.agentManager.findAvailableAgent(browserType as BrowserType);
      
      if (!agent) {
        res.status(500).json({
          success: false,
          message: 'Failed to create agent'
        });
        return;
      }
      
      res.status(201).json({
        success: true,
        data: agent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating agent'
      });
    }
  }
  
  private async getAgentById(req: Request, res: Response): Promise<void> {
    try {
      const agents = await this.agentManager.getAllAgents();
      const agent = agents.find(a => a.id === req.params.id);
      
      if (!agent) {
        res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: agent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching agent'
      });
    }
  }
  
  private async updateAgentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      
      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required'
        });
        return;
      }
      
      const agents = await this.agentManager.getAllAgents();
      const agent = agents.find(a => a.id === req.params.id);
      
      if (!agent) {
        res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
        return;
      }
      
      // Agent durumunu güncelle
      agent.status = status;
      
      res.status(200).json({
        success: true,
        data: agent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating agent status'
      });
    }
  }
  
  private async getQueue(req: Request, res: Response): Promise<void> {
    try {
      const queuedRequests = await this.queueManager.getQueuedRequests();
      
      res.status(200).json({
        success: true,
        count: queuedRequests.length,
        data: queuedRequests
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching queue'
      });
    }
  }
  
  private async addToQueue(req: Request, res: Response): Promise<void> {
    try {
      const { testName, description, browser, priority, category, tags, userId, projectId, testCaseId, testSuiteId, parameters } = req.body;
      
      if (!testName) {
        res.status(400).json({
          success: false,
          message: 'Test name is required'
        });
        return;
      }
      
      const queuedRequest = await this.queueManager.addRequest({
        id: uuidv4(),
        testName,
        description,
        browser: browser || BrowserType.CHROME,
        priority: priority || RequestPriority.NORMAL,
        category,
        tags,
        userId,
        projectId,
        testCaseId,
        testSuiteId,
        parameters
      });
      
      res.status(201).json({
        success: true,
        data: queuedRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding to queue'
      });
    }
  }
  
  private async getQueueItemById(req: Request, res: Response): Promise<void> {
    try {
      const queuedRequests = await this.queueManager.getQueuedRequests();
      const queuedRequest = queuedRequests.find(q => q.id === req.params.id);
      
      if (!queuedRequest) {
        res.status(404).json({
          success: false,
          message: 'Queued request not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: queuedRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching queued request'
      });
    }
  }
  
  private async getServerMetrics(req: Request, res: Response): Promise<void> {
    try {
      const systemMetrics = await this.systemMonitor.getMetrics();
      const agentStatus = await this.agentManager.getStatus();
      const queueStatus = await this.queueManager.getStatus();
      const healthStatus = await this.healthChecker.getStatus();
      
      const serverAgent = {
        id: 'server-001',
        name: 'Test Automation Server',
        version: '1.0.0',
        status: healthStatus.status,
        systemResources: systemMetrics,
        healthStatus,
        activeAgents: (await this.agentManager.getAllAgents()).map(agent => agent.id),
        queuedRequests: (await this.queueManager.getQueuedRequests()).map(req => req.id),
        processedRequests: (await this.queueManager.getProcessedRequests()).map(req => req.id),
        tags: ['production', 'automated-tests'],
        metadata: {
          location: 'Cloud',
          environment: 'Production',
          responsible: 'Test Team',
          contact: 'test@example.com'
        },
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      res.status(200).json({
        success: true,
        data: serverAgent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching server metrics'
      });
    }
  }
  
  private async getHealthStatus(req: Request, res: Response): Promise<void> {
    try {
      const healthStatus = await this.healthChecker.getStatus();
      
      res.status(200).json({
        success: true,
        data: healthStatus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching health status'
      });
    }
  }
  
  private async getProcessedRequests(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const processedRequests = await this.queueManager.getProcessedRequests(limit);
      
      res.status(200).json({
        success: true,
        count: processedRequests.length,
        data: processedRequests
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching processed requests'
      });
    }
  }
  
  private async getProcessedRequestById(req: Request, res: Response): Promise<void> {
    try {
      const processedRequests = await this.queueManager.getProcessedRequests(100);
      const processedRequest = processedRequests.find(p => p.id === req.params.id);
      
      if (!processedRequest) {
        res.status(404).json({
          success: false,
          message: 'Processed request not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: processedRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching processed request'
      });
    }
  }
}
