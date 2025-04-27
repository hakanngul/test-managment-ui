import { TestStep } from './TestStep';

// Test case status
export enum TestCaseStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  INACTIVE = 'inactive'
}

// Test case priority
export enum TestCasePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Test case model
export interface TestCase {
  id: string;
  title: string;
  description: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  steps: TestStep[];
  tags: string[];
  projectId: string;
  createdBy?: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
  executionStats?: TestCaseExecutionStats;
}

// Test case execution statistics
export interface TestCaseExecutionStats {
  totalRuns: number;
  passCount: number;
  failCount: number;
  passRate: number;
  lastRun?: Date;
  avgDuration?: number;
}

// Test case creation model
export interface TestCaseCreate {
  title: string;
  description: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  steps: TestStep[];
  tags: string[];
  projectId: string;
}

// Test case update model
export interface TestCaseUpdate {
  title?: string;
  description?: string;
  status?: TestCaseStatus;
  priority?: TestCasePriority;
  steps?: TestStep[];
  tags?: string[];
}

// Convert raw test case data to TestCase model
export const toTestCase = (data: any): TestCase => {
  return {
    id: data.id || data._id,
    title: data.title,
    description: data.description,
    status: data.status as TestCaseStatus,
    priority: data.priority as TestCasePriority,
    steps: data.steps || [],
    tags: data.tags || [],
    projectId: data.projectId,
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    executionStats: data.executionStats ? {
      totalRuns: data.executionStats.totalRuns || 0,
      passCount: data.executionStats.passCount || 0,
      failCount: data.executionStats.failCount || 0,
      passRate: data.executionStats.passRate || 0,
      lastRun: data.executionStats.lastRun ? new Date(data.executionStats.lastRun) : undefined,
      avgDuration: data.executionStats.avgDuration
    } : undefined
  };
};

// Convert TestCase model to raw data for API
export const fromTestCase = (testCase: TestCase): any => {
  return {
    id: testCase.id,
    title: testCase.title,
    description: testCase.description,
    status: testCase.status,
    priority: testCase.priority,
    steps: testCase.steps,
    tags: testCase.tags,
    projectId: testCase.projectId,
    createdBy: testCase.createdBy,
    createdAt: testCase.createdAt?.toISOString(),
    updatedAt: testCase.updatedAt?.toISOString(),
    executionStats: testCase.executionStats ? {
      totalRuns: testCase.executionStats.totalRuns,
      passCount: testCase.executionStats.passCount,
      failCount: testCase.executionStats.failCount,
      passRate: testCase.executionStats.passRate,
      lastRun: testCase.executionStats.lastRun?.toISOString(),
      avgDuration: testCase.executionStats.avgDuration
    } : undefined
  };
};
