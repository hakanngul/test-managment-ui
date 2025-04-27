// Processed request model
export interface ProcessedRequest {
  id: string;
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  browser: string;
  agentId: string;
  startTime: Date;
  endTime?: Date;
  duration: string; // formatted duration
  durationMs?: number; // duration in milliseconds
  status: 'success' | 'failed' | 'cancelled';
  result?: any; // test result data
}

// Processed request creation model
export interface ProcessedRequestCreate {
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  browser: string;
  agentId: string;
  startTime: Date;
  endTime?: Date;
  status: 'success' | 'failed' | 'cancelled';
  result?: any;
}

// Convert raw processed request data to ProcessedRequest model
export const toProcessedRequest = (data: any): ProcessedRequest => {
  return {
    id: data.id || data._id,
    testName: data.testName,
    testRunId: data.testRunId,
    testCaseId: data.testCaseId,
    browser: data.browser,
    agentId: data.agentId,
    startTime: data.startTime ? new Date(data.startTime) : new Date(),
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    duration: data.duration || '0s',
    durationMs: data.durationMs,
    status: data.status || 'success',
    result: data.result
  };
};

// Convert ProcessedRequest model to raw data for API
export const fromProcessedRequest = (processedRequest: ProcessedRequest): any => {
  return {
    id: processedRequest.id,
    testName: processedRequest.testName,
    testRunId: processedRequest.testRunId,
    testCaseId: processedRequest.testCaseId,
    browser: processedRequest.browser,
    agentId: processedRequest.agentId,
    startTime: processedRequest.startTime.toISOString(),
    endTime: processedRequest.endTime?.toISOString(),
    duration: processedRequest.duration,
    durationMs: processedRequest.durationMs,
    status: processedRequest.status,
    result: processedRequest.result
  };
};
