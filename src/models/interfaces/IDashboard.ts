import { TestRunStatus } from "../enums/TestEnums";
import { TestCaseResult, TestCaseCategory, TestCasePriority } from "./ITestCase";

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