import { fetchData } from './index';
import { TestCaseSchema, TestCaseStatus, TestCasePriority } from '../../models/database/schemas';

// Test Case API endpoints
export const testCaseApi = {
  // Get all test cases
  getTestCases: () => fetchData<TestCaseSchema[]>('testCases').catch(() => {
    console.error('Failed to fetch test cases, returning empty array');
    return [];
  }),
  
  // Get test case by ID
  getTestCaseById: (id: string) => fetchData<TestCaseSchema>(`testCases/${id}`),
  
  // Create new test case
  createTestCase: (data: Omit<TestCaseSchema, '_id'>) => fetchData<TestCaseSchema>('testCases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update test case
  updateTestCase: (id: string, data: Partial<TestCaseSchema>) => fetchData<TestCaseSchema>(`testCases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete test case
  deleteTestCase: (id: string) => fetchData<{ success: boolean }>(`testCases/${id}`, {
    method: 'DELETE',
  }),
  
  // Get test cases by project
  getTestCasesByProject: (projectId: string) => fetchData<TestCaseSchema[]>(`testCases?projectId=${projectId}`),
  
  // Get test cases by status
  getTestCasesByStatus: (status: TestCaseStatus) => fetchData<TestCaseSchema[]>(`testCases?status=${status}`),
  
  // Get test cases by priority
  getTestCasesByPriority: (priority: TestCasePriority) => fetchData<TestCaseSchema[]>(`testCases?priority=${priority}`),
  
  // Get test cases by tags
  getTestCasesByTags: (tags: string[]) => fetchData<TestCaseSchema[]>(`testCases?tags=${tags.join(',')}`),
  
  // Get test cases by creator
  getTestCasesByCreator: (userId: string) => fetchData<TestCaseSchema[]>(`testCases?createdBy=${userId}`),
  
  // Add step to test case
  addStepToTestCase: (testCaseId: string, step: any) => fetchData<TestCaseSchema>(`testCases/${testCaseId}/steps`, {
    method: 'POST',
    body: JSON.stringify(step),
  }),
  
  // Remove step from test case
  removeStepFromTestCase: (testCaseId: string, stepId: string) => fetchData<TestCaseSchema>(`testCases/${testCaseId}/steps/${stepId}`, {
    method: 'DELETE',
  }),
  
  // Update test case execution stats
  updateTestCaseExecutionStats: (testCaseId: string, stats: any) => fetchData<TestCaseSchema>(`testCases/${testCaseId}/stats`, {
    method: 'PUT',
    body: JSON.stringify(stats),
  }),
};
