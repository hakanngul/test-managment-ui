import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { TestRunSchema, TestRunStatus, TestRunPriority } from '../schemas/TestRunSchema';
import { COLLECTIONS } from '../collections';

/**
 * Test run repository sınıfı
 */
export class TestRunRepository extends BaseRepository<TestRunSchema> {
  /**
   * TestRunRepository constructor
   */
  constructor() {
    super(COLLECTIONS.TEST_RUNS);
  }

  /**
   * Projeye göre test run'ları getirir
   * @param projectId Proje ID'si
   * @returns Test run listesi
   */
  async findByProject(projectId: string): Promise<TestRunSchema[]> {
    return this.findAll({ projectId } as Filter<TestRunSchema>);
  }

  /**
   * Test suite'e göre test run'ları getirir
   * @param testSuiteId Test suite ID'si
   * @returns Test run listesi
   */
  async findByTestSuite(testSuiteId: string): Promise<TestRunSchema[]> {
    return this.findAll({ testSuiteId } as Filter<TestRunSchema>);
  }

  /**
   * Duruma göre test run'ları getirir
   * @param status Test run durumu
   * @returns Test run listesi
   */
  async findByStatus(status: TestRunStatus): Promise<TestRunSchema[]> {
    return this.findAll({ status } as Filter<TestRunSchema>);
  }

  /**
   * Önceliğe göre test run'ları getirir
   * @param priority Test run önceliği
   * @returns Test run listesi
   */
  async findByPriority(priority: TestRunPriority): Promise<TestRunSchema[]> {
    return this.findAll({ priority } as Filter<TestRunSchema>);
  }

  /**
   * Belirli bir tarih aralığında çalıştırılan test run'ları getirir
   * @param startDate Başlangıç tarihi
   * @param endDate Bitiş tarihi
   * @returns Test run listesi
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<TestRunSchema[]> {
    return this.findAll({ 
      startTime: { 
        $gte: startDate, 
        $lte: endDate 
      } 
    } as Filter<TestRunSchema>);
  }

  /**
   * Test run'a sonuç ekler
   * @param id Test run ID'si
   * @param resultId Test sonuç ID'si
   * @returns Güncellenen test run sayısı
   */
  async addResult(id: string, resultId: string): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: id }, { id }] } as Filter<TestRunSchema>,
      { $addToSet: { results: resultId } }
    );
    return result.modifiedCount;
  }

  /**
   * Test run istatistiklerini günceller
   * @param id Test run ID'si
   * @param stats Test run istatistikleri
   * @returns Güncellenen test run sayısı
   */
  async updateStats(id: string, stats: Partial<TestRunSchema['stats']>): Promise<number> {
    return this.update(id, { 
      stats,
      updatedAt: new Date()
    } as Partial<TestRunSchema>);
  }

  /**
   * Test run durumunu günceller
   * @param id Test run ID'si
   * @param status Test run durumu
   * @returns Güncellenen test run sayısı
   */
  async updateStatus(id: string, status: TestRunStatus): Promise<number> {
    return this.update(id, { 
      status,
      updatedAt: new Date()
    } as Partial<TestRunSchema>);
  }
}
