// Test Plan ile ilgili enum'lar
export enum TestPlanStatus {
  DRAFT = 'draft',
  PLANNING = 'planning',
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Test Suite ile ilgili enum'lar
export enum TestSuiteStatus {
  DRAFT = 'draft',
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  ARCHIVED = 'archived'
}

export enum TestSuitePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Test Case ile ilgili enum'lar
export enum TestCaseStatus {
  DRAFT = 'draft',
  READY = 'ready',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  BLOCKED = 'blocked',
  ARCHIVED = 'archived'
}

export enum TestCasePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TestCaseType {
  FUNCTIONAL = 'functional',
  REGRESSION = 'regression',
  INTEGRATION = 'integration',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  USABILITY = 'usability',
  ACCEPTANCE = 'acceptance',
  SMOKE = 'smoke',
  EXPLORATORY = 'exploratory',
  API = 'api',
  UI = 'ui',
  DATABASE = 'database'
}

export enum AutomationStatus {
  NOT_AUTOMATED = 'not_automated',
  AUTOMATED = 'automated',
  IN_PROGRESS = 'in_progress',
  PLANNED = 'planned',
  NOT_APPLICABLE = 'not_applicable'
}

// Test Step ile ilgili enum'lar
export enum TestStepStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
  NOT_RUN = 'not_run'
}

// Test Data ile ilgili enum'lar
export enum TestDataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  OBJECT = 'object',
  ARRAY = 'array',
  FILE = 'file',
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv'
}

export enum TestDataSource {
  STATIC = 'static',
  DATABASE = 'database',
  API = 'api',
  FILE = 'file',
  GENERATED = 'generated',
  EXTERNAL = 'external'
}

// Test Execution ile ilgili enum'lar
export enum BrowserType {
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  EDGE = 'edge',
  IE = 'ie',
  OPERA = 'opera',
  BRAVE = 'brave',
  CHROMIUM = 'chromium',
  WEBKIT = 'webkit',
  NONE = 'none'
}

export enum ExecutionStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ABORTED = 'aborted',
  TIMEOUT = 'timeout',
  ERROR = 'error'
}

// Test Run ile ilgili enum'lar
export enum TestRunStatus {
  SCHEDULED = 'scheduled',
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ABORTED = 'aborted',
  TIMEOUT = 'timeout',
  ERROR = 'error',
  PARTIAL = 'partial'
}

export enum TriggerType {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  CI_CD = 'ci_cd',
  API = 'api',
  WEBHOOK = 'webhook',
  EVENT = 'event'
}

// Test Result ile ilgili enum'lar
export enum TestResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
  ERROR = 'error',
  WARNING = 'warning',
  NOT_RUN = 'not_run',
  INCONCLUSIVE = 'inconclusive'
}

// Test Defect ile ilgili enum'lar
export enum DefectSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  TRIVIAL = 'trivial'
}

export enum DefectStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  FIXED = 'fixed',
  VERIFIED = 'verified',
  REOPENED = 'reopened',
  CLOSED = 'closed',
  REJECTED = 'rejected',
  DEFERRED = 'deferred'
}

// Environment ile ilgili enum'lar
export enum EnvironmentType {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production',
  QA = 'qa',
  UAT = 'uat',
  SANDBOX = 'sandbox',
  DEMO = 'demo'
}

// Test Scheduler ile ilgili enum'lar
export enum ScheduleType {
  ONE_TIME = 'one_time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export enum ScheduleStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error'
}

// Test Listener ile ilgili enum'lar
export enum ListenerType {
  BEFORE_TEST = 'before_test',
  AFTER_TEST = 'after_test',
  BEFORE_SUITE = 'before_suite',
  AFTER_SUITE = 'after_suite',
  ON_ERROR = 'on_error',
  ON_FAILURE = 'on_failure',
  ON_SUCCESS = 'on_success',
  ON_TIMEOUT = 'on_timeout'
}

export enum HookType {
  SETUP = 'setup',
  TEARDOWN = 'teardown',
  ASSERTION = 'assertion',
  VALIDATION = 'validation',
  NOTIFICATION = 'notification',
  LOGGING = 'logging',
  SCREENSHOT = 'screenshot',
  VIDEO = 'video'
}

// Notification ile ilgili enum'lar
export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  SLACK = 'slack',
  TEAMS = 'teams',
  WEBHOOK = 'webhook',
  PUSH = 'push',
  IN_APP = 'in_app'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
  READ = 'read'
}

// User ile ilgili enum'lar
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TESTER = 'tester',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

// Test Report ile ilgili enum'lar
export enum ReportType {
  SUMMARY = 'summary',
  DETAILED = 'detailed',
  EXECUTIVE = 'executive',
  TECHNICAL = 'technical',
  COMPLIANCE = 'compliance',
  CUSTOM = 'custom'
}

export enum ReportFormat {
  HTML = 'html',
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml',
  MARKDOWN = 'markdown'
}
