import { DataAdapter } from './adapters/DataAdapter';
import { MockDataAdapter } from './adapters/MockDataAdapter';
import { ServiceDataAdapter } from './adapters/ServiceDataAdapter';
import { ServerAgentSchema } from '../models/database/schemas';
import { Agent, QueuedRequest, ProcessedRequest } from '../models';

/**
 * DataService
 * 
 * Bu servis, veri kaynağını (mock veya gerçek API) yönetir ve
 * uygulamanın veri ihtiyaçlarını karşılar.
 */
class DataService {
  private adapter: DataAdapter;
  private useMockData: boolean;

  constructor() {
    // Varsayılan olarak mock data kullan
    this.useMockData = true;
    this.adapter = new MockDataAdapter();
  }

  /**
   * Veri kaynağını ayarlar
   * @param useMockData Mock data kullanılıp kullanılmayacağı
   * @param apiBaseUrl Gerçek API kullanılacaksa API'nin base URL'i
   */
  setDataSource(useMockData: boolean, apiBaseUrl?: string): void {
    this.useMockData = useMockData;
    
    if (useMockData) {
      this.adapter = new MockDataAdapter();
      console.log('DataService: Using mock data');
    } else {
      this.adapter = new ServiceDataAdapter(apiBaseUrl);
      console.log(`DataService: Using real API at ${apiBaseUrl}`);
    }
  }

  /**
   * Şu anki veri kaynağını döndürür
   */
  getDataSourceInfo(): { useMockData: boolean } {
    return { useMockData: this.useMockData };
  }

  /**
   * Server agent verilerini getirir
   */
  async getServerAgent(): Promise<ServerAgentSchema> {
    return this.adapter.getServerAgent();
  }

  /**
   * ID'ye göre agent verilerini getirir
   */
  async getAgentById(id: string): Promise<Agent | null> {
    return this.adapter.getAgentById(id);
  }

  /**
   * Kuyrukta bekleyen istekleri getirir
   */
  async getQueuedRequests(): Promise<QueuedRequest[]> {
    return this.adapter.getQueuedRequests();
  }

  /**
   * ID'ye göre kuyrukta bekleyen isteği getirir
   */
  async getQueuedRequestById(id: string): Promise<QueuedRequest | null> {
    return this.adapter.getQueuedRequestById(id);
  }

  /**
   * İşlenen istekleri getirir
   */
  async getProcessedRequests(): Promise<ProcessedRequest[]> {
    return this.adapter.getProcessedRequests();
  }

  /**
   * ID'ye göre işlenen isteği getirir
   */
  async getProcessedRequestById(id: string): Promise<ProcessedRequest | null> {
    return this.adapter.getProcessedRequestById(id);
  }

  /**
   * Sistem kaynaklarını getirir
   */
  async getSystemResources(): Promise<{ cpuUsage: number; memoryUsage: number; [key: string]: any }> {
    return this.adapter.getSystemResources();
  }
}

// Singleton instance
const dataService = new DataService();
export default dataService;
