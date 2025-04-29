export enum AgentStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE',
  STARTING = 'STARTING'
}

export enum BrowserType {
  CHROME = 'CHROME',
  FIREFOX = 'FIREFOX',
  SAFARI = 'SAFARI'
}

export enum AgentOS {
  WINDOWS = 'WINDOWS',
  LINUX = 'LINUX',
  MACOS = 'MACOS'
}

export enum AgentHealthStatus {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  UNKNOWN = 'UNKNOWN'
}

export interface NetworkInfo {
  ipAddress: string;
  port?: number;
  hostname?: string;
  macAddress?: string;
}

export interface SystemInfo {
  os: AgentOS;
  osVersion: string;
  cpuModel: string;
  cpuCores: number;
  totalMemory: number; // MB
  totalDisk: number; // MB
  hostname: string;
  username: string;
}

export interface PerformanceMetrics {
  cpuUsage: number; // Percentage
  memoryUsage: number; // MB
  diskUsage: number; // MB
  networkUsage: number; // MB/s
  uptime: number; // Seconds
  lastUpdated: Date;
}

export interface HealthCheck {
  status: AgentHealthStatus;
  lastCheck: Date;
  message?: string;
  details?: Record<string, any>;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: AgentStatus | string;
  browser: BrowserType | string;
  networkInfo: NetworkInfo;
  capabilities: string[];
  serverId: string;
  created: Date;
  lastActivity: Date;
  currentRequest: string | null;
  version: string;
  systemInfo?: SystemInfo;
  performanceMetrics?: PerformanceMetrics;
  healthCheck?: HealthCheck;
}
