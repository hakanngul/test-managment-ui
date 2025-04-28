import { fetchData } from './index';

// Performance Metrics API endpoints
export const performanceMetricsApi = {
  // Get all performance metrics
  getPerformanceMetrics: () => fetchData<any[]>('performanceMetrics').catch(() => []),
  
  // Get performance metric by ID
  getPerformanceMetricById: (id: string) => fetchData<any>(`performanceMetrics/${id}`),
  
  // Get performance metrics by test run ID
  getPerformanceMetricsByTestRunId: (testRunId: string) => 
    fetchData<any[]>(`performanceMetrics?testRunId=${testRunId}`),
  
  // Get performance metrics by test case ID
  getPerformanceMetricsByTestCaseId: (testCaseId: string) => 
    fetchData<any[]>(`performanceMetrics?testCaseId=${testCaseId}`),
  
  // Get performance metrics by project ID
  getPerformanceMetricsByProjectId: (projectId: string) => 
    fetchData<any[]>(`performanceMetrics?projectId=${projectId}`),
  
  // Get performance metrics by environment
  getPerformanceMetricsByEnvironment: (environment: string) => 
    fetchData<any[]>(`performanceMetrics?environment=${environment}`),
  
  // Get performance metrics by browser
  getPerformanceMetricsByBrowser: (browser: string) => 
    fetchData<any[]>(`performanceMetrics?browser=${browser}`),
  
  // Get performance metrics by date range
  getPerformanceMetricsByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`performanceMetrics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Create new performance metric
  createPerformanceMetric: (data: any) => fetchData<any>('performanceMetrics', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update performance metric
  updatePerformanceMetric: (id: string, data: any) => fetchData<any>(`performanceMetrics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete performance metric
  deletePerformanceMetric: (id: string) => fetchData<{ success: boolean }>(`performanceMetrics/${id}`, {
    method: 'DELETE',
  }),
  
  // Get average load time by project
  getAverageLoadTimeByProject: (projectId: string) => 
    fetchData<any>(`performanceMetrics/average-load-time?projectId=${projectId}`),
  
  // Get average first paint by project
  getAverageFirstPaintByProject: (projectId: string) => 
    fetchData<any>(`performanceMetrics/average-first-paint?projectId=${projectId}`),
  
  // Get performance metrics summary by project
  getPerformanceMetricsSummaryByProject: (projectId: string) => 
    fetchData<any>(`performanceMetrics/summary?projectId=${projectId}`),
};
