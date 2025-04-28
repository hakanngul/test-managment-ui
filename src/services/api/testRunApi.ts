import { fetchData } from './index';
import { TestRunSchema, TestRunStatus, TestRunPriority } from '../../models/database/schemas';

// Test Run API endpoints
export const testRunApi = {
  // Get all test runs
  getTestRuns: () => fetchData<TestRunSchema[]>('testRuns').catch(() => {
    console.error('Failed to fetch test runs, returning empty array');
    return [];
  }),
  
  // Get test run by ID
  getTestRunById: (id: string) => fetchData<TestRunSchema>(`testRuns/${id}`),
  
  // Create new test run
  createTestRun: (data: Omit<TestRunSchema, '_id'>) => fetchData<TestRunSchema>('testRuns', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update test run
  updateTestRun: (id: string, data: Partial<TestRunSchema>) => fetchData<TestRunSchema>(`testRuns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete test run
  deleteTestRun: (id: string) => fetchData<{ success: boolean }>(`testRuns/${id}`, {
    method: 'DELETE',
  }),
  
  // Get test runs by project
  getTestRunsByProject: (projectId: string) => fetchData<TestRunSchema[]>(`testRuns?projectId=${projectId}`),
  
  // Get test runs by test suite
  getTestRunsByTestSuite: (testSuiteId: string) => fetchData<TestRunSchema[]>(`testRuns?testSuiteId=${testSuiteId}`),
  
  // Get test runs by status
  getTestRunsByStatus: (status: TestRunStatus) => fetchData<TestRunSchema[]>(`testRuns?status=${status}`),
  
  // Get test runs by priority
  getTestRunsByPriority: (priority: TestRunPriority) => fetchData<TestRunSchema[]>(`testRuns?priority=${priority}`),
  
  // Get test runs by date range
  getTestRunsByDateRange: (startDate: Date, endDate: Date) => fetchData<TestRunSchema[]>(
    `testRuns?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
  ),
  
  // Add result to test run
  addResultToTestRun: (testRunId: string, resultId: string) => fetchData<TestRunSchema>(`testRuns/${testRunId}/results`, {
    method: 'POST',
    body: JSON.stringify({ resultId }),
  }),
  
  // Update test run stats
  updateTestRunStats: (testRunId: string, stats: any) => fetchData<TestRunSchema>(`testRuns/${testRunId}/stats`, {
    method: 'PUT',
    body: JSON.stringify(stats),
  }),
  
  // Update test run status
  updateTestRunStatus: (testRunId: string, status: TestRunStatus) => fetchData<TestRunSchema>(`testRuns/${testRunId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  
  // Start test run
  startTestRun: (testRunId: string) => fetchData<TestRunSchema>(`testRuns/${testRunId}/start`, {
    method: 'POST',
  }),
  
  // Complete test run
  completeTestRun: (testRunId: string) => fetchData<TestRunSchema>(`testRuns/${testRunId}/complete`, {
    method: 'POST',
  }),
};
