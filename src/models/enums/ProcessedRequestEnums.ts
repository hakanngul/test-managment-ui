// Processed request status
export enum ProcessedRequestStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
  ERROR = 'error',
  INTERRUPTED = 'interrupted',
  PARTIAL = 'partial'
}

// Processed request error type
export enum ProcessedRequestErrorType {
  BROWSER = 'browser',
  NETWORK = 'network',
  SCRIPT = 'script',
  ASSERTION = 'assertion',
  TIMEOUT = 'timeout',
  ENVIRONMENT = 'environment',
  PERMISSION = 'permission',
  RESOURCE = 'resource',
  AGENT = 'agent',
  UNKNOWN = 'unknown'
}

// Processed request priority
export enum ProcessedRequestPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Processed request source
export enum ProcessedRequestSource {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  API = 'api',
  CI_CD = 'ci_cd',
  WEBHOOK = 'webhook',
  RETRY = 'retry'
}
