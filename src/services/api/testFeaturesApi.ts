import { fetchData } from './index';

// Test Features API endpoints
export const testFeaturesApi = {
  // Get all test features
  getTestFeatures: () => fetchData<any[]>('testFeatures').catch(() => []),
  
  // Get test feature by ID
  getTestFeatureById: (id: string) => fetchData<any>(`testFeatures/${id}`),
  
  // Get test features by project ID
  getTestFeaturesByProjectId: (projectId: string) => 
    fetchData<any[]>(`testFeatures?projectId=${projectId}`),
  
  // Get test features by test case ID
  getTestFeaturesByTestCaseId: (testCaseId: string) => 
    fetchData<any[]>(`testFeatures?testCaseId=${testCaseId}`),
  
  // Create new test feature
  createTestFeature: (data: any) => fetchData<any>('testFeatures', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update test feature
  updateTestFeature: (id: string, data: any) => fetchData<any>(`testFeatures/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete test feature
  deleteTestFeature: (id: string) => fetchData<{ success: boolean }>(`testFeatures/${id}`, {
    method: 'DELETE',
  }),
  
  // Add test case to test feature
  addTestCaseToTestFeature: (testFeatureId: string, testCaseId: string) => 
    fetchData<any>(`testFeatures/${testFeatureId}/testCases`, {
      method: 'POST',
      body: JSON.stringify({ testCaseId }),
    }),
  
  // Remove test case from test feature
  removeTestCaseFromTestFeature: (testFeatureId: string, testCaseId: string) => 
    fetchData<any>(`testFeatures/${testFeatureId}/testCases/${testCaseId}`, {
      method: 'DELETE',
    }),
};
