// Test suite status
export enum TestSuiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending',
  FAILED = 'failed',
  PASSED = 'passed',
  DRAFT = 'draft'
}

// Test suite priority
export enum TestSuitePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Test suite execution mode
export enum TestSuiteExecutionMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel'
}

// Test suite retry strategy
export enum TestSuiteRetryStrategy {
  NONE = 'none',
  RETRY_FAILED = 'retry_failed',
  RETRY_ALL = 'retry_all'
}

// Test suite dependency mode
export enum TestSuiteDependencyMode {
  NONE = 'none',
  STRICT = 'strict', // Bağımlı olduğu test başarısız olursa çalışmaz
  SOFT = 'soft'      // Bağımlı olduğu test başarısız olsa da çalışır
}
