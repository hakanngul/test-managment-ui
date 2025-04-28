import { fetchData } from './index';
import { ProcessedRequestSchema, ProcessedRequestStatus } from '../../models/database/schemas';
import { RequestPriority, RequestSource } from '../../models/database/schemas/QueuedRequestSchema';

// Processed Request API endpoints
export const processedRequestApi = {
  // Get all processed requests
  getProcessedRequests: () => fetchData<ProcessedRequestSchema[]>('processedRequests'),
  
  // Get processed request by ID
  getProcessedRequestById: (id: string) => fetchData<ProcessedRequestSchema>(`processedRequests/${id}`),
  
  // Create new processed request
  createProcessedRequest: (data: Omit<ProcessedRequestSchema, '_id'>) => fetchData<ProcessedRequestSchema>('processedRequests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update processed request
  updateProcessedRequest: (id: string, data: Partial<ProcessedRequestSchema>) => fetchData<ProcessedRequestSchema>(`processedRequests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete processed request
  deleteProcessedRequest: (id: string) => fetchData<{ success: boolean }>(`processedRequests/${id}`, {
    method: 'DELETE',
  }),
  
  // Get processed requests by status
  getProcessedRequestsByStatus: (status: ProcessedRequestStatus) => fetchData<ProcessedRequestSchema[]>(`processedRequests?status=${status}`),
  
  // Get processed requests by priority
  getProcessedRequestsByPriority: (priority: RequestPriority) => fetchData<ProcessedRequestSchema[]>(`processedRequests?priority=${priority}`),
  
  // Get processed requests by source
  getProcessedRequestsBySource: (source: RequestSource) => fetchData<ProcessedRequestSchema[]>(`processedRequests?source=${source}`),
  
  // Get processed requests by project
  getProcessedRequestsByProject: (projectId: string) => fetchData<ProcessedRequestSchema[]>(`processedRequests?projectId=${projectId}`),
  
  // Get processed requests by test run
  getProcessedRequestsByTestRun: (testRunId: string) => fetchData<ProcessedRequestSchema[]>(`processedRequests?testRunId=${testRunId}`),
  
  // Get processed requests by agent
  getProcessedRequestsByAgent: (agentId: string) => fetchData<ProcessedRequestSchema[]>(`processedRequests?agentId=${agentId}`),
  
  // Get processed requests by date range
  getProcessedRequestsByDateRange: (startDate: Date, endDate: Date) => fetchData<ProcessedRequestSchema[]>(
    `processedRequests?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
  ),
  
  // Get successful processed requests
  getSuccessfulProcessedRequests: () => fetchData<ProcessedRequestSchema[]>(`processedRequests?status=${ProcessedRequestStatus.SUCCESS}`),
  
  // Get failed processed requests
  getFailedProcessedRequests: () => fetchData<ProcessedRequestSchema[]>(`processedRequests?status=${ProcessedRequestStatus.FAILED}`),
  
  // Get processed requests data
  getProcessedRequestsData: () => fetchData<ProcessedRequestSchema[]>('processedRequests').catch(() => []),
};
