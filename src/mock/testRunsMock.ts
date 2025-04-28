import { TestCaseResult } from '../models/interfaces/ITestCase';

// Test çalıştırma durumu
export enum TestRunStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  ERROR = 'error'
}

// Test çalıştırma arayüzü
export interface TestRun {
  id: string;
  testCaseId: string;
  testCaseName: string;
  status: TestRunStatus;
  result?: TestCaseResult;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milisaniye cinsinden
  browser: string;
  environment: string;
  executedBy: string;
  errorMessage?: string;
  progress?: number; // 0-100 arası
  priority: string;
  tags?: string[];
}

// Aktif çalışan testler için mock veri
export const mockActiveTestRuns: TestRun[] = [
  {
    id: 'run-101',
    testCaseId: 'tc-001',
    testCaseName: 'Kullanıcı Girişi Testi',
    status: TestRunStatus.RUNNING,
    startTime: new Date(Date.now() - 120000), // 2 dakika önce başladı
    browser: 'Chrome',
    environment: 'Testing',
    executedBy: 'Hakan Gül',
    progress: 65,
    priority: 'Yüksek',
    tags: ['login', 'smoke-test']
  },
  {
    id: 'run-102',
    testCaseId: 'tc-005',
    testCaseName: 'Ürün Arama Testi',
    status: TestRunStatus.RUNNING,
    startTime: new Date(Date.now() - 300000), // 5 dakika önce başladı
    browser: 'Firefox',
    environment: 'Staging',
    executedBy: 'Ahmet Yılmaz',
    progress: 80,
    priority: 'Orta',
    tags: ['search', 'regression']
  },
  {
    id: 'run-103',
    testCaseId: 'tc-008',
    testCaseName: 'Ödeme İşlemi Testi',
    status: TestRunStatus.RUNNING,
    startTime: new Date(Date.now() - 60000), // 1 dakika önce başladı
    browser: 'Chrome',
    environment: 'Production',
    executedBy: 'Mehmet Demir',
    progress: 25,
    priority: 'Kritik',
    tags: ['payment', 'e2e']
  },
  {
    id: 'run-104',
    testCaseId: 'tc-012',
    testCaseName: 'Kullanıcı Profili Güncelleme Testi',
    status: TestRunStatus.QUEUED,
    browser: 'Edge',
    environment: 'Development',
    executedBy: 'Ayşe Kaya',
    priority: 'Düşük',
    tags: ['profile', 'regression']
  }
];

// Son çalışan testler için mock veri
export const mockRecentTestRuns: TestRun[] = [
  {
    id: 'run-095',
    testCaseId: 'tc-003',
    testCaseName: 'Şifre Sıfırlama Testi',
    status: TestRunStatus.COMPLETED,
    result: TestCaseResult.PASSED,
    startTime: new Date(Date.now() - 3600000), // 1 saat önce
    endTime: new Date(Date.now() - 3540000), // 59 dakika önce
    duration: 60000, // 1 dakika
    browser: 'Chrome',
    environment: 'Production',
    executedBy: 'Hakan Gül',
    priority: 'Yüksek',
    tags: ['password', 'security']
  },
  {
    id: 'run-096',
    testCaseId: 'tc-007',
    testCaseName: 'Sepete Ürün Ekleme Testi',
    status: TestRunStatus.COMPLETED,
    result: TestCaseResult.PASSED,
    startTime: new Date(Date.now() - 7200000), // 2 saat önce
    endTime: new Date(Date.now() - 7140000), // 1 saat 59 dakika önce
    duration: 60000, // 1 dakika
    browser: 'Firefox',
    environment: 'Staging',
    executedBy: 'Ahmet Yılmaz',
    priority: 'Orta',
    tags: ['cart', 'e2e']
  },
  {
    id: 'run-097',
    testCaseId: 'tc-002',
    testCaseName: 'Kullanıcı Kaydı Testi',
    status: TestRunStatus.FAILED,
    result: TestCaseResult.FAILED,
    startTime: new Date(Date.now() - 10800000), // 3 saat önce
    endTime: new Date(Date.now() - 10770000), // 2 saat 59.5 dakika önce
    duration: 30000, // 30 saniye
    browser: 'Chrome',
    environment: 'Testing',
    executedBy: 'Mehmet Demir',
    errorMessage: 'Element bulunamadı: #register-button',
    priority: 'Yüksek',
    tags: ['registration', 'smoke-test']
  },
  {
    id: 'run-098',
    testCaseId: 'tc-010',
    testCaseName: 'Sipariş Takibi Testi',
    status: TestRunStatus.COMPLETED,
    result: TestCaseResult.PASSED,
    startTime: new Date(Date.now() - 14400000), // 4 saat önce
    endTime: new Date(Date.now() - 14340000), // 3 saat 59 dakika önce
    duration: 60000, // 1 dakika
    browser: 'Safari',
    environment: 'Production',
    executedBy: 'Ayşe Kaya',
    priority: 'Orta',
    tags: ['order', 'tracking']
  },
  {
    id: 'run-099',
    testCaseId: 'tc-004',
    testCaseName: 'Ürün Detayı Testi',
    status: TestRunStatus.ERROR,
    result: TestCaseResult.FAILED,
    startTime: new Date(Date.now() - 18000000), // 5 saat önce
    endTime: new Date(Date.now() - 17970000), // 4 saat 59.5 dakika önce
    duration: 30000, // 30 saniye
    browser: 'Edge',
    environment: 'Development',
    executedBy: 'Hakan Gül',
    errorMessage: 'Tarayıcı başlatılamadı',
    priority: 'Düşük',
    tags: ['product', 'details']
  },
  {
    id: 'run-100',
    testCaseId: 'tc-006',
    testCaseName: 'Filtreleme Testi',
    status: TestRunStatus.CANCELLED,
    startTime: new Date(Date.now() - 21600000), // 6 saat önce
    endTime: new Date(Date.now() - 21570000), // 5 saat 59.5 dakika önce
    duration: 30000, // 30 saniye
    browser: 'Chrome',
    environment: 'Testing',
    executedBy: 'Ahmet Yılmaz',
    priority: 'Düşük',
    tags: ['filter', 'search']
  }
];

// Test çalıştırma özet bilgileri
export interface TestRunsSummary {
  totalRuns: number;
  activeRuns: number;
  queuedRuns: number;
  completedRuns: number;
  failedRuns: number;
  passRate: number; // Yüzde olarak
  averageDuration: number; // Milisaniye cinsinden
  lastDayRuns: number;
  lastWeekRuns: number;
}

// Test çalıştırma özet bilgileri için mock veri
export const mockTestRunsSummary: TestRunsSummary = {
  totalRuns: 100,
  activeRuns: 3,
  queuedRuns: 1,
  completedRuns: 85,
  failedRuns: 12,
  passRate: 85, // %85 başarı oranı
  averageDuration: 45000, // 45 saniye
  lastDayRuns: 24,
  lastWeekRuns: 78
};
