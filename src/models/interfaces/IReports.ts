import { TestCaseCategory, TestCasePriority, TestCaseStatus } from "./ITestCase";

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