export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'tester' | 'viewer';
  avatar?: string;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  steps: TestStep[];
  tags: string[];
  projectId: string;
}

export interface TestStep {
  id: string;
  order: number;
  action: 'click' | 'type' | 'wait' | 'select' | 'assert' | 'navigate' | 'hover' | 'scroll' | 'drag' | 'upload' | 'custom';
  target: string;
  value?: string;
  description: string;
  expectedResult: string;
  type: 'manual' | 'automated';
  code?: string;
}

export interface TestRun {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  environment: 'development' | 'staging' | 'production';
  browser?: 'chrome' | 'firefox' | 'safari' | 'edge';
  device?: 'desktop' | 'tablet' | 'mobile';
  testCaseIds: string[];
  results: TestResult[];
  createdBy: string;
  createdAt: string;
}

export interface TestResult {
  id: string;
  testCaseId: string;
  status: 'passed' | 'failed' | 'skipped' | 'blocked';
  duration: number; // in milliseconds
  errorMessage?: string;
  screenshots?: string[];
  logs?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: string[]; // user IDs
}

export interface Dashboard {
  totalTests: number;
  passRate: number;
  recentRuns: TestRun[];
  testsPerDay: {
    date: string;
    passed: number;
    failed: number;
    skipped: number;
  }[];
  testsByStatus: {
    active: number;
    draft: number;
    archived: number;
  };
  testsByPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  createdAt: string;
}