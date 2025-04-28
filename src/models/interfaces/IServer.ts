import { ServerStatus, ServerType, ServerHealthStatus, ServerLogLevel } from "../enums/ServerEnums";

// Server system information
export interface ServerSystemInfo {
  os: string;
  osVersion: string;
  cpuModel: string;
  cpuCores: number;
  totalMemory: number; // in MB
  totalDisk: number; // in MB
  hostname: string;
  username: string;
}

// Server network information
export interface ServerNetworkInfo {
  ipAddress: string;
  macAddress?: string;
  bandwidth?: number; // in Mbps
  latency?: number; // in ms
  publicIp?: string;
  dns?: string[];
  port: number;
}

// Server performance metrics
export interface ServerPerformanceMetrics {
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  diskUsage: number; // percentage
  networkUsage: number; // percentage
  uptime: number; // in seconds
  lastUpdated: Date;
}

// Server security information
export interface ServerSecurityInfo {
  sslEnabled: boolean;
  sslCertificateExpiry?: Date;
  firewallEnabled?: boolean;
  encryptionEnabled?: boolean;
  lastSecurityScan?: Date;
  vulnerabilities?: string[];
}

// Server logging information
export interface ServerLoggingInfo {
  logLevel: ServerLogLevel;
  logFilePath?: string;
  maxLogSize?: number; // in MB
  maxLogFiles?: number;
  enableConsoleLogging?: boolean;
  enableFileLogging?: boolean;
  enableRemoteLogging?: boolean;
}

// Server health check
export interface ServerHealthCheck {
  status: ServerHealthStatus;
  lastCheck: Date;
  message?: string;
  details?: Record<string, any>;
}

// Server model
export interface Server {
  id: string;
  name: string;
  type: ServerType;
  status: ServerStatus;
  
  // System information
  systemInfo?: ServerSystemInfo;
  
  // Network information
  networkInfo: ServerNetworkInfo;
  
  // Performance metrics
  performanceMetrics?: ServerPerformanceMetrics;
  
  // Security information
  securityInfo?: ServerSecurityInfo;
  
  // Logging information
  loggingInfo?: ServerLoggingInfo;
  
  // Health check
  healthCheck?: ServerHealthCheck;
  
  // Agent information
  agentCount: number;
  activeAgentCount: number;
  
  // Version information
  version: string;
  updateAvailable?: boolean;
  lastUpdated?: Date;
  
  // Activity information
  created: Date;
  lastActivity: Date;
  
  // Configuration
  maxAgents: number;
  maxConcurrentTests: number;
  queueSize: number;
}

// Server creation model
export interface ServerCreate {
  name: string;
  type: ServerType;
  systemInfo?: ServerSystemInfo;
  networkInfo: ServerNetworkInfo;
  securityInfo?: ServerSecurityInfo;
  loggingInfo?: ServerLoggingInfo;
  version: string;
  maxAgents: number;
  maxConcurrentTests: number;
  queueSize: number;
}

// Server update model
export interface ServerUpdate {
  name?: string;
  status?: ServerStatus;
  systemInfo?: ServerSystemInfo;
  networkInfo?: ServerNetworkInfo;
  performanceMetrics?: ServerPerformanceMetrics;
  securityInfo?: ServerSecurityInfo;
  loggingInfo?: ServerLoggingInfo;
  healthCheck?: ServerHealthCheck;
  agentCount?: number;
  activeAgentCount?: number;
  version?: string;
  updateAvailable?: boolean;
  lastUpdated?: Date;
  lastActivity?: Date;
  maxAgents?: number;
  maxConcurrentTests?: number;
  queueSize?: number;
}

// Server status summary
export interface ServerStatusSummary {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
  error: number;
}

// Server performance summary
export interface ServerPerformanceSummary {
  avgCpuUsage: number;
  avgMemoryUsage: number;
  avgDiskUsage: number;
  avgNetworkUsage: number;
  totalAgents: number;
  activeAgents: number;
  totalTests: number;
  successfulTests: number;
  failedTests: number;
  avgTestDuration: number;
}
