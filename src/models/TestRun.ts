import { ITestRun } from './interfaces/ITestRun';
import { TestRunStatus, TriggerType, BrowserType } from './enums/TestEnums';

export class TestRun implements ITestRun {
  id: string;
  name: string;
  description: string;
  testSuiteId?: string;
  testPlanId?: string;
  startTime: Date;
  endTime?: Date;
  status: TestRunStatus;
  triggeredBy: string;
  triggerType: TriggerType;
  environment: string;
  browser: BrowserType;
  parallelCount: number;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
  testResultIds?: string[];

  constructor(data: Partial<ITestRun>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.testSuiteId = data.testSuiteId;
    this.testPlanId = data.testPlanId;
    this.startTime = data.startTime || new Date();
    this.endTime = data.endTime;
    this.status = data.status || TestRunStatus.SCHEDULED;
    this.triggeredBy = data.triggeredBy || '';
    this.triggerType = data.triggerType || TriggerType.MANUAL;
    this.environment = data.environment || '';
    this.browser = data.browser || BrowserType.CHROME;
    this.parallelCount = data.parallelCount || 1;
    this.retryCount = data.retryCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.testResultIds = data.testResultIds || [];
  }

  // Test çalıştırma durumunu güncelle
  updateStatus(status: TestRunStatus): void {
    this.status = status;
    this.updatedAt = new Date();
    
    if (status === TestRunStatus.COMPLETED || 
        status === TestRunStatus.FAILED || 
        status === TestRunStatus.ABORTED || 
        status === TestRunStatus.TIMEOUT || 
        status === TestRunStatus.ERROR || 
        status === TestRunStatus.PARTIAL) {
      this.endTime = new Date();
    }
  }

  // Test sonucu ekle
  addTestResult(testResultId: string): void {
    if (!this.testResultIds) {
      this.testResultIds = [];
    }
    if (!this.testResultIds.includes(testResultId)) {
      this.testResultIds.push(testResultId);
      this.updatedAt = new Date();
    }
  }

  // Test çalıştırmayı başlat
  start(): void {
    this.status = TestRunStatus.RUNNING;
    this.startTime = new Date();
    this.updatedAt = new Date();
  }

  // Test çalıştırmayı tamamla
  complete(): void {
    this.status = TestRunStatus.COMPLETED;
    this.endTime = new Date();
    this.updatedAt = new Date();
  }

  // Test çalıştırmayı başarısız olarak işaretle
  fail(): void {
    this.status = TestRunStatus.FAILED;
    this.endTime = new Date();
    this.updatedAt = new Date();
  }

  // Test çalıştırmayı iptal et
  abort(): void {
    this.status = TestRunStatus.ABORTED;
    this.endTime = new Date();
    this.updatedAt = new Date();
  }

  // Test çalıştırma süresini hesapla (milisaniye cinsinden)
  getDuration(): number {
    if (this.startTime && this.endTime) {
      return this.endTime.getTime() - this.startTime.getTime();
    }
    return 0;
  }

  // Test çalıştırmayı JSON formatına dönüştür
  toJSON(): ITestRun {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      testSuiteId: this.testSuiteId,
      testPlanId: this.testPlanId,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      triggeredBy: this.triggeredBy,
      triggerType: this.triggerType,
      environment: this.environment,
      browser: this.browser,
      parallelCount: this.parallelCount,
      retryCount: this.retryCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      testResultIds: this.testResultIds
    };
  }
}
