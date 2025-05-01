import { TestCaseAdapter } from './TestCaseAdapter';
import { TestCase } from '../../models/interfaces/ITestCase';
import { v4 as uuidv4 } from 'uuid';
import { testCasesData } from '../../mock/testCasesData';

/**
 * FileTestCaseAdapter
 *
 * Bu adapter, dosya sisteminden test case'leri almak için kullanılır.
 * Test ve geliştirme aşamasında JSON dosyalarından veri okumayı sağlar.
 */
export class FileTestCaseAdapter implements TestCaseAdapter {
  private testCases: TestCase[] = [];

  constructor() {
    // Test case'leri yükle
    this.loadTestCasesFromData();
  }

  /**
   * Test case'leri mock verilerden yükler
   */
  private loadTestCasesFromData(): void {
    try {
      console.log('FileTestCaseAdapter: Loading test cases from mock data');

      // Mock verilerden test case'leri yükle
      this.testCases = [...testCasesData];

      console.log(`FileTestCaseAdapter: Loaded ${this.testCases.length} test cases from mock data`);
    } catch (error) {
      console.error('FileTestCaseAdapter: Error loading test cases from mock data:', error);
      this.testCases = [];
    }
  }



  /**
   * Tüm test case'leri getirir
   */
  async getAllTestCases(): Promise<TestCase[]> {
    console.log('FileTestCaseAdapter: Fetching all test cases from mock data');
    return [...this.testCases];
  }

  /**
   * ID'ye göre test case getirir
   * @param id Test case ID'si
   */
  async getTestCaseById(id: string): Promise<TestCase | null> {
    console.log(`FileTestCaseAdapter: Fetching test case ${id} from mock data`);
    const testCase = this.testCases.find(tc => tc.id === id);
    return testCase ? { ...testCase } : null;
  }

  /**
   * Yeni bir test case ekler
   * @param testCase Eklenecek test case
   */
  async createTestCase(testCase: Omit<TestCase, 'id'>): Promise<TestCase> {
    console.log('FileTestCaseAdapter: Creating new test case in memory');

    // Yeni ID oluştur
    const newTestCase: TestCase = {
      ...testCase,
      id: `tc-${uuidv4().substring(0, 8)}`,
    };

    this.testCases.push(newTestCase);

    // Not: Gerçek bir dosya sistemine kaydetme işlemi burada yapılmıyor
    // Tarayıcı ortamında çalıştığı için sadece memory'de tutuluyor

    return { ...newTestCase };
  }

  /**
   * Mevcut bir test case'i günceller
   * @param id Güncellenecek test case ID'si
   * @param testCase Güncellenmiş test case verileri
   */
  async updateTestCase(id: string, testCase: Partial<TestCase>): Promise<TestCase | null> {
    console.log(`FileTestCaseAdapter: Updating test case ${id} in memory`);

    const index = this.testCases.findIndex(tc => tc.id === id);
    if (index === -1) {
      return null;
    }

    // Mevcut test case'i güncelle
    this.testCases[index] = {
      ...this.testCases[index],
      ...testCase,
      updatedAt: new Date()
    };

    // Not: Gerçek bir dosya sistemine kaydetme işlemi burada yapılmıyor
    // Tarayıcı ortamında çalıştığı için sadece memory'de tutuluyor

    return { ...this.testCases[index] };
  }

  /**
   * Bir test case'i siler
   * @param id Silinecek test case ID'si
   */
  async deleteTestCase(id: string): Promise<boolean> {
    console.log(`FileTestCaseAdapter: Deleting test case ${id} from memory`);

    const initialLength = this.testCases.length;
    this.testCases = this.testCases.filter(tc => tc.id !== id);

    // Not: Gerçek bir dosya sisteminden silme işlemi burada yapılmıyor
    // Tarayıcı ortamında çalıştığı için sadece memory'den siliniyor

    return this.testCases.length < initialLength;
  }

  /**
   * Filtrelere göre test case'leri getirir
   * @param filters Filtreler
   */
  async filterTestCases(filters: {
    status?: string[];
    priority?: string[];
    category?: string[];
    automated?: boolean;
    tags?: string[];
  }): Promise<TestCase[]> {
    console.log('FileTestCaseAdapter: Filtering test cases from mock data');

    return this.testCases.filter(testCase => {
      // Status filtresi
      if (filters.status && filters.status.length > 0 && !filters.status.includes(testCase.status)) {
        return false;
      }

      // Priority filtresi
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(testCase.priority)) {
        return false;
      }

      // Category filtresi
      if (filters.category && filters.category.length > 0 && !filters.category.includes(testCase.category)) {
        return false;
      }

      // Automated filtresi
      if (filters.automated !== undefined && testCase.automated !== filters.automated) {
        return false;
      }

      // Tags filtresi
      if (filters.tags && filters.tags.length > 0 && !filters.tags.some(tag => testCase.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }
}
