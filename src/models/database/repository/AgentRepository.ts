import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { AgentSchema, AgentStatus, AgentType } from '../schemas/AgentSchema';
import { COLLECTIONS } from '../collections';

/**
 * Agent repository sınıfı
 */
export class AgentRepository extends BaseRepository<AgentSchema> {
  /**
   * AgentRepository constructor
   */
  constructor() {
    super(COLLECTIONS.AGENTS);
  }

  /**
   * Duruma göre agent'ları getirir
   * @param status Agent durumu
   * @returns Agent listesi
   */
  async findByStatus(status: AgentStatus): Promise<AgentSchema[]> {
    return this.findAll({ status } as Filter<AgentSchema>);
  }

  /**
   * Türe göre agent'ları getirir
   * @param type Agent türü
   * @returns Agent listesi
   */
  async findByType(type: AgentType): Promise<AgentSchema[]> {
    return this.findAll({ type } as Filter<AgentSchema>);
  }

  /**
   * Sunucuya göre agent'ları getirir
   * @param serverId Sunucu ID'si
   * @returns Agent listesi
   */
  async findByServer(serverId: string): Promise<AgentSchema[]> {
    return this.findAll({ serverId } as Filter<AgentSchema>);
  }

  /**
   * Kullanılabilir agent'ları getirir
   * @returns Kullanılabilir agent listesi
   */
  async findAvailableAgents(): Promise<AgentSchema[]> {
    return this.findAll({ 
      status: AgentStatus.AVAILABLE 
    } as Filter<AgentSchema>);
  }

  /**
   * Agent durumunu günceller
   * @param id Agent ID'si
   * @param status Agent durumu
   * @returns Güncellenen agent sayısı
   */
  async updateStatus(id: string, status: AgentStatus): Promise<number> {
    return this.update(id, { 
      status,
      lastActivity: new Date()
    } as Partial<AgentSchema>);
  }

  /**
   * Agent'a istek atar
   * @param id Agent ID'si
   * @param requestId İstek ID'si
   * @returns Güncellenen agent sayısı
   */
  async assignRequest(id: string, requestId: string): Promise<number> {
    return this.update(id, { 
      currentRequest: requestId,
      status: AgentStatus.BUSY,
      lastActivity: new Date()
    } as Partial<AgentSchema>);
  }

  /**
   * Agent'ın isteğini tamamlar
   * @param id Agent ID'si
   * @param requestId İstek ID'si
   * @returns Güncellenen agent sayısı
   */
  async completeRequest(id: string, requestId: string): Promise<number> {
    return this.update(id, { 
      currentRequest: null,
      lastRequest: requestId,
      status: AgentStatus.AVAILABLE,
      lastActivity: new Date()
    } as Partial<AgentSchema>);
  }
}
