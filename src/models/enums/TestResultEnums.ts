// Test result status
export enum TestResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

// Test step result status
export enum TestStepResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

// Error type
export enum TestErrorType {
  SYNTAX = 'syntax',
  ASSERTION = 'assertion',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  ELEMENT_NOT_FOUND = 'element_not_found',
  JAVASCRIPT = 'javascript',
  PERMISSION = 'permission',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  ENVIRONMENT = 'environment',
  UNKNOWN = 'unknown'
}

// Error severity
export enum TestErrorSeverity {
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
  TRIVIAL = 'trivial'
}

// Error category
export enum TestErrorCategory {
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  NETWORK = 'network',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  FUNCTIONALITY = 'functionality',
  COMPATIBILITY = 'compatibility',
  USABILITY = 'usability',
  ACCESSIBILITY = 'accessibility',
  OTHER = 'other'
}

// Media type
export enum TestMediaType {
  SCREENSHOT = 'screenshot',
  VIDEO = 'video',
  HAR = 'har',
  CONSOLE_LOG = 'console_log',
  NETWORK_LOG = 'network_log',
  PERFORMANCE_TIMELINE = 'performance_timeline',
  CUSTOM = 'custom'
}

// Test priority
export enum TestPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Test severity
export enum TestSeverity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
  TRIVIAL = 'trivial'
}
