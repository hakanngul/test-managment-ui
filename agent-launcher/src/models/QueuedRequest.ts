import { BrowserType } from './Agent';

export enum RequestStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum RequestPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface TestTiming {
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  waitTime?: number; // milliseconds
  executionTime?: number; // milliseconds
  totalTime?: number; // milliseconds
}

export interface QueuedRequest {
  id: string;
  testName: string;
  description?: string;
  status: RequestStatus;
  queuePosition: number;
  estimatedStartTime?: Date;
  queuedAt: Date;
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
  agentId?: string;
}
