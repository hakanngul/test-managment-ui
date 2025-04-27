import { TestRun, TestRunStats, TestRunContext, TestRunLogging, TestRunReporting, TestRunNotification } from '../interfaces/TestRun';
import { TestRunStatus, TestRunPriority, TestRunExecutionMode, TestRunRetryStrategy, TestRunLogLevel, TestRunReportFormat } from '../enums/TestRunEnums';
import { BrowserType } from '../enums/TestCaseEnums';
import { TestResult } from '../TestResult';

// Convert raw test run data to TestRun model
export const toTestRun = (data: any): TestRun => {
  return {
    id: data.id || data._id,
    name: data.name,
    description: data.description,
    status: data.status as TestRunStatus,
    priority: data.priority as TestRunPriority,
    testSuiteId: data.testSuiteId,
    environment: data.environment,
    tags: data.tags || [],
    
    // Execution settings
    executionMode: data.executionMode as TestRunExecutionMode,
    maxParallelExecutions: data.maxParallelExecutions,
    retryStrategy: data.retryStrategy as TestRunRetryStrategy,
    maxRetries: data.maxRetries,
    
    // Browser settings
    browsers: data.browsers ? data.browsers.map((b: string) => b as BrowserType) : undefined,
    headless: data.headless,
    browserPool: data.browserPool,
    
    // Logging and reporting
    logging: data.logging,
    reporting: data.reporting,
    
    // Notifications
    notifications: data.notifications,
    
    // Context information
    context: data.context,
    
    // Timing
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    duration: data.duration,
    
    // Results
    results: data.results || [],
    stats: data.stats,
    
    // Assignment
    agentId: data.agentId,
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
  };
};

// Convert TestRun model to raw data for API
export const fromTestRun = (testRun: TestRun): any => {
  return {
    id: testRun.id,
    name: testRun.name,
    description: testRun.description,
    status: testRun.status,
    priority: testRun.priority,
    testSuiteId: testRun.testSuiteId,
    environment: testRun.environment,
    tags: testRun.tags,
    
    // Execution settings
    executionMode: testRun.executionMode,
    maxParallelExecutions: testRun.maxParallelExecutions,
    retryStrategy: testRun.retryStrategy,
    maxRetries: testRun.maxRetries,
    
    // Browser settings
    browsers: testRun.browsers,
    headless: testRun.headless,
    browserPool: testRun.browserPool,
    
    // Logging and reporting
    logging: testRun.logging,
    reporting: testRun.reporting,
    
    // Notifications
    notifications: testRun.notifications,
    
    // Context information
    context: testRun.context,
    
    // Timing
    startTime: testRun.startTime?.toISOString(),
    endTime: testRun.endTime?.toISOString(),
    duration: testRun.duration,
    
    // Results
    results: testRun.results,
    stats: testRun.stats,
    
    // Assignment
    agentId: testRun.agentId,
    createdBy: testRun.createdBy,
    createdAt: testRun.createdAt?.toISOString(),
    updatedAt: testRun.updatedAt?.toISOString()
  };
};

// Calculate test run statistics from test results
export const calculateTestRunStats = (results: TestResult[]): TestRunStats => {
  if (!results || results.length === 0) {
    return {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      pendingTests: 0,
      blockedTests: 0,
      passRate: 0
    };
  }
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  const pendingTests = results.filter(r => r.status === 'pending').length;
  const blockedTests = results.filter(r => r.status === 'blocked').length;
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  
  // Calculate duration statistics
  const durations = results
    .filter(r => r.duration !== undefined && r.duration !== null)
    .map(r => r.duration as number);
  
  let avgDuration, minDuration, maxDuration, medianDuration, totalDuration;
  
  if (durations.length > 0) {
    totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    avgDuration = totalDuration / durations.length;
    minDuration = Math.min(...durations);
    maxDuration = Math.max(...durations);
    
    // Calculate median
    const sortedDurations = [...durations].sort((a, b) => a - b);
    const mid = Math.floor(sortedDurations.length / 2);
    medianDuration = sortedDurations.length % 2 === 0
      ? (sortedDurations[mid - 1] + sortedDurations[mid]) / 2
      : sortedDurations[mid];
  }
  
  return {
    totalTests,
    passedTests,
    failedTests,
    pendingTests,
    blockedTests,
    passRate,
    avgDuration,
    minDuration,
    maxDuration,
    medianDuration,
    totalDuration
  };
};

// Create default logging options
export const createDefaultLoggingOptions = (): TestRunLogging => {
  return {
    level: TestRunLogLevel.INFO,
    captureScreenshots: true,
    screenshotOnFailure: true,
    captureVideo: false,
    captureConsoleOutput: true,
    captureNetworkRequests: false,
    capturePerformanceMetrics: false
  };
};

// Create default reporting options
export const createDefaultReportingOptions = (): TestRunReporting => {
  return {
    formats: [TestRunReportFormat.HTML],
    includeScreenshots: true,
    includeVideos: false,
    includeConsoleLogs: true,
    includeNetworkLogs: false,
    includePerformanceData: false
  };
};

// Create a new empty test run
export const createEmptyTestRun = (testSuiteId: string, environment: string): TestRun => {
  return {
    id: '',
    name: '',
    description: '',
    status: TestRunStatus.PENDING,
    priority: TestRunPriority.MEDIUM,
    testSuiteId,
    environment,
    tags: [],
    executionMode: TestRunExecutionMode.SEQUENTIAL,
    retryStrategy: TestRunRetryStrategy.NONE,
    logging: createDefaultLoggingOptions(),
    reporting: createDefaultReportingOptions(),
    results: []
  };
};
