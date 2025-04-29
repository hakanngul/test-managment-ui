import { ServerAgentSchema } from '../models/database/schemas';
import {
  mockServerAgentSchema,
  mockAgents,
  mockQueuedRequests,
  mockProcessedRequests,
  mockSystemResource
} from '../mock/serverAgentMock';

// API base URL - Şu an kullanılmıyor, mock data kullanıyoruz
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * API servisi
 *
 * Bu servis, backend API'si ile iletişim kurmak için kullanılır.
 * Şu an için mock veriler kullanıyoruz.
 */
const api = {
  /**
   * Server agent verilerini getirir
   */
  getServerAgent: async (): Promise<ServerAgentSchema> => {
    try {
      console.log('Fetching server agent data from mock');
      // Mock veriyi döndür
      return mockServerAgentSchema;
    } catch (error) {
      console.error('Error fetching server agent data:', error);
      // Hata durumunda boş bir şablon döndür
      return createEmptyServerAgentSchema();
    }
  },

  /**
   * ID'ye göre agent verilerini getirir
   */
  getAgentById: async (id: string) => {
    try {
      console.log(`Fetching agent ${id} from mock`);
      // Mock veriden agent'ı bul
      const agent = mockAgents.find(a => a.id === id);
      return agent || null;
    } catch (error) {
      console.error(`Error fetching agent ${id}:`, error);
      // Hata durumunda null döndür
      return null;
    }
  },

  /**
   * Kuyrukta bekleyen istekleri getirir
   */
  getQueuedRequests: async () => {
    try {
      console.log('Fetching queued requests from mock');
      // Mock veriyi döndür
      return mockQueuedRequests;
    } catch (error) {
      console.error('Error fetching queued requests:', error);
      // Hata durumunda boş dizi döndür
      return [];
    }
  },

  /**
   * İşlenen istekleri getirir
   */
  getProcessedRequests: async () => {
    try {
      console.log('Fetching processed requests from mock');
      // Mock veriyi döndür
      return mockProcessedRequests;
    } catch (error) {
      console.error('Error fetching processed requests:', error);
      // Hata durumunda boş dizi döndür
      return [];
    }
  },

  /**
   * Sistem kaynaklarını getirir
   */
  getSystemResources: async () => {
    try {
      console.log('Fetching system resources from mock');
      // Mock veriyi döndür
      return mockSystemResource;
    } catch (error) {
      console.error('Error fetching system resources:', error);
      // Hata durumunda boş bir sistem kaynakları nesnesi döndür
      return {
        cpuUsage: 0,
        memoryUsage: 0
      };
    }
  },

  /**
   * ID'ye göre kuyrukta bekleyen isteği getirir
   */
  getQueuedRequestById: async (id: string) => {
    try {
      console.log(`Fetching queued request ${id} from mock`);
      // Mock veriden isteği bul
      const request = mockQueuedRequests.find(r => r.id === id);
      return request || null;
    } catch (error) {
      console.error(`Error fetching queued request ${id}:`, error);
      // Hata durumunda null döndür
      return null;
    }
  },

  /**
   * ID'ye göre işlenen isteği getirir
   */
  getProcessedRequestById: async (id: string) => {
    try {
      console.log(`Fetching processed request ${id} from mock`);
      // Mock veriden isteği bul
      const request = mockProcessedRequests.find(r => r.id === id);
      return request || null;
    } catch (error) {
      console.error(`Error fetching processed request ${id}:`, error);
      // Hata durumunda null döndür
      return null;
    }
  }
};

/**
 * Boş bir ServerAgentSchema nesnesi oluşturur
 * Bu, API çağrıları başarısız olduğunda kullanılır
 */
const createEmptyServerAgentSchema = (): ServerAgentSchema => {
  return {
    id: 'unknown',
    name: 'Agent Launcher',
    status: 'OFFLINE',
    version: {
      current: '1.0.0',
      updateAvailable: false
    },
    systemResources: {
      cpuUsage: 0,
      memoryUsage: 0
    },
    agentStatus: {
      total: 0,
      available: 0,
      busy: 0,
      offline: 0,
      error: 0,
      maintenance: 0
    },
    queueStatus: {
      queued: 0,
      processing: 0,
      total: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      estimatedWaitTime: 0
    },
    performanceMetrics: {
      testExecutionTime: {
        average: 0,
        min: 0,
        max: 0
      },
      successRate: 0,
      throughput: 0
    },
    config: {
      maxConcurrentTests: 5,
      queueLimit: 100,
      testTimeout: 300000,
      retryPolicy: {
        enabled: true,
        maxRetries: 3,
        retryInterval: 5000
      },
      logging: {
        level: 'info',
        retention: 7
      },
      security: {
        authEnabled: false,
        sslEnabled: false
      },
      notifications: {
        email: false,
        slack: false,
        webhook: false
      }
    },
    activeAgents: [],
    queuedRequests: [],
    processedRequests: [],
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
};

export default api;
