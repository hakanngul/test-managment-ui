import { ITestReport } from './interfaces/ITestReport';
import { ReportType, ReportFormat } from './enums/TestEnums';

export class TestReport implements ITestReport {
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
  charts?: any[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  url?: string;

  constructor(data: Partial<ITestReport>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || ReportType.SUMMARY;
    this.format = data.format || ReportFormat.HTML;
    this.testRunId = data.testRunId;
    this.testSuiteId = data.testSuiteId;
    this.testPlanId = data.testPlanId;
    this.dateRange = data.dateRange || {
      startDate: new Date(),
      endDate: new Date()
    };
    this.summary = data.summary || {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      blocked: 0,
      passRate: 0
    };
    this.metrics = data.metrics || {
      averageExecutionTime: 0,
      totalExecutionTime: 0
    };
    this.charts = data.charts || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.url = data.url;
  }

  // Özet bilgilerini güncelle
  updateSummary(summary: Partial<TestReport['summary']>): void {
    this.summary = { ...this.summary, ...summary };
    this.updatedAt = new Date();
  }

  // Metrikleri güncelle
  updateMetrics(metrics: Partial<TestReport['metrics']>): void {
    this.metrics = { ...this.metrics, ...metrics };
    this.updatedAt = new Date();
  }

  // Grafik ekle
  addChart(chart: any): void {
    if (!this.charts) {
      this.charts = [];
    }
    this.charts.push(chart);
    this.updatedAt = new Date();
  }

  // Rapor URL'sini güncelle
  setUrl(url: string): void {
    this.url = url;
    this.updatedAt = new Date();
  }

  // Başarı oranını hesapla
  calculatePassRate(): void {
    if (this.summary.totalTests > 0) {
      this.summary.passRate = (this.summary.passed / this.summary.totalTests) * 100;
    } else {
      this.summary.passRate = 0;
    }
    this.updatedAt = new Date();
  }

  // Rapor formatını değiştir
  changeFormat(format: ReportFormat): void {
    this.format = format;
    this.updatedAt = new Date();
  }

  // Test raporunu JSON formatına dönüştür
  toJSON(): ITestReport {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      format: this.format,
      testRunId: this.testRunId,
      testSuiteId: this.testSuiteId,
      testPlanId: this.testPlanId,
      dateRange: this.dateRange,
      summary: this.summary,
      metrics: this.metrics,
      charts: this.charts,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      url: this.url
    };
  }
}
