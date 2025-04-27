import { ApexOptions } from 'apexcharts';
import { TestResultStatus, TestErrorType, TestErrorCategory, TestPriority, TestSeverity } from '../enums/TestResultEnums';

// Test result summary for reports
export interface TestResultSummary {
  id: string;
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  blocked?: number;
  pending?: number;
  error?: number;
  duration: string;
  durationMs?: number;
  lastRun: Date;
  passRate?: number;
  priority?: TestPriority;
  severity?: TestSeverity;
  tags?: string[];
  categories?: string[];
}

// Test execution trend data
export interface TestExecutionTrendData {
  options: ApexOptions;
  series: any[];
  timeRange?: string;
  interval?: string;
  filters?: Record<string, any>;
}

// Test duration trend data
export interface TestDurationTrendData {
  options: ApexOptions;
  series: any[];
  timeRange?: string;
  interval?: string;
  filters?: Record<string, any>;
}

// Status distribution data
export interface StatusDistributionData {
  options: ApexOptions;
  series: any[];
  filters?: Record<string, any>;
}

// Duration by status data
export interface DurationByStatusData {
  options: ApexOptions;
  series: any[];
  filters?: Record<string, any>;
}

// Error distribution data
export interface ErrorDistributionData {
  options: ApexOptions;
  series: any[];
  byType?: boolean;
  byCategory?: boolean;
  bySeverity?: boolean;
  filters?: Record<string, any>;
}

// Performance metrics data
export interface PerformanceMetricsData {
  options: ApexOptions;
  series: any[];
  metricType?: string;
  timeRange?: string;
  interval?: string;
  filters?: Record<string, any>;
}

// Test coverage data
export interface TestCoverageData {
  options: ApexOptions;
  series: any[];
  coverageType?: string;
  filters?: Record<string, any>;
}

// Test quality metrics
export interface TestQualityMetrics {
  errorDensity: number; // errors per test
  testEffectiveness: number; // percentage of tests finding issues
  testEfficiency: number; // issues found per hour of testing
  qualityScore: number; // overall quality score (0-100)
  flakiness?: number; // percentage of flaky tests
  maintainability?: number; // score for test maintainability
  automationCoverage?: number; // percentage of automated tests
}

// Test report summary
export interface TestReportSummary {
  totalTests: number;
  passRate: number;
  averageDuration: string;
  averageDurationMs?: number;
  failedTests: number;
  blockedTests?: number;
  skippedTests?: number;
  pendingTests?: number;
  errorTests?: number;
  lastUpdated: Date;
  trend: {
    passRate: number;
    change: number;
  };
  qualityMetrics?: TestQualityMetrics;
  topErrors?: {
    type: TestErrorType;
    category: TestErrorCategory;
    count: number;
    message: string;
  }[];
  testsByPriority?: Record<TestPriority, number>;
  testsBySeverity?: Record<TestSeverity, number>;
  testsByCategory?: Record<string, number>;
  testsByTag?: Record<string, number>;
}

// Comparative report data
export interface ComparativeReportData {
  current: TestReportSummary;
  previous: TestReportSummary;
  reference?: TestReportSummary;
  changes: {
    passRate: number;
    totalTests: number;
    failedTests: number;
    averageDuration: number;
    qualityScore?: number;
  };
  improvementAreas?: string[];
  regressionAreas?: string[];
}

// Custom report configuration
export interface CustomReportConfig {
  id: string;
  name: string;
  description?: string;
  charts: {
    type: string;
    title: string;
    dataSource: string;
    filters?: Record<string, any>;
    options?: Record<string, any>;
  }[];
  filters?: Record<string, any>;
  timeRange?: string;
  refreshInterval?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
