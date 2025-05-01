import { TestCase } from '../models/interfaces/ITestCase';
import { TestStep } from '../components/test-cases/TestStepsEditor';
import { BrowserSettings } from '../components/test-cases/BrowserSettingsEditor';
import { BrowserType } from '../models/enums/TestEnums';
import { webSocketService } from './websocket';

// Test çalıştırma isteği arayüzü
export interface TestRunRequest {
  id: string;
  name: string;
  description: string;
  browserSettings: BrowserSettings;
  steps: TestStep[];
  testCaseId?: string;
  testSuiteId?: string;
  projectId?: string;
  priority?: string;
  tags?: string[];
  createdBy?: string;
}

// Test çalıştırma yanıtı arayüzü
export interface TestRunResponse {
  id: string;
  status: 'queued' | 'scheduled' | 'running' | 'completed' | 'failed' | 'error';
  message?: string;
  queuePosition?: number;
  estimatedStartTime?: string;
  agentId?: string;
}

// API yanıt arayüzü
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Test çalıştırma servisi
 *
 * Bu servis, test case'leri çalıştırmak için merkezi bir API sağlar.
 * Şu anda mock verilerle çalışır, ancak ileride gerçek API'ye geçiş yapabilir.
 */
class TestRunService {
  private apiUrl: string;

  constructor() {
    // Gerçek uygulamada bu değerler .env dosyasından alınabilir
    this.apiUrl = 'http://localhost:3000/run-test';
  }

  /**
   * Test case'i çalıştır
   * @param testCaseId Test case ID'si
   */
  async runTestById(testCaseId: string): Promise<TestRunResponse> {
    try {
      console.log(`TestRunService: Running test case ${testCaseId}`);

      // Test case'i bul
      const testCase = await this.getTestCaseById(testCaseId);
      if (!testCase) {
        throw new Error('Test case bulunamadı');
      }

      // Test çalıştırma isteği oluştur
      const testRunRequest = this.createTestRunRequestFromTestCase(testCase);

      // API'ye istek gönder
      const response = await fetch(`${this.apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRunRequest),
      });

      if (!response.ok) {
        let errorMessage = 'Test çalıştırma isteği başarısız oldu';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // JSON parse hatası, response body boş olabilir
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Test çalıştırma hatası:', error);

      // Gerçek API olmadığı için mock yanıt döndür
      return this.getMockResponse(testCaseId);
    }
  }

  /**
   * Test case'i ID'ye göre getir
   * @param testCaseId Test case ID'si
   */
  private async getTestCaseById(testCaseId: string): Promise<TestCase | null> {
    try {
      // Gerçek uygulamada bu API'den alınacak
      // Şimdilik mock veri döndürüyoruz

      // Örnek test adımları
      const steps: TestStep[] = [
        {
          id: 'step-1',
          action: 'NAVIGATE',
          description: 'Ana sayfaya git',
          value: 'https://example.com',
          order: 1,
          selector: ''
        },
        {
          id: 'step-2',
          action: 'CLICK',
          description: 'Giriş butonuna tıkla',
          selector: '#login-button',
          value: '',
          order: 2
        },
        {
          id: 'step-3',
          action: 'TYPE',
          description: 'Kullanıcı adını gir',
          selector: '#username',
          value: 'testuser',
          order: 3
        },
        {
          id: 'step-4',
          action: 'TYPE',
          description: 'Şifreyi gir',
          selector: '#password',
          value: 'password123',
          order: 4
        },
        {
          id: 'step-5',
          action: 'CLICK',
          description: 'Giriş formunu gönder',
          selector: 'button[type="submit"]',
          value: '',
          order: 5
        },
        {
          id: 'step-6',
          action: 'ASSERT_TEXT',
          description: 'Başarılı giriş mesajını kontrol et',
          selector: '.welcome-message',
          value: 'Hoş geldiniz',
          order: 6
        }
      ];

      // Test case'i oluştur
      return {
        id: testCaseId,
        name: `Test Case ${testCaseId}`,
        description: 'Bu bir test case açıklamasıdır',
        status: 'ACTIVE',
        priority: 'HIGH',
        category: 'FUNCTIONAL',
        tags: ['login', 'authentication'],
        createdBy: 'Hakan Gül',
        createdAt: new Date(),
        updatedAt: new Date(),
        browser: 'CHROME',
        environment: 'Production',
        automated: true,
        prerequisites: 'Internet bağlantısı gereklidir',
        projectId: 'proj-001',
        steps: steps
      };
    } catch (error) {
      console.error('Test case getirme hatası:', error);
      return null;
    }
  }

  /**
   * Test case'i çalıştır (detaylı)
   * @param request Test çalıştırma isteği
   */
  async runTest(request: TestRunRequest): Promise<TestRunResponse> {
    try {
      console.log(`TestRunService: Running test with detailed request`, request);

      // API'ye istek gönder
      const response = await fetch(`${this.apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        let errorMessage = 'Test çalıştırma isteği başarısız oldu';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // JSON parse hatası, response body boş olabilir
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Test çalıştırma hatası:', error);

      // Gerçek API olmadığı için mock yanıt döndür
      return this.getMockResponse(request.testCaseId || request.id);
    }
  }

  /**
   * Test durumunu kontrol et
   * @param testRunId Test çalıştırma ID'si
   */
  async checkTestStatus(testRunId: string): Promise<TestRunResponse> {
    try {
      console.log(`TestRunService: Checking status of test run ${testRunId}`);

      // API'ye istek gönder
      const response = await fetch(`${this.apiUrl}/${testRunId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Test durumu alınamadı';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // JSON parse hatası, response body boş olabilir
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Test durumu kontrol hatası:', error);

      // Gerçek API olmadığı için mock yanıt döndür
      return {
        id: testRunId,
        status: 'running',
        message: 'Test çalışıyor...',
        agentId: 'agent-001'
      };
    }
  }

  /**
   * Test çalıştırmasını iptal et
   * @param testRunId Test çalıştırma ID'si
   */
  async cancelTestRun(testRunId: string): Promise<void> {
    try {
      console.log(`TestRunService: Cancelling test run ${testRunId}`);

      // API'ye istek gönder
      const response = await fetch(`${this.apiUrl}/${testRunId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Test çalıştırması iptal edilemedi';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // JSON parse hatası, response body boş olabilir
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Test iptal hatası:', error);
      // Gerçek API olmadığı için hata fırlatma
    }
  }

  /**
   * Test adımlarını doğrula
   * @param steps Test adımları
   */
  validateTestSteps(steps: TestStep[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!steps || steps.length === 0) {
      errors.push('En az bir test adımı gereklidir');
      return { isValid: false, errors };
    }

    // Her adımı kontrol et
    steps.forEach((step, index) => {
      if (!step.action) {
        errors.push(`Adım ${index + 1}: İşlem tipi gereklidir`);
      }

      if (!step.description) {
        errors.push(`Adım ${index + 1}: Açıklama gereklidir`);
      }

      // İşlem tipine göre gerekli alanları kontrol et
      switch (step.action) {
        case 'NAVIGATE':
          if (!step.value) {
            errors.push(`Adım ${index + 1}: URL değeri gereklidir`);
          }
          break;
        case 'CLICK':
        case 'ASSERT_ELEMENT':
          if (!step.selector) {
            errors.push(`Adım ${index + 1}: Seçici gereklidir`);
          }
          break;
        case 'TYPE':
          if (!step.selector) {
            errors.push(`Adım ${index + 1}: Seçici gereklidir`);
          }
          if (!step.value) {
            errors.push(`Adım ${index + 1}: Değer gereklidir`);
          }
          break;
        case 'ASSERT_TEXT':
          if (!step.selector) {
            errors.push(`Adım ${index + 1}: Seçici gereklidir`);
          }
          if (!step.value) {
            errors.push(`Adım ${index + 1}: Beklenen metin gereklidir`);
          }
          break;
        case 'ASSERT_URL':
          if (!step.value) {
            errors.push(`Adım ${index + 1}: Beklenen URL gereklidir`);
          }
          break;
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Tarayıcı ayarlarını doğrula
   * @param browserSettings Tarayıcı ayarları
   */
  validateBrowserSettings(browserSettings: BrowserSettings): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!browserSettings) {
      errors.push('Tarayıcı ayarları gereklidir');
      return { isValid: false, errors };
    }

    if (!browserSettings.browser) {
      errors.push('Tarayıcı tipi gereklidir');
    }

    if (browserSettings.width <= 0) {
      errors.push('Tarayıcı genişliği pozitif bir değer olmalıdır');
    }

    if (browserSettings.height <= 0) {
      errors.push('Tarayıcı yüksekliği pozitif bir değer olmalıdır');
    }

    if (browserSettings.timeout <= 0) {
      errors.push('Zaman aşımı süresi pozitif bir değer olmalıdır');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Test çalıştırma isteğini doğrula
   * @param request Test çalıştırma isteği
   */
  validateTestRunRequest(request: TestRunRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.name) {
      errors.push('Test adı gereklidir');
    }

    if (!request.description) {
      errors.push('Test açıklaması gereklidir');
    }

    // Test adımlarını doğrula
    const stepsValidation = this.validateTestSteps(request.steps);
    if (!stepsValidation.isValid) {
      errors.push(...stepsValidation.errors);
    }

    // Tarayıcı ayarlarını doğrula
    const browserValidation = this.validateBrowserSettings(request.browserSettings);
    if (!browserValidation.isValid) {
      errors.push(...browserValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Mock yanıt döndür
   * @param testId Test ID'si
   */
  private getMockResponse(testId: string): TestRunResponse {
    // WebSocket bağlantısını kontrol et
    let queuePosition = 1;
    let estimatedStartTime = new Date(Date.now() + 5000).toISOString();

    try {
      // WebSocketManager'dan kuyruk durumunu al
      const manager = webSocketService.getManager();
      const state = manager.getState();

      // Kuyruk durumunu kontrol et
      if (state.queueStatus) {
        queuePosition = state.queueStatus.pendingTests + 1;

        // Tahmini başlama zamanını hesapla
        const estimatedWaitTime = state.queueStatus.estimatedWaitTime || 5000;
        estimatedStartTime = new Date(Date.now() + estimatedWaitTime).toISOString();
      }
    } catch (error) {
      console.warn('WebSocket kuyruk durumu alınamadı:', error);
    }

    return {
      id: `run-${Date.now()}-${testId}`,
      status: 'queued',
      message: 'Test kuyruğa alındı',
      queuePosition,
      estimatedStartTime,
      agentId: 'agent-001'
    };
  }

  /**
   * Test case'i çalıştırmak için gerekli request nesnesini oluştur
   * @param testCase Test case
   */
  createTestRunRequestFromTestCase(testCase: TestCase): any {
    // API'nin beklediği formata dönüştür
    const apiSteps = (testCase.steps || []).map(step => {
      return {
        action: step.action.toLowerCase(),
        target: step.selector || '',
        strategy: step.selector ? 'css' : '',
        value: step.value || '',
        description: step.description || ''
      };
    });

    // Adım sayısı az ise, bazı temel adımlar ekle
    if (apiSteps.length < 3) {
      apiSteps.push(
        {
          action: "navigate",
          value: "https://www.wikipedia.org",
          description: "Wikipedia'ya git"
        },
        {
          action: "wait",
          value: "1000",
          description: "Sayfanın yüklenmesini bekle"
        },
        {
          action: "type",
          target: "searchInput",
          strategy: "id",
          value: "Test automation",
          description: "Arama terimini yaz"
        }
      );
    }

    return {
      name: testCase.name,
      description: testCase.description || '',
      browserPreference: ((testCase.browser as string) || 'chrome').toLowerCase(),
      headless: true,
      takeScreenshots: true,
      steps: apiSteps,
      testCaseId: testCase.id
    };
  }
}

// Singleton instance
export const testRunService = new TestRunService();
