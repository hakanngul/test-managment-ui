import { TestCaseResult, TestCaseCategory, TestCasePriority } from '../models/interfaces/ITestCase';
import { TestRunStatus } from './testRunsMock';

// Test durumu özeti
export interface TestStatusSummary {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  notRun: number;
  passRate: number; // Yüzde olarak
}

// Test çalıştırma özeti
export interface TestRunSummary {
  totalRuns: number;
  activeRuns: number;
  queuedRuns: number;
  completedRuns: number;
  failedRuns: number;
  passRate: number; // Yüzde olarak
  averageDuration: number; // Milisaniye cinsinden
}

// Otomasyon kapsama oranı
export interface AutomationCoverage {
  totalTestCases: number;
  automatedTestCases: number;
  coverageRate: number; // Yüzde olarak
  lastUpdated: Date;
}

// Son çalıştırma bilgisi
export interface LastRunInfo {
  date: Date;
  passRate: number; // Yüzde olarak
  totalRuns: number;
  duration: number; // Milisaniye cinsinden
}

// Test durumu dağılımı
export interface TestStatusDistribution {
  status: TestCaseResult;
  count: number;
  percentage: number;
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

// Test kategorisi dağılımı
export interface TestCategoryDistribution {
  category: TestCaseCategory;
  count: number;
  percentage: number;
}

// Son çalıştırılan test
export interface RecentTestRun {
  id: string;
  testCaseId: string;
  testCaseName: string;
  status: TestRunStatus;
  result?: TestCaseResult; // Opsiyonel olarak işaretlendi
  startTime: Date;
  endTime?: Date; // Opsiyonel olarak işaretlendi
  duration: number; // Milisaniye cinsinden
  executedBy: string;
}

// Başarısız test
export interface FailedTest {
  id: string;
  name: string;
  lastRun: Date;
  failureCount: number;
  category: TestCaseCategory;
  priority: TestCasePriority;
  errorMessage: string;
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

// En yavaş testler
export interface SlowestTest {
  id: string;
  name: string;
  averageDuration: number; // Milisaniye cinsinden
  lastRun: Date;
  category: TestCaseCategory;
}

// Aktivite
export interface Activity {
  id: string;
  type: 'test_created' | 'test_updated' | 'test_run' | 'user_login';
  description: string;
  user: string;
  timestamp: Date;
  relatedId?: string;
}

// Tüm dashboard verileri
export interface DashboardData {
  testStatusSummary: TestStatusSummary;
  testRunSummary: TestRunSummary;
  automationCoverage: AutomationCoverage;
  lastRunInfo: LastRunInfo;
  testStatusDistribution: TestStatusDistribution[];
  testResultsOverTime: TestResultsOverTime[];
  testCategoryDistribution: TestCategoryDistribution[];
  recentTestRuns: RecentTestRun[];
  failedTests: FailedTest[];
  browserDistribution: BrowserDistribution[];
  environmentDistribution: EnvironmentDistribution[];
  slowestTests: SlowestTest[];
  recentActivities: Activity[];
}

// Mock dashboard verileri
export const mockDashboardData: DashboardData = {
  // Test durumu özeti
  testStatusSummary: {
    total: 150,
    passed: 105,
    failed: 25,
    blocked: 10,
    skipped: 5,
    notRun: 5,
    passRate: 70 // %70
  },

  // Test çalıştırma özeti
  testRunSummary: {
    totalRuns: 500,
    activeRuns: 3,
    queuedRuns: 5,
    completedRuns: 480,
    failedRuns: 12,
    passRate: 85, // %85
    averageDuration: 45000 // 45 saniye
  },

  // Otomasyon kapsama oranı
  automationCoverage: {
    totalTestCases: 150,
    automatedTestCases: 120,
    coverageRate: 80, // %80
    lastUpdated: new Date('2023-06-15T10:30:00')
  },

  // Son çalıştırma bilgisi
  lastRunInfo: {
    date: new Date('2023-06-18T14:45:00'),
    passRate: 88, // %88
    totalRuns: 25,
    duration: 1800000 // 30 dakika
  },

  // Test durumu dağılımı
  testStatusDistribution: [
    { status: TestCaseResult.PASSED, count: 105, percentage: 70 },
    { status: TestCaseResult.FAILED, count: 25, percentage: 16.7 },
    { status: TestCaseResult.BLOCKED, count: 10, percentage: 6.7 },
    { status: TestCaseResult.SKIPPED, count: 5, percentage: 3.3 },
    { status: TestCaseResult.NOT_RUN, count: 5, percentage: 3.3 }
  ],

  // Zaman içinde test sonuçları (son 7 gün)
  testResultsOverTime: [
    { date: '2023-06-12', passed: 20, failed: 5, blocked: 2, skipped: 1, total: 28 },
    { date: '2023-06-13', passed: 18, failed: 4, blocked: 1, skipped: 0, total: 23 },
    { date: '2023-06-14', passed: 22, failed: 3, blocked: 2, skipped: 1, total: 28 },
    { date: '2023-06-15', passed: 25, failed: 2, blocked: 1, skipped: 0, total: 28 },
    { date: '2023-06-16', passed: 19, failed: 6, blocked: 3, skipped: 2, total: 30 },
    { date: '2023-06-17', passed: 21, failed: 4, blocked: 1, skipped: 1, total: 27 },
    { date: '2023-06-18', passed: 23, failed: 3, blocked: 0, skipped: 0, total: 26 }
  ],

  // Test kategorisi dağılımı
  testCategoryDistribution: [
    { category: TestCaseCategory.FUNCTIONAL, count: 70, percentage: 46.7 },
    { category: TestCaseCategory.REGRESSION, count: 25, percentage: 16.7 },
    { category: TestCaseCategory.INTEGRATION, count: 20, percentage: 13.3 },
    { category: TestCaseCategory.PERFORMANCE, count: 15, percentage: 10 },
    { category: TestCaseCategory.SECURITY, count: 10, percentage: 6.7 },
    { category: TestCaseCategory.USABILITY, count: 5, percentage: 3.3 },
    { category: TestCaseCategory.ACCEPTANCE, count: 3, percentage: 2 },
    { category: TestCaseCategory.SMOKE, count: 2, percentage: 1.3 }
  ],

  // Son çalıştırılan testler
  recentTestRuns: [
    {
      id: 'run-101',
      testCaseId: 'tc-001',
      testCaseName: 'Kullanıcı Girişi Testi',
      status: TestRunStatus.COMPLETED,
      result: TestCaseResult.PASSED,
      startTime: new Date('2023-06-18T14:30:00'),
      endTime: new Date('2023-06-18T14:31:30'),
      duration: 90000, // 1.5 dakika
      executedBy: 'Hakan Gül'
    },
    {
      id: 'run-102',
      testCaseId: 'tc-005',
      testCaseName: 'Ürün Arama Testi',
      status: TestRunStatus.COMPLETED,
      result: TestCaseResult.FAILED,
      startTime: new Date('2023-06-18T14:15:00'),
      endTime: new Date('2023-06-18T14:17:45'),
      duration: 165000, // 2.75 dakika
      executedBy: 'Ahmet Yılmaz'
    },
    {
      id: 'run-103',
      testCaseId: 'tc-008',
      testCaseName: 'Ödeme İşlemi Testi',
      status: TestRunStatus.COMPLETED,
      result: TestCaseResult.PASSED,
      startTime: new Date('2023-06-18T14:00:00'),
      endTime: new Date('2023-06-18T14:04:30'),
      duration: 270000, // 4.5 dakika
      executedBy: 'Mehmet Demir'
    },
    {
      id: 'run-104',
      testCaseId: 'tc-012',
      testCaseName: 'Kullanıcı Profili Güncelleme Testi',
      status: TestRunStatus.COMPLETED,
      result: TestCaseResult.PASSED,
      startTime: new Date('2023-06-18T13:45:00'),
      endTime: new Date('2023-06-18T13:48:15'),
      duration: 195000, // 3.25 dakika
      executedBy: 'Ayşe Kaya'
    },
    {
      id: 'run-105',
      testCaseId: 'tc-003',
      testCaseName: 'Sepete Ürün Ekleme Testi',
      status: TestRunStatus.COMPLETED,
      result: TestCaseResult.PASSED,
      startTime: new Date('2023-06-18T13:30:00'),
      endTime: new Date('2023-06-18T13:32:45'),
      duration: 165000, // 2.75 dakika
      executedBy: 'Hakan Gül'
    }
  ],

  // Başarısız testler
  failedTests: [
    {
      id: 'tc-005',
      name: 'Ürün Arama Testi',
      lastRun: new Date('2023-06-18T14:17:45'),
      failureCount: 3,
      category: TestCaseCategory.FUNCTIONAL,
      priority: TestCasePriority.MEDIUM,
      errorMessage: 'Arama sonuçları beklenen ürünleri içermiyor.'
    },
    {
      id: 'tc-008',
      name: 'Kullanıcı Kaydı Testi',
      lastRun: new Date('2023-06-17T11:30:15'),
      failureCount: 2,
      category: TestCaseCategory.FUNCTIONAL,
      priority: TestCasePriority.HIGH,
      errorMessage: 'E-posta doğrulama bağlantısı gönderilemiyor.'
    },
    {
      id: 'tc-014',
      name: 'Güvenlik Testi - XSS Koruması',
      lastRun: new Date('2023-06-16T15:45:30'),
      failureCount: 1,
      category: TestCaseCategory.SECURITY,
      priority: TestCasePriority.CRITICAL,
      errorMessage: 'Yorum alanında XSS açığı tespit edildi.'
    }
  ],

  // Tarayıcı dağılımı
  browserDistribution: [
    { browser: 'Chrome', count: 250, percentage: 50 },
    { browser: 'Firefox', count: 100, percentage: 20 },
    { browser: 'Safari', count: 75, percentage: 15 },
    { browser: 'Edge', count: 50, percentage: 10 },
    { browser: 'IE', count: 25, percentage: 5 }
  ],

  // Ortam dağılımı
  environmentDistribution: [
    { environment: 'Production', count: 200, percentage: 40 },
    { environment: 'Staging', count: 150, percentage: 30 },
    { environment: 'Development', count: 100, percentage: 20 },
    { environment: 'Testing', count: 50, percentage: 10 }
  ],

  // En yavaş testler
  slowestTests: [
    {
      id: 'tc-012',
      name: 'Mobil Uyumluluk Testi',
      averageDuration: 240000, // 4 dakika
      lastRun: new Date('2023-06-18T13:48:15'),
      category: TestCaseCategory.USABILITY
    },
    {
      id: 'tc-004',
      name: 'Ödeme İşlemi Testi',
      averageDuration: 180000, // 3 dakika
      lastRun: new Date('2023-06-18T14:04:30'),
      category: TestCaseCategory.INTEGRATION
    },
    {
      id: 'tc-015',
      name: 'Çoklu Dil Desteği Testi',
      averageDuration: 175000, // 2.92 dakika
      lastRun: new Date('2023-06-15T10:15:45'),
      category: TestCaseCategory.FUNCTIONAL
    }
  ],



  // Son aktiviteler
  recentActivities: [
    {
      id: 'act-001',
      type: 'test_run',
      description: 'Kullanıcı Girişi Testi başarıyla çalıştırıldı',
      user: 'Hakan Gül',
      timestamp: new Date('2023-06-18T14:31:30'),
      relatedId: 'tc-001'
    },
    {
      id: 'act-002',
      type: 'test_run',
      description: 'Ürün Arama Testi başarısız oldu',
      user: 'Ahmet Yılmaz',
      timestamp: new Date('2023-06-18T14:17:45'),
      relatedId: 'tc-005'
    },
    {
      id: 'act-003',
      type: 'test_updated',
      description: 'Sepete Ürün Ekleme Testi güncellendi',
      user: 'Mehmet Demir',
      timestamp: new Date('2023-06-18T13:15:00'),
      relatedId: 'tc-003'
    },
    {
      id: 'act-004',
      type: 'test_created',
      description: 'Yeni test oluşturuldu: API Entegrasyon Testi - Stok Kontrolü',
      user: 'Ayşe Kaya',
      timestamp: new Date('2023-06-18T11:45:00'),
      relatedId: 'tc-016'
    },
    {
      id: 'act-005',
      type: 'user_login',
      description: 'Kullanıcı sisteme giriş yaptı',
      user: 'Hakan Gül',
      timestamp: new Date('2023-06-18T09:30:00')
    }
  ]
};
