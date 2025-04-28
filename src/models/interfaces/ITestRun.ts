import { TestRunStatus, TriggerType, BrowserType } from '../enums/TestEnums';

export interface ITestRun {
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
  testResultIds?: string[]; // İlişkili test sonuçlarının ID'leri
}
