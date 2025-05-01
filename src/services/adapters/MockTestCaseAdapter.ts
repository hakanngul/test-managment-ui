import { TestCaseAdapter } from './TestCaseAdapter';
import { TestCase } from '../../models/interfaces/ITestCase';
import { mockTestCases } from '../../mock/testCasesMock';
import { v4 as uuidv4 } from 'uuid';

/**
 * MockTestCaseAdapter
 * 
 * Bu adapter, mock verilerden test case'leri almak için kullanılır.
 * Test ve geliştirme aşamasında gerçek API olmadan çalışmayı sağlar.
 */
export class MockTestCaseAdapter implements TestCaseAdapter {
  private testCases: TestCase[] = [...mockTestCases];

  /**
   * Tüm test case'leri getirir
   */
  async getAllTestCases(): Promise<TestCase[]> {
    console.log('MockTestCaseAdapter: Fetching all test cases from mock');
    return [...this.testCases];
  }

  /**
   * ID'ye göre test case getirir
   * @param id Test case ID'si
   */
  async getTestCaseById(id: string): Promise<TestCase | null> {
    console.log(`MockTestCaseAdapter: Fetching test case ${id} from mock`);
    const testCase = this.testCases.find(tc => tc.id === id);
    return testCase ? { ...testCase } : null;
  }

  /**
   * Yeni bir test case ekler
   * @param testCase Eklenecek test case
   */
  async createTestCase(testCase: Omit<TestCase, 'id'>): Promise<TestCase> {
    console.log('MockTestCaseAdapter: Creating new test case in mock');
    
    // Yeni ID oluştur
    const newTestCase: TestCase = {
      ...testCase,
      id: `tc-${uuidv4().substring(0, 8)}`,
    };
    
    this.testCases.push(newTestCase);
    return { ...newTestCase };
  }

  /**
   * Mevcut bir test case'i günceller
   * @param id Güncellenecek test case ID'si
   * @param testCase Güncellenmiş test case verileri
   */
  async updateTestCase(id: string, testCase: Partial<TestCase>): Promise<TestCase | null> {
    console.log(`MockTestCaseAdapter: Updating test case ${id} in mock`);
    
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
    
    return { ...this.testCases[index] };
  }

  /**
   * Bir test case'i siler
   * @param id Silinecek test case ID'si
   */
  async deleteTestCase(id: string): Promise<boolean> {
    console.log(`MockTestCaseAdapter: Deleting test case ${id} from mock`);
    
    const initialLength = this.testCases.length;
    this.testCases = this.testCases.filter(tc => tc.id !== id);
    
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
    console.log('MockTestCaseAdapter: Filtering test cases from mock');
    
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
