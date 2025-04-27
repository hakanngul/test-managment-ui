import { TestResult } from './TestResult';

// Test run status
export enum TestRunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused'
}

// Test run model
export interface TestRun {
  id: string;
  name: string;
  description?: string;
  status: TestRunStatus;
  testSuiteId: string;
  environment: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in milliseconds
  results?: TestResult[];
  agentId?: string;
  createdBy?: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
}

// Test run creation model
export interface TestRunCreate {
  name: string;
  description?: string;
  testSuiteId: string;
  environment: string;
  agentId?: string;
}

// Test run update model
export interface TestRunUpdate {
  name?: string;
  description?: string;
  status?: TestRunStatus;
  environment?: string;
  startTime?: Date;
  endTime?: Date;
  agentId?: string;
}

// Test run statistics
export interface TestRunStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  blockedTests: number;
  passRate: number;
  avgDuration?: number;
}

// Convert raw test run data to TestRun model
export const toTestRun = (data: any): TestRun => {
  return {
    id: data.id || data._id,
    name: data.name,
    description: data.description,
    status: data.status as TestRunStatus,
    testSuiteId: data.testSuiteId,
    environment: data.environment,
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    duration: data.duration,
    results: data.results || [],
    agentId: data.agentId,
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
  };
};

// Convert TestRun model to raw data for API
export const fromTestRun = (testRun: TestRun): any => {
  return {
    id: testRun.id,
    name: testRun.name,
    description: testRun.description,
    status: testRun.status,
    testSuiteId: testRun.testSuiteId,
    environment: testRun.environment,
    startTime: testRun.startTime?.toISOString(),
    endTime: testRun.endTime?.toISOString(),
    duration: testRun.duration,
    results: testRun.results,
    agentId: testRun.agentId,
    createdBy: testRun.createdBy,
    createdAt: testRun.createdAt?.toISOString(),
    updatedAt: testRun.updatedAt?.toISOString()
  };
};
