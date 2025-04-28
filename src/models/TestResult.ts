import { ITestResult } from './interfaces/ITestResult';
import { TestResultStatus } from './enums/TestEnums';

export class TestResult implements ITestResult {
  id: string;
  testRunId: string;
  testCaseId: string;
  status: TestResultStatus;
  executionTime: number;
  errorMessage?: string;
  errorDetails?: string;
  screenshot?: string;
  stackTrace?: string;
  logs?: string[];
  videoRecording?: string;
  performance?: {
    loadTime?: number;
    renderTime?: number;
    networkRequests?: number;
    memoryUsage?: number;
    cpuUsage?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  testDefectIds?: string[];

  constructor(data: Partial<ITestResult>) {
    this.id = data.id || '';
    this.testRunId = data.testRunId || '';
    this.testCaseId = data.testCaseId || '';
    this.status = data.status || TestResultStatus.NOT_RUN;
    this.executionTime = data.executionTime || 0;
    this.errorMessage = data.errorMessage;
    this.errorDetails = data.errorDetails;
    this.screenshot = data.screenshot;
    this.stackTrace = data.stackTrace;
    this.logs = data.logs || [];
    this.videoRecording = data.videoRecording;
    this.performance = data.performance || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.testDefectIds = data.testDefectIds || [];
  }

  // Test sonucu durumunu güncelle
  updateStatus(status: TestResultStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // Hata mesajı ekle
  setError(message: string, details?: string, stackTrace?: string): void {
    this.errorMessage = message;
    this.errorDetails = details;
    this.stackTrace = stackTrace;
    this.status = TestResultStatus.FAILED;
    this.updatedAt = new Date();
  }

  // Log ekle
  addLog(log: string): void {
    if (!this.logs) {
      this.logs = [];
    }
    this.logs.push(log);
  }

  // Ekran görüntüsü ekle
  setScreenshot(screenshotUrl: string): void {
    this.screenshot = screenshotUrl;
    this.updatedAt = new Date();
  }

  // Video kaydı ekle
  setVideoRecording(videoUrl: string): void {
    this.videoRecording = videoUrl;
    this.updatedAt = new Date();
  }

  // Performans metriklerini güncelle
  updatePerformance(metrics: Partial<TestResult['performance']>): void {
    this.performance = { ...this.performance, ...metrics };
    this.updatedAt = new Date();
  }

  // Hata kaydı ekle
  addDefect(defectId: string): void {
    if (!this.testDefectIds) {
      this.testDefectIds = [];
    }
    if (!this.testDefectIds.includes(defectId)) {
      this.testDefectIds.push(defectId);
      this.updatedAt = new Date();
    }
  }

  // Test sonucunu başarılı olarak işaretle
  markAsPassed(): void {
    this.status = TestResultStatus.PASSED;
    this.updatedAt = new Date();
  }

  // Test sonucunu başarısız olarak işaretle
  markAsFailed(errorMessage?: string): void {
    this.status = TestResultStatus.FAILED;
    if (errorMessage) {
      this.errorMessage = errorMessage;
    }
    this.updatedAt = new Date();
  }

  // Test sonucunu JSON formatına dönüştür
  toJSON(): ITestResult {
    return {
      id: this.id,
      testRunId: this.testRunId,
      testCaseId: this.testCaseId,
      status: this.status,
      executionTime: this.executionTime,
      errorMessage: this.errorMessage,
      errorDetails: this.errorDetails,
      screenshot: this.screenshot,
      stackTrace: this.stackTrace,
      logs: this.logs,
      videoRecording: this.videoRecording,
      performance: this.performance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      testDefectIds: this.testDefectIds
    };
  }
}
