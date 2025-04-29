import { BrowserType } from './Agent';
import { RequestPriority, TestTiming } from './QueuedRequest';

export enum TestResult {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  ERROR = 'ERROR',
  SKIPPED = 'SKIPPED',
  BLOCKED = 'BLOCKED'
}

export interface TestStep {
  id: string;
  name: string;
  action: string;
  selector?: string;
  value?: string;
  result: TestResult;
  duration: number; // milliseconds
  screenshot?: string; // Base64 or path
  error?: {
    message: string;
    stack?: string;
  };
}

export interface ProcessedRequest {
  id: string;
  testName: string;
  description?: string;
  result: TestResult;
  browser: BrowserType;
  priority: RequestPriority;
  category?: string;
  tags?: string[];
  userId?: string;
  projectId?: string;
  testCaseId?: string;
  testSuiteId?: string;
  parameters?: Record<string, any>;
  timing: TestTiming;
  agentId: string;
  steps: TestStep[];
  screenshots?: string[]; // Base64 or paths
  video?: string; // Base64 or path
  logs?: string[]; // Log entries
  errorMessage?: string;
  errorStack?: string;
  metadata?: Record<string, any>;
}
