import { fetchData } from './index';

// Test Counts By Day API endpoints
export const testCountsByDayApi = {
  // Get all test counts by day
  getTestCountsByDay: () => fetchData<any[]>('testCountsByDay').catch(() => []),
  
  // Get test counts by day by ID
  getTestCountsByDayById: (id: string) => fetchData<any>(`testCountsByDay/${id}`),
  
  // Get test counts by day by project ID
  getTestCountsByDayByProjectId: (projectId: string) => 
    fetchData<any[]>(`testCountsByDay?projectId=${projectId}`),
  
  // Get test counts by day by date range
  getTestCountsByDayByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`testCountsByDay?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Get test counts by day by date
  getTestCountsByDayByDate: (date: Date) => 
    fetchData<any>(`testCountsByDay?date=${date.toISOString()}`),
  
  // Create new test counts by day
  createTestCountsByDay: (data: any) => fetchData<any>('testCountsByDay', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update test counts by day
  updateTestCountsByDay: (id: string, data: any) => fetchData<any>(`testCountsByDay/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete test counts by day
  deleteTestCountsByDay: (id: string) => fetchData<{ success: boolean }>(`testCountsByDay/${id}`, {
    method: 'DELETE',
  }),
  
  // Get test counts trend by project
  getTestCountsTrendByProject: (projectId: string, days: number = 30) => 
    fetchData<any[]>(`testCountsByDay/trend?projectId=${projectId}&days=${days}`),
  
  // Get pass rate trend by project
  getPassRateTrendByProject: (projectId: string, days: number = 30) => 
    fetchData<any[]>(`testCountsByDay/pass-rate-trend?projectId=${projectId}&days=${days}`),
};
