import { TestCaseAdapter } from './adapters/TestCaseAdapter';
import { MockTestCaseAdapter } from './adapters/MockTestCaseAdapter';
import { MongoDBTestCaseAdapter } from './adapters/MongoDBTestCaseAdapter';
import { FileTestCaseAdapter } from './adapters/FileTestCaseAdapter';
import { TestCase } from '../models/interfaces/ITestCase';

/**
 * TestCaseService
 *
 * Bu servis, test case'leri yönetir ve uygulamanın test case ihtiyaçlarını karşılar.
 * Veri kaynağını (mock veya MongoDB) yönetir.
 */
class TestCaseService {
  private adapter: TestCaseAdapter;
  private useMockData: boolean;
  private useFileData: boolean;

  constructor() {
    // Varsayılan olarak file data kullan
    this.useMockData = false;
    this.useFileData = true;
    this.adapter = new FileTestCaseAdapter();
  }

  /**
   * Veri kaynağını ayarlar
   * @param dataSource Kullanılacak veri kaynağı ('mock', 'file', 'mongodb')
   * @param apiBaseUrl MongoDB kullanılacaksa API'nin base URL'i
   */
  setDataSource(dataSource: 'mock' | 'file' | 'mongodb', apiBaseUrl?: string): void {
    this.useMockData = dataSource === 'mock';
    this.useFileData = dataSource === 'file';

    if (dataSource === 'mock') {
      this.adapter = new MockTestCaseAdapter();
      console.log('TestCaseService: Using mock data');
    } else if (dataSource === 'file') {
      this.adapter = new FileTestCaseAdapter();
      console.log('TestCaseService: Using file data from test-plans');
    } else if (dataSource === 'mongodb') {
      this.adapter = new MongoDBTestCaseAdapter(apiBaseUrl);
      console.log(`TestCaseService: Using MongoDB at ${apiBaseUrl}`);
    }
  }

  /**
   * Şu anki veri kaynağını döndürür
   */
  getDataSourceInfo(): { dataSource: 'mock' | 'file' | 'mongodb' } {
    if (this.useMockData) {
      return { dataSource: 'mock' };
    } else if (this.useFileData) {
      return { dataSource: 'file' };
    } else {
      return { dataSource: 'mongodb' };
    }
  }

  /**
   * Tüm test case'leri getirir
   */
  async getAllTestCases(): Promise<TestCase[]> {
    return this.adapter.getAllTestCases();
  }

  /**
   * ID'ye göre test case getirir
   * @param id Test case ID'si
   */
  async getTestCaseById(id: string): Promise<TestCase | null> {
    return this.adapter.getTestCaseById(id);
  }

  /**
   * Yeni bir test case ekler
   * @param testCase Eklenecek test case
   */
  async createTestCase(testCase: Omit<TestCase, 'id'>): Promise<TestCase> {
    return this.adapter.createTestCase(testCase);
  }

  /**
   * Mevcut bir test case'i günceller
   * @param id Güncellenecek test case ID'si
   * @param testCase Güncellenmiş test case verileri
   */
  async updateTestCase(id: string, testCase: Partial<TestCase>): Promise<TestCase | null> {
    return this.adapter.updateTestCase(id, testCase);
  }

  /**
   * Bir test case'i siler
   * @param id Silinecek test case ID'si
   */
  async deleteTestCase(id: string): Promise<boolean> {
    return this.adapter.deleteTestCase(id);
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
    return this.adapter.filterTestCases(filters);
  }
}

// Singleton instance
const testCaseService = new TestCaseService();
export default testCaseService;
