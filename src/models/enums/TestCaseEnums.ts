// Browser types
export enum BrowserType {
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  EDGE = 'edge',
  IE = 'ie',
  OPERA = 'opera'
}

// Test case status
export enum TestCaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

// Test case priority
export enum TestCasePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Test case type
export enum TestCaseType {
  FUNCTIONAL = 'functional',
  REGRESSION = 'regression',
  INTEGRATION = 'integration',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  USABILITY = 'usability',
  ACCEPTANCE = 'acceptance',
  SMOKE = 'smoke',
  EXPLORATORY = 'exploratory'
}

// Test result status
export enum TestResultStatus {
  PASS = 'pass',
  FAIL = 'fail',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
  ERROR = 'error'
}
