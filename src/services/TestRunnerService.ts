import { TestStep, TestStepActionType } from '../components/test-cases/TestStepsEditor';
import { BrowserSettings } from '../components/test-cases/BrowserSettingsEditor';

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

// Test çalıştırma servisi
class TestRunnerService {
  private apiUrl: string;

  constructor() {
    // Gerçek uygulamada bu değerler .env dosyasından alınabilir
    this.apiUrl = 'http://localhost:3001/api';
  }

  // Test çalıştırma isteği gönder
  async runTest(request: TestRunRequest): Promise<TestRunResponse> {
    try {
      // Önce kuyruk durumunu kontrol et
      try {
        const queueStatusResponse = await fetch(`${this.apiUrl}/queue-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (queueStatusResponse.ok) {
          const queueStatus = await queueStatusResponse.json();

          // Kuyruk dolu mu kontrol et
          if (queueStatus.length >= queueStatus.maxSize) {
            throw new Error('Test kuyruğu dolu. Lütfen daha sonra tekrar deneyin.');
          }
        }
      } catch (queueError) {
        // Kuyruk durumu alınamazsa, devam et
        console.warn('Kuyruk durumu kontrol edilemedi:', queueError);
      }

      // Benzersiz ID kontrolü
      if (!request.id || request.id.trim() === '') {
        request.id = `run-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }

      // Test çalıştırma isteği gönder
      const response = await fetch(`${this.apiUrl}/test-runs`, {
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

          // Özel hata durumlarını kontrol et
          if (response.status === 409) {
            errorMessage = 'Bu test zaten çalışıyor veya kuyruğa alınmış.';
          } else if (response.status === 429) {
            errorMessage = 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.';
          } else if (response.status === 503) {
            errorMessage = 'Test çalıştırma servisi şu anda kullanılamıyor.';
          }
        } catch (e) {
          // JSON parse hatası, response body boş olabilir
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Test çalıştırma hatası:', error);
      throw error;
    }
  }

  // Test durumunu kontrol et
  async checkTestStatus(testRunId: string): Promise<TestRunResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/test-runs/${testRunId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Test durumu alınamadı');
      }

      return await response.json();
    } catch (error) {
      console.error('Test durumu kontrol hatası:', error);
      throw error;
    }
  }

  // Test çalıştırmasını iptal et
  async cancelTestRun(testRunId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/test-runs/${testRunId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Test çalıştırması iptal edilemedi');
      }
    } catch (error) {
      console.error('Test iptal hatası:', error);
      throw error;
    }
  }

  // Test çalıştırma sonuçlarını al
  async getTestResults(testRunId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/test-runs/${testRunId}/results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Test sonuçları alınamadı');
      }

      return await response.json();
    } catch (error) {
      console.error('Test sonuçları alma hatası:', error);
      throw error;
    }
  }

  // Test adımlarını doğrula
  validateTestSteps(steps: TestStep[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!steps || steps.length === 0) {
      errors.push('En az bir test adımı gereklidir');
      return { isValid: false, errors };
    }

    // Her adımı kontrol et
    steps.forEach((step, index) => {
      const stepNumber = index + 1;

      // Gerekli alanları kontrol et
      if (!step.action) {
        errors.push(`Adım ${stepNumber}: İşlem türü gereklidir`);
      }

      if (!step.description) {
        errors.push(`Adım ${stepNumber}: Açıklama gereklidir`);
      }

      // İşlem türüne göre gerekli alanları kontrol et
      switch (step.action) {
        case TestStepActionType.NAVIGATE:
          if (!step.value) {
            errors.push(`Adım ${stepNumber}: URL gereklidir`);
          }
          break;
        case TestStepActionType.CLICK:
        case TestStepActionType.HOVER:
        case TestStepActionType.ASSERT_ELEMENT:
        case TestStepActionType.FOCUS:
        case TestStepActionType.BLUR:
        case TestStepActionType.CHECK:
        case TestStepActionType.UNCHECK:
          if (!step.selector) {
            errors.push(`Adım ${stepNumber}: Seçici gereklidir`);
          }
          break;
        case TestStepActionType.TYPE:
        case TestStepActionType.ASSERT_TEXT:
        case TestStepActionType.SELECT:
          if (!step.selector) {
            errors.push(`Adım ${stepNumber}: Seçici gereklidir`);
          }
          if (!step.value) {
            errors.push(`Adım ${stepNumber}: Değer gereklidir`);
          }
          break;
        case TestStepActionType.WAIT:
          if (!step.value) {
            errors.push(`Adım ${stepNumber}: Bekleme süresi gereklidir`);
          } else if (isNaN(parseInt(step.value, 10))) {
            errors.push(`Adım ${stepNumber}: Bekleme süresi sayısal olmalıdır`);
          }
          break;
        case TestStepActionType.TAKE_SCREENSHOT:
          if (!step.value) {
            errors.push(`Adım ${stepNumber}: Ekran görüntüsü adı gereklidir`);
          }
          break;
        case TestStepActionType.ASSERT_URL:
          if (!step.value) {
            errors.push(`Adım ${stepNumber}: URL gereklidir`);
          }
          break;
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  // Tarayıcı ayarlarını doğrula
  validateBrowserSettings(settings: BrowserSettings): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!settings.browser) {
      errors.push('Tarayıcı seçilmelidir');
    }

    if (settings.width <= 0) {
      errors.push('Genişlik pozitif bir sayı olmalıdır');
    }

    if (settings.height <= 0) {
      errors.push('Yükseklik pozitif bir sayı olmalıdır');
    }

    if (settings.timeout < 0) {
      errors.push('Zaman aşımı negatif olamaz');
    }

    if (settings.proxy?.server && !settings.proxy.server.includes('://')) {
      errors.push('Proxy sunucusu geçerli bir URL olmalıdır (örn: http://proxy.example.com:8080)');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Test çalıştırma isteğini doğrula
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

  // API URL'sini güncelle
  setApiUrl(apiUrl: string): void {
    this.apiUrl = apiUrl;
  }
}

// Singleton instance
export const testRunnerService = new TestRunnerService();
