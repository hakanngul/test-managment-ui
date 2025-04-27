// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

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

    const data = await response.json();

    // If the response is an array with a single item, return that item
    // This is to handle MongoDB's array responses for single documents
    if (Array.isArray(data) && data.length === 1) {
      return data[0] as T;
    }

    return data as T;
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
  getTestCases: () => fetchData<any[]>('testCases').catch(() => []),
  getTestCaseById: (id: string) => fetchData<any>(`testCases/${id}`),
  updateTestCase: (id: string, data: any) => fetchData<any>(`testCases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTestCase: (id: string) => fetchData<{success: boolean}>(`testCases/${id}`, {
    method: 'DELETE',
  }),
  createTestCase: (data: any) => fetchData<any>('testCases', {
    method: 'POST',
    body: JSON.stringify(data),
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

  // Dashboard Data
  getCategories: () => fetchData<string[]>('testCategories'),
  getPriorities: () => fetchData<string[]>('testPriorities'),
  getStatuses: () => fetchData<string[]>('testStatuses'),
  getEnvironments: () => fetchData<string[]>('testEnvironments'),
  getFeatures: () => fetchData<string[]>('testFeatures'),

  // Test Results
  getTestResultsData: () => fetchData<any[]>('testResults'),
  getTestResultById: (id: string) => fetchData<any>(`testResults/${id}`),
  createTestResult: (data: any) => fetchData<any>('testResults', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTestResult: (id: string, data: any) => fetchData<any>(`testResults/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTestResult: (id: string) => fetchData<void>(`testResults/${id}`, {
    method: 'DELETE',
  }),

  // These methods are kept for backward compatibility but now use MongoDB data
  getExecutionTimeData: () => fetchData<number[]>('executionTimeData'),
  getTestCountsByDay: () => fetchData<any[]>('testCountsByDay'),

  // Test Case Form Data
  getAvailableTags: () => fetchData<string[]>('availableTags').catch(() => [
    'regression', 'smoke', 'integration', 'api', 'ui', 'performance', 'security',
    'functional', 'usability', 'accessibility', 'compatibility', 'load', 'stress'
  ]),
  getAvailableActions: () => fetchData<string[]>('availableActions').catch(() => [
    'click', 'type', 'wait', 'select', 'assert', 'navigate', 'hover', 'scroll', 'drag', 'upload', 'custom'
  ]),
  getTeamMembers: () => fetchData<any[]>('teamMembers'),
  getMockTestCases: () => fetchData<any[]>('mockTestCases'),

  // Reports Data
  getTestExecutionData: () => fetchData<any>('testExecutionData').catch(() => ({
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    },
    series: [
      {
        name: 'Passed',
        data: [44, 55, 41, 67, 22, 43, 36]
      },
      {
        name: 'Failed',
        data: [13, 23, 20, 8, 13, 27, 33]
      },
      {
        name: 'Skipped',
        data: [11, 17, 15, 15, 21, 14, 15]
      }
    ]
  })),
  getTestDurationData: () => fetchData<any>('testDurationData').catch(() => ({
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true
        }
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yaxis: {
        title: {
          text: 'Duration (minutes)'
        }
      }
    },
    series: [
      {
        name: 'Duration',
        data: [30, 40, 35, 50, 49, 60, 70]
      }
    ]
  })),
  getTestResults: () => fetchData<any[]>('testResults').catch(() => [
    {
      id: '1',
      name: 'Login Test Suite',
      total: 24,
      passed: 20,
      failed: 3,
      skipped: 1,
      duration: '45m 30s',
      durationMs: 2730000,
      lastRun: new Date().toISOString()
    },
    {
      id: '2',
      name: 'User Profile Tests',
      total: 15,
      passed: 12,
      failed: 2,
      skipped: 1,
      duration: '30m 15s',
      durationMs: 1815000,
      lastRun: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Payment Processing',
      total: 18,
      passed: 16,
      failed: 1,
      skipped: 1,
      duration: '25m 45s',
      durationMs: 1545000,
      lastRun: new Date().toISOString()
    }
  ]),
  getDetailedTestResults: () => fetchData<any[]>('detailedTestResults'),
  getStatusDistributionData: () => fetchData<any>('statusDistributionData'),
  getDurationByStatusData: () => fetchData<any>('durationByStatusData'),
  getCoverageData: () => fetchData<any>('coverageData'),
  getCoverageTrendData: () => fetchData<any>('coverageTrendData'),
  getCoverageByTypeData: () => fetchData<any>('coverageByTypeData'),
  getUncoveredLinesData: () => fetchData<any>('uncoveredLinesData'),
  getPerformanceMetrics: () => fetchData<any[]>('performanceMetrics'),
  getLoadTimeData: () => fetchData<any>('loadTimeData'),
  getResponseTimeData: () => fetchData<any>('responseTimeData'),
  getResourceUsageData: () => fetchData<any>('resourceUsageData'),
  getBrowserComparisonData: () => fetchData<any>('browserComparisonData'),

  // Server Agent Data
  getSystemResourcesData: () => fetchData<any>('systemResources').catch(() => ({
    lastUpdated: new Date().toLocaleString('tr-TR'),
    cpuUsage: 0,
    memoryUsage: 0
  })),
  getAgentStatusData: () => fetchData<any>('agentStatus').catch(() => ({
    total: 0,
    available: 0,
    busy: 0,
    limit: 1
  })),
  getQueueStatusData: () => fetchData<any>('queueStatus').catch(() => ({
    queued: 0,
    processing: 0,
    total: 0
  })),
  getActiveAgentsData: () => fetchData<any[]>('activeAgents').catch(() => []),
  getQueuedRequestsData: () => fetchData<any[]>('queuedRequests').catch(() => []),
  getProcessedRequestsData: () => fetchData<any[]>('processedRequests').catch(() => []),
};

export default api;
