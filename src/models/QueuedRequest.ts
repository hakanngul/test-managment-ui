// Request priority
export enum RequestPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Queued request model
export interface QueuedRequest {
  id: string;
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  browser: string;
  priority: RequestPriority;
  category: string;
  queuedAt: Date;
  waitTime: string; // formatted wait time
  waitTimeMs?: number; // wait time in milliseconds
  payload?: any; // test data
}

// Queued request creation model
export interface QueuedRequestCreate {
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  browser: string;
  priority: RequestPriority;
  category: string;
  payload?: any;
}

// Queue status summary
export interface QueueStatusSummary {
  queued: number;
  processing: number;
  total: number;
}

// Convert raw queued request data to QueuedRequest model
export const toQueuedRequest = (data: any): QueuedRequest => {
  return {
    id: data.id || data._id,
    testName: data.testName,
    testRunId: data.testRunId,
    testCaseId: data.testCaseId,
    browser: data.browser,
    priority: data.priority as RequestPriority,
    category: data.category,
    queuedAt: data.queuedAt ? new Date(data.queuedAt) : new Date(),
    waitTime: data.waitTime || '0s',
    waitTimeMs: data.waitTimeMs,
    payload: data.payload
  };
};

// Convert QueuedRequest model to raw data for API
export const fromQueuedRequest = (queuedRequest: QueuedRequest): any => {
  return {
    id: queuedRequest.id,
    testName: queuedRequest.testName,
    testRunId: queuedRequest.testRunId,
    testCaseId: queuedRequest.testCaseId,
    browser: queuedRequest.browser,
    priority: queuedRequest.priority,
    category: queuedRequest.category,
    queuedAt: queuedRequest.queuedAt.toISOString(),
    waitTime: queuedRequest.waitTime,
    waitTimeMs: queuedRequest.waitTimeMs,
    payload: queuedRequest.payload
  };
};
