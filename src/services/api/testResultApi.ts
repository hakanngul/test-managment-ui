import { fetchData } from './index';
import { TestResultSchema, TestResultStatus, TestPriority, TestSeverity } from '../../models/database/schemas';

// Test Result API endpoints
export const testResultApi = {
  // Get all test results
  getTestResults: () => fetchData<TestResultSchema[]>('testResults'),
  
  // Get test result by ID
  getTestResultById: (id: string) => fetchData<TestResultSchema>(`testResults/${id}`),
  
  // Create new test result
  createTestResult: (data: Omit<TestResultSchema, '_id'>) => fetchData<TestResultSchema>('testResults', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update test result
  updateTestResult: (id: string, data: Partial<TestResultSchema>) => fetchData<TestResultSchema>(`testResults/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete test result
  deleteTestResult: (id: string) => fetchData<{ success: boolean }>(`testResults/${id}`, {
    method: 'DELETE',
  }),
  
  // Get test results by test run
  getTestResultsByTestRun: (testRunId: string) => fetchData<TestResultSchema[]>(`testResults?testRunId=${testRunId}`),
  
  // Get test results by test case
  getTestResultsByTestCase: (testCaseId: string) => fetchData<TestResultSchema[]>(`testResults?testCaseId=${testCaseId}`),
  
  // Get test results by test suite
  getTestResultsByTestSuite: (testSuiteId: string) => fetchData<TestResultSchema[]>(`testResults?testSuiteId=${testSuiteId}`),
  
  // Get test results by status
  getTestResultsByStatus: (status: TestResultStatus) => fetchData<TestResultSchema[]>(`testResults?status=${status}`),
  
  // Get test results by priority
  getTestResultsByPriority: (priority: TestPriority) => fetchData<TestResultSchema[]>(`testResults?priority=${priority}`),
  
  // Get test results by severity
  getTestResultsBySeverity: (severity: TestSeverity) => fetchData<TestResultSchema[]>(`testResults?severity=${severity}`),
  
  // Get test results by date range
  getTestResultsByDateRange: (startDate: Date, endDate: Date) => fetchData<TestResultSchema[]>(
    `testResults?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
  ),
  
  // Add step result to test result
  addStepResultToTestResult: (testResultId: string, stepResultId: string) => fetchData<TestResultSchema>(`testResults/${testResultId}/steps`, {
    method: 'POST',
    body: JSON.stringify({ stepResultId }),
  }),
  
  // Update test result status
  updateTestResultStatus: (testResultId: string, status: TestResultStatus) => fetchData<TestResultSchema>(`testResults/${testResultId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  
  // Add screenshot to test result
  addScreenshotToTestResult: (testResultId: string, screenshot: string) => fetchData<TestResultSchema>(`testResults/${testResultId}/screenshots`, {
    method: 'POST',
    body: JSON.stringify({ screenshot }),
  }),
};
