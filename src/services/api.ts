import { ServerAgentSchema } from '../models/database/schemas';

// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * API servisi
 *
 * Bu servis, backend API'si ile iletişim kurmak için kullanılır.
 * Gerçek API çağrıları ve mock veriler arasında geçiş yapabilir.
 */
const api = {
  /**
   * Server agent verilerini getirir
   */
  getServerAgent: async (): Promise<ServerAgentSchema> => {
    try {
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${API_BASE_URL}/launcher/status`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // API'den gelen veriyi ServerAgentSchema formatına dönüştür
      const serverAgentData: ServerAgentSchema = {
        id: data.id || 'unknown',
        name: data.name || 'Agent Launcher',
        status: data.status || 'OFFLINE',
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
          successRate: 100,
          throughput: 0
        },
        config: {
          maxConcurrentTests: data.maxAgents || 5,
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

      return serverAgentData;
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
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${API_BASE_URL}/agents/${id}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
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
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${API_BASE_URL}/queue`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
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
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${API_BASE_URL}/queue/processed`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
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
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${API_BASE_URL}/metrics/system/latest`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching system resources:', error);
      // Hata durumunda boş bir sistem kaynakları nesnesi döndür
      return {
        cpuUsage: 0,
        memoryUsage: 0
      };
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
