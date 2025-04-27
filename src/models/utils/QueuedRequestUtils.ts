import { 
  QueuedRequest, 
  QueuedRequestCreate, 
  QueuedRequestUpdate,
  RequestEnvironment,
  RequestTiming,
  RequestDependency,
  RequestRetryConfig,
  QueueStatusSummary
} from '../interfaces/QueuedRequest';
import { 
  RequestPriority, 
  RequestStatus, 
  RequestCategory, 
  RequestSource, 
  RequestRetryStrategy 
} from '../enums/QueuedRequestEnums';
import { BrowserType } from '../enums/TestCaseEnums';

// Convert raw queued request data to QueuedRequest model
export const toQueuedRequest = (data: any): QueuedRequest => {
  return {
    id: data.id || data._id,
    testName: data.testName,
    testRunId: data.testRunId,
    testCaseId: data.testCaseId,
    testSuiteId: data.testSuiteId,
    projectId: data.projectId,
    
    // Status and category
    status: data.status as RequestStatus || RequestStatus.QUEUED,
    priority: data.priority as RequestPriority,
    category: data.category,
    source: data.source as RequestSource,
    
    // Environment
    browser: data.browser,
    environment: data.environment,
    
    // Timing
    timing: {
      queuedAt: data.queuedAt ? new Date(data.queuedAt) : new Date(),
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      assignedAt: data.assignedAt ? new Date(data.assignedAt) : undefined,
      startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
      estimatedStartTime: data.estimatedStartTime ? new Date(data.estimatedStartTime) : undefined,
      estimatedDuration: data.estimatedDuration,
      timeout: data.timeout,
      waitTime: data.waitTime || '0s',
      waitTimeMs: data.waitTimeMs
    },
    
    // Dependencies and retry
    dependencies: data.dependencies,
    retryConfig: data.retryConfig ? {
      ...data.retryConfig,
      lastRetryAt: data.retryConfig.lastRetryAt ? new Date(data.retryConfig.lastRetryAt) : undefined
    } : undefined,
    
    // Payload and metadata
    payload: data.payload,
    tags: data.tags || [],
    metadata: data.metadata,
    
    // User information
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    
    // Agent assignment
    assignedAgentId: data.assignedAgentId
  };
};

// Convert QueuedRequest model to raw data for API
export const fromQueuedRequest = (queuedRequest: QueuedRequest): any => {
  return {
    id: queuedRequest.id,
    testName: queuedRequest.testName,
    testRunId: queuedRequest.testRunId,
    testCaseId: queuedRequest.testCaseId,
    testSuiteId: queuedRequest.testSuiteId,
    projectId: queuedRequest.projectId,
    
    // Status and category
    status: queuedRequest.status,
    priority: queuedRequest.priority,
    category: queuedRequest.category,
    source: queuedRequest.source,
    
    // Environment
    browser: queuedRequest.browser,
    environment: queuedRequest.environment,
    
    // Timing
    queuedAt: queuedRequest.timing.queuedAt.toISOString(),
    scheduledAt: queuedRequest.timing.scheduledAt?.toISOString(),
    assignedAt: queuedRequest.timing.assignedAt?.toISOString(),
    startedAt: queuedRequest.timing.startedAt?.toISOString(),
    estimatedStartTime: queuedRequest.timing.estimatedStartTime?.toISOString(),
    estimatedDuration: queuedRequest.timing.estimatedDuration,
    timeout: queuedRequest.timing.timeout,
    waitTime: queuedRequest.timing.waitTime,
    waitTimeMs: queuedRequest.timing.waitTimeMs,
    
    // Dependencies and retry
    dependencies: queuedRequest.dependencies,
    retryConfig: queuedRequest.retryConfig ? {
      ...queuedRequest.retryConfig,
      lastRetryAt: queuedRequest.retryConfig.lastRetryAt?.toISOString()
    } : undefined,
    
    // Payload and metadata
    payload: queuedRequest.payload,
    tags: queuedRequest.tags,
    metadata: queuedRequest.metadata,
    
    // User information
    createdBy: queuedRequest.createdBy,
    createdAt: queuedRequest.createdAt?.toISOString(),
    updatedAt: queuedRequest.updatedAt?.toISOString(),
    
    // Agent assignment
    assignedAgentId: queuedRequest.assignedAgentId
  };
};

// Calculate wait time in milliseconds
export const calculateWaitTimeMs = (queuedAt: Date): number => {
  return Date.now() - queuedAt.getTime();
};

// Format wait time in milliseconds to human-readable string
export const formatWaitTime = (waitTimeMs: number): string => {
  if (waitTimeMs < 1000) {
    return `${waitTimeMs}ms`;
  }
  
  const seconds = Math.floor(waitTimeMs / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ${seconds % 60}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
};

// Calculate estimated start time based on queue position and average processing time
export const calculateEstimatedStartTime = (
  queuePosition: number, 
  averageProcessingTimeMs: number,
  concurrentProcessing: number = 1
): Date => {
  const waitTimeMs = (queuePosition / concurrentProcessing) * averageProcessingTimeMs;
  return new Date(Date.now() + waitTimeMs);
};

// Create default environment
export const createDefaultRequestEnvironment = (browser: BrowserType): RequestEnvironment => {
  return {
    browser
  };
};

// Create default timing
export const createDefaultRequestTiming = (): RequestTiming => {
  const now = new Date();
  return {
    queuedAt: now,
    waitTime: '0s',
    waitTimeMs: 0
  };
};

// Create default retry configuration
export const createDefaultRequestRetryConfig = (
  strategy: RequestRetryStrategy = RequestRetryStrategy.NONE,
  maxRetries: number = 0
): RequestRetryConfig => {
  return {
    strategy,
    maxRetries,
    currentRetry: 0,
    retryDelay: 0
  };
};

// Create default queue status summary
export const createDefaultQueueStatusSummary = (): QueueStatusSummary => {
  return {
    queued: 0,
    scheduled: 0,
    assigned: 0,
    processing: 0,
    total: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    estimatedWaitTime: 0
  };
};

// Update queue status summary based on queued requests
export const updateQueueStatusSummary = (requests: QueuedRequest[]): QueueStatusSummary => {
  const summary = createDefaultQueueStatusSummary();
  
  if (!requests || requests.length === 0) {
    return summary;
  }
  
  summary.total = requests.length;
  summary.queued = requests.filter(r => r.status === RequestStatus.QUEUED).length;
  summary.scheduled = requests.filter(r => r.status === RequestStatus.SCHEDULED).length;
  summary.assigned = requests.filter(r => r.status === RequestStatus.ASSIGNED).length;
  summary.processing = requests.filter(r => r.status === RequestStatus.PROCESSING).length;
  
  summary.highPriority = requests.filter(r => r.priority === RequestPriority.HIGH || r.priority === RequestPriority.CRITICAL).length;
  summary.mediumPriority = requests.filter(r => r.priority === RequestPriority.MEDIUM).length;
  summary.lowPriority = requests.filter(r => r.priority === RequestPriority.LOW || r.priority === RequestPriority.LOWEST).length;
  
  // Calculate estimated wait time based on queue size and average processing time
  // This is a simplified calculation and can be improved with actual metrics
  const averageProcessingTimeMs = 60000; // 1 minute as default
  const concurrentProcessing = 1; // Default to 1 concurrent processing
  summary.estimatedWaitTime = (summary.queued / concurrentProcessing) * averageProcessingTimeMs;
  
  return summary;
};
