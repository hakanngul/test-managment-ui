import { TestStep } from './TestStep';
import { TestCaseStatus, TestCasePriority, BrowserType } from '../enums/TestCaseEnums';

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
  browsers?: BrowserType[]; // Desteklenen tarayıcılar
  headless?: boolean; // Headless modda çalıştırılacak mı
  browserPool?: boolean; // Tarayıcı havuzu kullanılacak mı
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
  browsers?: BrowserType[]; // Desteklenen tarayıcılar
  headless?: boolean; // Headless modda çalıştırılacak mı
  browserPool?: boolean; // Tarayıcı havuzu kullanılacak mı
}

// Test case update model
export interface TestCaseUpdate {
  title?: string;
  description?: string;
  status?: TestCaseStatus;
  priority?: TestCasePriority;
  steps?: TestStep[];
  tags?: string[];
  browsers?: BrowserType[]; // Desteklenen tarayıcılar
  headless?: boolean; // Headless modda çalıştırılacak mı
  browserPool?: boolean; // Tarayıcı havuzu kullanılacak mı
}
