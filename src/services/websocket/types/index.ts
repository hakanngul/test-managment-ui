// WebSocket bağlantı durumu
export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

// Test durumu
export enum TestStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ABORTED = 'aborted'
}

// Log seviyesi
export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

// Test adımı
export interface TestStep {
  current: number;
  total: number;
  description: string;
}

// Test logu
export interface TestLog {
  level: LogLevel;
  message: string;
  timestamp: string;
}

// Test bilgisi
export interface Test {
  id: string;
  name: string;
  status: TestStatus;
  startTime: string;
  endTime?: string;
  currentStep: number;
  totalSteps: number;
  error?: string;
}

// WebSocket olayları
export interface WebSocketEvents {
  // Bağlantı olayları
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;

  // Test olayları
  testStarted: (data: any) => void;
  test_started: (data: any) => void;
  testCompleted: (data: any) => void;
  test_completed: (data: any) => void;
  testFailed: (data: any) => void;
  test_failed: (data: any) => void;

  // Log olayları
  testLog: (data: any) => void;
  test_log: (data: any) => void;
  agent_log: (data: any) => void;

  // Adım olayları
  testStepStarted: (data: any) => void;
  test_step_started: (data: any) => void;
  testStepCompleted: (data: any) => void;
  test_step_completed: (data: any) => void;
}

// WebSocketManager için yapılandırma
export interface WebSocketConfig {
  url: string;
  options?: {
    transports?: string[];
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
    randomizationFactor?: number;
    timeout?: number;
    autoConnect?: boolean;
    query?: Record<string, string>;
    pingInterval?: number;
    cleanupInterval?: number;
    autoCleanupTime?: number;
  };
}

// Agent durumu
export enum AgentStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

// Agent tipleri
export enum AgentType {
  BROWSER = 'browser',
  API = 'api',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  SERVICE = 'service'
}

// Agent işletim sistemi
export enum AgentOS {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  ANDROID = 'android',
  IOS = 'ios'
}

// Agent sağlık durumu
export enum AgentHealthStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  WARNING = 'warning',
  UNKNOWN = 'unknown'
}

// Agent log seviyesi
export enum AgentLogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

// Tarayıcı tipi
export enum BrowserType {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit',
  EDGE = 'edge',
  IE = 'ie',
  SAFARI = 'safari'
}

// Agent verisi
export interface AgentData {
  id: string;
  name: string;
  status: AgentStatus;
  type?: AgentType;
  browser?: BrowserType;
  ip?: string;
  version?: string;
  lastSeen?: string;
  capabilities?: string[];
  detailedCapabilities?: Record<string, any>;
  resources?: {
    cpu?: number;
    memory?: number;
    disk?: number;
    network?: number;
    uptime?: number;
  };
  systemInfo?: Record<string, any>;
  networkInfo?: {
    ipAddress?: string;
    [key: string]: any;
  };
  performanceMetrics?: {
    cpuUsage?: number;
    memoryUsage?: number;
    diskUsage?: number;
    networkUsage?: number;
    uptime?: number;
    lastUpdated?: Date;
  };
  securityInfo?: {
    sslEnabled?: boolean;
    [key: string]: any;
  };
  loggingInfo?: {
    logLevel?: AgentLogLevel;
    [key: string]: any;
  };
  authInfo?: Record<string, any>;
  healthCheck?: {
    status?: AgentHealthStatus;
    lastCheck?: Date;
    [key: string]: any;
  };
  serverId?: string;
  serverUrl?: string;
  created?: Date;
  lastActivity?: Date;
  currentRequest?: any;
  updateAvailable?: boolean;
  lastUpdated?: Date | null;
  error?: string;
}

// Agent durum özeti
export interface AgentStatusSummary {
  total: number;
  available: number;
  busy: number;
  offline: number;
  error: number;
  maintenance: number;
  limit: number;
}

// Agent performans özeti
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

// Bildirim
export interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
}

// Kuyruk durumu
export interface QueueStatus {
  totalTests: number;
  pendingTests: number;
  runningTests: number;
  completedTests: number;
  failedTests: number;
  queuedSince?: string;
  estimatedWaitTime?: number;
  maxConcurrentTests?: number;
}

// Test durumları özeti
export interface TestStatusSummary {
  total: number;
  running: number;
  completed: number;
  failed: number;
  aborted: number;
  pending: number;
  successRate: number;
  avgDuration: number;
}

// WebSocketManager durumu
export interface WebSocketState {
  [x: string]: any;
  status: ConnectionStatus;
  tests: Record<string, Test>;
  logs: Record<string, TestLog[]>;
  steps: Record<string, { step: TestStep }>;
  agents: AgentData[];
  agentStatusSummary: AgentStatusSummary;
  agentPerformanceSummary: AgentPerformanceSummary;
  notifications: Notification[];
  queueStatus?: QueueStatus;
  testStatusSummary?: TestStatusSummary;
  stats: {
    messagesReceived: number;
    lastMessageTime: string | null;
    reconnectCount: number;
    latency: number;
    connectedSince: string | null;
  };
  error?: Error;
}

// WebSocketManager için dinleyici
export interface WebSocketListener {
  onStatusChange?: (status: ConnectionStatus) => void;
  onTestsChange?: (tests: Record<string, Test>) => void;
  onLogsChange?: (logs: Record<string, TestLog[]>) => void;
  onStepsChange?: (steps: Record<string, { step: TestStep }>) => void;
  onAgentsChange?: (agents: AgentData[]) => void;
  onAgentStatusSummaryChange?: (summary: AgentStatusSummary) => void;
  onAgentPerformanceSummaryChange?: (summary: AgentPerformanceSummary) => void;
  onNotificationsChange?: (notifications: Notification[]) => void;
  onQueueStatusChange?: (queueStatus: QueueStatus) => void;
  onTestStatusSummaryChange?: (testStatusSummary: TestStatusSummary) => void;
  onStatsChange?: (stats: WebSocketState['stats']) => void;
  onError?: (error: Error) => void;
}
