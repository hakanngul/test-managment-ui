import { fetchData } from './index';
import { ServerAgentSchema } from '../../models/database/schemas';
import { AgentStatusSummary } from '../../models/database/schemas/AgentSchema';
import { QueueStatusSummary } from '../../models/database/schemas/QueuedRequestSchema';

// Server Agent API endpoints
export const serverAgentApi = {
  // Get server agent
  getServerAgent: () => fetchData<ServerAgentSchema>('serverAgent'),
  
  // Get server agent by ID
  getServerAgentById: (id: string) => fetchData<ServerAgentSchema>(`serverAgent/${id}`),
  
  // Get server agent by server ID
  getServerAgentByServerId: (serverId: string) => fetchData<ServerAgentSchema>(`serverAgent?serverId=${serverId}`),
  
  // Create new server agent
  createServerAgent: (data: Omit<ServerAgentSchema, '_id'>) => fetchData<ServerAgentSchema>('serverAgent', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update server agent
  updateServerAgent: (id: string, data: Partial<ServerAgentSchema>) => fetchData<ServerAgentSchema>(`serverAgent/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Update agent status
  updateAgentStatus: (id: string, agentStatus: AgentStatusSummary) => fetchData<ServerAgentSchema>(`serverAgent/${id}/agentStatus`, {
    method: 'PUT',
    body: JSON.stringify(agentStatus),
  }),
  
  // Update queue status
  updateQueueStatus: (id: string, queueStatus: QueueStatusSummary) => fetchData<ServerAgentSchema>(`serverAgent/${id}/queueStatus`, {
    method: 'PUT',
    body: JSON.stringify(queueStatus),
  }),
  
  // Update active agents
  updateActiveAgents: (id: string, activeAgents: string[]) => fetchData<ServerAgentSchema>(`serverAgent/${id}/activeAgents`, {
    method: 'PUT',
    body: JSON.stringify(activeAgents),
  }),
  
  // Update queued requests
  updateQueuedRequests: (id: string, queuedRequests: string[]) => fetchData<ServerAgentSchema>(`serverAgent/${id}/queuedRequests`, {
    method: 'PUT',
    body: JSON.stringify(queuedRequests),
  }),
  
  // Update processed requests
  updateProcessedRequests: (id: string, processedRequests: string[]) => fetchData<ServerAgentSchema>(`serverAgent/${id}/processedRequests`, {
    method: 'PUT',
    body: JSON.stringify(processedRequests),
  }),
  
  // Get system resources data
  getSystemResourcesData: () => fetchData<any>('systemResources').catch(() => ({
    lastUpdated: new Date().toLocaleString('tr-TR'),
    cpuUsage: 0,
    memoryUsage: 0
  })),
  
  // Get agent status data
  getAgentStatusData: () => fetchData<AgentStatusSummary>('agentStatus').catch(() => ({
    total: 0,
    available: 0,
    busy: 0,
    offline: 0,
    error: 0,
    maintenance: 0
  })),
  
  // Get queue status data
  getQueueStatusData: () => fetchData<QueueStatusSummary>('queueStatus').catch(() => ({
    queued: 0,
    processing: 0,
    total: 0
  })),
  
  // Get active agents data
  getActiveAgentsData: () => fetchData<any[]>('activeAgents').catch(() => []),
};
