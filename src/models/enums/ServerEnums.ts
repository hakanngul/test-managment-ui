// Server status
export enum ServerStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  STARTING = 'starting',
  STOPPING = 'stopping',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

// Server type
export enum ServerType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  BACKUP = 'backup',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

// Server health status
export enum ServerHealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}

// Server log level
export enum ServerLogLevel {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}
