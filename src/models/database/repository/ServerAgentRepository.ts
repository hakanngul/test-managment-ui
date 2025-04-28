import { BaseRepository } from './BaseRepository';
import { ServerAgentSchema } from '../schemas/ServerAgentSchema';
import { AgentStatusSummary } from '../schemas/AgentSchema';
import { QueueStatusSummary } from '../schemas/QueuedRequestSchema';
import { COLLECTIONS } from '../collections';

/**
 * Server agent repository sınıfı
 */
export class ServerAgentRepository extends BaseRepository<ServerAgentSchema> {
  /**
   * ServerAgentRepository constructor
   */
  constructor() {
    super(COLLECTIONS.SERVER_AGENT);
  }

  /**
   * Sunucu agent'ını ID'ye göre getirir
   * @param serverId Sunucu ID'si
   * @returns Sunucu agent'ı veya null
   */
  async findByServerId(serverId: string): Promise<ServerAgentSchema | null> {
    return this.findOne({ serverId });
  }

  /**
   * Agent durumunu günceller
   * @param id Sunucu agent ID'si
   * @param agentStatus Agent durum özeti
   * @returns Güncellenen sunucu agent sayısı
   */
  async updateAgentStatus(id: string, agentStatus: AgentStatusSummary): Promise<number> {
    return this.update(id, { 
      agentStatus,
      lastUpdated: new Date()
    });
  }

  /**
   * Kuyruk durumunu günceller
   * @param id Sunucu agent ID'si
   * @param queueStatus Kuyruk durum özeti
   * @returns Güncellenen sunucu agent sayısı
   */
  async updateQueueStatus(id: string, queueStatus: QueueStatusSummary): Promise<number> {
    return this.update(id, { 
      queueStatus,
      lastUpdated: new Date()
    });
  }

  /**
   * Aktif agent'ları günceller
   * @param id Sunucu agent ID'si
   * @param activeAgents Aktif agent ID'leri
   * @returns Güncellenen sunucu agent sayısı
   */
  async updateActiveAgents(id: string, activeAgents: string[]): Promise<number> {
    return this.update(id, { 
      activeAgents,
      lastUpdated: new Date()
    });
  }

  /**
   * Sıradaki istekleri günceller
   * @param id Sunucu agent ID'si
   * @param queuedRequests Sıradaki istek ID'leri
   * @returns Güncellenen sunucu agent sayısı
   */
  async updateQueuedRequests(id: string, queuedRequests: string[]): Promise<number> {
    return this.update(id, { 
      queuedRequests,
      lastUpdated: new Date()
    });
  }

  /**
   * İşlenmiş istekleri günceller
   * @param id Sunucu agent ID'si
   * @param processedRequests İşlenmiş istek ID'leri
   * @returns Güncellenen sunucu agent sayısı
   */
  async updateProcessedRequests(id: string, processedRequests: string[]): Promise<number> {
    return this.update(id, { 
      processedRequests,
      lastUpdated: new Date()
    });
  }
}
