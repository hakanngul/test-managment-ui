import { Server as SocketIOServer } from 'socket.io';
import { SystemMonitor } from './system-monitor';
import { AgentManager } from './agent-manager';
import { QueueManager } from './queue-manager';
import { HealthChecker } from './health-checker';

export class MetricsPublisher {
  private io: SocketIOServer;
  private systemMonitor: SystemMonitor;
  private agentManager: AgentManager;
  private queueManager: QueueManager;
  private healthChecker: HealthChecker;
  
  constructor(
    io: SocketIOServer,
    systemMonitor: SystemMonitor,
    agentManager: AgentManager,
    queueManager: QueueManager,
    healthChecker: HealthChecker
  ) {
    this.io = io;
    this.systemMonitor = systemMonitor;
    this.agentManager = agentManager;
    this.queueManager = queueManager;
    this.healthChecker = healthChecker;
  }
  
  public startPublishing(): void {
    // Sistem metriklerini her 1 saniyede bir yayınla
    setInterval(async () => {
      const metrics = await this.systemMonitor.getMetrics();
      this.io.emit('system-metrics', metrics);
    }, 1000);
    
    // Agent durumunu her 2 saniyede bir yayınla
    setInterval(async () => {
      const status = await this.agentManager.getStatus();
      this.io.emit('agent-status', status);
    }, 2000);
    
    // Kuyruk durumunu her 1 saniyede bir yayınla
    setInterval(async () => {
      const status = await this.queueManager.getStatus();
      this.io.emit('queue-status', status);
    }, 1000);
    
    // Sağlık durumunu her 5 saniyede bir yayınla
    setInterval(async () => {
      const healthStatus = await this.healthChecker.getStatus();
      this.io.emit('health-status', healthStatus);
    }, 5000);
    
    // Detaylı verileri her 3 saniyede bir yayınla
    setInterval(async () => {
      const detailedData = await this.getDetailedData();
      this.io.emit('detailed-data', detailedData);
    }, 3000);
  }
  
  private async getDetailedData(): Promise<any> {
    return {
      activeAgents: await this.agentManager.getDetailedAgents(),
      queuedRequests: await this.queueManager.getQueuedRequests(),
      processedRequests: await this.queueManager.getProcessedRequests(10) // Son 10 işlenmiş istek
    };
  }
}
