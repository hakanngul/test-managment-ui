import { TestSuite, TestSuiteResults, TestSuiteSchedule, TestSuiteNotification, TestCaseDependency, TestSuiteCreate } from '../interfaces/TestSuite';
import { TestSuiteStatus, TestSuitePriority, TestSuiteExecutionMode, TestSuiteRetryStrategy, TestSuiteDependencyMode } from '../enums/TestSuiteEnums';
import { BrowserType } from '../enums/TestCaseEnums';

// Convert raw test suite data to TestSuite model
export const toTestSuite = (data: any): TestSuite => {
  return {
    id: data.id || data._id,
    name: data.name,
    description: data.description,
    status: data.status as TestSuiteStatus,
    priority: data.priority as TestSuitePriority,
    progress: data.progress || 0,
    testCases: data.testCases || [],
    projectId: data.projectId,
    tags: data.tags || [],
    
    // Execution settings
    executionMode: data.executionMode as TestSuiteExecutionMode,
    maxParallelExecutions: data.maxParallelExecutions,
    retryStrategy: data.retryStrategy as TestSuiteRetryStrategy,
    maxRetries: data.maxRetries,
    dependencies: data.dependencies,
    dependencyMode: data.dependencyMode as TestSuiteDependencyMode,
    
    // Browser settings
    browsers: data.browsers ? data.browsers.map((b: string) => b as BrowserType) : undefined,
    headless: data.headless,
    browserPool: data.browserPool,
    
    // Scheduling
    schedule: data.schedule ? {
      enabled: data.schedule.enabled,
      cronExpression: data.schedule.cronExpression,
      nextRunDate: data.schedule.nextRunDate ? new Date(data.schedule.nextRunDate) : undefined,
      timezone: data.schedule.timezone
    } : undefined,
    
    // Notifications
    notifications: data.notifications,
    
    // Assignment and dates
    assignee: data.assignee,
    dateRange: data.dateRange,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    environment: data.environment,
    
    // Metadata
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    
    // Results
    results: data.results ? {
      passed: data.results.passed || 0,
      failed: data.results.failed || 0,
      blocked: data.results.blocked || 0,
      pending: data.results.pending || 0,
      total: data.results.total || (data.results.passed + data.results.failed + data.results.blocked + data.results.pending),
      avgDuration: data.results.avgDuration,
      lastRun: data.results.lastRun ? new Date(data.results.lastRun) : undefined
    } : undefined
  };
};

// Convert TestSuite model to raw data for API
export const fromTestSuite = (testSuite: TestSuite): any => {
  return {
    id: testSuite.id,
    name: testSuite.name,
    description: testSuite.description,
    status: testSuite.status,
    priority: testSuite.priority,
    progress: testSuite.progress,
    testCases: testSuite.testCases,
    projectId: testSuite.projectId,
    tags: testSuite.tags,
    
    // Execution settings
    executionMode: testSuite.executionMode,
    maxParallelExecutions: testSuite.maxParallelExecutions,
    retryStrategy: testSuite.retryStrategy,
    maxRetries: testSuite.maxRetries,
    dependencies: testSuite.dependencies,
    dependencyMode: testSuite.dependencyMode,
    
    // Browser settings
    browsers: testSuite.browsers,
    headless: testSuite.headless,
    browserPool: testSuite.browserPool,
    
    // Scheduling
    schedule: testSuite.schedule ? {
      enabled: testSuite.schedule.enabled,
      cronExpression: testSuite.schedule.cronExpression,
      nextRunDate: testSuite.schedule.nextRunDate?.toISOString(),
      timezone: testSuite.schedule.timezone
    } : undefined,
    
    // Notifications
    notifications: testSuite.notifications,
    
    // Assignment and dates
    assignee: testSuite.assignee,
    dateRange: testSuite.dateRange,
    startDate: testSuite.startDate?.toISOString(),
    endDate: testSuite.endDate?.toISOString(),
    environment: testSuite.environment,
    
    // Metadata
    createdBy: testSuite.createdBy,
    createdAt: testSuite.createdAt?.toISOString(),
    updatedAt: testSuite.updatedAt?.toISOString(),
    
    // Results
    results: testSuite.results ? {
      passed: testSuite.results.passed,
      failed: testSuite.results.failed,
      blocked: testSuite.results.blocked,
      pending: testSuite.results.pending,
      total: testSuite.results.total,
      avgDuration: testSuite.results.avgDuration,
      lastRun: testSuite.results.lastRun?.toISOString()
    } : undefined
  };
};

// Calculate test suite progress based on test results
export const calculateTestSuiteProgress = (results: TestSuiteResults): number => {
  if (!results || !results.total || results.total === 0) {
    return 0;
  }
  
  const completed = results.passed + results.failed;
  return Math.round((completed / results.total) * 100);
};

// Create a new empty test suite
export const createEmptyTestSuite = (projectId: string): TestSuiteCreate => {
  return {
    name: '',
    description: '',
    status: TestSuiteStatus.DRAFT,
    priority: TestSuitePriority.MEDIUM,
    testCases: [],
    projectId,
    tags: [],
    executionMode: TestSuiteExecutionMode.SEQUENTIAL,
    retryStrategy: TestSuiteRetryStrategy.NONE,
    dependencyMode: TestSuiteDependencyMode.NONE
  };
};
