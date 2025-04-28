// Request priority
export enum RequestPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  LOWEST = 'lowest'
}

// Request status
export enum RequestStatus {
  QUEUED = 'queued',
  SCHEDULED = 'scheduled',
  ASSIGNED = 'assigned',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

// Request category
export enum RequestCategory {
  UI_TEST = 'ui_test',
  API_TEST = 'api_test',
  PERFORMANCE_TEST = 'performance_test',
  SECURITY_TEST = 'security_test',
  ACCESSIBILITY_TEST = 'accessibility_test',
  INTEGRATION_TEST = 'integration_test',
  REGRESSION_TEST = 'regression_test',
  SMOKE_TEST = 'smoke_test',
  SANITY_TEST = 'sanity_test',
  CUSTOM = 'custom'
}

// Request source
export enum RequestSource {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  API = 'api',
  CI_CD = 'ci_cd',
  WEBHOOK = 'webhook',
  RETRY = 'retry'
}

// Request retry strategy
export enum RequestRetryStrategy {
  NONE = 'none',
  IMMEDIATE = 'immediate',
  INCREMENTAL = 'incremental',
  EXPONENTIAL = 'exponential',
  FIXED = 'fixed'
}
