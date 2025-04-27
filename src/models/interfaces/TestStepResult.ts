import { TestStepResultStatus, TestErrorType, TestErrorSeverity, TestErrorCategory, TestMediaType } from '../enums/TestResultEnums';

// Test step error details
export interface TestStepErrorDetails {
  type: TestErrorType;
  severity: TestErrorSeverity;
  category: TestErrorCategory;
  message: string;
  stack?: string;
  code?: string;
  location?: string;
  timestamp: Date;
}

// Test step media
export interface TestStepMedia {
  type: TestMediaType;
  url: string;
  timestamp: Date;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Test step performance metrics
export interface TestStepPerformanceMetrics {
  executionTime: number; // in milliseconds
  cpuUsage?: number; // percentage
  memoryUsage?: number; // in MB
  networkRequests?: number;
  networkTransferred?: number; // in bytes
  domElements?: number;
  jsHeapSize?: number; // in bytes
  jsEventListeners?: number;
}

// Test step result model
export interface TestStepResult {
  id: string;
  order: number;
  description: string;
  expectedResult?: string;
  actualResult?: string;
  status: TestStepResultStatus;
  duration?: number; // in milliseconds
  startTime?: Date;
  endTime?: Date;
  
  // Error information
  errorMessage?: string | null;
  errorDetails?: TestStepErrorDetails;
  
  // Media
  screenshot?: string | null;
  media?: TestStepMedia[];
  
  // Performance
  performanceMetrics?: TestStepPerformanceMetrics;
  
  // Logs
  logs?: string[];
  consoleOutput?: string[];
  
  // Retry information
  retryCount?: number;
  previousAttempts?: string[]; // IDs of previous attempts
  
  // Additional information
  metadata?: Record<string, any>;
  tags?: string[];
}

// Test step result creation model
export interface TestStepResultCreate {
  order: number;
  description: string;
  expectedResult?: string;
  actualResult?: string;
  status: TestStepResultStatus;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  
  // Error information
  errorMessage?: string | null;
  errorDetails?: TestStepErrorDetails;
  
  // Media
  screenshot?: string | null;
  media?: TestStepMedia[];
  
  // Performance
  performanceMetrics?: TestStepPerformanceMetrics;
  
  // Logs
  logs?: string[];
  consoleOutput?: string[];
  
  // Retry information
  retryCount?: number;
  previousAttempts?: string[];
  
  // Additional information
  metadata?: Record<string, any>;
  tags?: string[];
}

// Test step result update model
export interface TestStepResultUpdate {
  status?: TestStepResultStatus;
  actualResult?: string;
  duration?: number;
  endTime?: Date;
  
  // Error information
  errorMessage?: string | null;
  errorDetails?: TestStepErrorDetails;
  
  // Media
  screenshot?: string | null;
  media?: TestStepMedia[];
  
  // Performance
  performanceMetrics?: TestStepPerformanceMetrics;
  
  // Logs
  logs?: string[];
  consoleOutput?: string[];
  
  // Retry information
  retryCount?: number;
  previousAttempts?: string[];
  
  // Additional information
  metadata?: Record<string, any>;
  tags?: string[];
}
