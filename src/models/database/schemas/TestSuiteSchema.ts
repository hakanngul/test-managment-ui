import { ObjectId } from 'mongodb';
import { BrowserType } from './TestCaseSchema';

// Test suite durumları
export enum TestSuiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending',
  FAILED = 'failed',
  PASSED = 'passed',
  DRAFT = 'draft'
}

// Test suite öncelikleri
export enum TestSuitePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Test suite çalıştırma modları
export enum TestSuiteExecutionMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel'
}

// Test suite yeniden deneme stratejileri
export enum TestSuiteRetryStrategy {
  NONE = 'none',
  RETRY_FAILED = 'retry_failed',
  RETRY_ALL = 'retry_all'
}

// Test suite bağımlılık modları
export enum TestSuiteDependencyMode {
  NONE = 'none',
  STRICT = 'strict', // Bağımlı olduğu test başarısız olursa çalışmaz
  SOFT = 'soft'      // Bağımlı olduğu test başarısız olsa da çalışır
}

// Test case bağımlılığı
export interface TestCaseDependency {
  testCaseId: string;
  dependsOn: string;
  type: 'must_pass' | 'must_fail' | 'must_run';
}

// Test suite zamanlama
export interface TestSuiteSchedule {
  enabled: boolean;
  cron?: string;
  startDate?: Date;
  endDate?: Date;
  runOnDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  runAtTime?: string; // HH:MM formatında
  timezone?: string;
  lastRun?: Date;
  nextRun?: Date;
}

// Test suite bildirim
export interface TestSuiteNotification {
  onStart?: boolean;
  onComplete?: boolean;
  onFail?: boolean;
  recipients?: string[]; // E-posta adresleri
  channels?: {
    type: 'email' | 'slack' | 'teams' | 'webhook';
    config: Record<string, any>;
  }[];
}

// Test suite şeması
export interface TestSuiteSchema {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  status: TestSuiteStatus;
  priority?: TestSuitePriority;
  progress: number; // 0-100
  testCases: string[]; // Test case ID'leri
  projectId: string;
  tags?: string[];
  
  // Çalıştırma ayarları
  executionMode?: TestSuiteExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestSuiteRetryStrategy;
  maxRetries?: number;
  dependencies?: TestCaseDependency[];
  dependencyMode?: TestSuiteDependencyMode;
  
  // Tarayıcı ayarları
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  
  // Zamanlama
  schedule?: TestSuiteSchedule;
  
  // Bildirimler
  notifications?: TestSuiteNotification;
  
  // Atama ve tarihler
  assignee?: string; // Kullanıcı ID
  startDate?: Date;
  endDate?: Date;
  environment?: string;
  
  // Metadata
  createdBy?: string; // Kullanıcı ID
  createdAt?: Date;
  updatedBy?: string; // Kullanıcı ID
  updatedAt?: Date;
}
