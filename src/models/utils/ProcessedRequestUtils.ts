import { 
  ProcessedRequest, 
  ProcessedRequestCreate, 
  ProcessedRequestUpdate,
  ProcessedRequestError,
  ProcessedRequestPerformance,
  ProcessedRequestEnvironment,
  ProcessedRequestResources,
  ProcessedRequestLogs
} from '../interfaces/ProcessedRequest';
import { 
  ProcessedRequestStatus, 
  ProcessedRequestErrorType, 
  ProcessedRequestPriority, 
  ProcessedRequestSource 
} from '../enums/ProcessedRequestEnums';
import { BrowserType } from '../enums/TestCaseEnums';

// Convert raw processed request data to ProcessedRequest model
export const toProcessedRequest = (data: any): ProcessedRequest => {
  return {
    id: data.id || data._id,
    testName: data.testName,
    testRunId: data.testRunId,
    testCaseId: data.testCaseId,
    testSuiteId: data.testSuiteId,
    projectId: data.projectId,
    
    // Status and result
    status: data.status as ProcessedRequestStatus || ProcessedRequestStatus.SUCCESS,
    result: data.result,
    error: data.error ? {
      ...data.error,
      timestamp: data.error.timestamp ? new Date(data.error.timestamp) : new Date()
    } : undefined,
    
    // Execution details
    browser: data.browser,
    agentId: data.agentId,
    priority: data.priority as ProcessedRequestPriority,
    source: data.source as ProcessedRequestSource,
    
    // Timing
    startTime: data.startTime ? new Date(data.startTime) : new Date(),
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    duration: data.duration || '0s',
    durationMs: data.durationMs,
    
    // Performance and resources
    performance: data.performance,
    resources: data.resources,
    
    // Environment
    environment: data.environment,
    
    // Logs and artifacts
    logs: data.logs,
    screenshots: data.screenshots || [],
    videos: data.videos || [],
    artifacts: data.artifacts || [],
    
    // Retry information
    retryCount: data.retryCount,
    previousAttempts: data.previousAttempts || [],
    maxRetries: data.maxRetries,
    
    // Metadata
    tags: data.tags || [],
    metadata: data.metadata,
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
  };
};

// Convert ProcessedRequest model to raw data for API
export const fromProcessedRequest = (processedRequest: ProcessedRequest): any => {
  return {
    id: processedRequest.id,
    testName: processedRequest.testName,
    testRunId: processedRequest.testRunId,
    testCaseId: processedRequest.testCaseId,
    testSuiteId: processedRequest.testSuiteId,
    projectId: processedRequest.projectId,
    
    // Status and result
    status: processedRequest.status,
    result: processedRequest.result,
    error: processedRequest.error ? {
      ...processedRequest.error,
      timestamp: processedRequest.error.timestamp?.toISOString()
    } : undefined,
    
    // Execution details
    browser: processedRequest.browser,
    agentId: processedRequest.agentId,
    priority: processedRequest.priority,
    source: processedRequest.source,
    
    // Timing
    startTime: processedRequest.startTime.toISOString(),
    endTime: processedRequest.endTime?.toISOString(),
    duration: processedRequest.duration,
    durationMs: processedRequest.durationMs,
    
    // Performance and resources
    performance: processedRequest.performance,
    resources: processedRequest.resources,
    
    // Environment
    environment: processedRequest.environment,
    
    // Logs and artifacts
    logs: processedRequest.logs,
    screenshots: processedRequest.screenshots,
    videos: processedRequest.videos,
    artifacts: processedRequest.artifacts,
    
    // Retry information
    retryCount: processedRequest.retryCount,
    previousAttempts: processedRequest.previousAttempts,
    maxRetries: processedRequest.maxRetries,
    
    // Metadata
    tags: processedRequest.tags,
    metadata: processedRequest.metadata,
    createdBy: processedRequest.createdBy,
    createdAt: processedRequest.createdAt?.toISOString(),
    updatedAt: processedRequest.updatedAt?.toISOString()
  };
};

// Calculate duration in milliseconds
export const calculateDurationMs = (startTime?: Date, endTime?: Date): number | undefined => {
  if (!startTime || !endTime) {
    return undefined;
  }
  
  return endTime.getTime() - startTime.getTime();
};

// Format duration in milliseconds to human-readable string
export const formatDuration = (durationMs?: number): string => {
  if (!durationMs) {
    return '0s';
  }
  
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

// Create default error details
export const createDefaultProcessedRequestError = (
  message: string, 
  type: ProcessedRequestErrorType = ProcessedRequestErrorType.UNKNOWN,
  stack?: string
): ProcessedRequestError => {
  return {
    type,
    message,
    stack,
    timestamp: new Date()
  };
};

// Create default performance metrics
export const createDefaultProcessedRequestPerformance = (): ProcessedRequestPerformance => {
  return {
    totalTime: 0
  };
};

// Create default environment info
export const createDefaultProcessedRequestEnvironment = (browser: BrowserType): ProcessedRequestEnvironment => {
  return {
    browser
  };
};

// Create default resources
export const createDefaultProcessedRequestResources = (): ProcessedRequestResources => {
  return {};
};

// Create default logs
export const createDefaultProcessedRequestLogs = (): ProcessedRequestLogs => {
  return {
    console: [],
    network: [],
    browser: [],
    agent: [],
    system: []
  };
};
