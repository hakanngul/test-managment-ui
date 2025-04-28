import { ObjectId } from 'mongodb';
import { TestStepSchema } from './TestStepSchema';

// Test case durumları
export enum TestCaseStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  INACTIVE = 'inactive'
}

// Test case öncelikleri
export enum TestCasePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Tarayıcı türleri
export enum BrowserType {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit'
}

// Test case çalıştırma istatistikleri
export interface TestCaseExecutionStats {
  totalRuns: number;
  passCount: number;
  failCount: number;
  passRate: number;
  lastRun?: Date;
  avgDuration?: number;
}

// Test case şeması
export interface TestCaseSchema {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  steps: TestStepSchema[] | string[]; // Test adımları veya adım ID'leri
  tags: string[];
  projectId: string;
  browsers?: BrowserType[]; // Desteklenen tarayıcılar
  headless?: boolean; // Headless modda çalıştırılacak mı
  browserPool?: boolean; // Tarayıcı havuzu kullanılacak mı
  createdBy?: string; // Kullanıcı ID
  createdAt?: Date;
  updatedAt?: Date;
  executionStats?: TestCaseExecutionStats;
}
