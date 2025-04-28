import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { ProcessedRequestSchema, ProcessedRequestStatus } from '../schemas/ProcessedRequestSchema';
import { RequestPriority, RequestSource } from '../schemas/QueuedRequestSchema';
import { COLLECTIONS } from '../collections';

/**
 * Processed request repository sınıfı
 */
export class ProcessedRequestRepository extends BaseRepository<ProcessedRequestSchema> {
  /**
   * ProcessedRequestRepository constructor
   */
  constructor() {
    super(COLLECTIONS.PROCESSED_REQUESTS);
  }

  /**
   * Duruma göre işlenmiş istekleri getirir
   * @param status İşlenmiş istek durumu
   * @returns İşlenmiş istek listesi
   */
  async findByStatus(status: ProcessedRequestStatus): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ status } as Filter<ProcessedRequestSchema>);
  }

  /**
   * Önceliğe göre işlenmiş istekleri getirir
   * @param priority İstek önceliği
   * @returns İşlenmiş istek listesi
   */
  async findByPriority(priority: RequestPriority): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ priority } as Filter<ProcessedRequestSchema>);
  }

  /**
   * Kaynağa göre işlenmiş istekleri getirir
   * @param source İstek kaynağı
   * @returns İşlenmiş istek listesi
   */
  async findBySource(source: RequestSource): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ source } as Filter<ProcessedRequestSchema>);
  }

  /**
   * Projeye göre işlenmiş istekleri getirir
   * @param projectId Proje ID'si
   * @returns İşlenmiş istek listesi
   */
  async findByProject(projectId: string): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ projectId } as Filter<ProcessedRequestSchema>);
  }

  /**
   * Test run'a göre işlenmiş istekleri getirir
   * @param testRunId Test run ID'si
   * @returns İşlenmiş istek listesi
   */
  async findByTestRun(testRunId: string): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ testRunId } as Filter<ProcessedRequestSchema>);
  }

  /**
   * Agent'a göre işlenmiş istekleri getirir
   * @param agentId Agent ID'si
   * @returns İşlenmiş istek listesi
   */
  async findByAgent(agentId: string): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ agentId } as Filter<ProcessedRequestSchema>);
  }

  /**
   * Belirli bir tarih aralığında işlenmiş istekleri getirir
   * @param startDate Başlangıç tarihi
   * @param endDate Bitiş tarihi
   * @returns İşlenmiş istek listesi
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ 
      startTime: { 
        $gte: startDate, 
        $lte: endDate 
      } 
    } as Filter<ProcessedRequestSchema>);
  }

  /**
   * Başarılı işlenmiş istekleri getirir
   * @returns Başarılı işlenmiş istek listesi
   */
  async findSuccessfulRequests(): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ 
      status: ProcessedRequestStatus.SUCCESS 
    } as Filter<ProcessedRequestSchema>);
  }

  /**
   * Başarısız işlenmiş istekleri getirir
   * @returns Başarısız işlenmiş istek listesi
   */
  async findFailedRequests(): Promise<ProcessedRequestSchema[]> {
    return this.findAll({ 
      status: ProcessedRequestStatus.FAILED 
    } as Filter<ProcessedRequestSchema>);
  }
}
