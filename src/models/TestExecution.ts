import { ITestExecution } from './interfaces/ITestExecution';
import { BrowserType, ExecutionStatus } from './enums/TestEnums';

export class TestExecution implements ITestExecution {
  id: string;
  testCaseId: string;
  executionDate: Date;
  executedBy: string;
  environment: string;
  browser: BrowserType;
  version: string;
  deviceInfo?: string;
  status: ExecutionStatus;
  executionTime: number;
  startTime: Date;
  endTime?: Date;
  testRunId?: string;
  logs?: string[];
  screenshots?: string[];
  videoRecording?: string;

  constructor(data: Partial<ITestExecution>) {
    this.id = data.id || '';
    this.testCaseId = data.testCaseId || '';
    this.executionDate = data.executionDate || new Date();
    this.executedBy = data.executedBy || '';
    this.environment = data.environment || '';
    this.browser = data.browser || BrowserType.CHROME;
    this.version = data.version || '';
    this.deviceInfo = data.deviceInfo;
    this.status = data.status || ExecutionStatus.QUEUED;
    this.executionTime = data.executionTime || 0;
    this.startTime = data.startTime || new Date();
    this.endTime = data.endTime;
    this.testRunId = data.testRunId;
    this.logs = data.logs || [];
    this.screenshots = data.screenshots || [];
    this.videoRecording = data.videoRecording;
  }

  // Çalıştırma durumunu güncelle
  updateStatus(status: ExecutionStatus): void {
    this.status = status;
    if (status === ExecutionStatus.COMPLETED || 
        status === ExecutionStatus.FAILED || 
        status === ExecutionStatus.ABORTED || 
        status === ExecutionStatus.TIMEOUT || 
        status === ExecutionStatus.ERROR) {
      this.endTime = new Date();
      this.executionTime = this.endTime.getTime() - this.startTime.getTime();
    }
  }

  // Log ekle
  addLog(log: string): void {
    if (!this.logs) {
      this.logs = [];
    }
    this.logs.push(log);
  }

  // Ekran görüntüsü ekle
  addScreenshot(screenshotUrl: string): void {
    if (!this.screenshots) {
      this.screenshots = [];
    }
    this.screenshots.push(screenshotUrl);
  }

  // Video kaydı ekle
  setVideoRecording(videoUrl: string): void {
    this.videoRecording = videoUrl;
  }

  // Çalıştırmayı başlat
  start(): void {
    this.status = ExecutionStatus.RUNNING;
    this.startTime = new Date();
  }

  // Çalıştırmayı tamamla
  complete(): void {
    this.status = ExecutionStatus.COMPLETED;
    this.endTime = new Date();
    this.executionTime = this.endTime.getTime() - this.startTime.getTime();
  }

  // Çalıştırmayı başarısız olarak işaretle
  fail(errorMessage?: string): void {
    this.status = ExecutionStatus.FAILED;
    this.endTime = new Date();
    this.executionTime = this.endTime.getTime() - this.startTime.getTime();
    if (errorMessage) {
      this.addLog(`Error: ${errorMessage}`);
    }
  }

  // Çalıştırmayı iptal et
  abort(): void {
    this.status = ExecutionStatus.ABORTED;
    this.endTime = new Date();
    this.executionTime = this.endTime.getTime() - this.startTime.getTime();
  }

  // Test çalıştırmasını JSON formatına dönüştür
  toJSON(): ITestExecution {
    return {
      id: this.id,
      testCaseId: this.testCaseId,
      executionDate: this.executionDate,
      executedBy: this.executedBy,
      environment: this.environment,
      browser: this.browser,
      version: this.version,
      deviceInfo: this.deviceInfo,
      status: this.status,
      executionTime: this.executionTime,
      startTime: this.startTime,
      endTime: this.endTime,
      testRunId: this.testRunId,
      logs: this.logs,
      screenshots: this.screenshots,
      videoRecording: this.videoRecording
    };
  }
}
