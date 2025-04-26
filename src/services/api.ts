// API base URL
const API_BASE_URL = 'http://localhost:3001';

// Generic fetch function with error handling
async function fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

// API endpoints
export const api = {
  // Users
  getUsers: () => fetchData<any[]>('users'),
  getUserById: (id: string) => fetchData<any>(`users/${id}`),
  
  // Projects
  getProjects: () => fetchData<any[]>('projects'),
  getProjectById: (id: string) => fetchData<any>(`projects/${id}`),
  
  // Test Cases
  getTestCases: () => fetchData<any[]>('testCases'),
  getTestCaseById: (id: string) => fetchData<any>(`testCases/${id}`),
  createTestCase: (data: any) => fetchData<any>('testCases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTestCase: (id: string, data: any) => fetchData<any>(`testCases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTestCase: (id: string) => fetchData<void>(`testCases/${id}`, {
    method: 'DELETE',
  }),
  
  // Test Suites
  getTestSuites: () => fetchData<any[]>('testSuites'),
  getTestSuiteById: (id: string) => fetchData<any>(`testSuites/${id}`),
  createTestSuite: (data: any) => fetchData<any>('testSuites', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTestSuite: (id: string, data: any) => fetchData<any>(`testSuites/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTestSuite: (id: string) => fetchData<void>(`testSuites/${id}`, {
    method: 'DELETE',
  }),
  
  // Test Runs
  getTestRuns: () => fetchData<any[]>('testRuns'),
  getTestRunById: (id: string) => fetchData<any>(`testRuns/${id}`),
  createTestRun: (data: any) => fetchData<any>('testRuns', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTestRun: (id: string, data: any) => fetchData<any>(`testRuns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTestRun: (id: string) => fetchData<void>(`testRuns/${id}`, {
    method: 'DELETE',
  }),
  
  // Server Agent
  getServerAgentStatus: () => fetchData<any>('serverAgent'),
  updateServerAgentStatus: (data: any) => fetchData<any>('serverAgent', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Notifications
  getNotifications: () => fetchData<any[]>('notifications'),
  markNotificationAsRead: (id: string) => {
    return fetchData<any>(`notifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ read: true }),
    });
  },
};

export default api;
