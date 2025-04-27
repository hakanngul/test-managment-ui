import { TestResult } from '../TestResult';
import { BrowserType } from '../enums/TestCaseEnums';
import { TestRunStatus, TestRunPriority, TestRunExecutionMode, TestRunRetryStrategy, TestRunLogLevel, TestRunReportFormat } from '../enums/TestRunEnums';

// Test run context information
export interface TestRunContext {
  operatingSystem?: string;
  browserVersion?: string;
  deviceInfo?: string;
  viewport?: string;
  userAgent?: string;
  networkConditions?: string;
  customData?: Record<string, any>;
}

// Test run logging options
export interface TestRunLogging {
  level: TestRunLogLevel;
  captureScreenshots: boolean;
  screenshotOnFailure: boolean;
  captureVideo: boolean;
  captureConsoleOutput: boolean;
  captureNetworkRequests: boolean;
  capturePerformanceMetrics: boolean;
}

// Test run reporting options
export interface TestRunReporting {
  formats: TestRunReportFormat[];
  destinations?: string[]; // URLs, file paths, etc.
  includeScreenshots?: boolean;
  includeVideos?: boolean;
  includeConsoleLogs?: boolean;
  includeNetworkLogs?: boolean;
  includePerformanceData?: boolean;
  customTemplate?: string;
}

// Test run notification settings
export interface TestRunNotification {
  onStart?: boolean;
  onComplete?: boolean;
  onFail?: boolean;
  emailRecipients?: string[];
  webhookUrls?: string[];
  slackChannels?: string[];
}

// Test run statistics
export interface TestRunStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  blockedTests: number;
  passRate: number;
  avgDuration?: number;
  minDuration?: number;
  maxDuration?: number;
  medianDuration?: number;
  totalDuration?: number;
}

// Test run model
export interface TestRun {
  id: string;
  name: string;
  description?: string;
  status: TestRunStatus;
  priority?: TestRunPriority;
  testSuiteId: string;
  environment: string;
  tags?: string[];
  
  // Execution settings
  executionMode?: TestRunExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestRunRetryStrategy;
  maxRetries?: number;
  
  // Browser settings
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  
  // Logging and reporting
  logging?: TestRunLogging;
  reporting?: TestRunReporting;
  
  // Notifications
  notifications?: TestRunNotification;
  
  // Context information
  context?: TestRunContext;
  
  // Timing
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in milliseconds
  
  // Results
  results?: TestResult[];
  stats?: TestRunStats;
  
  // Assignment
  agentId?: string;
  createdBy?: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
}

// Test run creation model
export interface TestRunCreate {
  name: string;
  description?: string;
  priority?: TestRunPriority;
  testSuiteId: string;
  environment: string;
  tags?: string[];
  
  // Execution settings
  executionMode?: TestRunExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestRunRetryStrategy;
  maxRetries?: number;
  
  // Browser settings
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  
  // Logging and reporting
  logging?: TestRunLogging;
  reporting?: TestRunReporting;
  
  // Notifications
  notifications?: TestRunNotification;
  
  // Context information
  context?: TestRunContext;
  
  // Assignment
  agentId?: string;
}

// Test run update model
export interface TestRunUpdate {
  name?: string;
  description?: string;
  status?: TestRunStatus;
  priority?: TestRunPriority;
  environment?: string;
  tags?: string[];
  
  // Execution settings
  executionMode?: TestRunExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestRunRetryStrategy;
  maxRetries?: number;
  
  // Browser settings
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  
  // Logging and reporting
  logging?: TestRunLogging;
  reporting?: TestRunReporting;
  
  // Notifications
  notifications?: TestRunNotification;
  
  // Context information
  context?: TestRunContext;
  
  // Timing
  startTime?: Date;
  endTime?: Date;
  
  // Assignment
  agentId?: string;
}
