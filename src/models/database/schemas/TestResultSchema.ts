import { ObjectId } from 'mongodb';

// Test sonuç durumları
export enum TestResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

// Test öncelikleri
export enum TestPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Test şiddet seviyeleri
export enum TestSeverity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
  TRIVIAL = 'trivial'
}

// Hata türleri
export enum TestErrorType {
  SYNTAX = 'syntax',
  ASSERTION = 'assertion',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  ELEMENT_NOT_FOUND = 'element_not_found',
  JAVASCRIPT = 'javascript',
  PERMISSION = 'permission',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  ENVIRONMENT = 'environment',
  UNKNOWN = 'unknown'
}

// Hata şiddet seviyeleri
export enum TestErrorSeverity {
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
  TRIVIAL = 'trivial'
}

// Hata kategorileri
export enum TestErrorCategory {
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  NETWORK = 'network',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  FUNCTIONALITY = 'functionality',
  COMPATIBILITY = 'compatibility',
  USABILITY = 'usability',
  ACCESSIBILITY = 'accessibility',
  OTHER = 'other'
}

// Medya türleri
export enum TestMediaType {
  SCREENSHOT = 'screenshot',
  VIDEO = 'video',
  HAR = 'har',
  CONSOLE_LOG = 'console_log',
  NETWORK_LOG = 'network_log',
  PERFORMANCE_TIMELINE = 'performance_timeline',
  CUSTOM = 'custom'
}

// Test ortam bilgileri
export interface TestEnvironmentInfo {
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  osVersion?: string;
  deviceName?: string;
  deviceType?: string;
  viewport?: string;
  userAgent?: string;
  networkType?: string;
  networkSpeed?: string;
  location?: string;
  timezone?: string;
  customData?: Record<string, any>;
}

// Test hata detayları
export interface TestErrorDetails {
  type: TestErrorType;
  message: string;
  stack?: string;
  code?: string;
  location?: string;
  line?: number;
  column?: number;
  severity?: TestErrorSeverity;
  category?: TestErrorCategory;
  screenshot?: string;
  relatedElements?: string[];
  details?: Record<string, any>;
}

// Test medya
export interface TestMedia {
  type: TestMediaType;
  url: string;
  name?: string;
  description?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

// Test performans metrikleri
export interface TestPerformanceMetrics {
  loadTime?: number; // milisaniye cinsinden
  domContentLoaded?: number; // milisaniye cinsinden
  firstPaint?: number; // milisaniye cinsinden
  firstContentfulPaint?: number; // milisaniye cinsinden
  largestContentfulPaint?: number; // milisaniye cinsinden
  timeToInteractive?: number; // milisaniye cinsinden
  totalBlockingTime?: number; // milisaniye cinsinden
  cumulativeLayoutShift?: number;
  speedIndex?: number;
  resourceCount?: number;
  resourceSize?: number; // bayt cinsinden
  jsHeapSize?: number; // bayt cinsinden
  cpuTime?: number; // milisaniye cinsinden
  networkRequests?: number;
  networkTransferred?: number; // bayt cinsinden
  customMetrics?: Record<string, number>;
}

// Test ağ bilgileri
export interface TestNetworkInfo {
  totalRequests?: number;
  totalSize?: number; // bayt cinsinden
  totalTime?: number; // milisaniye cinsinden
  slowestRequest?: {
    url: string;
    time: number; // milisaniye cinsinden
    size: number; // bayt cinsinden
    type: string;
  };
  failedRequests?: {
    url: string;
    status: number;
    error?: string;
  }[];
  requestsByType?: Record<string, number>;
  requestsByDomain?: Record<string, number>;
  harFile?: string; // HAR dosyasının URL'si
}

// Test yeniden deneme bilgileri
export interface TestRetryInfo {
  retryCount: number;
  maxRetries: number;
  previousAttempts: string[]; // Önceki deneme ID'leri
  retryReason?: string;
  retryStrategy?: string;
}

// Test sonuç şeması
export interface TestResultSchema {
  _id?: ObjectId;
  id: string;
  testRunId: string;
  testCaseId: string;
  testSuiteId?: string;
  name?: string;
  description?: string;
  status: TestResultStatus;
  priority?: TestPriority;
  severity?: TestSeverity;
  
  // Zamanlama
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milisaniye cinsinden
  
  // Ortam
  environment?: string;
  environmentInfo?: TestEnvironmentInfo;
  
  // Hata bilgileri
  errorMessage?: string;
  errorStack?: string;
  errorDetails?: TestErrorDetails;
  
  // Medya
  screenshots?: string[];
  media?: TestMedia[];
  
  // Performans
  performanceMetrics?: TestPerformanceMetrics;
  
  // Ağ
  networkInfo?: TestNetworkInfo;
  
  // Loglar
  logs?: string[];
  consoleOutput?: string[];
  
  // Adımlar
  steps?: string[]; // TestStepResult ID'leri
  
  // Yeniden deneme bilgileri
  retryInfo?: TestRetryInfo;
  
  // Ek bilgiler
  metadata?: Record<string, any>;
  tags?: string[];
  categories?: string[];
  
  // İzleme
  traceId?: string;
  spanId?: string;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}
