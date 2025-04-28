import { ITestSuite } from './interfaces/ITestSuite';
import { TestSuiteStatus, TestSuitePriority } from './enums/TestEnums';

export class TestSuite implements ITestSuite {
  id: string;
  name: string;
  description: string;
  testPlanId: string;
  owner: string;
  status: TestSuiteStatus;
  priority: TestSuitePriority;
  tags: string[];
  estimatedTime: number;
  actualTime?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  testCaseIds?: string[];

  constructor(data: Partial<ITestSuite>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.testPlanId = data.testPlanId || '';
    this.owner = data.owner || '';
    this.status = data.status || TestSuiteStatus.DRAFT;
    this.priority = data.priority || TestSuitePriority.MEDIUM;
    this.tags = data.tags || [];
    this.estimatedTime = data.estimatedTime || 0;
    this.actualTime = data.actualTime;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.testCaseIds = data.testCaseIds || [];
  }

  // Test suite durumunu güncelle
  updateStatus(status: TestSuiteStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // Test case ekle
  addTestCase(testCaseId: string): void {
    if (!this.testCaseIds) {
      this.testCaseIds = [];
    }
    if (!this.testCaseIds.includes(testCaseId)) {
      this.testCaseIds.push(testCaseId);
      this.updatedAt = new Date();
    }
  }

  // Test case kaldır
  removeTestCase(testCaseId: string): void {
    if (this.testCaseIds) {
      this.testCaseIds = this.testCaseIds.filter(id => id !== testCaseId);
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

  // Gerçek süreyi güncelle
  updateActualTime(time: number): void {
    this.actualTime = time;
    this.updatedAt = new Date();
  }

  // Test suite'i arşivle
  archive(): void {
    this.status = TestSuiteStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  // Test suite'i JSON formatına dönüştür
  toJSON(): ITestSuite {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      testPlanId: this.testPlanId,
      owner: this.owner,
      status: this.status,
      priority: this.priority,
      tags: this.tags,
      estimatedTime: this.estimatedTime,
      actualTime: this.actualTime,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      testCaseIds: this.testCaseIds
    };
  }
}
