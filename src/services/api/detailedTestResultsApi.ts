import { fetchData } from './index';
import { TestResultStatus } from '../../models/database/schemas';

// Detailed Test Results API endpoints
export const detailedTestResultsApi = {
  // Get all detailed test results
  getDetailedTestResults: () => fetchData<any[]>('detailedTestResults').catch(() => []),
  
  // Get detailed test result by ID
  getDetailedTestResultById: (id: string) => fetchData<any>(`detailedTestResults/${id}`),
  
  // Get detailed test results by test result ID
  getDetailedTestResultsByTestResultId: (testResultId: string) => 
    fetchData<any[]>(`detailedTestResults?testResultId=${testResultId}`),
  
  // Get detailed test results by test case ID
  getDetailedTestResultsByTestCaseId: (testCaseId: string) => 
    fetchData<any[]>(`detailedTestResults?testCaseId=${testCaseId}`),
  
  // Get detailed test results by test run ID
  getDetailedTestResultsByTestRunId: (testRunId: string) => 
    fetchData<any[]>(`detailedTestResults?testRunId=${testRunId}`),
  
  // Get detailed test results by status
  getDetailedTestResultsByStatus: (status: TestResultStatus) => 
    fetchData<any[]>(`detailedTestResults?status=${status}`),
  
  // Get detailed test results by date range
  getDetailedTestResultsByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`detailedTestResults?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Get detailed test results by environment
  getDetailedTestResultsByEnvironment: (environment: string) => 
    fetchData<any[]>(`detailedTestResults?environment=${environment}`),
  
  // Get detailed test results by browser
  getDetailedTestResultsByBrowser: (browser: string) => 
    fetchData<any[]>(`detailedTestResults?browser=${browser}`),
  
  // Create new detailed test result
  createDetailedTestResult: (data: any) => fetchData<any>('detailedTestResults', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update detailed test result
  updateDetailedTestResult: (id: string, data: any) => fetchData<any>(`detailedTestResults/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete detailed test result
  deleteDetailedTestResult: (id: string) => fetchData<{ success: boolean }>(`detailedTestResults/${id}`, {
    method: 'DELETE',
  }),
};
