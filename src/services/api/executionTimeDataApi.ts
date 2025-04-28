import { fetchData } from './index';

// Execution Time Data API endpoints
export const executionTimeDataApi = {
  // Get all execution time data
  getExecutionTimeData: () => fetchData<any[]>('executionTimeData').catch(() => []),
  
  // Get execution time data by ID
  getExecutionTimeDataById: (id: string) => fetchData<any>(`executionTimeData/${id}`),
  
  // Get execution time data by project ID
  getExecutionTimeDataByProjectId: (projectId: string) => 
    fetchData<any[]>(`executionTimeData?projectId=${projectId}`),
  
  // Get execution time data by date range
  getExecutionTimeDataByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`executionTimeData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Get execution time data by date
  getExecutionTimeDataByDate: (date: Date) => 
    fetchData<any>(`executionTimeData?date=${date.toISOString()}`),
  
  // Create new execution time data
  createExecutionTimeData: (data: any) => fetchData<any>('executionTimeData', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update execution time data
  updateExecutionTimeData: (id: string, data: any) => fetchData<any>(`executionTimeData/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete execution time data
  deleteExecutionTimeData: (id: string) => fetchData<{ success: boolean }>(`executionTimeData/${id}`, {
    method: 'DELETE',
  }),
  
  // Get average execution time by project
  getAverageExecutionTimeByProject: (projectId: string) => 
    fetchData<any>(`executionTimeData/average?projectId=${projectId}`),
  
  // Get execution time trend by project
  getExecutionTimeTrendByProject: (projectId: string, days: number = 30) => 
    fetchData<any[]>(`executionTimeData/trend?projectId=${projectId}&days=${days}`),
};
