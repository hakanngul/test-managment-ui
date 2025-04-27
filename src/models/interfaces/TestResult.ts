import { TestResultStatus, TestErrorType, TestErrorSeverity, TestErrorCategory, TestMediaType, TestPriority, TestSeverity } from '../enums/TestResultEnums';
import { TestStepResult } from './TestStepResult';
import { BrowserType } from '../enums/TestCaseEnums';

// Test environment information
export interface TestEnvironmentInfo {
  browser?: BrowserType;
  browserVersion?: string;
  userAgent?: string;
  platform?: string;
  platformVersion?: string;
  viewport?: string;
  deviceName?: string;
  deviceType?: string;
  networkType?: string;
  networkSpeed?: string;
  location?: string;
  timezone?: string;
}

// Test error details
export interface TestErrorDetails {
  type: TestErrorType;
  severity: TestErrorSeverity;
  category: TestErrorCategory;
  message: string;
  stack?: string;
  code?: string;
  location?: string;
  timestamp: Date;
  relatedErrors?: string[];
}

// Test media
export interface TestMedia {
  type: TestMediaType;
  url: string;
  timestamp: Date;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Test performance metrics
export interface TestPerformanceMetrics {
  executionTime: number; // in milliseconds
  setupTime?: number; // in milliseconds
  teardownTime?: number; // in milliseconds
  
  // Page performance
  firstPaint?: number; // in milliseconds
  firstContentfulPaint?: number; // in milliseconds
  largestContentfulPaint?: number; // in milliseconds
  timeToInteractive?: number; // in milliseconds
  domComplete?: number; // in milliseconds
  loadEvent?: number; // in milliseconds
  
  // Resource usage
  cpuUsage?: number; // percentage
  peakCpuUsage?: number; // percentage
  memoryUsage?: number; // in MB
  peakMemoryUsage?: number; // in MB
  
  // Network
  networkRequests?: number;
  networkTransferred?: number; // in bytes
  networkDuration?: number; // in milliseconds
  
  // Other
  domElements?: number;
  jsHeapSize?: number; // in bytes
  jsEventListeners?: number;
}

// Test network information
export interface TestNetworkInfo {
  requests: TestNetworkRequest[];
  totalRequests: number;
  totalTransferred: number; // in bytes
  totalDuration: number; // in milliseconds
  failedRequests: number;
}

// Test network request
export interface TestNetworkRequest {
  url: string;
  method: string;
  status: number;
  statusText: string;
  type: string;
  size: number; // in bytes
  duration: number; // in milliseconds
  timing?: Record<string, number>;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  error?: string;
}

// Test retry information
export interface TestRetryInfo {
  count: number;
  maxRetries: number;
  strategy: string;
  previousAttempts: string[]; // IDs of previous attempts
  reasons: string[];
}

// Test result model
export interface TestResult {
  id: string;
  testRunId: string;
  testCaseId: string;
  testSuiteId?: string;
  name?: string;
  description?: string;
  status: TestResultStatus;
  priority?: TestPriority;
  severity?: TestSeverity;
  
  // Timing
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in milliseconds
  
  // Environment
  environment?: string;
  environmentInfo?: TestEnvironmentInfo;
  
  // Error information
  errorMessage?: string;
  errorStack?: string;
  errorDetails?: TestErrorDetails;
  
  // Media
  screenshots?: string[];
  media?: TestMedia[];
  
  // Performance
  performanceMetrics?: TestPerformanceMetrics;
  
  // Network
  networkInfo?: TestNetworkInfo;
  
  // Logs
  logs?: string[];
  consoleOutput?: string[];
  
  // Steps
  steps?: TestStepResult[];
  
  // Retry information
  retryInfo?: TestRetryInfo;
  
  // Additional information
  metadata?: Record<string, any>;
  tags?: string[];
  categories?: string[];
  
  // Tracing
  traceId?: string;
  spanId?: string;
}

// Test result creation model
export interface TestResultCreate {
  testRunId: string;
  testCaseId: string;
  testSuiteId?: string;
  name?: string;
  description?: string;
  status: TestResultStatus;
  priority?: TestPriority;
  severity?: TestSeverity;
  
  // Timing
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  
  // Environment
  environment?: string;
  environmentInfo?: TestEnvironmentInfo;
  
  // Error information
  errorMessage?: string;
  errorStack?: string;
  errorDetails?: TestErrorDetails;
  
  // Media
  screenshots?: string[];
  media?: TestMedia[];
  
  // Performance
  performanceMetrics?: TestPerformanceMetrics;
  
  // Network
  networkInfo?: TestNetworkInfo;
  
  // Logs
  logs?: string[];
  consoleOutput?: string[];
  
  // Steps
  steps?: TestStepResult[];
  
  // Retry information
  retryInfo?: TestRetryInfo;
  
  // Additional information
  metadata?: Record<string, any>;
  tags?: string[];
  categories?: string[];
  
  // Tracing
  traceId?: string;
  spanId?: string;
}

// Test result update model
export interface TestResultUpdate {
  status?: TestResultStatus;
  priority?: TestPriority;
  severity?: TestSeverity;
  
  // Timing
  endTime?: Date;
  duration?: number;
  
  // Environment
  environmentInfo?: TestEnvironmentInfo;
  
  // Error information
  errorMessage?: string;
  errorStack?: string;
  errorDetails?: TestErrorDetails;
  
  // Media
  screenshots?: string[];
  media?: TestMedia[];
  
  // Performance
  performanceMetrics?: TestPerformanceMetrics;
  
  // Network
  networkInfo?: TestNetworkInfo;
  
  // Logs
  logs?: string[];
  consoleOutput?: string[];
  
  // Steps
  steps?: TestStepResult[];
  
  // Retry information
  retryInfo?: TestRetryInfo;
  
  // Additional information
  metadata?: Record<string, any>;
  tags?: string[];
  categories?: string[];
  
  // Tracing
  traceId?: string;
  spanId?: string;
}
