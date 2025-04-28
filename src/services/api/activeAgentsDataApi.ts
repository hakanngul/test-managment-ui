import { fetchData } from './index';

// Active Agents Data API endpoints
export const activeAgentsDataApi = {
  // Get all active agents data
  getActiveAgentsData: () => fetchData<any[]>('activeAgentsData').catch(() => []),
  
  // Get active agents data by ID
  getActiveAgentsDataById: (id: string) => fetchData<any>(`activeAgentsData/${id}`),
  
  // Get active agents data by server ID
  getActiveAgentsDataByServerId: (serverId: string) => 
    fetchData<any[]>(`activeAgentsData?serverId=${serverId}`),
  
  // Get active agents data by date range
  getActiveAgentsDataByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`activeAgentsData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Get latest active agents data
  getLatestActiveAgentsData: () => fetchData<any>('activeAgentsData/latest'),
  
  // Create new active agents data
  createActiveAgentsData: (data: any) => fetchData<any>('activeAgentsData', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update active agents data
  updateActiveAgentsData: (id: string, data: any) => fetchData<any>(`activeAgentsData/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete active agents data
  deleteActiveAgentsData: (id: string) => fetchData<{ success: boolean }>(`activeAgentsData/${id}`, {
    method: 'DELETE',
  }),
  
  // Get active agents count trend
  getActiveAgentsCountTrend: (serverId: string, hours: number = 24) => 
    fetchData<any[]>(`activeAgentsData/count-trend?serverId=${serverId}&hours=${hours}`),
};
