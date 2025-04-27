// Test step result status
export enum TestStepResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

// Test step result model
export interface TestStepResult {
  id: string;
  order: number;
  description: string;
  expectedResult?: string;
  status: TestStepResultStatus;
  duration?: number; // in milliseconds
  screenshot?: string | null;
  errorMessage?: string | null;
}

// Test step result creation model
export interface TestStepResultCreate {
  order: number;
  description: string;
  expectedResult?: string;
  status: TestStepResultStatus;
  duration?: number;
  screenshot?: string | null;
  errorMessage?: string | null;
}

// Test step result update model
export interface TestStepResultUpdate {
  status?: TestStepResultStatus;
  duration?: number;
  screenshot?: string | null;
  errorMessage?: string | null;
}

// Convert raw test step result data to TestStepResult model
export const toTestStepResult = (data: any): TestStepResult => {
  return {
    id: data.id || data._id,
    order: data.order,
    description: data.description,
    expectedResult: data.expectedResult,
    status: data.status as TestStepResultStatus,
    duration: data.duration,
    screenshot: data.screenshot,
    errorMessage: data.errorMessage
  };
};

// Convert TestStepResult model to raw data for API
export const fromTestStepResult = (testStepResult: TestStepResult): any => {
  return {
    id: testStepResult.id,
    order: testStepResult.order,
    description: testStepResult.description,
    expectedResult: testStepResult.expectedResult,
    status: testStepResult.status,
    duration: testStepResult.duration,
    screenshot: testStepResult.screenshot,
    errorMessage: testStepResult.errorMessage
  };
};
