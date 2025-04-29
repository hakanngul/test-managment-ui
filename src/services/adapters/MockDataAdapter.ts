import { DataAdapter } from './DataAdapter';
import { ServerAgentSchema } from '../../models/database/schemas';
import { Agent, QueuedRequest, ProcessedRequest } from '../../models';
import { 
  mockServerAgentSchema, 
  mockAgents, 
  mockQueuedRequests, 
  mockProcessedRequests, 
  mockSystemResource 
} from '../../mock/serverAgentMock';

/**
 * MockDataAdapter
 * 
 * Bu adapter, mock verilerden veri almak için kullanılır.
 * Test ve geliştirme aşamasında gerçek API olmadan çalışmayı sağlar.
 */
export class MockDataAdapter implements DataAdapter {
  /**
   * Server agent verilerini getirir
   */
  async getServerAgent(): Promise<ServerAgentSchema> {
    console.log('MockDataAdapter: Fetching server agent data from mock');
    return mockServerAgentSchema;
  }

  /**
   * ID'ye göre agent verilerini getirir
   */
  async getAgentById(id: string): Promise<Agent | null> {
    console.log(`MockDataAdapter: Fetching agent ${id} from mock`);
    const agent = mockAgents.find(a => a.id === id);
    return agent || null;
  }

  /**
   * Kuyrukta bekleyen istekleri getirir
   */
  async getQueuedRequests(): Promise<QueuedRequest[]> {
    console.log('MockDataAdapter: Fetching queued requests from mock');
    return mockQueuedRequests;
  }

  /**
   * ID'ye göre kuyrukta bekleyen isteği getirir
   */
  async getQueuedRequestById(id: string): Promise<QueuedRequest | null> {
    console.log(`MockDataAdapter: Fetching queued request ${id} from mock`);
    const request = mockQueuedRequests.find(r => r.id === id);
    return request || null;
  }

  /**
   * İşlenen istekleri getirir
   */
  async getProcessedRequests(): Promise<ProcessedRequest[]> {
    console.log('MockDataAdapter: Fetching processed requests from mock');
    return mockProcessedRequests;
  }

  /**
   * ID'ye göre işlenen isteği getirir
   */
  async getProcessedRequestById(id: string): Promise<ProcessedRequest | null> {
    console.log(`MockDataAdapter: Fetching processed request ${id} from mock`);
    const request = mockProcessedRequests.find(r => r.id === id);
    return request || null;
  }

  /**
   * Sistem kaynaklarını getirir
   */
  async getSystemResources(): Promise<{ cpuUsage: number; memoryUsage: number; [key: string]: any }> {
    console.log('MockDataAdapter: Fetching system resources from mock');
    return mockSystemResource;
  }
}
