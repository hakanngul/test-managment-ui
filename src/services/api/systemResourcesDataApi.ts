import { fetchData } from './index';

// System Resources Data API endpoints
export const systemResourcesDataApi = {
  // Get all system resources data
  getSystemResourcesData: () => fetchData<any[]>('systemResourcesData').catch(() => []),
  
  // Get system resources data by ID
  getSystemResourcesDataById: (id: string) => fetchData<any>(`systemResourcesData/${id}`),
  
  // Get system resources data by server ID
  getSystemResourcesDataByServerId: (serverId: string) => 
    fetchData<any[]>(`systemResourcesData?serverId=${serverId}`),
  
  // Get system resources data by date range
  getSystemResourcesDataByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`systemResourcesData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Get latest system resources data
  getLatestSystemResourcesData: () => fetchData<any>('systemResourcesData/latest'),
  
  // Create new system resources data
  createSystemResourcesData: (data: any) => fetchData<any>('systemResourcesData', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update system resources data
  updateSystemResourcesData: (id: string, data: any) => fetchData<any>(`systemResourcesData/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete system resources data
  deleteSystemResourcesData: (id: string) => fetchData<{ success: boolean }>(`systemResourcesData/${id}`, {
    method: 'DELETE',
  }),
  
  // Get CPU usage trend
  getCpuUsageTrend: (serverId: string, hours: number = 24) => 
    fetchData<any[]>(`systemResourcesData/cpu-trend?serverId=${serverId}&hours=${hours}`),
  
  // Get memory usage trend
  getMemoryUsageTrend: (serverId: string, hours: number = 24) => 
    fetchData<any[]>(`systemResourcesData/memory-trend?serverId=${serverId}&hours=${hours}`),
  
  // Get disk usage trend
  getDiskUsageTrend: (serverId: string, hours: number = 24) => 
    fetchData<any[]>(`systemResourcesData/disk-trend?serverId=${serverId}&hours=${hours}`),
  
  // Get network usage trend
  getNetworkUsageTrend: (serverId: string, hours: number = 24) => 
    fetchData<any[]>(`systemResourcesData/network-trend?serverId=${serverId}&hours=${hours}`),
};
