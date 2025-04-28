import { fetchData } from './index';
import { QueuedRequestSchema, RequestStatus, RequestPriority, RequestCategory, RequestSource } from '../../models/database/schemas';

// Queued Request API endpoints
export const queuedRequestApi = {
  // Get all queued requests
  getQueuedRequests: () => fetchData<QueuedRequestSchema[]>('queuedRequests'),
  
  // Get queued request by ID
  getQueuedRequestById: (id: string) => fetchData<QueuedRequestSchema>(`queuedRequests/${id}`),
  
  // Create new queued request
  createQueuedRequest: (data: Omit<QueuedRequestSchema, '_id'>) => fetchData<QueuedRequestSchema>('queuedRequests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update queued request
  updateQueuedRequest: (id: string, data: Partial<QueuedRequestSchema>) => fetchData<QueuedRequestSchema>(`queuedRequests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete queued request
  deleteQueuedRequest: (id: string) => fetchData<{ success: boolean }>(`queuedRequests/${id}`, {
    method: 'DELETE',
  }),
  
  // Get queued requests by status
  getQueuedRequestsByStatus: (status: RequestStatus) => fetchData<QueuedRequestSchema[]>(`queuedRequests?status=${status}`),
  
  // Get queued requests by priority
  getQueuedRequestsByPriority: (priority: RequestPriority) => fetchData<QueuedRequestSchema[]>(`queuedRequests?priority=${priority}`),
  
  // Get queued requests by category
  getQueuedRequestsByCategory: (category: RequestCategory) => fetchData<QueuedRequestSchema[]>(`queuedRequests?category=${category}`),
  
  // Get queued requests by source
  getQueuedRequestsBySource: (source: RequestSource) => fetchData<QueuedRequestSchema[]>(`queuedRequests?source=${source}`),
  
  // Get queued requests by project
  getQueuedRequestsByProject: (projectId: string) => fetchData<QueuedRequestSchema[]>(`queuedRequests?projectId=${projectId}`),
  
  // Get queued requests by test run
  getQueuedRequestsByTestRun: (testRunId: string) => fetchData<QueuedRequestSchema[]>(`queuedRequests?testRunId=${testRunId}`),
  
  // Get queued requests by assigned agent
  getQueuedRequestsByAssignedAgent: (agentId: string) => fetchData<QueuedRequestSchema[]>(`queuedRequests?assignedTo=${agentId}`),
  
  // Update queued request status
  updateQueuedRequestStatus: (id: string, status: RequestStatus) => fetchData<QueuedRequestSchema>(`queuedRequests/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  
  // Assign queued request to agent
  assignQueuedRequestToAgent: (id: string, agentId: string) => fetchData<QueuedRequestSchema>(`queuedRequests/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify({ agentId }),
  }),
  
  // Start processing queued request
  startProcessingQueuedRequest: (id: string) => fetchData<QueuedRequestSchema>(`queuedRequests/${id}/start`, {
    method: 'POST',
  }),
  
  // Get queued requests data
  getQueuedRequestsData: () => fetchData<QueuedRequestSchema[]>('queuedRequests').catch(() => []),
};
