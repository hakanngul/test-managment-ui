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

// Tüm API'leri birleştir
const api = {

  // Yardımcı fonksiyonlar
  getCategories: () => fetchData<any[]>('testCategories'),
  getPriorities: () => fetchData<any[]>('testPriorities'),
  getStatuses: () => fetchData<any[]>('testStatuses'),
  getEnvironments: () => fetchData<any[]>('testEnvironments'),
  getFeatures: () => fetchData<any[]>('testFeatures'),
  getServerAgentStatus: () => fetchData<any>('serverAgent'),

  // Server Agent sayfası için API çağrıları
  getServerAgent: () => fetchData<any>('serverAgent'),
  getLatestSystemResourcesData: () => fetchData<any>('systemResources'),
  getLatestAgentStatusData: () => fetchData<any>('agentStatus'),
  getLatestQueueStatusData: () => fetchData<any>('queueStatus'),
  getLatestActiveAgentsData: () => fetchData<any>('activeAgents'),
  getQueuedRequests: () => fetchData<any[]>('queuedRequestsData'),
  getProcessedRequests: () => fetchData<any[]>('processedRequestsData'),
  getAgentById: (id: string) => fetchData<any>(`agents/${id}`),
  getQueuedRequestById: (id: string) => fetchData<any>(`queuedRequestsData/${id}`),
  getProcessedRequestById: (id: string) => fetchData<any>(`processedRequestsData/${id}`)
};

export default api;
