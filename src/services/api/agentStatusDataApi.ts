import { fetchData } from './index';

// Agent Status Data API endpoints
export const agentStatusDataApi = {
  // Get all agent status data
  getAgentStatusData: () => fetchData<any[]>('agentStatusData').catch(() => []),
  
  // Get agent status data by ID
  getAgentStatusDataById: (id: string) => fetchData<any>(`agentStatusData/${id}`),
  
  // Get agent status data by server ID
  getAgentStatusDataByServerId: (serverId: string) => 
    fetchData<any[]>(`agentStatusData?serverId=${serverId}`),
  
  // Get agent status data by date range
  getAgentStatusDataByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`agentStatusData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Get latest agent status data
  getLatestAgentStatusData: () => fetchData<any>('agentStatusData/latest'),
  
  // Create new agent status data
  createAgentStatusData: (data: any) => fetchData<any>('agentStatusData', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update agent status data
  updateAgentStatusData: (id: string, data: any) => fetchData<any>(`agentStatusData/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete agent status data
  deleteAgentStatusData: (id: string) => fetchData<{ success: boolean }>(`agentStatusData/${id}`, {
    method: 'DELETE',
  }),
  
  // Get agent availability trend
  getAgentAvailabilityTrend: (serverId: string, hours: number = 24) => 
    fetchData<any[]>(`agentStatusData/availability-trend?serverId=${serverId}&hours=${hours}`),
  
  // Get agent status distribution
  getAgentStatusDistribution: (serverId: string) => 
    fetchData<any>(`agentStatusData/status-distribution?serverId=${serverId}`),
};
