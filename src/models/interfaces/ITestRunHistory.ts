import { TestCaseResult } from "./ITestCase";

export interface TestRun {
  id: string;
  testCaseId: string;
  result: TestCaseResult;
  startTime: Date;
  endTime: Date;
  duration: number; // milisaniye cinsinden
  browser: string;
  environment: string;
  executedBy: string;
  errorMessage?: string;
  logs?: string[];
  screenshots?: string[];
}