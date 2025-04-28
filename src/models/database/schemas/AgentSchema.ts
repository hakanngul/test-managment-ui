import { ObjectId } from 'mongodb';
import { BrowserType } from './TestCaseSchema';

// Agent durumları
export enum AgentStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
  STARTING = 'starting',
  STOPPING = 'stopping',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

// Agent türleri
export enum AgentType {
  BROWSER = 'browser',
  API = 'api',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  PERFORMANCE = 'performance',
  SECURITY = 'security'
}

// Agent işletim sistemleri
export enum AgentOS {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  ANDROID = 'android',
  IOS = 'ios'
}

// Agent sağlık durumları
export enum AgentHealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}

// Agent tarayıcı bilgileri
export interface AgentBrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  headless: boolean;
  windowSize: string;
  extensions?: string[];
  capabilities?: string[];
  arguments?: string[];
  preferences?: Record<string, any>;
}

// Agent sistem bilgileri
export interface AgentSystemInfo {
  os: AgentOS;
  osVersion: string;
  architecture: string;
  cpuCores: number;
  cpuModel?: string;
  memoryTotal: number; // MB cinsinden
  memoryFree: number; // MB cinsinden
  diskTotal: number; // MB cinsinden
  diskFree: number; // MB cinsinden
  hostname?: string;
  username?: string;
  timezone?: string;
}

// Agent ağ bilgileri
export interface AgentNetworkInfo {
  ipAddress: string;
  port: number;
  connected: boolean;
  connectionType?: string;
  bandwidth?: number; // Mbps cinsinden
  latency?: number; // ms cinsinden
  packetLoss?: number; // yüzde cinsinden
  dns?: string[];
  proxy?: {
    enabled: boolean;
    address?: string;
    port?: number;
    type?: string;
  };
}

// Agent performans metrikleri
export interface AgentPerformanceMetrics {
  cpuUsage: number; // yüzde cinsinden
  memoryUsage: number; // MB cinsinden
  diskUsage: number; // MB cinsinden
  networkUsage: number; // MB cinsinden
  activeProcesses: number;
  uptime: number; // saniye cinsinden
  loadAverage: number[];
  testExecutionTime?: {
    avg: number; // ms cinsinden
    min: number; // ms cinsinden
    max: number; // ms cinsinden
    p95: number; // ms cinsinden
  };
  concurrentTests?: number;
  queueLength?: number;
}

// Agent güvenlik bilgileri
export interface AgentSecurityInfo {
  sslEnabled: boolean;
  certificateExpiry?: Date;
  firewallEnabled?: boolean;
  antivirusEnabled?: boolean;
  lastSecurityScan?: Date;
  vulnerabilities?: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    count: number;
  }[];
  securityPatches?: {
    installed: number;
    pending: number;
    lastUpdated?: Date;
  };
}

// Agent loglama bilgileri
export interface AgentLoggingInfo {
  level: 'none' | 'error' | 'warning' | 'info' | 'debug' | 'trace';
  logDirectory?: string;
  logRetentionDays?: number;
  consoleLogging?: boolean;
  fileLogging?: boolean;
  remoteLogging?: boolean;
  remoteLogServer?: string;
}

// Agent kimlik doğrulama bilgileri
export interface AgentAuthInfo {
  token?: string;
  tokenExpiry?: Date;
  apiKey?: string;
  username?: string;
  lastAuthenticated?: Date;
  authMethod?: 'token' | 'apiKey' | 'basic' | 'oauth';
}

// Agent sağlık kontrolü
export interface AgentHealthCheck {
  status: AgentHealthStatus;
  lastCheck: Date;
  nextCheck?: Date;
  checkInterval: number; // saniye cinsinden
  details?: {
    cpu?: AgentHealthStatus;
    memory?: AgentHealthStatus;
    disk?: AgentHealthStatus;
    network?: AgentHealthStatus;
    browser?: AgentHealthStatus;
  };
  issues?: {
    component: string;
    status: AgentHealthStatus;
    message: string;
    timestamp: Date;
  }[];
}

// Agent yetenekleri
export interface AgentCapabilities {
  browsers?: string[];
  mobileDevices?: string[];
  apiFormats?: string[];
  testTypes?: string[];
  automationFrameworks?: string[];
  supportedFeatures?: string[];
  maxConcurrentTests?: number;
  maxTestDuration?: number; // saniye cinsinden
  supportedEnvironments?: string[];
}

// Agent durum özeti
export interface AgentStatusSummary {
  total: number;
  available: number;
  busy: number;
  offline: number;
  error: number;
  maintenance: number;
}

// Agent şeması
export interface AgentSchema {
  _id?: ObjectId;
  id: string;
  name?: string;
  type: AgentType;
  status: AgentStatus;
  
  // Tarayıcı bilgileri
  browser: BrowserType;
  browserInfo?: AgentBrowserInfo;
  
  // Sistem bilgileri
  systemInfo?: AgentSystemInfo;
  
  // Ağ bilgileri
  networkInfo: AgentNetworkInfo;
  
  // Performans metrikleri
  performanceMetrics?: AgentPerformanceMetrics;
  
  // Güvenlik bilgileri
  securityInfo?: AgentSecurityInfo;
  
  // Loglama bilgileri
  loggingInfo?: AgentLoggingInfo;
  
  // Kimlik doğrulama bilgileri
  authInfo?: AgentAuthInfo;
  
  // Sağlık kontrolü
  healthCheck?: AgentHealthCheck;
  
  // Yetenekler
  capabilities: string[];
  detailedCapabilities?: AgentCapabilities;
  
  // Sunucu bilgileri
  serverId: string;
  serverUrl?: string;
  
  // Çalıştırma bilgileri
  currentRequest?: string; // QueuedRequest ID
  lastRequest?: string; // ProcessedRequest ID
  
  // İstatistikler
  stats?: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    totalExecutionTime: number; // milisaniye cinsinden
    avgExecutionTime: number; // milisaniye cinsinden
  };
  
  // Sürüm bilgileri
  version: string;
  lastUpdated?: Date;
  
  // Zaman bilgileri
  created: Date;
  lastActivity: Date;
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
}
