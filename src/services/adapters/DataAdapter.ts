import { ServerAgentSchema } from '../../models/database/schemas';
import { Agent, QueuedRequest, ProcessedRequest } from '../../models';

/**
 * DataAdapter interface
 * 
 * Bu interface, farklı veri kaynaklarından (mock data, API, WebSocket, vb.)
 * veri almak için kullanılacak adapter'ların uygulaması gereken metotları tanımlar.
 */
export interface DataAdapter {
  /**
   * Server agent verilerini getirir
   */
  getServerAgent(): Promise<ServerAgentSchema>;

  /**
   * ID'ye göre agent verilerini getirir
   */
  getAgentById(id: string): Promise<Agent | null>;

  /**
   * Kuyrukta bekleyen istekleri getirir
   */
  getQueuedRequests(): Promise<QueuedRequest[]>;

  /**
   * ID'ye göre kuyrukta bekleyen isteği getirir
   */
  getQueuedRequestById(id: string): Promise<QueuedRequest | null>;

  /**
   * İşlenen istekleri getirir
   */
  getProcessedRequests(): Promise<ProcessedRequest[]>;

  /**
   * ID'ye göre işlenen isteği getirir
   */
  getProcessedRequestById(id: string): Promise<ProcessedRequest | null>;

  /**
   * Sistem kaynaklarını getirir
   */
  getSystemResources(): Promise<{ cpuUsage: number; memoryUsage: number; [key: string]: any }>;
}
