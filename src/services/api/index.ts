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
