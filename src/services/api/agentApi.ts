import { fetchData } from './index';
import { AgentSchema, AgentStatus, AgentType } from '../../models/database/schemas';

// Agent API endpoints
export const agentApi = {
  // Get all agents
  getAgents: () => fetchData<AgentSchema[]>('agents'),
  
  // Get agent by ID
  getAgentById: (id: string) => fetchData<AgentSchema>(`agents/${id}`),
  
  // Create new agent
  createAgent: (data: Omit<AgentSchema, '_id'>) => fetchData<AgentSchema>('agents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update agent
  updateAgent: (id: string, data: Partial<AgentSchema>) => fetchData<AgentSchema>(`agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete agent
  deleteAgent: (id: string) => fetchData<{ success: boolean }>(`agents/${id}`, {
    method: 'DELETE',
  }),
  
  // Get agents by status
  getAgentsByStatus: (status: AgentStatus) => fetchData<AgentSchema[]>(`agents?status=${status}`),
  
  // Get agents by type
  getAgentsByType: (type: AgentType) => fetchData<AgentSchema[]>(`agents?type=${type}`),
  
  // Get agents by server
  getAgentsByServer: (serverId: string) => fetchData<AgentSchema[]>(`agents?serverId=${serverId}`),
  
  // Get available agents
  getAvailableAgents: () => fetchData<AgentSchema[]>(`agents?status=${AgentStatus.AVAILABLE}`),
  
  // Update agent status
  updateAgentStatus: (id: string, status: AgentStatus) => fetchData<AgentSchema>(`agents/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  
  // Assign request to agent
  assignRequestToAgent: (agentId: string, requestId: string) => fetchData<AgentSchema>(`agents/${agentId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ requestId }),
  }),
  
  // Complete request for agent
  completeRequestForAgent: (agentId: string, requestId: string) => fetchData<AgentSchema>(`agents/${agentId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ requestId }),
  }),
};
