import { ReportType, ReportFormat } from '../enums/TestEnums';

export interface ITestReport {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  format: ReportFormat;
  testRunId?: string;
  testSuiteId?: string;
  testPlanId?: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    blocked: number;
    passRate: number;
  };
  metrics: {
    averageExecutionTime: number;
    totalExecutionTime: number;
    flakiness?: number;
    coverage?: number;
  };
  charts?: any[]; // Grafikler için veri
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  url?: string; // Rapor dosyasının URL'si
}
