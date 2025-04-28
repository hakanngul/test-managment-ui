import { fetchData } from './index';

// Queue Status Data API endpoints
export const queueStatusDataApi = {
  // Get all queue status data
  getQueueStatusData: () => fetchData<any[]>('queueStatusData').catch(() => []),
  
  // Get queue status data by ID
  getQueueStatusDataById: (id: string) => fetchData<any>(`queueStatusData/${id}`),
  
  // Get queue status data by server ID
  getQueueStatusDataByServerId: (serverId: string) => 
    fetchData<any[]>(`queueStatusData?serverId=${serverId}`),
  
  // Get queue status data by date range
  getQueueStatusDataByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`queueStatusData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Get latest queue status data
  getLatestQueueStatusData: () => fetchData<any>('queueStatusData/latest'),
  
  // Create new queue status data
  createQueueStatusData: (data: any) => fetchData<any>('queueStatusData', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update queue status data
  updateQueueStatusData: (id: string, data: any) => fetchData<any>(`queueStatusData/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete queue status data
  deleteQueueStatusData: (id: string) => fetchData<{ success: boolean }>(`queueStatusData/${id}`, {
    method: 'DELETE',
  }),
  
  // Get queue size trend
  getQueueSizeTrend: (serverId: string, hours: number = 24) => 
    fetchData<any[]>(`queueStatusData/size-trend?serverId=${serverId}&hours=${hours}`),
  
  // Get processing count trend
  getProcessingCountTrend: (serverId: string, hours: number = 24) => 
    fetchData<any[]>(`queueStatusData/processing-trend?serverId=${serverId}&hours=${hours}`),
};
