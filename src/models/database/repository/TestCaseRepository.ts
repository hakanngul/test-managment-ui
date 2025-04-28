import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { TestCaseSchema, TestCaseStatus, TestCasePriority } from '../schemas/TestCaseSchema';
import { COLLECTIONS } from '../collections';

/**
 * Test case repository sınıfı
 */
export class TestCaseRepository extends BaseRepository<TestCaseSchema> {
  /**
   * TestCaseRepository constructor
   */
  constructor() {
    super(COLLECTIONS.TEST_CASES);
  }

  /**
   * Projeye göre test case'leri getirir
   * @param projectId Proje ID'si
   * @returns Test case listesi
   */
  async findByProject(projectId: string): Promise<TestCaseSchema[]> {
    return this.findAll({ projectId } as Filter<TestCaseSchema>);
  }

  /**
   * Duruma göre test case'leri getirir
   * @param status Test case durumu
   * @returns Test case listesi
   */
  async findByStatus(status: TestCaseStatus): Promise<TestCaseSchema[]> {
    return this.findAll({ status } as Filter<TestCaseSchema>);
  }

  /**
   * Önceliğe göre test case'leri getirir
   * @param priority Test case önceliği
   * @returns Test case listesi
   */
  async findByPriority(priority: TestCasePriority): Promise<TestCaseSchema[]> {
    return this.findAll({ priority } as Filter<TestCaseSchema>);
  }

  /**
   * Etiketlere göre test case'leri getirir
   * @param tags Etiketler
   * @returns Test case listesi
   */
  async findByTags(tags: string[]): Promise<TestCaseSchema[]> {
    return this.findAll({ 
      tags: { $in: tags } 
    } as Filter<TestCaseSchema>);
  }

  /**
   * Oluşturan kullanıcıya göre test case'leri getirir
   * @param userId Kullanıcı ID'si
   * @returns Test case listesi
   */
  async findByCreator(userId: string): Promise<TestCaseSchema[]> {
    return this.findAll({ createdBy: userId } as Filter<TestCaseSchema>);
  }

  /**
   * Test case'e adım ekler
   * @param id Test case ID'si
   * @param step Test adımı
   * @returns Güncellenen test case sayısı
   */
  async addStep(id: string, step: TestCaseSchema['steps'][0]): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: id }, { id }] } as Filter<TestCaseSchema>,
      { $push: { steps: step } }
    );
    return result.modifiedCount;
  }

  /**
   * Test case'den adım çıkarır
   * @param id Test case ID'si
   * @param stepId Test adımı ID'si
   * @returns Güncellenen test case sayısı
   */
  async removeStep(id: string, stepId: string): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: id }, { id }] } as Filter<TestCaseSchema>,
      { $pull: { steps: { id: stepId } } }
    );
    return result.modifiedCount;
  }

  /**
   * Test case çalıştırma istatistiklerini günceller
   * @param id Test case ID'si
   * @param stats Test case çalıştırma istatistikleri
   * @returns Güncellenen test case sayısı
   */
  async updateExecutionStats(id: string, stats: Partial<TestCaseSchema['executionStats']>): Promise<number> {
    return this.update(id, { 
      executionStats: stats,
      updatedAt: new Date()
    } as Partial<TestCaseSchema>);
  }
}
