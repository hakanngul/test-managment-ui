// Test suite status
export enum TestSuiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending',
  FAILED = 'failed',
  PASSED = 'passed'
}

// Test suite model
export interface TestSuite {
  id: string;
  name: string;
  description: string;
  status: TestSuiteStatus;
  progress: number; // 0-100
  testCases: string[]; // Test case IDs
  projectId: string;
  assignee?: string; // User ID
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
  environment?: string;
  createdBy?: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
  results?: TestSuiteResults;
}

// Test suite results
export interface TestSuiteResults {
  passed: number;
  failed: number;
  blocked: number;
  pending: number;
  total?: number;
}

// Test suite creation model
export interface TestSuiteCreate {
  name: string;
  description: string;
  status: TestSuiteStatus;
  testCases: string[];
  projectId: string;
  assignee?: string;
  startDate?: Date;
  endDate?: Date;
  environment?: string;
}

// Test suite update model
export interface TestSuiteUpdate {
  name?: string;
  description?: string;
  status?: TestSuiteStatus;
  progress?: number;
  testCases?: string[];
  assignee?: string;
  startDate?: Date;
  endDate?: Date;
  environment?: string;
  results?: TestSuiteResults;
}

// Convert raw test suite data to TestSuite model
export const toTestSuite = (data: any): TestSuite => {
  return {
    id: data.id || data._id,
    name: data.name,
    description: data.description,
    status: data.status as TestSuiteStatus,
    progress: data.progress || 0,
    testCases: data.testCases || [],
    projectId: data.projectId,
    assignee: data.assignee,
    dateRange: data.dateRange,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    environment: data.environment,
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    results: data.results ? {
      passed: data.results.passed || 0,
      failed: data.results.failed || 0,
      blocked: data.results.blocked || 0,
      pending: data.results.pending || 0,
      total: data.results.total || (data.results.passed + data.results.failed + data.results.blocked + data.results.pending)
    } : undefined
  };
};

// Convert TestSuite model to raw data for API
export const fromTestSuite = (testSuite: TestSuite): any => {
  return {
    id: testSuite.id,
    name: testSuite.name,
    description: testSuite.description,
    status: testSuite.status,
    progress: testSuite.progress,
    testCases: testSuite.testCases,
    projectId: testSuite.projectId,
    assignee: testSuite.assignee,
    dateRange: testSuite.dateRange,
    startDate: testSuite.startDate?.toISOString(),
    endDate: testSuite.endDate?.toISOString(),
    environment: testSuite.environment,
    createdBy: testSuite.createdBy,
    createdAt: testSuite.createdAt?.toISOString(),
    updatedAt: testSuite.updatedAt?.toISOString(),
    results: testSuite.results
  };
};
