import { 
  TestCase, 
  TestCaseStatus, 
  TestCasePriority, 
  TestCaseCategory, 
  TestCaseResult,
  TestStep,
  TestStepStatus
} from '../models/interfaces/ITestCase';
import { BrowserType, ExecutionStatus, TestRunStatus } from '../models/enums/TestEnums';

// Test adımı çalıştırma durumu
export enum TestStepExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PASSED = 'passed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

// Test çalıştırma ayarları
export interface TestExecutionSettings {
  browser: BrowserType;
  environment: string;
  headless: boolean;
  takeScreenshots: boolean;
  recordVideo: boolean;
  retryOnFailure: boolean;
  maxRetries: number;
}

// Test adımı çalıştırma sonucu
export interface TestStepExecution {
  id: string;
  stepId: string;
  order: number;
  description: string;
  expectedResult: string;
  actualResult?: string;
  status: TestStepExecutionStatus;
  screenshot?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milisaniye cinsinden
  error?: string;
  logs: string[];
}

// Test çalıştırma sonucu
export interface TestExecution {
  id: string;
  testCaseId: string;
  testCaseName: string;
  status: ExecutionStatus;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milisaniye cinsinden
  result?: TestCaseResult;
  browser: BrowserType;
  environment: string;
  headless: boolean;
  takeScreenshots: boolean;
  recordVideo: boolean;
  executedBy: string;
  steps: TestStepExecution[];
  logs: string[];
  screenshots: string[];
  video?: string;
  error?: string;
}

// Varsayılan test çalıştırma ayarları
export const defaultTestExecutionSettings: TestExecutionSettings = {
  browser: BrowserType.CHROME,
  environment: 'Testing',
  headless: true,
  takeScreenshots: true,
  recordVideo: false,
  retryOnFailure: false,
  maxRetries: 1
};

// Simülatör için kullanılabilir test case'leri
export const availableTestCases: TestCase[] = [
  {
    id: 'tc-001',
    name: 'Kullanıcı Girişi Testi',
    description: 'Kullanıcının sisteme başarılı bir şekilde giriş yapabildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['login', 'authentication', 'security'],
    createdBy: 'Hakan Gül',
    createdAt: new Date('2023-01-15T10:30:00'),
    updatedAt: new Date('2023-06-10T14:45:00'),
    lastRun: new Date('2023-06-18T09:15:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Chrome',
    environment: 'Production',
    estimatedDuration: 60, // 1 dakika
    actualDuration: 45, // 45 saniye
    steps: [
      {
        id: 'step-001',
        order: 1,
        description: 'Tarayıcıyı aç ve login sayfasına git',
        expectedResult: 'Login sayfası görüntülenir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-002',
        order: 2,
        description: 'Kullanıcı adı alanına geçerli bir kullanıcı adı gir',
        expectedResult: 'Kullanıcı adı alanı doldurulur',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-003',
        order: 3,
        description: 'Şifre alanına geçerli bir şifre gir',
        expectedResult: 'Şifre alanı doldurulur',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-004',
        order: 4,
        description: 'Giriş butonuna tıkla',
        expectedResult: 'Sistem kullanıcıyı doğrular ve ana sayfaya yönlendirir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-005',
        order: 5,
        description: 'Ana sayfada kullanıcı bilgilerinin görüntülendiğini doğrula',
        expectedResult: 'Kullanıcı bilgileri doğru şekilde görüntülenir',
        status: TestStepStatus.PASSED
      }
    ],
    prerequisites: ['Geçerli kullanıcı hesabı'],
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-002',
    name: 'Ürün Arama Testi',
    description: 'Kullanıcının ürün arama özelliğini kullanabildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.MEDIUM,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['search', 'product', 'ui'],
    createdBy: 'Hakan Gül',
    createdAt: new Date('2023-02-20T11:15:00'),
    updatedAt: new Date('2023-06-15T09:30:00'),
    lastRun: new Date('2023-06-20T14:20:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Firefox',
    environment: 'Staging',
    estimatedDuration: 90, // 1.5 dakika
    actualDuration: 85, // 85 saniye
    steps: [
      {
        id: 'step-001',
        order: 1,
        description: 'Ana sayfaya git',
        expectedResult: 'Ana sayfa görüntülenir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-002',
        order: 2,
        description: 'Arama kutusuna "telefon" yaz',
        expectedResult: 'Arama kutusu "telefon" metni ile doldurulur',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-003',
        order: 3,
        description: 'Ara butonuna tıkla',
        expectedResult: 'Arama sonuçları sayfası görüntülenir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-004',
        order: 4,
        description: 'Arama sonuçlarının "telefon" ile ilgili olduğunu doğrula',
        expectedResult: 'Sonuçlar "telefon" ile ilgilidir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-005',
        order: 5,
        description: 'Filtreleme seçeneklerinin çalıştığını doğrula',
        expectedResult: 'Filtreleme seçenekleri doğru çalışır',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-006',
        order: 6,
        description: 'Sıralama seçeneklerinin çalıştığını doğrula',
        expectedResult: 'Sıralama seçenekleri doğru çalışır',
        status: TestStepStatus.PASSED
      }
    ],
    prerequisites: ['Ürün veritabanı dolu olmalı'],
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-003',
    name: 'Ödeme İşlemi Testi',
    description: 'Kullanıcının ödeme işlemini başarıyla tamamlayabildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.CRITICAL,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['payment', 'checkout', 'e2e'],
    createdBy: 'Mehmet Demir',
    createdAt: new Date('2023-03-10T09:45:00'),
    updatedAt: new Date('2023-06-18T16:20:00'),
    lastRun: new Date('2023-06-22T11:30:00'),
    lastResult: TestCaseResult.FAILED,
    browser: 'Chrome',
    environment: 'Testing',
    estimatedDuration: 120, // 2 dakika
    actualDuration: 135, // 135 saniye
    steps: [
      {
        id: 'step-001',
        order: 1,
        description: 'Sepete ürün ekle',
        expectedResult: 'Ürün sepete eklenir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-002',
        order: 2,
        description: 'Sepet sayfasına git',
        expectedResult: 'Sepet sayfası görüntülenir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-003',
        order: 3,
        description: 'Ödeme adımına ilerle',
        expectedResult: 'Ödeme sayfası görüntülenir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-004',
        order: 4,
        description: 'Teslimat adresini gir',
        expectedResult: 'Teslimat adresi kaydedilir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-005',
        order: 5,
        description: 'Ödeme yöntemini seç',
        expectedResult: 'Ödeme yöntemi seçilir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-006',
        order: 6,
        description: 'Kredi kartı bilgilerini gir',
        expectedResult: 'Kredi kartı bilgileri doğrulanır',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-007',
        order: 7,
        description: 'Siparişi tamamla butonuna tıkla',
        expectedResult: 'Sipariş onay sayfası görüntülenir',
        status: TestStepStatus.FAILED
      }
    ],
    prerequisites: ['Kullanıcı giriş yapmış olmalı', 'Sepette ürün olmalı'],
    testSuiteId: 'ts-003',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-004',
    name: 'Kullanıcı Kaydı Testi',
    description: 'Yeni kullanıcı kaydı işleminin başarıyla tamamlanabildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['registration', 'user', 'security'],
    createdBy: 'Ayşe Kaya',
    createdAt: new Date('2023-04-05T13:20:00'),
    updatedAt: new Date('2023-06-12T10:15:00'),
    lastRun: new Date('2023-06-25T09:45:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Edge',
    environment: 'Development',
    estimatedDuration: 75, // 1.25 dakika
    actualDuration: 70, // 70 saniye
    steps: [
      {
        id: 'step-001',
        order: 1,
        description: 'Kayıt sayfasına git',
        expectedResult: 'Kayıt sayfası görüntülenir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-002',
        order: 2,
        description: 'Ad ve soyad bilgilerini gir',
        expectedResult: 'Ad ve soyad alanları doldurulur',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-003',
        order: 3,
        description: 'Geçerli bir e-posta adresi gir',
        expectedResult: 'E-posta alanı doldurulur',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-004',
        order: 4,
        description: 'Güçlü bir şifre gir',
        expectedResult: 'Şifre alanı doldurulur',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-005',
        order: 5,
        description: 'Şifreyi tekrar gir',
        expectedResult: 'Şifre tekrar alanı doldurulur',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-006',
        order: 6,
        description: 'Kullanım şartlarını kabul et',
        expectedResult: 'Kullanım şartları onay kutusu işaretlenir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-007',
        order: 7,
        description: 'Kayıt ol butonuna tıkla',
        expectedResult: 'Kayıt işlemi tamamlanır ve doğrulama e-postası gönderilir',
        status: TestStepStatus.PASSED
      }
    ],
    prerequisites: [],
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-005',
    name: 'API Entegrasyon Testi',
    description: 'Harici API servislerinin doğru şekilde entegre edildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    category: TestCaseCategory.INTEGRATION,
    tags: ['api', 'integration', 'backend'],
    createdBy: 'Hakan Gül',
    createdAt: new Date('2023-05-15T14:30:00'),
    updatedAt: new Date('2023-06-20T11:45:00'),
    lastRun: new Date('2023-06-28T15:20:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'None',
    environment: 'Testing',
    estimatedDuration: 45, // 45 saniye
    actualDuration: 40, // 40 saniye
    steps: [
      {
        id: 'step-001',
        order: 1,
        description: 'Ödeme API\'sine bağlantı kur',
        expectedResult: 'Bağlantı başarılı olur',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-002',
        order: 2,
        description: 'Test ödeme isteği gönder',
        expectedResult: 'İstek başarıyla gönderilir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-003',
        order: 3,
        description: 'Yanıtın doğruluğunu kontrol et',
        expectedResult: 'Yanıt beklenen formatta ve doğru verilerle gelir',
        status: TestStepStatus.PASSED
      },
      {
        id: 'step-004',
        order: 4,
        description: 'Hata durumlarını test et',
        expectedResult: 'Hata durumları doğru şekilde işlenir',
        status: TestStepStatus.PASSED
      }
    ],
    prerequisites: ['API anahtarları yapılandırılmış olmalı'],
    testSuiteId: 'ts-004',
    projectId: 'proj-001',
    automated: true
  }
];

// Örnek test çalıştırma logları
export const sampleTestLogs: string[] = [
  '[INFO] Test başlatılıyor...',
  '[INFO] Tarayıcı başlatılıyor: Chrome',
  '[INFO] Tarayıcı başlatıldı',
  '[INFO] URL açılıyor: https://example.com/login',
  '[INFO] Sayfa yüklendi',
  '[INFO] Element bulunuyor: #username',
  '[INFO] Element bulundu ve tıklandı',
  '[INFO] Metin giriliyor: testuser@example.com',
  '[INFO] Element bulunuyor: #password',
  '[INFO] Element bulundu ve tıklandı',
  '[INFO] Metin giriliyor: ********',
  '[INFO] Element bulunuyor: #login-button',
  '[INFO] Element bulundu ve tıklandı',
  '[INFO] Sayfa yükleniyor...',
  '[INFO] Sayfa yüklendi: https://example.com/dashboard',
  '[INFO] Doğrulama yapılıyor: Kullanıcı girişi başarılı mı?',
  '[INFO] Element bulunuyor: .user-profile',
  '[INFO] Element bulundu',
  '[INFO] Doğrulama başarılı: Kullanıcı başarıyla giriş yaptı',
  '[INFO] Test adımı tamamlandı: 1/5',
  '[INFO] Test adımı tamamlandı: 2/5',
  '[INFO] Test adımı tamamlandı: 3/5',
  '[INFO] Test adımı tamamlandı: 4/5',
  '[INFO] Test adımı tamamlandı: 5/5',
  '[INFO] Test tamamlandı: BAŞARILI'
];

// Örnek hata logları
export const sampleErrorLogs: string[] = [
  '[INFO] Test başlatılıyor...',
  '[INFO] Tarayıcı başlatılıyor: Chrome',
  '[INFO] Tarayıcı başlatıldı',
  '[INFO] URL açılıyor: https://example.com/login',
  '[INFO] Sayfa yüklendi',
  '[INFO] Element bulunuyor: #username',
  '[INFO] Element bulundu ve tıklandı',
  '[INFO] Metin giriliyor: testuser@example.com',
  '[INFO] Element bulunuyor: #password',
  '[INFO] Element bulundu ve tıklandı',
  '[INFO] Metin giriliyor: ********',
  '[INFO] Element bulunuyor: #login-button',
  '[INFO] Element bulundu ve tıklandı',
  '[INFO] Sayfa yükleniyor...',
  '[ERROR] Zaman aşımı: Sayfa 30 saniye içinde yüklenemedi',
  '[ERROR] Element bulunamadı: .user-profile',
  '[ERROR] Doğrulama başarısız: Kullanıcı girişi başarısız',
  '[INFO] Test adımı tamamlandı: 1/5',
  '[INFO] Test adımı tamamlandı: 2/5',
  '[INFO] Test adımı tamamlandı: 3/5',
  '[ERROR] Test adımı başarısız: 4/5',
  '[INFO] Test durduruldu',
  '[INFO] Test tamamlandı: BAŞARISIZ'
];

// Örnek ekran görüntüleri
export const sampleScreenshots: string[] = [
  'login-page.png',
  'username-input.png',
  'password-input.png',
  'dashboard.png',
  'user-profile.png'
];
