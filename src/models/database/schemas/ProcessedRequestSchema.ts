import { ObjectId } from 'mongodb';
import { RequestPriority, RequestSource } from './QueuedRequestSchema';
import { BrowserType } from './TestCaseSchema';

// İşlenmiş istek durumları
export enum ProcessedRequestStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
  ERROR = 'error',
  INTERRUPTED = 'interrupted',
  PARTIAL = 'partial'
}

// İşlenmiş istek hata türleri
export enum ProcessedRequestErrorType {
  BROWSER = 'browser',
  NETWORK = 'network',
  SCRIPT = 'script',
  ASSERTION = 'assertion',
  TIMEOUT = 'timeout',
  ENVIRONMENT = 'environment',
  PERMISSION = 'permission',
  RESOURCE = 'resource',
  AGENT = 'agent',
  UNKNOWN = 'unknown'
}

// İşlenmiş istek hata detayları
export interface ProcessedRequestError {
  type: ProcessedRequestErrorType;
  message: string;
  stack?: string;
  code?: string;
  location?: string;
  timestamp: Date;
  details?: Record<string, any>;
}

// İşlenmiş istek performans metrikleri
export interface ProcessedRequestPerformance {
  setupTime?: number; // milisaniye cinsinden
  executionTime?: number; // milisaniye cinsinden
  teardownTime?: number; // milisaniye cinsinden
  totalTime: number; // milisaniye cinsinden
  cpuUsage?: number; // yüzde cinsinden
  memoryUsage?: number; // MB cinsinden
  networkUsage?: number; // MB cinsinden
}

// İşlenmiş istek ortam bilgileri
export interface ProcessedRequestEnvironment {
  browser: BrowserType;
  browserVersion?: string;
  userAgent?: string;
  platform?: string;
  platformVersion?: string;
  viewport?: string;
  deviceName?: string;
  deviceType?: string;
  networkType?: string;
  networkSpeed?: string;
  location?: string;
  timezone?: string;
}

// İşlenmiş istek kaynak kullanımı
export interface ProcessedRequestResources {
  cpuTime?: number; // milisaniye cinsinden
  peakMemory?: number; // MB cinsinden
  networkRequests?: number;
  networkTransferred?: number; // bayt cinsinden
  diskUsage?: number; // MB cinsinden
  screenshots?: number;
  videos?: number;
}

// İşlenmiş istek logları
export interface ProcessedRequestLogs {
  console?: string[];
  network?: string[];
  browser?: string[];
  agent?: string[];
  system?: string[];
}

// İşlenmiş istek şeması
export interface ProcessedRequestSchema {
  _id?: ObjectId;
  id: string;
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  testSuiteId?: string;
  projectId?: string;
  
  // Durum ve sonuç
  status: ProcessedRequestStatus;
  result?: any; // test sonuç verisi
  error?: ProcessedRequestError;
  
  // Çalıştırma detayları
  browser: string;
  agentId: string;
  priority?: RequestPriority;
  source?: RequestSource;
  
  // Zamanlama
  startTime: Date;
  endTime?: Date;
  duration: string; // formatlanmış süre
  durationMs?: number; // milisaniye cinsinden süre
  
  // Performans ve kaynaklar
  performance?: ProcessedRequestPerformance;
  resources?: ProcessedRequestResources;
  
  // Ortam
  environment?: ProcessedRequestEnvironment;
  
  // Loglar ve artifactlar
  logs?: ProcessedRequestLogs;
  screenshots?: string[];
  videos?: string[];
  artifacts?: string[];
  
  // Yeniden deneme bilgileri
  retryCount?: number;
  previousAttempts?: string[];
  maxRetries?: number;
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
