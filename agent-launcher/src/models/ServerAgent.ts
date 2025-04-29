export interface SystemResource {
  cpuUsage: number; // Percentage
  memoryUsage: number; // MB
  diskUsage: number; // MB
  loadAverage: number[];
  processes: number;
  networkUsage: number; // MB/s
  cpuDetails: {
    model: string;
    cores: number;
    speed: number;
  };
}

export interface HealthStatusCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  timestamp: string;
}

export interface HealthStatus {
  status: string;
  lastCheck: string;
  uptime: number;
  message: string;
  checks: HealthStatusCheck[];
}

export interface ServerAgent {
  id: string;
  name: string;
  version: string;
  status: string;
  systemResources: SystemResource;
  healthStatus: HealthStatus;
  activeAgents: string[];
  queuedRequests: string[];
  processedRequests: string[];
  tags: string[];
  metadata: {
    location: string;
    environment: string;
    responsible: string;
    contact: string;
  };
  lastUpdated: string;
  createdAt: string;
}
