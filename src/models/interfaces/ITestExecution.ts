import { BrowserType, ExecutionStatus } from '../enums/TestEnums';

export interface ITestExecution {
  id: string;
  testCaseId: string;
  executionDate: Date;
  executedBy: string;
  environment: string;
  browser: BrowserType;
  version: string;
  deviceInfo?: string;
  status: ExecutionStatus;
  executionTime: number; // Milisaniye cinsinden
  startTime: Date;
  endTime?: Date;
  testRunId?: string;
  logs?: string[];
  screenshots?: string[];
  videoRecording?: string;
}
