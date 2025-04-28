import { 
  TestCase, 
  TestCaseStatus, 
  TestCasePriority, 
  TestCaseCategory, 
  TestCaseResult,
  TestStep,
  TestStepStatus
} from '../models/interfaces/ITestCase';

// Test adımları için mock veri
const createMockSteps = (count: number): TestStep[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `step-${i + 1}`,
    order: i + 1,
    description: `Test adımı ${i + 1}`,
    expectedResult: `Beklenen sonuç ${i + 1}`,
    status: i % 5 === 0 ? TestStepStatus.FAILED : TestStepStatus.PASSED,
    screenshot: i % 3 === 0 ? `screenshot-${i + 1}.png` : undefined,
    duration: Math.floor(Math.random() * 5000) + 500 // 500ms - 5500ms arası
  }));
};

// Test case'ler için mock veri
export const mockTestCases: TestCase[] = [
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
    steps: createMockSteps(5),
    prerequisites: ['Geçerli kullanıcı hesabı'],
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-002',
    name: 'Ürün Arama Testi',
    description: 'Kullanıcının ürün arama özelliğini kullanarak ürünleri bulabildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.MEDIUM,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['search', 'product', 'ui'],
    createdBy: 'Ahmet Yılmaz',
    createdAt: new Date('2023-02-05T11:20:00'),
    updatedAt: new Date('2023-05-20T16:30:00'),
    lastRun: new Date('2023-06-17T10:45:00'),
    lastResult: TestCaseResult.FAILED,
    browser: 'Firefox',
    environment: 'Staging',
    estimatedDuration: 90, // 1.5 dakika
    actualDuration: 105, // 1 dakika 45 saniye
    steps: createMockSteps(7),
    prerequisites: ['Sistemde kayıtlı ürünler'],
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-003',
    name: 'Sepete Ürün Ekleme Testi',
    description: 'Kullanıcının ürünleri sepete ekleyebildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['cart', 'product', 'ui'],
    createdBy: 'Mehmet Demir',
    createdAt: new Date('2023-02-10T09:15:00'),
    updatedAt: new Date('2023-06-05T13:20:00'),
    lastRun: new Date('2023-06-16T14:30:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Chrome',
    environment: 'Production',
    estimatedDuration: 120, // 2 dakika
    actualDuration: 95, // 1 dakika 35 saniye
    steps: createMockSteps(6),
    prerequisites: ['Kullanıcı girişi yapılmış olmalı', 'Sistemde kayıtlı ürünler'],
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-004',
    name: 'Ödeme İşlemi Testi',
    description: 'Kullanıcının ödeme işlemini başarıyla tamamlayabildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.CRITICAL,
    category: TestCaseCategory.INTEGRATION,
    tags: ['payment', 'checkout', 'integration'],
    createdBy: 'Ayşe Kaya',
    createdAt: new Date('2023-03-01T14:45:00'),
    updatedAt: new Date('2023-06-12T11:10:00'),
    lastRun: new Date('2023-06-15T16:20:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Chrome',
    environment: 'Production',
    estimatedDuration: 180, // 3 dakika
    actualDuration: 165, // 2 dakika 45 saniye
    steps: createMockSteps(12),
    prerequisites: ['Kullanıcı girişi yapılmış olmalı', 'Sepette ürün bulunmalı', 'Geçerli ödeme bilgileri'],
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-005',
    name: 'Kullanıcı Profil Güncelleme Testi',
    description: 'Kullanıcının profil bilgilerini güncelleyebildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.MEDIUM,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['profile', 'user', 'ui'],
    createdBy: 'Hakan Gül',
    createdAt: new Date('2023-03-10T10:30:00'),
    updatedAt: new Date('2023-05-25T09:45:00'),
    lastRun: new Date('2023-06-14T11:30:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Edge',
    environment: 'Staging',
    estimatedDuration: 150, // 2.5 dakika
    actualDuration: 140, // 2 dakika 20 saniye
    steps: createMockSteps(8),
    prerequisites: ['Kullanıcı girişi yapılmış olmalı'],
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-006',
    name: 'Şifre Sıfırlama Testi',
    description: 'Kullanıcının şifresini sıfırlayabildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['password', 'reset', 'security'],
    createdBy: 'Fatma Şahin',
    createdAt: new Date('2023-03-15T16:20:00'),
    updatedAt: new Date('2023-06-08T15:30:00'),
    lastRun: new Date('2023-06-13T10:15:00'),
    lastResult: TestCaseResult.BLOCKED,
    browser: 'Chrome',
    environment: 'Development',
    estimatedDuration: 120, // 2 dakika
    actualDuration: 0, // Blocked olduğu için süre yok
    steps: createMockSteps(9),
    prerequisites: ['Geçerli e-posta adresi'],
    testSuiteId: 'ts-003',
    projectId: 'proj-001',
    automated: false
  },
  {
    id: 'tc-007',
    name: 'Ürün Filtreleme Testi',
    description: 'Kullanıcının ürünleri farklı kriterlere göre filtreleyebildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.MEDIUM,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['filter', 'product', 'ui'],
    createdBy: 'Ali Yıldız',
    createdAt: new Date('2023-03-20T11:45:00'),
    updatedAt: new Date('2023-05-30T14:20:00'),
    lastRun: new Date('2023-06-12T13:45:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Safari',
    environment: 'Production',
    estimatedDuration: 150, // 2.5 dakika
    actualDuration: 135, // 2 dakika 15 saniye
    steps: createMockSteps(10),
    prerequisites: ['Sistemde kayıtlı ürünler'],
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-008',
    name: 'Kullanıcı Kaydı Testi',
    description: 'Yeni kullanıcıların sisteme kayıt olabildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['registration', 'user', 'security'],
    createdBy: 'Zeynep Aydın',
    createdAt: new Date('2023-03-25T09:30:00'),
    updatedAt: new Date('2023-06-02T10:15:00'),
    lastRun: new Date('2023-06-11T15:30:00'),
    lastResult: TestCaseResult.FAILED,
    browser: 'Firefox',
    environment: 'Staging',
    estimatedDuration: 180, // 3 dakika
    actualDuration: 195, // 3 dakika 15 saniye
    steps: createMockSteps(11),
    prerequisites: ['Geçerli e-posta adresi'],
    testSuiteId: 'ts-003',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-009',
    name: 'Sipariş Geçmişi Testi',
    description: 'Kullanıcının sipariş geçmişini görüntüleyebildiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.LOW,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['order', 'history', 'ui'],
    createdBy: 'Hakan Gül',
    createdAt: new Date('2023-04-01T13:20:00'),
    updatedAt: new Date('2023-05-15T11:45:00'),
    lastRun: new Date('2023-06-10T09:30:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Chrome',
    environment: 'Production',
    estimatedDuration: 90, // 1.5 dakika
    actualDuration: 85, // 1 dakika 25 saniye
    steps: createMockSteps(6),
    prerequisites: ['Kullanıcı girişi yapılmış olmalı', 'Kullanıcının geçmiş siparişleri olmalı'],
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-010',
    name: 'Ürün Detay Sayfası Testi',
    description: 'Ürün detay sayfasının doğru bilgileri gösterdiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.MEDIUM,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['product', 'detail', 'ui'],
    createdBy: 'Mustafa Özkan',
    createdAt: new Date('2023-04-05T15:45:00'),
    updatedAt: new Date('2023-06-01T16:30:00'),
    lastRun: new Date('2023-06-09T14:15:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Edge',
    environment: 'Production',
    estimatedDuration: 120, // 2 dakika
    actualDuration: 110, // 1 dakika 50 saniye
    steps: createMockSteps(8),
    prerequisites: ['Sistemde kayıtlı ürünler'],
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-011',
    name: 'Performans Testi - Ana Sayfa Yükleme',
    description: 'Ana sayfanın kabul edilebilir bir sürede yüklendiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    category: TestCaseCategory.PERFORMANCE,
    tags: ['performance', 'loading', 'homepage'],
    createdBy: 'Emre Kaya',
    createdAt: new Date('2023-04-10T10:15:00'),
    updatedAt: new Date('2023-05-28T09:30:00'),
    lastRun: new Date('2023-06-08T11:45:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Chrome',
    environment: 'Production',
    estimatedDuration: 60, // 1 dakika
    actualDuration: 55, // 55 saniye
    steps: createMockSteps(3),
    prerequisites: [],
    testSuiteId: 'ts-004',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-012',
    name: 'Mobil Uyumluluk Testi',
    description: 'Web sitesinin mobil cihazlarda doğru şekilde görüntülendiğini doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    category: TestCaseCategory.USABILITY,
    tags: ['mobile', 'responsive', 'ui'],
    createdBy: 'Selin Demir',
    createdAt: new Date('2023-04-15T14:30:00'),
    updatedAt: new Date('2023-06-03T13:15:00'),
    lastRun: new Date('2023-06-07T16:30:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Chrome Mobile',
    environment: 'Production',
    estimatedDuration: 240, // 4 dakika
    actualDuration: 225, // 3 dakika 45 saniye
    steps: createMockSteps(15),
    prerequisites: [],
    testSuiteId: 'ts-005',
    projectId: 'proj-001',
    automated: false
  },
  {
    id: 'tc-013',
    name: 'API Entegrasyon Testi - Ödeme Geçidi',
    description: 'Ödeme geçidi API entegrasyonunun doğru çalıştığını doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.CRITICAL,
    category: TestCaseCategory.INTEGRATION,
    tags: ['api', 'payment', 'integration'],
    createdBy: 'Hakan Gül',
    createdAt: new Date('2023-04-20T11:30:00'),
    updatedAt: new Date('2023-05-22T10:45:00'),
    lastRun: new Date('2023-06-06T09:15:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'N/A',
    environment: 'Staging',
    estimatedDuration: 90, // 1.5 dakika
    actualDuration: 85, // 1 dakika 25 saniye
    steps: createMockSteps(7),
    prerequisites: ['API anahtarları yapılandırılmış olmalı'],
    testSuiteId: 'ts-006',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-014',
    name: 'Güvenlik Testi - XSS Koruması',
    description: 'Sistemin XSS (Cross-Site Scripting) saldırılarına karşı korumalı olduğunu doğrular.',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.CRITICAL,
    category: TestCaseCategory.SECURITY,
    tags: ['security', 'xss', 'vulnerability'],
    createdBy: 'Burak Yılmaz',
    createdAt: new Date('2023-04-25T16:45:00'),
    updatedAt: new Date('2023-06-04T15:30:00'),
    lastRun: new Date('2023-06-05T13:45:00'),
    lastResult: TestCaseResult.PASSED,
    browser: 'Chrome',
    environment: 'Development',
    estimatedDuration: 150, // 2.5 dakika
    actualDuration: 145, // 2 dakika 25 saniye
    steps: createMockSteps(9),
    prerequisites: [],
    testSuiteId: 'ts-007',
    projectId: 'proj-001',
    automated: true
  },
  {
    id: 'tc-015',
    name: 'Çoklu Dil Desteği Testi',
    description: 'Web sitesinin farklı dillerde doğru şekilde görüntülendiğini doğrular.',
    status: TestCaseStatus.DRAFT,
    priority: TestCasePriority.MEDIUM,
    category: TestCaseCategory.FUNCTIONAL,
    tags: ['localization', 'language', 'ui'],
    createdBy: 'Ayşe Kaya',
    createdAt: new Date('2023-05-01T09:15:00'),
    updatedAt: new Date('2023-05-01T09:15:00'),
    lastRun: undefined,
    lastResult: undefined,
    browser: 'Chrome',
    environment: 'Development',
    estimatedDuration: 300, // 5 dakika
    actualDuration: undefined,
    steps: createMockSteps(20),
    prerequisites: ['Çoklu dil desteği yapılandırılmış olmalı'],
    testSuiteId: 'ts-005',
    projectId: 'proj-001',
    automated: false
  }
];

// Test case'leri filtrelemek için yardımcı fonksiyon
export const filterTestCases = (
  testCases: TestCase[],
  filters: {
    search?: string;
    status?: TestCaseStatus[];
    priority?: TestCasePriority[];
    category?: TestCaseCategory[];
    automated?: boolean;
    tags?: string[];
  }
) => {
  return testCases.filter(testCase => {
    // Arama filtresi
    if (filters.search && !testCase.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !testCase.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Durum filtresi
    if (filters.status && filters.status.length > 0 && !filters.status.includes(testCase.status)) {
      return false;
    }
    
    // Öncelik filtresi
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(testCase.priority)) {
      return false;
    }
    
    // Kategori filtresi
    if (filters.category && filters.category.length > 0 && !filters.category.includes(testCase.category)) {
      return false;
    }
    
    // Otomasyon filtresi
    if (filters.automated !== undefined && testCase.automated !== filters.automated) {
      return false;
    }
    
    // Etiket filtresi
    if (filters.tags && filters.tags.length > 0 && !filters.tags.some(tag => testCase.tags.includes(tag))) {
      return false;
    }
    
    return true;
  });
};
