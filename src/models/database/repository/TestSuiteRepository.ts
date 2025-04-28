import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { TestSuiteSchema, TestSuiteStatus, TestSuitePriority } from '../schemas/TestSuiteSchema';
import { COLLECTIONS } from '../collections';

/**
 * Test suite repository sınıfı
 */
export class TestSuiteRepository extends BaseRepository<TestSuiteSchema> {
  /**
   * TestSuiteRepository constructor
   */
  constructor() {
    super(COLLECTIONS.TEST_SUITES);
  }

  /**
   * Projeye göre test suite'leri getirir
   * @param projectId Proje ID'si
   * @returns Test suite listesi
   */
  async findByProject(projectId: string): Promise<TestSuiteSchema[]> {
    return this.findAll({ projectId } as Filter<TestSuiteSchema>);
  }

  /**
   * Duruma göre test suite'leri getirir
   * @param status Test suite durumu
   * @returns Test suite listesi
   */
  async findByStatus(status: TestSuiteStatus): Promise<TestSuiteSchema[]> {
    return this.findAll({ status } as Filter<TestSuiteSchema>);
  }

  /**
   * Önceliğe göre test suite'leri getirir
   * @param priority Test suite önceliği
   * @returns Test suite listesi
   */
  async findByPriority(priority: TestSuitePriority): Promise<TestSuiteSchema[]> {
    return this.findAll({ priority } as Filter<TestSuiteSchema>);
  }

  /**
   * Etiketlere göre test suite'leri getirir
   * @param tags Etiketler
   * @returns Test suite listesi
   */
  async findByTags(tags: string[]): Promise<TestSuiteSchema[]> {
    return this.findAll({ 
      tags: { $in: tags } 
    } as Filter<TestSuiteSchema>);
  }

  /**
   * Oluşturan kullanıcıya göre test suite'leri getirir
   * @param userId Kullanıcı ID'si
   * @returns Test suite listesi
   */
  async findByCreator(userId: string): Promise<TestSuiteSchema[]> {
    return this.findAll({ createdBy: userId } as Filter<TestSuiteSchema>);
  }

  /**
   * Test suite'e test case ekler
   * @param id Test suite ID'si
   * @param testCaseId Test case ID'si
   * @returns Güncellenen test suite sayısı
   */
  async addTestCase(id: string, testCaseId: string): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: id }, { id }] } as Filter<TestSuiteSchema>,
      { $addToSet: { testCases: testCaseId } }
    );
    return result.modifiedCount;
  }

  /**
   * Test suite'den test case çıkarır
   * @param id Test suite ID'si
   * @param testCaseId Test case ID'si
   * @returns Güncellenen test suite sayısı
   */
  async removeTestCase(id: string, testCaseId: string): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: id }, { id }] } as Filter<TestSuiteSchema>,
      { $pull: { testCases: testCaseId } }
    );
    return result.modifiedCount;
  }

  /**
   * Test suite ilerleme durumunu günceller
   * @param id Test suite ID'si
   * @param progress İlerleme durumu (0-100)
   * @returns Güncellenen test suite sayısı
   */
  async updateProgress(id: string, progress: number): Promise<number> {
    return this.update(id, { 
      progress,
      updatedAt: new Date()
    } as Partial<TestSuiteSchema>);
  }
}
