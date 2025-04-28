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

export { fetchData };
export * from './userApi';
export * from './projectApi';
export * from './testCaseApi';
export * from './testSuiteApi';
export * from './testRunApi';
export * from './testResultApi';
export * from './agentApi';
export * from './serverAgentApi';
export * from './queuedRequestApi';
export * from './processedRequestApi';
export * from './detailedTestResultsApi';
export * from './notificationsApi';
export * from './performanceMetricsApi';
export * from './testFeaturesApi';
export * from './executionTimeDataApi';
export * from './testCountsByDayApi';
export * from './systemResourcesDataApi';
export * from './agentStatusDataApi';
export * from './activeAgentsDataApi';
export * from './queueStatusDataApi';

// Tüm API servislerini içeren bir nesne oluştur
import { userApi } from './userApi';
import { projectApi } from './projectApi';
import { testCaseApi } from './testCaseApi';
import { testSuiteApi } from './testSuiteApi';
import { testRunApi } from './testRunApi';
import { testResultApi } from './testResultApi';
import { agentApi } from './agentApi';
import { serverAgentApi } from './serverAgentApi';
import { queuedRequestApi } from './queuedRequestApi';
import { processedRequestApi } from './processedRequestApi';
import { detailedTestResultsApi } from './detailedTestResultsApi';
import { notificationsApi } from './notificationsApi';
import { performanceMetricsApi } from './performanceMetricsApi';
import { testFeaturesApi } from './testFeaturesApi';
import { executionTimeDataApi } from './executionTimeDataApi';
import { testCountsByDayApi } from './testCountsByDayApi';
import { systemResourcesDataApi } from './systemResourcesDataApi';
import { agentStatusDataApi } from './agentStatusDataApi';
import { activeAgentsDataApi } from './activeAgentsDataApi';
import { queueStatusDataApi } from './queueStatusDataApi';

// Tüm API'leri birleştir
const api = {
  ...userApi,
  ...projectApi,
  ...testCaseApi,
  ...testSuiteApi,
  ...testRunApi,
  ...testResultApi,
  ...agentApi,
  ...serverAgentApi,
  ...queuedRequestApi,
  ...processedRequestApi,
  ...detailedTestResultsApi,
  ...notificationsApi,
  ...performanceMetricsApi,
  ...testFeaturesApi,
  ...executionTimeDataApi,
  ...testCountsByDayApi,
  ...systemResourcesDataApi,
  ...agentStatusDataApi,
  ...activeAgentsDataApi,
  ...queueStatusDataApi,

  // Yardımcı fonksiyonlar
  getCategories: () => fetchData<any[]>('testCategories'),
  getPriorities: () => fetchData<any[]>('testPriorities'),
  getStatuses: () => fetchData<any[]>('testStatuses'),
  getEnvironments: () => fetchData<any[]>('testEnvironments'),
  getFeatures: () => fetchData<any[]>('testFeatures'),
  getServerAgentStatus: () => fetchData<any>('serverAgent'),

  // Server Agent sayfası için API çağrıları
  getLatestSystemResourcesData: () => fetchData<any>('systemResources'),
  getLatestAgentStatusData: () => fetchData<any>('agentStatus'),
  getLatestQueueStatusData: () => fetchData<any>('queueStatus'),
  getLatestActiveAgentsData: () => fetchData<any>('activeAgents'),
  getQueuedRequests: () => fetchData<any[]>('queuedRequests'),
  getProcessedRequests: () => fetchData<any[]>('processedRequests'),
  getAgentById: (id: string) => fetchData<any>(`agents/${id}`)
};

export default api;
