import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { TestResultSchema, TestResultStatus, TestPriority, TestSeverity } from '../schemas/TestResultSchema';
import { COLLECTIONS } from '../collections';

/**
 * Test result repository sınıfı
 */
export class TestResultRepository extends BaseRepository<TestResultSchema> {
  /**
   * TestResultRepository constructor
   */
  constructor() {
    super(COLLECTIONS.TEST_RESULTS);
  }

  /**
   * Test run'a göre test sonuçlarını getirir
   * @param testRunId Test run ID'si
   * @returns Test sonuç listesi
   */
  async findByTestRun(testRunId: string): Promise<TestResultSchema[]> {
    return this.findAll({ testRunId } as Filter<TestResultSchema>);
  }

  /**
   * Test case'e göre test sonuçlarını getirir
   * @param testCaseId Test case ID'si
   * @returns Test sonuç listesi
   */
  async findByTestCase(testCaseId: string): Promise<TestResultSchema[]> {
    return this.findAll({ testCaseId } as Filter<TestResultSchema>);
  }

  /**
   * Test suite'e göre test sonuçlarını getirir
   * @param testSuiteId Test suite ID'si
   * @returns Test sonuç listesi
   */
  async findByTestSuite(testSuiteId: string): Promise<TestResultSchema[]> {
    return this.findAll({ testSuiteId } as Filter<TestResultSchema>);
  }

  /**
   * Duruma göre test sonuçlarını getirir
   * @param status Test sonuç durumu
   * @returns Test sonuç listesi
   */
  async findByStatus(status: TestResultStatus): Promise<TestResultSchema[]> {
    return this.findAll({ status } as Filter<TestResultSchema>);
  }

  /**
   * Önceliğe göre test sonuçlarını getirir
   * @param priority Test önceliği
   * @returns Test sonuç listesi
   */
  async findByPriority(priority: TestPriority): Promise<TestResultSchema[]> {
    return this.findAll({ priority } as Filter<TestResultSchema>);
  }

  /**
   * Şiddet seviyesine göre test sonuçlarını getirir
   * @param severity Test şiddet seviyesi
   * @returns Test sonuç listesi
   */
  async findBySeverity(severity: TestSeverity): Promise<TestResultSchema[]> {
    return this.findAll({ severity } as Filter<TestResultSchema>);
  }

  /**
   * Belirli bir tarih aralığında çalıştırılan test sonuçlarını getirir
   * @param startDate Başlangıç tarihi
   * @param endDate Bitiş tarihi
   * @returns Test sonuç listesi
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<TestResultSchema[]> {
    return this.findAll({ 
      startTime: { 
        $gte: startDate, 
        $lte: endDate 
      } 
    } as Filter<TestResultSchema>);
  }

  /**
   * Test sonucuna adım sonucu ekler
   * @param id Test sonuç ID'si
   * @param stepResultId Test adım sonuç ID'si
   * @returns Güncellenen test sonuç sayısı
   */
  async addStepResult(id: string, stepResultId: string): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: id }, { id }] } as Filter<TestResultSchema>,
      { $addToSet: { steps: stepResultId } }
    );
    return result.modifiedCount;
  }

  /**
   * Test sonuç durumunu günceller
   * @param id Test sonuç ID'si
   * @param status Test sonuç durumu
   * @returns Güncellenen test sonuç sayısı
   */
  async updateStatus(id: string, status: TestResultStatus): Promise<number> {
    return this.update(id, { 
      status,
      updatedAt: new Date()
    } as Partial<TestResultSchema>);
  }
}
