import { TestCaseStatus, TestCasePriority, TestCaseType, AutomationStatus } from './enums/TestEnums';
import { ITestStep } from './interfaces/ITestStep';

export interface ITestCase {
  id: string;
  name: string;
  description: string;
  testSuiteId: string;
  owner: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  type: TestCaseType;
  preconditions: string[];
  expectedResults: string;
  automationStatus: AutomationStatus;
  headless?: boolean;
  takeScreenshots?: boolean;
  estimatedDuration: number; // Saniye cinsinden
  actualDuration?: number; // Saniye cinsinden
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  testSteps?: ITestStep[];
  testDataIds?: string[];
}

export class TestCase implements ITestCase {
  id: string;
  name: string;
  description: string;
  testSuiteId: string;
  owner: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  type: TestCaseType;
  preconditions: string[];
  expectedResults: string;
  automationStatus: AutomationStatus;
  headless?: boolean;
  takeScreenshots?: boolean;
  estimatedDuration: number;
  actualDuration?: number;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  testSteps?: ITestStep[];
  testDataIds?: string[];

  constructor(data: Partial<ITestCase>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.testSuiteId = data.testSuiteId || '';
    this.owner = data.owner || '';
    this.status = data.status || TestCaseStatus.DRAFT;
    this.priority = data.priority || TestCasePriority.MEDIUM;
    this.type = data.type || TestCaseType.FUNCTIONAL;
    this.preconditions = data.preconditions || [];
    this.expectedResults = data.expectedResults || '';
    this.automationStatus = data.automationStatus || AutomationStatus.NOT_AUTOMATED;
    this.headless = data.headless !== undefined ? data.headless : false;
    this.takeScreenshots = data.takeScreenshots !== undefined ? data.takeScreenshots : true;
    this.estimatedDuration = data.estimatedDuration || 0;
    this.actualDuration = data.actualDuration;
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.testSteps = data.testSteps || [];
    this.testDataIds = data.testDataIds || [];
  }

  // Test case durumunu güncelle
  updateStatus(status: TestCaseStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // Test adımı ekle
  addTestStep(testStep: ITestStep): void {
    if (!this.testSteps) {
      this.testSteps = [];
    }
    this.testSteps.push(testStep);
    this.updatedAt = new Date();
  }

  // Test adımı kaldır
  removeTestStep(testStepId: string): void {
    if (this.testSteps) {
      this.testSteps = this.testSteps.filter(step => step.id !== testStepId);
      this.updatedAt = new Date();
    }
  }

  // Test adımlarını sırala
  reorderTestSteps(): void {
    if (this.testSteps) {
      this.testSteps.sort((a, b) => {
        if (a.stepNumber && b.stepNumber) {
          return a.stepNumber - b.stepNumber;
        }
        return 0;
      });
      this.updatedAt = new Date();
    }
  }

  // Test verisi ekle
  addTestData(testDataId: string): void {
    if (!this.testDataIds) {
      this.testDataIds = [];
    }
    if (!this.testDataIds.includes(testDataId)) {
      this.testDataIds.push(testDataId);
      this.updatedAt = new Date();
    }
  }

  // Test verisi kaldır
  removeTestData(testDataId: string): void {
    if (this.testDataIds) {
      this.testDataIds = this.testDataIds.filter(id => id !== testDataId);
      this.updatedAt = new Date();
    }
  }

  // Etiket ekle
  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  // Etiket kaldır
  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date();
  }

  // Ön koşul ekle
  addPrecondition(precondition: string): void {
    if (!this.preconditions.includes(precondition)) {
      this.preconditions.push(precondition);
      this.updatedAt = new Date();
    }
  }

  // Ön koşul kaldır
  removePrecondition(precondition: string): void {
    this.preconditions = this.preconditions.filter(p => p !== precondition);
    this.updatedAt = new Date();
  }

  // Otomasyon durumunu güncelle
  updateAutomationStatus(status: AutomationStatus): void {
    this.automationStatus = status;
    this.updatedAt = new Date();
  }

  // Test case'i arşivle
  archive(): void {
    this.status = TestCaseStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  // Test case'i JSON formatına dönüştür
  toJSON(): ITestCase {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      testSuiteId: this.testSuiteId,
      owner: this.owner,
      status: this.status,
      priority: this.priority,
      type: this.type,
      preconditions: this.preconditions,
      expectedResults: this.expectedResults,
      automationStatus: this.automationStatus,
      headless: this.headless,
      takeScreenshots: this.takeScreenshots,
      estimatedDuration: this.estimatedDuration,
      actualDuration: this.actualDuration,
      tags: this.tags,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      testSteps: this.testSteps,
      testDataIds: this.testDataIds
    };
  }
}
