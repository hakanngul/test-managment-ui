import { DataAdapter } from './DataAdapter';
import { ServerAgentSchema } from '../../models/database/schemas';
import { Agent, QueuedRequest, ProcessedRequest, toAgent, toQueuedRequest, toProcessedRequest } from '../../models';
import { createEmptyServerAgentSchema } from '../../models/database/schemas';

/**
 * ServiceDataAdapter
 *
 * Bu adapter, gerçek API'den veri almak için kullanılır.
 * Üretim ortamında gerçek verilerle çalışmayı sağlar.
 */
export class ServiceDataAdapter implements DataAdapter {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = 'http://localhost:3001/api') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Server agent verilerini getirir
   */
  async getServerAgent(): Promise<ServerAgentSchema> {
    try {
      console.log('ServiceDataAdapter: Fetching server agent data from API');
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${this.apiBaseUrl}/launcher/status`);

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
          current: data.version?.current || '1.0.0',
          updateAvailable: data.version?.updateAvailable || false
        },
        systemResources: data.systemResources || {
          cpuUsage: 0,
          memoryUsage: 0
        },
        agentStatus: {
          total: data.agentStatus?.total || 0,
          available: data.agentStatus?.available || 0,
          busy: data.agentStatus?.busy || 0,
          offline: data.agentStatus?.offline || 0,
          error: data.agentStatus?.error || 0,
          maintenance: data.agentStatus?.maintenance || 0
        },
        queueStatus: {
          queued: data.queueStatus?.queued || 0,
          processing: data.queueStatus?.processing || 0,
          total: data.queueStatus?.total || 0,
          highPriority: data.queueStatus?.highPriority || 0,
          mediumPriority: data.queueStatus?.mediumPriority || 0,
          lowPriority: data.queueStatus?.lowPriority || 0,
          estimatedWaitTime: data.queueStatus?.estimatedWaitTime || 0,
          scheduled: 0,
          assigned: 0
        },
        performanceMetrics: data.performanceMetrics || {
          testExecutionTime: {
            average: 0,
            min: 0,
            max: 0,
            p95: 0
          },
          requestsPerMinute: 0,
          averageResponseTime: 0,
          successRate: 0,
          errorRate: 0,
          resourceUtilization: {
            cpu: 0,
            memory: 0,
            disk: 0,
            network: 0
          },
          concurrentTests: {
            current: 0,
            max: 5
          }
        },
        config: data.config || {
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
        healthStatus: data.healthStatus || {
          status: 'healthy',
          lastCheck: new Date().toISOString(),
          uptime: 0,
          checks: []
        },
        activeAgents: data.activeAgents || [],
        queuedRequests: data.queuedRequests || [],
        processedRequests: data.processedRequests || [],
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        createdAt: data.createdAt || new Date().toISOString()
      };

      return serverAgentData;
    } catch (error) {
      console.error('ServiceDataAdapter: Error fetching server agent data:', error);
      // Hata durumunda boş bir şablon döndür
      return createEmptyServerAgentSchema();
    }
  }

  /**
   * ID'ye göre agent verilerini getirir
   */
  async getAgentById(id: string): Promise<Agent | null> {
    try {
      console.log(`ServiceDataAdapter: Fetching agent ${id} from API`);
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${this.apiBaseUrl}/agents/${id}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return toAgent(data);
    } catch (error) {
      console.error(`ServiceDataAdapter: Error fetching agent ${id}:`, error);
      // Hata durumunda null döndür
      return null;
    }
  }

  /**
   * Kuyrukta bekleyen istekleri getirir
   */
  async getQueuedRequests(): Promise<QueuedRequest[]> {
    try {
      console.log('ServiceDataAdapter: Fetching queued requests from API');
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${this.apiBaseUrl}/queue`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.map((item: any) => toQueuedRequest(item));
    } catch (error) {
      console.error('ServiceDataAdapter: Error fetching queued requests:', error);
      // Hata durumunda boş dizi döndür
      return [];
    }
  }

  /**
   * ID'ye göre kuyrukta bekleyen isteği getirir
   */
  async getQueuedRequestById(id: string): Promise<QueuedRequest | null> {
    try {
      console.log(`ServiceDataAdapter: Fetching queued request ${id} from API`);
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${this.apiBaseUrl}/queue/${id}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return toQueuedRequest(data);
    } catch (error) {
      console.error(`ServiceDataAdapter: Error fetching queued request ${id}:`, error);
      // Hata durumunda null döndür
      return null;
    }
  }

  /**
   * İşlenen istekleri getirir
   */
  async getProcessedRequests(): Promise<ProcessedRequest[]> {
    try {
      console.log('ServiceDataAdapter: Fetching processed requests from API');
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${this.apiBaseUrl}/queue/processed`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.map((item: any) => toProcessedRequest(item));
    } catch (error) {
      console.error('ServiceDataAdapter: Error fetching processed requests:', error);
      // Hata durumunda boş dizi döndür
      return [];
    }
  }

  /**
   * ID'ye göre işlenen isteği getirir
   */
  async getProcessedRequestById(id: string): Promise<ProcessedRequest | null> {
    try {
      console.log(`ServiceDataAdapter: Fetching processed request ${id} from API`);
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${this.apiBaseUrl}/queue/processed/${id}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return toProcessedRequest(data);
    } catch (error) {
      console.error(`ServiceDataAdapter: Error fetching processed request ${id}:`, error);
      // Hata durumunda null döndür
      return null;
    }
  }

  /**
   * Sistem kaynaklarını getirir
   */
  async getSystemResources(): Promise<{ cpuUsage: number; memoryUsage: number; [key: string]: any }> {
    try {
      console.log('ServiceDataAdapter: Fetching system resources from API');
      // Gerçek API çağrısı yapmaya çalış
      const response = await fetch(`${this.apiBaseUrl}/metrics/system/latest`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        cpuUsage: data.cpuUsage || 0,
        memoryUsage: data.memoryUsage || 0,
        ...data
      };
    } catch (error) {
      console.error('ServiceDataAdapter: Error fetching system resources:', error);
      // Hata durumunda boş bir sistem kaynakları nesnesi döndür
      return {
        cpuUsage: 0,
        memoryUsage: 0
      };
    }
  }
}
