import { TestPlanStatus } from '../enums/TestEnums';

export interface ITestPlan {
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
  testSuiteIds?: string[]; // İlişkili test suite'lerin ID'leri
}
