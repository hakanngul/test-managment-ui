import { BrowserType } from "../enums/TestCaseEnums";
import { AgentStatus, AgentType, AgentOS, AgentHealthStatus, AgentLogLevel } from "../enums/AgentEnums";

// Agent system information
export interface AgentSystemInfo {
  os: AgentOS;
  osVersion: string;
  cpuModel: string;
  cpuCores: number;
  totalMemory: number; // in MB
  totalDisk: number; // in MB
  hostname: string;
  username: string;
}

// Agent browser information
export interface AgentBrowserInfo {
  type: BrowserType;
  version: string;
  userAgent: string;
  headless: boolean;
  extensions: string[];
  arguments: string[];
}

// Agent network information
export interface AgentNetworkInfo {
  ipAddress: string;
  macAddress?: string;
  bandwidth?: number; // in Mbps
  latency?: number; // in ms
  publicIp?: string;
  dns?: string[];
}

// Agent performance metrics
export interface AgentPerformanceMetrics {
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  diskUsage: number; // percentage
  networkUsage: number; // percentage
  uptime: number; // in seconds
  lastUpdated: Date;
}

// Agent security information
export interface AgentSecurityInfo {
  sslEnabled: boolean;
  sslCertificateExpiry?: Date;
  firewallEnabled?: boolean;
  encryptionEnabled?: boolean;
  lastSecurityScan?: Date;
  vulnerabilities?: string[];
}

// Agent logging information
export interface AgentLoggingInfo {
  logLevel: AgentLogLevel;
  logFilePath?: string;
  maxLogSize?: number; // in MB
  maxLogFiles?: number;
  enableConsoleLogging?: boolean;
  enableFileLogging?: boolean;
  enableRemoteLogging?: boolean;
}

// Agent authentication information
export interface AgentAuthInfo {
  apiKey?: string;
  token?: string;
  tokenExpiry?: Date;
  authMethod?: string;
}

// Agent health check
export interface AgentHealthCheck {
  status: AgentHealthStatus;
  lastCheck: Date;
  message?: string;
  details?: Record<string, any>;
}

// Agent capabilities
export interface AgentCapabilities {
  supportedBrowsers: BrowserType[];
  supportedFeatures: string[];
  maxConcurrentTests: number;
  supportsMobile: boolean;
  supportsHeadless: boolean;
  supportsBrowserExtensions: boolean;
  supportsNetworkThrottling: boolean;
  supportsCpuThrottling: boolean;
  supportsDeviceEmulation: boolean;
  supportsGeolocation: boolean;
  supportsFileDownload: boolean;
  supportsFileUpload: boolean;
}

// Agent model
export interface Agent {
  id: string;
  name?: string;
  type: AgentType;
  status: AgentStatus;
  
  // Browser information
  browser: BrowserType;
  browserInfo?: AgentBrowserInfo;
  
  // System information
  systemInfo?: AgentSystemInfo;
  
  // Network information
  networkInfo: AgentNetworkInfo;
  
  // Performance metrics
  performanceMetrics?: AgentPerformanceMetrics;
  
  // Security information
  securityInfo?: AgentSecurityInfo;
  
  // Logging information
  loggingInfo?: AgentLoggingInfo;
  
  // Authentication information
  authInfo?: AgentAuthInfo;
  
  // Health check
  healthCheck?: AgentHealthCheck;
  
  // Capabilities
  capabilities: string[];
  detailedCapabilities?: AgentCapabilities;
  
  // Server information
  serverId: string;
  serverUrl?: string;
  
  // Activity information
  created: Date;
  lastActivity: Date;
  currentRequest: string | null; // Request ID
  
  // Version information
  version: string;
  updateAvailable?: boolean;
  lastUpdated?: Date;
}

// Agent creation model
export interface AgentCreate {
  name?: string;
  type: AgentType;
  browser: BrowserType;
  browserInfo?: AgentBrowserInfo;
  systemInfo?: AgentSystemInfo;
  networkInfo: AgentNetworkInfo;
  securityInfo?: AgentSecurityInfo;
  loggingInfo?: AgentLoggingInfo;
  authInfo?: AgentAuthInfo;
  capabilities: string[];
  detailedCapabilities?: AgentCapabilities;
  serverId: string;
  serverUrl?: string;
  version: string;
}

// Agent update model
export interface AgentUpdate {
  name?: string;
  status?: AgentStatus;
  browserInfo?: AgentBrowserInfo;
  systemInfo?: AgentSystemInfo;
  networkInfo?: AgentNetworkInfo;
  performanceMetrics?: AgentPerformanceMetrics;
  securityInfo?: AgentSecurityInfo;
  loggingInfo?: AgentLoggingInfo;
  authInfo?: AgentAuthInfo;
  healthCheck?: AgentHealthCheck;
  capabilities?: string[];
  detailedCapabilities?: AgentCapabilities;
  serverUrl?: string;
  lastActivity?: Date;
  currentRequest?: string | null;
  version?: string;
  updateAvailable?: boolean;
  lastUpdated?: Date;
}

// Agent status summary
export interface AgentStatusSummary {
  total: number;
  available: number;
  busy: number;
  offline: number;
  error: number;
  maintenance: number;
  limit: number;
}

// Agent performance summary
export interface AgentPerformanceSummary {
  avgCpuUsage: number;
  avgMemoryUsage: number;
  avgDiskUsage: number;
  avgNetworkUsage: number;
  totalTests: number;
  successfulTests: number;
  failedTests: number;
  avgTestDuration: number;
}
