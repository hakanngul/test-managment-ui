import { fetchData } from './index';
import { TestSuiteSchema, TestSuiteStatus, TestSuitePriority } from '../../models/database/schemas';

// Test Suite API endpoints
export const testSuiteApi = {
  // Get all test suites
  getTestSuites: () => fetchData<TestSuiteSchema[]>('testSuites'),
  
  // Get test suite by ID
  getTestSuiteById: (id: string) => fetchData<TestSuiteSchema>(`testSuites/${id}`),
  
  // Create new test suite
  createTestSuite: (data: Omit<TestSuiteSchema, '_id'>) => fetchData<TestSuiteSchema>('testSuites', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update test suite
  updateTestSuite: (id: string, data: Partial<TestSuiteSchema>) => fetchData<TestSuiteSchema>(`testSuites/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete test suite
  deleteTestSuite: (id: string) => fetchData<{ success: boolean }>(`testSuites/${id}`, {
    method: 'DELETE',
  }),
  
  // Get test suites by project
  getTestSuitesByProject: (projectId: string) => fetchData<TestSuiteSchema[]>(`testSuites?projectId=${projectId}`),
  
  // Get test suites by status
  getTestSuitesByStatus: (status: TestSuiteStatus) => fetchData<TestSuiteSchema[]>(`testSuites?status=${status}`),
  
  // Get test suites by priority
  getTestSuitesByPriority: (priority: TestSuitePriority) => fetchData<TestSuiteSchema[]>(`testSuites?priority=${priority}`),
  
  // Get test suites by tags
  getTestSuitesByTags: (tags: string[]) => fetchData<TestSuiteSchema[]>(`testSuites?tags=${tags.join(',')}`),
  
  // Get test suites by creator
  getTestSuitesByCreator: (userId: string) => fetchData<TestSuiteSchema[]>(`testSuites?createdBy=${userId}`),
  
  // Add test case to test suite
  addTestCaseToTestSuite: (testSuiteId: string, testCaseId: string) => fetchData<TestSuiteSchema>(`testSuites/${testSuiteId}/testCases`, {
    method: 'POST',
    body: JSON.stringify({ testCaseId }),
  }),
  
  // Remove test case from test suite
  removeTestCaseFromTestSuite: (testSuiteId: string, testCaseId: string) => fetchData<TestSuiteSchema>(`testSuites/${testSuiteId}/testCases/${testCaseId}`, {
    method: 'DELETE',
  }),
  
  // Update test suite progress
  updateTestSuiteProgress: (testSuiteId: string, progress: number) => fetchData<TestSuiteSchema>(`testSuites/${testSuiteId}/progress`, {
    method: 'PUT',
    body: JSON.stringify({ progress }),
  }),
};
