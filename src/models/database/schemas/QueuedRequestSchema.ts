import { ObjectId } from 'mongodb';
import { BrowserType } from './TestCaseSchema';

// İstek öncelikleri
export enum RequestPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  LOWEST = 'lowest'
}

// İstek durumları
export enum RequestStatus {
  QUEUED = 'queued',
  SCHEDULED = 'scheduled',
  ASSIGNED = 'assigned',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

// İstek kategorileri
export enum RequestCategory {
  UI_TEST = 'ui_test',
  API_TEST = 'api_test',
  PERFORMANCE_TEST = 'performance_test',
  SECURITY_TEST = 'security_test',
  ACCESSIBILITY_TEST = 'accessibility_test',
  INTEGRATION_TEST = 'integration_test',
  REGRESSION_TEST = 'regression_test',
  SMOKE_TEST = 'smoke_test',
  SANITY_TEST = 'sanity_test',
  CUSTOM = 'custom'
}

// İstek kaynakları
export enum RequestSource {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  API = 'api',
  CI_CD = 'ci_cd',
  WEBHOOK = 'webhook',
  RETRY = 'retry'
}

// İstek yeniden deneme stratejileri
export enum RequestRetryStrategy {
  NONE = 'none',
  IMMEDIATE = 'immediate',
  INCREMENTAL = 'incremental',
  EXPONENTIAL = 'exponential',
  FIXED = 'fixed'
}

// Kuyruk durum özeti
export interface QueueStatusSummary {
  queued: number;
  processing: number;
  total: number;
  oldestRequest?: Date;
  estimatedWaitTime?: number; // saniye cinsinden
}

// Sıradaki istek şeması
export interface QueuedRequestSchema {
  _id?: ObjectId;
  id: string;
  
  // İstek bilgileri
  name: string;
  description?: string;
  status: RequestStatus;
  priority: RequestPriority;
  category: RequestCategory;
  source: RequestSource;
  
  // Test bilgileri
  testRunId?: string;
  testCaseId?: string;
  testSuiteId?: string;
  projectId?: string;
  
  // Çalıştırma ayarları
  browser?: BrowserType;
  environment?: string;
  headless?: boolean;
  timeout?: number; // milisaniye cinsinden
  retryStrategy?: RequestRetryStrategy;
  maxRetries?: number;
  retryCount?: number;
  
  // Zamanlama
  createdAt: Date;
  scheduledAt?: Date;
  startedAt?: Date;
  estimatedDuration?: number; // milisaniye cinsinden
  
  // Atama
  assignedTo?: string; // Agent ID
  assignedAt?: Date;
  
  // Bağımlılıklar
  dependencies?: string[]; // Diğer istek ID'leri
  dependencyMode?: 'strict' | 'soft';
  
  // Parametreler
  parameters?: Record<string, any>;
  
  // Metadata
  createdBy?: string; // Kullanıcı ID
  tags?: string[];
  metadata?: Record<string, any>;
}
