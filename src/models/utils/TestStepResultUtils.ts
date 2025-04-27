import { 
  TestStepResult, 
  TestStepResultCreate, 
  TestStepResultUpdate,
  TestStepErrorDetails,
  TestStepMedia,
  TestStepPerformanceMetrics
} from '../interfaces/TestStepResult';
import { TestStepResultStatus, TestErrorType, TestErrorSeverity, TestErrorCategory, TestMediaType } from '../enums/TestResultEnums';

// Convert raw test step result data to TestStepResult model
export const toTestStepResult = (data: any): TestStepResult => {
  return {
    id: data.id || data._id,
    order: data.order,
    description: data.description,
    expectedResult: data.expectedResult,
    actualResult: data.actualResult,
    status: data.status as TestStepResultStatus,
    duration: data.duration,
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    
    // Error information
    errorMessage: data.errorMessage,
    errorDetails: data.errorDetails ? {
      ...data.errorDetails,
      timestamp: data.errorDetails.timestamp ? new Date(data.errorDetails.timestamp) : new Date()
    } : undefined,
    
    // Media
    screenshot: data.screenshot,
    media: data.media ? data.media.map((m: any) => ({
      ...m,
      timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
    })) : undefined,
    
    // Performance
    performanceMetrics: data.performanceMetrics,
    
    // Logs
    logs: data.logs,
    consoleOutput: data.consoleOutput,
    
    // Retry information
    retryCount: data.retryCount,
    previousAttempts: data.previousAttempts,
    
    // Additional information
    metadata: data.metadata,
    tags: data.tags
  };
};

// Convert TestStepResult model to raw data for API
export const fromTestStepResult = (testStepResult: TestStepResult): any => {
  return {
    id: testStepResult.id,
    order: testStepResult.order,
    description: testStepResult.description,
    expectedResult: testStepResult.expectedResult,
    actualResult: testStepResult.actualResult,
    status: testStepResult.status,
    duration: testStepResult.duration,
    startTime: testStepResult.startTime?.toISOString(),
    endTime: testStepResult.endTime?.toISOString(),
    
    // Error information
    errorMessage: testStepResult.errorMessage,
    errorDetails: testStepResult.errorDetails ? {
      ...testStepResult.errorDetails,
      timestamp: testStepResult.errorDetails.timestamp?.toISOString()
    } : undefined,
    
    // Media
    screenshot: testStepResult.screenshot,
    media: testStepResult.media ? testStepResult.media.map(m => ({
      ...m,
      timestamp: m.timestamp?.toISOString()
    })) : undefined,
    
    // Performance
    performanceMetrics: testStepResult.performanceMetrics,
    
    // Logs
    logs: testStepResult.logs,
    consoleOutput: testStepResult.consoleOutput,
    
    // Retry information
    retryCount: testStepResult.retryCount,
    previousAttempts: testStepResult.previousAttempts,
    
    // Additional information
    metadata: testStepResult.metadata,
    tags: testStepResult.tags
  };
};

// Calculate test step result duration
export const calculateTestStepResultDuration = (startTime?: Date, endTime?: Date): number | undefined => {
  if (!startTime || !endTime) {
    return undefined;
  }
  
  return endTime.getTime() - startTime.getTime();
};

// Create default error details
export const createDefaultStepErrorDetails = (
  message: string, 
  stack?: string, 
  type: TestErrorType = TestErrorType.UNKNOWN,
  severity: TestErrorSeverity = TestErrorSeverity.MAJOR,
  category: TestErrorCategory = TestErrorCategory.FUNCTIONALITY
): TestStepErrorDetails => {
  return {
    type,
    severity,
    category,
    message,
    stack,
    timestamp: new Date()
  };
};

// Create default media
export const createDefaultStepMedia = (
  url: string,
  type: TestMediaType = TestMediaType.SCREENSHOT,
  title?: string,
  description?: string
): TestStepMedia => {
  return {
    type,
    url,
    timestamp: new Date(),
    title,
    description
  };
};

// Create default performance metrics
export const createDefaultStepPerformanceMetrics = (): TestStepPerformanceMetrics => {
  return {
    executionTime: 0
  };
};
