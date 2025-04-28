import { ProcessedRequestStatus, ProcessedRequestErrorType, ProcessedRequestPriority, ProcessedRequestSource } from '../enums/ProcessedRequestEnums';
import { BrowserType } from '../enums/TestCaseEnums';

// Processed request error details
export interface ProcessedRequestError {
  type: ProcessedRequestErrorType;
  message: string;
  stack?: string;
  code?: string;
  location?: string;
  timestamp: Date;
  details?: Record<string, any>;
}

// Processed request performance metrics
export interface ProcessedRequestPerformance {
  setupTime?: number; // in milliseconds
  executionTime?: number; // in milliseconds
  teardownTime?: number; // in milliseconds
  totalTime: number; // in milliseconds
  cpuUsage?: number; // percentage
  memoryUsage?: number; // in MB
  networkUsage?: number; // in MB
}

// Processed request environment info
export interface ProcessedRequestEnvironment {
  browser: BrowserType;
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

// Processed request resource usage
export interface ProcessedRequestResources {
  cpuTime?: number; // in milliseconds
  peakMemory?: number; // in MB
  networkRequests?: number;
  networkTransferred?: number; // in bytes
  diskUsage?: number; // in MB
  screenshots?: number;
  videos?: number;
}

// Processed request logs
export interface ProcessedRequestLogs {
  console?: string[];
  network?: string[];
  browser?: string[];
  agent?: string[];
  system?: string[];
}

// Processed request model
export interface ProcessedRequest {
  [x: string]: string;
  id: string;
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  testSuiteId?: string;
  projectId?: string;
  
  // Status and result
  status: ProcessedRequestStatus;
  result?: any; // test result data
  error?: ProcessedRequestError;
  
  // Execution details
  browser: string;
  agentId: string;
  priority?: ProcessedRequestPriority;
  source?: ProcessedRequestSource;
  
  // Timing
  startTime: Date;
  endTime?: Date;
  duration: string; // formatted duration
  durationMs?: number; // duration in milliseconds
  
  // Performance and resources
  performance?: ProcessedRequestPerformance;
  resources?: ProcessedRequestResources;
  
  // Environment
  environment?: ProcessedRequestEnvironment;
  
  // Logs and artifacts
  logs?: ProcessedRequestLogs;
  screenshots?: string[]; // URLs to screenshots
  videos?: string[]; // URLs to videos
  artifacts?: string[]; // URLs to other artifacts
  
  // Retry information
  retryCount?: number;
  previousAttempts?: string[]; // IDs of previous attempts
  maxRetries?: number;
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
  createdBy?: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
}

// Processed request creation model
export interface ProcessedRequestCreate {
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  testSuiteId?: string;
  projectId?: string;
  
  // Status and result
  status: ProcessedRequestStatus;
  result?: any;
  error?: ProcessedRequestError;
  
  // Execution details
  browser: string;
  agentId: string;
  priority?: ProcessedRequestPriority;
  source?: ProcessedRequestSource;
  
  // Timing
  startTime: Date;
  endTime?: Date;
  
  // Performance and resources
  performance?: ProcessedRequestPerformance;
  resources?: ProcessedRequestResources;
  
  // Environment
  environment?: ProcessedRequestEnvironment;
  
  // Logs and artifacts
  logs?: ProcessedRequestLogs;
  screenshots?: string[];
  videos?: string[];
  artifacts?: string[];
  
  // Retry information
  retryCount?: number;
  previousAttempts?: string[];
  maxRetries?: number;
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
  createdBy?: string;
}

// Processed request update model
export interface ProcessedRequestUpdate {
  status?: ProcessedRequestStatus;
  result?: any;
  error?: ProcessedRequestError;
  
  // Timing
  endTime?: Date;
  
  // Performance and resources
  performance?: ProcessedRequestPerformance;
  resources?: ProcessedRequestResources;
  
  // Logs and artifacts
  logs?: ProcessedRequestLogs;
  screenshots?: string[];
  videos?: string[];
  artifacts?: string[];
  
  // Retry information
  retryCount?: number;
  previousAttempts?: string[];
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
  updatedAt?: Date;
}
