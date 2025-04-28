import { TestResultStatus } from '../enums/TestEnums';

export interface ITestHistory {
  id: string;
  testCaseId: string;
  testRunId: string;
  testResultId: string;
  previousStatus: TestResultStatus;
  newStatus: TestResultStatus;
  changedAt: Date;
  changedBy: string;
  reason?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}
