// Test case status
export type TestCaseStatus = 'active' | 'draft' | 'archived' | 'inactive';

// Test case priority
export type TestCasePriority = 'critical' | 'high' | 'medium' | 'low';

// Test step action
export type TestStepAction = 'click' | 'type' | 'wait' | 'select' | 'assert' | 'navigate' | 'hover' | 'scroll' | 'drag' | 'upload' | 'custom';

// Test step type
export type TestStepType = 'manual' | 'automated';

// Test step interface
export interface TestStep {
  id: string;
  order: number;
  action: TestStepAction;
  target: string;
  value?: string;
  description?: string;
  expectedResult: string;
  type: TestStepType;
}

// Test case interface
export interface TestCase {
  id?: string;
  title: string;
  description: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  steps: TestStep[];
  tags: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  projectId?: string;
}

// Test suite interface
export interface TestSuite {
  id?: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  testCases: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  projectId?: string;
}

// Test run interface
export interface TestRun {
  id?: string;
  name: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  testSuiteId: string;
  environment: string;
  startTime?: string;
  endTime?: string;
  results?: TestResult[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Test result interface
export interface TestResult {
  id?: string;
  testRunId: string;
  testCaseId: string;
  status: 'passed' | 'failed' | 'pending' | 'blocked';
  startTime?: string;
  endTime?: string;
  duration?: number;
  errorMessage?: string;
  errorStack?: string;
  screenshots?: string[];
  steps?: TestStepResult[];
}

// Test step result interface
export interface TestStepResult {
  id: string;
  order: number;
  description: string;
  status: 'passed' | 'failed' | 'pending' | 'skipped';
  duration?: number;
  screenshot?: string | null;
  errorMessage?: string | null;
}

// User interface
export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'tester' | 'viewer';
  avatar?: string;
}

// Project interface
export interface Project {
  id?: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  members: string[];
}
