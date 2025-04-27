// Test run status
export enum TestRunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused'
}

// Test run priority
export enum TestRunPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Test run execution mode
export enum TestRunExecutionMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel'
}

// Test run retry strategy
export enum TestRunRetryStrategy {
  NONE = 'none',
  RETRY_FAILED = 'retry_failed',
  RETRY_ALL = 'retry_all'
}

// Test run log level
export enum TestRunLogLevel {
  NONE = 'none',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

// Test run report format
export enum TestRunReportFormat {
  HTML = 'html',
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv',
  PDF = 'pdf'
}
