import { TestCaseResult, TestCaseStatus, TestCasePriority, TestCaseCategory } from '../models/interfaces/ITestCase';

// Test sonuçları dağılımı
export interface TestResultDistribution {
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  notRun: number;
}

// Zaman içinde test sonuçları
export interface TestResultsOverTime {
  date: string;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  total: number;
}

// Test çalıştırma süresi dağılımı
export interface TestDurationDistribution {
  range: string;
  count: number;
}

// Test başarısızlık nedenleri
export interface TestFailureReason {
  reason: string;
  count: number;
  percentage: number;
}

// Test kategorisi dağılımı
export interface TestCategoryDistribution {
  category: TestCaseCategory;
  count: number;
  percentage: number;
}

// Test önceliği dağılımı
export interface TestPriorityDistribution {
  priority: TestCasePriority;
  count: number;
  percentage: number;
}

// Test durumu dağılımı
export interface TestStatusDistribution {
  status: TestCaseStatus;
  count: number;
  percentage: number;
}

// Test otomasyonu kapsamı
export interface TestAutomationCoverage {
  automated: number;
  manual: number;
  total: number;
  coverage: number; // Yüzde olarak
}

// Test çalıştırma özeti
export interface TestExecutionSummary {
  totalRuns: number;
  totalTests: number;
  passRate: number; // Yüzde olarak
  averageDuration: number; // Milisaniye cinsinden
  flakiness: number; // Yüzde olarak (kararsız testlerin oranı)
  lastRun: Date;
  trendsLastWeek: {
    passRate: number[]; // Son 7 günün başarı oranları
    executionCount: number[]; // Son 7 günün çalıştırma sayıları
  };
}

// Tarayıcı dağılımı
export interface BrowserDistribution {
  browser: string;
  count: number;
  percentage: number;
}

// Ortam dağılımı
export interface EnvironmentDistribution {
  environment: string;
  count: number;
  percentage: number;
}

// En çok başarısız olan testler
export interface TopFailingTest {
  id: string;
  name: string;
  failureCount: number;
  lastFailure: Date;
  failureRate: number; // Yüzde olarak
}

// En yavaş testler
export interface SlowestTest {
  id: string;
  name: string;
  averageDuration: number; // Milisaniye cinsinden
  lastDuration: number; // Milisaniye cinsinden
  executions: number;
}

// Tüm raporlama verileri
export interface ReportingData {
  testResultDistribution: TestResultDistribution;
  testResultsOverTime: TestResultsOverTime[];
  testDurationDistribution: TestDurationDistribution[];
  testFailureReasons: TestFailureReason[];
  testCategoryDistribution: TestCategoryDistribution[];
  testPriorityDistribution: TestPriorityDistribution[];
  testStatusDistribution: TestStatusDistribution[];
  testAutomationCoverage: TestAutomationCoverage;
  testExecutionSummary: TestExecutionSummary;
  browserDistribution: BrowserDistribution[];
  environmentDistribution: EnvironmentDistribution[];
  topFailingTests: TopFailingTest[];
  slowestTests: SlowestTest[];
}

// Mock veri
export const mockReportingData: ReportingData = {
  // Test sonuçları dağılımı
  testResultDistribution: {
    passed: 1250,
    failed: 180,
    blocked: 45,
    skipped: 75,
    notRun: 450
  },
  
  // Zaman içinde test sonuçları (son 14 gün)
  testResultsOverTime: [
    { date: '2023-06-01', passed: 85, failed: 12, blocked: 3, skipped: 5, total: 105 },
    { date: '2023-06-02', passed: 92, failed: 8, blocked: 2, skipped: 3, total: 105 },
    { date: '2023-06-03', passed: 88, failed: 10, blocked: 4, skipped: 3, total: 105 },
    { date: '2023-06-04', passed: 90, failed: 9, blocked: 2, skipped: 4, total: 105 },
    { date: '2023-06-05', passed: 95, failed: 5, blocked: 3, skipped: 2, total: 105 },
    { date: '2023-06-06', passed: 91, failed: 7, blocked: 4, skipped: 3, total: 105 },
    { date: '2023-06-07', passed: 87, failed: 11, blocked: 3, skipped: 4, total: 105 },
    { date: '2023-06-08', passed: 93, failed: 6, blocked: 2, skipped: 4, total: 105 },
    { date: '2023-06-09', passed: 89, failed: 9, blocked: 3, skipped: 4, total: 105 },
    { date: '2023-06-10', passed: 92, failed: 8, blocked: 2, skipped: 3, total: 105 },
    { date: '2023-06-11', passed: 94, failed: 6, blocked: 3, skipped: 2, total: 105 },
    { date: '2023-06-12', passed: 90, failed: 10, blocked: 2, skipped: 3, total: 105 },
    { date: '2023-06-13', passed: 88, failed: 12, blocked: 3, skipped: 2, total: 105 },
    { date: '2023-06-14', passed: 91, failed: 9, blocked: 2, skipped: 3, total: 105 }
  ],
  
  // Test çalıştırma süresi dağılımı
  testDurationDistribution: [
    { range: '0-10 sn', count: 450 },
    { range: '10-30 sn', count: 620 },
    { range: '30-60 sn', count: 380 },
    { range: '1-2 dk', count: 210 },
    { range: '2-5 dk', count: 120 },
    { range: '5+ dk', count: 70 }
  ],
  
  // Test başarısızlık nedenleri
  testFailureReasons: [
    { reason: 'Element Bulunamadı', count: 75, percentage: 41.7 },
    { reason: 'Assertion Hatası', count: 45, percentage: 25.0 },
    { reason: 'Zaman Aşımı', count: 30, percentage: 16.7 },
    { reason: 'Ağ Hatası', count: 15, percentage: 8.3 },
    { reason: 'JavaScript Hatası', count: 10, percentage: 5.6 },
    { reason: 'Diğer', count: 5, percentage: 2.7 }
  ],
  
  // Test kategorisi dağılımı
  testCategoryDistribution: [
    { category: TestCaseCategory.FUNCTIONAL, count: 850, percentage: 42.5 },
    { category: TestCaseCategory.REGRESSION, count: 450, percentage: 22.5 },
    { category: TestCaseCategory.INTEGRATION, count: 350, percentage: 17.5 },
    { category: TestCaseCategory.PERFORMANCE, count: 200, percentage: 10.0 },
    { category: TestCaseCategory.SECURITY, count: 150, percentage: 7.5 }
  ],
  
  // Test önceliği dağılımı
  testPriorityDistribution: [
    { priority: TestCasePriority.CRITICAL, count: 300, percentage: 15.0 },
    { priority: TestCasePriority.HIGH, count: 550, percentage: 27.5 },
    { priority: TestCasePriority.MEDIUM, count: 750, percentage: 37.5 },
    { priority: TestCasePriority.LOW, count: 400, percentage: 20.0 }
  ],
  
  // Test durumu dağılımı
  testStatusDistribution: [
    { status: TestCaseStatus.ACTIVE, count: 1200, percentage: 60.0 },
    { status: TestCaseStatus.DRAFT, count: 350, percentage: 17.5 },
    { status: TestCaseStatus.DEPRECATED, count: 250, percentage: 12.5 },
    { status: TestCaseStatus.ARCHIVED, count: 200, percentage: 10.0 }
  ],
  
  // Test otomasyonu kapsamı
  testAutomationCoverage: {
    automated: 1500,
    manual: 500,
    total: 2000,
    coverage: 75.0
  },
  
  // Test çalıştırma özeti
  testExecutionSummary: {
    totalRuns: 3500,
    totalTests: 2000,
    passRate: 85.7,
    averageDuration: 45000, // 45 saniye
    flakiness: 4.2, // %4.2 kararsız test
    lastRun: new Date('2023-06-14T18:30:00'),
    trendsLastWeek: {
      passRate: [84.5, 85.2, 86.1, 85.8, 86.5, 85.9, 85.7],
      executionCount: [320, 310, 350, 330, 340, 325, 315]
    }
  },
  
  // Tarayıcı dağılımı
  browserDistribution: [
    { browser: 'Chrome', count: 1800, percentage: 51.4 },
    { browser: 'Firefox', count: 850, percentage: 24.3 },
    { browser: 'Safari', count: 450, percentage: 12.9 },
    { browser: 'Edge', count: 350, percentage: 10.0 },
    { browser: 'IE', count: 50, percentage: 1.4 }
  ],
  
  // Ortam dağılımı
  environmentDistribution: [
    { environment: 'Production', count: 950, percentage: 27.1 },
    { environment: 'Staging', count: 1200, percentage: 34.3 },
    { environment: 'Testing', count: 850, percentage: 24.3 },
    { environment: 'Development', count: 500, percentage: 14.3 }
  ],
  
  // En çok başarısız olan testler
  topFailingTests: [
    { id: 'tc-045', name: 'Kullanıcı Kaydı Doğrulama', failureCount: 15, lastFailure: new Date('2023-06-14T14:25:00'), failureRate: 30.0 },
    { id: 'tc-078', name: 'Ödeme İşlemi Tamamlama', failureCount: 12, lastFailure: new Date('2023-06-13T10:15:00'), failureRate: 24.0 },
    { id: 'tc-023', name: 'Sepete Ürün Ekleme', failureCount: 10, lastFailure: new Date('2023-06-12T16:45:00'), failureRate: 20.0 },
    { id: 'tc-112', name: 'Sipariş Takibi', failureCount: 8, lastFailure: new Date('2023-06-14T09:30:00'), failureRate: 16.0 },
    { id: 'tc-056', name: 'Şifre Sıfırlama', failureCount: 7, lastFailure: new Date('2023-06-11T11:20:00'), failureRate: 14.0 }
  ],
  
  // En yavaş testler
  slowestTests: [
    { id: 'tc-098', name: 'Tam Sipariş Akışı', averageDuration: 285000, lastDuration: 290000, executions: 25 },
    { id: 'tc-076', name: 'Büyük Veri Yükleme Testi', averageDuration: 240000, lastDuration: 235000, executions: 18 },
    { id: 'tc-112', name: 'Sipariş Takibi', averageDuration: 180000, lastDuration: 175000, executions: 32 },
    { id: 'tc-045', name: 'Kullanıcı Kaydı Doğrulama', averageDuration: 150000, lastDuration: 155000, executions: 42 },
    { id: 'tc-087', name: 'Ürün Filtreleme ve Sıralama', averageDuration: 135000, lastDuration: 140000, executions: 38 }
  ]
};
