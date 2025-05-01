import { TestCase } from '../../models/interfaces/ITestCase';

/**
 * TestCaseAdapter interface
 * 
 * Bu interface, test case'leri getirme, ekleme, güncelleme ve silme işlemlerini tanımlar.
 * Farklı veri kaynaklarından (mock data, API, MongoDB, vb.) test case verilerini almak için kullanılır.
 */
export interface TestCaseAdapter {
  /**
   * Tüm test case'leri getirir
   */
  getAllTestCases(): Promise<TestCase[]>;

  /**
   * ID'ye göre test case getirir
   * @param id Test case ID'si
   */
  getTestCaseById(id: string): Promise<TestCase | null>;

  /**
   * Yeni bir test case ekler
   * @param testCase Eklenecek test case
   */
  createTestCase(testCase: Omit<TestCase, 'id'>): Promise<TestCase>;

  /**
   * Mevcut bir test case'i günceller
   * @param id Güncellenecek test case ID'si
   * @param testCase Güncellenmiş test case verileri
   */
  updateTestCase(id: string, testCase: Partial<TestCase>): Promise<TestCase | null>;

  /**
   * Bir test case'i siler
   * @param id Silinecek test case ID'si
   */
  deleteTestCase(id: string): Promise<boolean>;

  /**
   * Filtrelere göre test case'leri getirir
   * @param filters Filtreler
   */
  filterTestCases(filters: {
    status?: string[];
    priority?: string[];
    category?: string[];
    automated?: boolean;
    tags?: string[];
  }): Promise<TestCase[]>;
}
