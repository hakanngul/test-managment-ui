import { ObjectId } from 'mongodb';
import { BrowserType } from './TestCaseSchema';

// Test run durumları
export enum TestRunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused'
}

// Test run öncelikleri
export enum TestRunPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Test run çalıştırma modları
export enum TestRunExecutionMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel'
}

// Test run yeniden deneme stratejileri
export enum TestRunRetryStrategy {
  NONE = 'none',
  RETRY_FAILED = 'retry_failed',
  RETRY_ALL = 'retry_all'
}

// Test run log seviyeleri
export enum TestRunLogLevel {
  NONE = 'none',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

// Test run rapor formatları
export enum TestRunReportFormat {
  HTML = 'html',
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv',
  PDF = 'pdf'
}

// Test run bağlam bilgileri
export interface TestRunContext {
  operatingSystem?: string;
  browserVersion?: string;
  deviceInfo?: string;
  viewport?: string;
  userAgent?: string;
  networkConditions?: string;
  customData?: Record<string, any>;
}

// Test run loglama seçenekleri
export interface TestRunLogging {
  level: TestRunLogLevel;
  captureScreenshots: boolean;
  screenshotOnFailure: boolean;
  captureVideo: boolean;
  captureConsoleOutput: boolean;
  captureNetworkRequests: boolean;
  capturePerformanceMetrics: boolean;
}

// Test run raporlama seçenekleri
export interface TestRunReporting {
  formats: TestRunReportFormat[];
  includeScreenshots: boolean;
  includeVideos: boolean;
  includeLogs: boolean;
  includePerformanceData: boolean;
  customFields?: Record<string, any>;
}

// Test run bildirim seçenekleri
export interface TestRunNotification {
  onStart?: boolean;
  onComplete?: boolean;
  onFail?: boolean;
  recipients?: string[]; // E-posta adresleri
  channels?: {
    type: 'email' | 'slack' | 'teams' | 'webhook';
    config: Record<string, any>;
  }[];
}

// Test run istatistikleri
export interface TestRunStats {
  total: number;
  passed: number;
  failed: number;
  pending: number;
  skipped: number;
  passRate: number;
  duration: number; // milisaniye cinsinden
  startTime?: Date;
  endTime?: Date;
}

// Test run şeması
export interface TestRunSchema {
  _id?: ObjectId;
  id: string;
  name: string;
  description?: string;
  status: TestRunStatus;
  priority?: TestRunPriority;
  
  // İlişkiler
  projectId: string;
  testSuiteId?: string;
  testCaseIds?: string[];
  
  // Çalıştırma ayarları
  environment?: string;
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  executionMode?: TestRunExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestRunRetryStrategy;
  maxRetries?: number;
  timeout?: number; // milisaniye cinsinden
  
  // Bağlam ve yapılandırma
  context?: TestRunContext;
  logging?: TestRunLogging;
  reporting?: TestRunReporting;
  notifications?: TestRunNotification;
  
  // Sonuçlar ve istatistikler
  results?: string[]; // TestResult ID'leri
  stats?: TestRunStats;
  
  // Zamanlama
  scheduledStart?: Date;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milisaniye cinsinden
  
  // Metadata
  tags?: string[];
  createdBy?: string; // Kullanıcı ID
  createdAt?: Date;
  updatedBy?: string; // Kullanıcı ID
  updatedAt?: Date;
  
  // Ek bilgiler
  notes?: string;
  artifacts?: string[]; // Rapor, log, vb. dosya URL'leri
  metadata?: Record<string, any>;
}
