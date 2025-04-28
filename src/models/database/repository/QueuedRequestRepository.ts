import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { QueuedRequestSchema, RequestStatus, RequestPriority, RequestCategory, RequestSource } from '../schemas/QueuedRequestSchema';
import { COLLECTIONS } from '../collections';

/**
 * Queued request repository sınıfı
 */
export class QueuedRequestRepository extends BaseRepository<QueuedRequestSchema> {
  /**
   * QueuedRequestRepository constructor
   */
  constructor() {
    super(COLLECTIONS.QUEUED_REQUESTS);
  }

  /**
   * Duruma göre istekleri getirir
   * @param status İstek durumu
   * @returns İstek listesi
   */
  async findByStatus(status: RequestStatus): Promise<QueuedRequestSchema[]> {
    return this.findAll({ status } as Filter<QueuedRequestSchema>);
  }

  /**
   * Önceliğe göre istekleri getirir
   * @param priority İstek önceliği
   * @returns İstek listesi
   */
  async findByPriority(priority: RequestPriority): Promise<QueuedRequestSchema[]> {
    return this.findAll({ priority } as Filter<QueuedRequestSchema>);
  }

  /**
   * Kategoriye göre istekleri getirir
   * @param category İstek kategorisi
   * @returns İstek listesi
   */
  async findByCategory(category: RequestCategory): Promise<QueuedRequestSchema[]> {
    return this.findAll({ category } as Filter<QueuedRequestSchema>);
  }

  /**
   * Kaynağa göre istekleri getirir
   * @param source İstek kaynağı
   * @returns İstek listesi
   */
  async findBySource(source: RequestSource): Promise<QueuedRequestSchema[]> {
    return this.findAll({ source } as Filter<QueuedRequestSchema>);
  }

  /**
   * Projeye göre istekleri getirir
   * @param projectId Proje ID'si
   * @returns İstek listesi
   */
  async findByProject(projectId: string): Promise<QueuedRequestSchema[]> {
    return this.findAll({ projectId } as Filter<QueuedRequestSchema>);
  }

  /**
   * Test run'a göre istekleri getirir
   * @param testRunId Test run ID'si
   * @returns İstek listesi
   */
  async findByTestRun(testRunId: string): Promise<QueuedRequestSchema[]> {
    return this.findAll({ testRunId } as Filter<QueuedRequestSchema>);
  }

  /**
   * Atanan agent'a göre istekleri getirir
   * @param agentId Agent ID'si
   * @returns İstek listesi
   */
  async findByAssignedAgent(agentId: string): Promise<QueuedRequestSchema[]> {
    return this.findAll({ assignedTo: agentId } as Filter<QueuedRequestSchema>);
  }

  /**
   * İstek durumunu günceller
   * @param id İstek ID'si
   * @param status İstek durumu
   * @returns Güncellenen istek sayısı
   */
  async updateStatus(id: string, status: RequestStatus): Promise<number> {
    return this.update(id, { status });
  }

  /**
   * İsteği bir agent'a atar
   * @param id İstek ID'si
   * @param agentId Agent ID'si
   * @returns Güncellenen istek sayısı
   */
  async assignToAgent(id: string, agentId: string): Promise<number> {
    return this.update(id, { 
      assignedTo: agentId,
      assignedAt: new Date(),
      status: RequestStatus.ASSIGNED
    });
  }

  /**
   * İsteği işlemeye başlar
   * @param id İstek ID'si
   * @returns Güncellenen istek sayısı
   */
  async startProcessing(id: string): Promise<number> {
    return this.update(id, { 
      status: RequestStatus.PROCESSING,
      startedAt: new Date()
    });
  }

  /**
   * Sıradaki istekleri getirir
   * @returns Sıradaki istek listesi
   */
  async findQueuedRequests(): Promise<QueuedRequestSchema[]> {
    return this.findAll({ 
      status: RequestStatus.QUEUED 
    } as Filter<QueuedRequestSchema>, {
      sort: { priority: 1, createdAt: 1 }
    });
  }
}
