import { ITestPlan } from './interfaces/ITestPlan';
import { TestPlanStatus } from './enums/TestEnums';

export class TestPlan implements ITestPlan {
  id: string;
  name: string;
  description: string;
  objective: string;
  scope: string;
  startDate: Date;
  endDate: Date;
  version: string;
  status: TestPlanStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  testSuiteIds?: string[];

  constructor(data: Partial<ITestPlan>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.objective = data.objective || '';
    this.scope = data.scope || '';
    this.startDate = data.startDate || new Date();
    this.endDate = data.endDate || new Date();
    this.version = data.version || '1.0';
    this.status = data.status || TestPlanStatus.DRAFT;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.approvedBy = data.approvedBy;
    this.approvedAt = data.approvedAt;
    this.testSuiteIds = data.testSuiteIds || [];
  }

  // Test planının durumunu güncelle
  updateStatus(status: TestPlanStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // Test planını onayla
  approve(approvedBy: string): void {
    this.status = TestPlanStatus.READY;
    this.approvedBy = approvedBy;
    this.approvedAt = new Date();
    this.updatedAt = new Date();
  }

  // Test suite ekle
  addTestSuite(testSuiteId: string): void {
    if (!this.testSuiteIds) {
      this.testSuiteIds = [];
    }
    if (!this.testSuiteIds.includes(testSuiteId)) {
      this.testSuiteIds.push(testSuiteId);
      this.updatedAt = new Date();
    }
  }

  // Test suite kaldır
  removeTestSuite(testSuiteId: string): void {
    if (this.testSuiteIds) {
      this.testSuiteIds = this.testSuiteIds.filter(id => id !== testSuiteId);
      this.updatedAt = new Date();
    }
  }

  // Test planını arşivle
  archive(): void {
    this.status = TestPlanStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  // Test planını JSON formatına dönüştür
  toJSON(): ITestPlan {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      objective: this.objective,
      scope: this.scope,
      startDate: this.startDate,
      endDate: this.endDate,
      version: this.version,
      status: this.status,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt,
      testSuiteIds: this.testSuiteIds
    };
  }
}
