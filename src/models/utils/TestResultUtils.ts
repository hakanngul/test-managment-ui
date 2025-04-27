import {
  TestResult,
  TestResultCreate,
  TestResultUpdate,
  TestEnvironmentInfo,
  TestErrorDetails,
  TestMedia,
  TestPerformanceMetrics,
  TestNetworkInfo,
  TestRetryInfo
} from '../interfaces/TestResult';
import { TestStepResult } from '../interfaces/TestStepResult';
import { TestResultStatus, TestErrorType, TestErrorSeverity, TestErrorCategory } from '../enums/TestResultEnums';

// Convert raw test result data to TestResult model
export const toTestResult = (data: any): TestResult => {
  return {
    id: data.id || data._id,
    testRunId: data.testRunId,
    testCaseId: data.testCaseId,
    testSuiteId: data.testSuiteId,
    name: data.name,
    description: data.description,
    status: data.status as TestResultStatus,
    priority: data.priority,
    severity: data.severity,

    // Timing
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    duration: data.duration,

    // Environment
    environment: data.environment,
    environmentInfo: data.environmentInfo,

    // Error information
    errorMessage: data.errorMessage,
    errorStack: data.errorStack,
    errorDetails: data.errorDetails ? {
      ...data.errorDetails,
      timestamp: data.errorDetails.timestamp ? new Date(data.errorDetails.timestamp) : new Date()
    } : undefined,

    // Media
    screenshots: data.screenshots || [],
    media: data.media ? data.media.map((m: any) => ({
      ...m,
      timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
    })) : undefined,

    // Performance
    performanceMetrics: data.performanceMetrics,

    // Network
    networkInfo: data.networkInfo,

    // Logs
    logs: data.logs,
    consoleOutput: data.consoleOutput,

    // Steps
    steps: data.steps || [],

    // Retry information
    retryInfo: data.retryInfo,

    // Additional information
    metadata: data.metadata,
    tags: data.tags,
    categories: data.categories,

    // Tracing
    traceId: data.traceId,
    spanId: data.spanId
  };
};

// Convert TestResult model to raw data for API
export const fromTestResult = (testResult: TestResult): any => {
  return {
    id: testResult.id,
    testRunId: testResult.testRunId,
    testCaseId: testResult.testCaseId,
    testSuiteId: testResult.testSuiteId,
    name: testResult.name,
    description: testResult.description,
    status: testResult.status,
    priority: testResult.priority,
    severity: testResult.severity,

    // Timing
    startTime: testResult.startTime?.toISOString(),
    endTime: testResult.endTime?.toISOString(),
    duration: testResult.duration,

    // Environment
    environment: testResult.environment,
    environmentInfo: testResult.environmentInfo,

    // Error information
    errorMessage: testResult.errorMessage,
    errorStack: testResult.errorStack,
    errorDetails: testResult.errorDetails ? {
      ...testResult.errorDetails,
      timestamp: testResult.errorDetails.timestamp?.toISOString()
    } : undefined,

    // Media
    screenshots: testResult.screenshots,
    media: testResult.media ? testResult.media.map(m => ({
      ...m,
      timestamp: m.timestamp?.toISOString()
    })) : undefined,

    // Performance
    performanceMetrics: testResult.performanceMetrics,

    // Network
    networkInfo: testResult.networkInfo,

    // Logs
    logs: testResult.logs,
    consoleOutput: testResult.consoleOutput,

    // Steps
    steps: testResult.steps,

    // Retry information
    retryInfo: testResult.retryInfo,

    // Additional information
    metadata: testResult.metadata,
    tags: testResult.tags,
    categories: testResult.categories,

    // Tracing
    traceId: testResult.traceId,
    spanId: testResult.spanId
  };
};

// Calculate test result duration
export const calculateTestResultDuration = (startTime?: Date, endTime?: Date): number | undefined => {
  if (!startTime || !endTime) {
    return undefined;
  }

  return endTime.getTime() - startTime.getTime();
};

// Calculate test result status from step results
export const calculateTestResultStatus = (steps: TestStepResult[]): TestResultStatus => {
  if (!steps || steps.length === 0) {
    return TestResultStatus.PENDING;
  }

  if (steps.some(step => step.status === 'failed')) {
    return TestResultStatus.FAILED;
  }

  if (steps.some(step => step.status === 'error')) {
    return TestResultStatus.ERROR;
  }

  if (steps.some(step => step.status === 'blocked')) {
    return TestResultStatus.BLOCKED;
  }

  if (steps.some(step => step.status === 'pending')) {
    return TestResultStatus.PENDING;
  }

  if (steps.some(step => step.status === 'skipped')) {
    return TestResultStatus.SKIPPED;
  }

  return TestResultStatus.PASSED;
};

// Create default error details
export const createDefaultErrorDetails = (
  message: string,
  stack?: string,
  type: TestErrorType = TestErrorType.UNKNOWN,
  severity: TestErrorSeverity = TestErrorSeverity.MAJOR,
  category: TestErrorCategory = TestErrorCategory.FUNCTIONALITY
): TestErrorDetails => {
  return {
    type,
    severity,
    category,
    message,
    stack,
    timestamp: new Date()
  };
};

// Create default environment info
export const createDefaultEnvironmentInfo = (): TestEnvironmentInfo => {
  return {
    browser: undefined,
    browserVersion: '',
    userAgent: '',
    platform: '',
    platformVersion: '',
    viewport: '',
    deviceName: '',
    deviceType: '',
    networkType: '',
    networkSpeed: '',
    location: '',
    timezone: ''
  };
};

// Create default test performance metrics
export const createDefaultTestPerformanceMetrics = (): TestPerformanceMetrics => {
  return {
    executionTime: 0,
    setupTime: 0,
    teardownTime: 0
  };
};

// Create default test network info
export const createDefaultTestNetworkInfo = (): TestNetworkInfo => {
  return {
    requests: [],
    totalRequests: 0,
    totalTransferred: 0,
    totalDuration: 0,
    failedRequests: 0
  };
};

// Create default retry info
export const createDefaultRetryInfo = (): TestRetryInfo => {
  return {
    count: 0,
    maxRetries: 0,
    strategy: 'none',
    previousAttempts: [],
    reasons: []
  };
};
