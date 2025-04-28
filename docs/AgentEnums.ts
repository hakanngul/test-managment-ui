// Agent status
export enum AgentStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
  STARTING = 'starting',
  STOPPING = 'stopping',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

// Agent type
export enum AgentType {
  BROWSER = 'browser',
  API = 'api',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  PERFORMANCE = 'performance',
  SECURITY = 'security'
}

// Agent operating system
export enum AgentOS {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  ANDROID = 'android',
  IOS = 'ios'
}

// Agent health status
export enum AgentHealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}

// Agent log level
export enum AgentLogLevel {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}
