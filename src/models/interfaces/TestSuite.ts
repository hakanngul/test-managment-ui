import { BrowserType } from '../enums/TestCaseEnums';
import { TestSuiteStatus, TestSuitePriority, TestSuiteExecutionMode, TestSuiteRetryStrategy, TestSuiteDependencyMode } from '../enums/TestSuiteEnums';

// Test case dependency
export interface TestCaseDependency {
  testCaseId: string;
  dependsOn: string[];
}

// Test suite scheduling
export interface TestSuiteSchedule {
  enabled: boolean;
  cronExpression?: string;
  nextRunDate?: Date;
  timezone?: string;
}

// Test suite notification settings
export interface TestSuiteNotification {
  onStart?: boolean;
  onComplete?: boolean;
  onFail?: boolean;
  emailRecipients?: string[];
  webhookUrls?: string[];
  slackChannels?: string[];
}

// Test suite results
export interface TestSuiteResults {
  passed: number;
  failed: number;
  blocked: number;
  pending: number;
  total?: number;
  avgDuration?: number;
  lastRun?: Date;
}

// Test suite model
export interface TestSuite {
  id: string;
  name: string;
  description: string;
  status: TestSuiteStatus;
  priority?: TestSuitePriority;
  progress: number; // 0-100
  testCases: string[]; // Test case IDs
  projectId: string;
  tags?: string[];
  
  // Execution settings
  executionMode?: TestSuiteExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestSuiteRetryStrategy;
  maxRetries?: number;
  dependencies?: TestCaseDependency[];
  dependencyMode?: TestSuiteDependencyMode;
  
  // Browser settings
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  
  // Scheduling
  schedule?: TestSuiteSchedule;
  
  // Notifications
  notifications?: TestSuiteNotification;
  
  // Assignment and dates
  assignee?: string; // User ID
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
  environment?: string;
  
  // Metadata
  createdBy?: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
  results?: TestSuiteResults;
}

// Test suite creation model
export interface TestSuiteCreate {
  name: string;
  description: string;
  status: TestSuiteStatus;
  priority?: TestSuitePriority;
  testCases: string[];
  projectId: string;
  tags?: string[];
  
  // Execution settings
  executionMode?: TestSuiteExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestSuiteRetryStrategy;
  maxRetries?: number;
  dependencies?: TestCaseDependency[];
  dependencyMode?: TestSuiteDependencyMode;
  
  // Browser settings
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  
  // Scheduling
  schedule?: TestSuiteSchedule;
  
  // Notifications
  notifications?: TestSuiteNotification;
  
  // Assignment and dates
  assignee?: string;
  startDate?: Date;
  endDate?: Date;
  environment?: string;
}

// Test suite update model
export interface TestSuiteUpdate {
  name?: string;
  description?: string;
  status?: TestSuiteStatus;
  priority?: TestSuitePriority;
  progress?: number;
  testCases?: string[];
  tags?: string[];
  
  // Execution settings
  executionMode?: TestSuiteExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestSuiteRetryStrategy;
  maxRetries?: number;
  dependencies?: TestCaseDependency[];
  dependencyMode?: TestSuiteDependencyMode;
  
  // Browser settings
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  
  // Scheduling
  schedule?: TestSuiteSchedule;
  
  // Notifications
  notifications?: TestSuiteNotification;
  
  // Assignment and dates
  assignee?: string;
  startDate?: Date;
  endDate?: Date;
  environment?: string;
  
  // Results
  results?: TestSuiteResults;
}
