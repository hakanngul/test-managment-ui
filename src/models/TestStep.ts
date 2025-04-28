import { ITestStep } from './interfaces/ITestStep';
import { TestStepStatus } from './enums/TestEnums';

export class TestStep implements ITestStep {
  id: string;
  testCaseId: string;
  stepNumber: number;
  description: string;
  action: string;
  expectedResult: string;
  actualResult?: string;
  status?: TestStepStatus;
  screenshot?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ITestStep>) {
    this.id = data.id || '';
    this.testCaseId = data.testCaseId || '';
    this.stepNumber = data.stepNumber || 0;
    this.description = data.description || '';
    this.action = data.action || '';
    this.expectedResult = data.expectedResult || '';
    this.actualResult = data.actualResult;
    this.status = data.status;
    this.screenshot = data.screenshot;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Test adımı durumunu güncelle
  updateStatus(status: TestStepStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // Gerçek sonucu güncelle
  updateActualResult(result: string): void {
    this.actualResult = result;
    this.updatedAt = new Date();
  }

  // Ekran görüntüsü ekle
  addScreenshot(screenshotUrl: string): void {
    this.screenshot = screenshotUrl;
    this.updatedAt = new Date();
  }

  // Test adımını JSON formatına dönüştür
  toJSON(): ITestStep {
    return {
      id: this.id,
      testCaseId: this.testCaseId,
      stepNumber: this.stepNumber,
      description: this.description,
      action: this.action,
      expectedResult: this.expectedResult,
      actualResult: this.actualResult,
      status: this.status,
      screenshot: this.screenshot,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
