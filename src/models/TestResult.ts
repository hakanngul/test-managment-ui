import { TestStepResult } from './TestStepResult';

// Test result status
export enum TestResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

// Test result model
export interface TestResult {
  id: string;
  testRunId: string;
  testCaseId: string;
  status: TestResultStatus;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in milliseconds
  errorMessage?: string;
  errorStack?: string;
  screenshots?: string[];
  steps?: TestStepResult[];
}

// Test result creation model
export interface TestResultCreate {
  testRunId: string;
  testCaseId: string;
  status: TestResultStatus;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  errorMessage?: string;
  errorStack?: string;
  screenshots?: string[];
  steps?: TestStepResult[];
}

// Test result update model
export interface TestResultUpdate {
  status?: TestResultStatus;
  endTime?: Date;
  duration?: number;
  errorMessage?: string;
  errorStack?: string;
  screenshots?: string[];
  steps?: TestStepResult[];
}

// Convert raw test result data to TestResult model
export const toTestResult = (data: any): TestResult => {
  return {
    id: data.id || data._id,
    testRunId: data.testRunId,
    testCaseId: data.testCaseId,
    status: data.status as TestResultStatus,
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    duration: data.duration,
    errorMessage: data.errorMessage,
    errorStack: data.errorStack,
    screenshots: data.screenshots || [],
    steps: data.steps || []
  };
};

// Convert TestResult model to raw data for API
export const fromTestResult = (testResult: TestResult): any => {
  return {
    id: testResult.id,
    testRunId: testResult.testRunId,
    testCaseId: testResult.testCaseId,
    status: testResult.status,
    startTime: testResult.startTime?.toISOString(),
    endTime: testResult.endTime?.toISOString(),
    duration: testResult.duration,
    errorMessage: testResult.errorMessage,
    errorStack: testResult.errorStack,
    screenshots: testResult.screenshots,
    steps: testResult.steps
  };
};
