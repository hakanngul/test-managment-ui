import { TestSuiteStatus, TestSuitePriority } from '../enums/TestEnums';

export interface ITestSuite {
  id: string;
  name: string;
  description: string;
  testPlanId: string;
  owner: string;
  status: TestSuiteStatus;
  priority: TestSuitePriority;
  tags: string[];
  estimatedTime: number; // Dakika cinsinden
  actualTime?: number; // Dakika cinsinden
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  testCaseIds?: string[]; // İlişkili test case'lerin ID'leri
}
