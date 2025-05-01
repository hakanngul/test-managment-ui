import { TestRunStatus, TriggerType, BrowserType } from '../enums/TestEnums';
import { TestCaseResult } from './ITestCase';

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

// Test çalıştırma arayüzü
export interface TestRun {
  id: string;
  testCaseId: string;
  testCaseName: string;
  status: TestRunStatus;
  result?: TestCaseResult;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milisaniye cinsinden
  browser: string;
  environment: string;
  executedBy: string;
  errorMessage?: string;
  progress?: number; // 0-100 arası
  priority: string;
  tags?: string[];
}