import { ObjectId } from 'mongodb';
import { TestResultStatus } from './TestResultSchema';

// Test adım sonuç durumları
export enum TestStepResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

// Test adım hata detayları
export interface TestStepErrorDetails {
  message: string;
  stack?: string;
  code?: string;
  location?: string;
  line?: number;
  column?: number;
  screenshot?: string;
  details?: Record<string, any>;
}

// Test adım medya
export interface TestStepMedia {
  type: string;
  url: string;
  name?: string;
  description?: string;
  timestamp?: Date;
}

// Test adım performans metrikleri
export interface TestStepPerformanceMetrics {
  executionTime?: number; // milisaniye cinsinden
  networkTime?: number; // milisaniye cinsinden
  renderTime?: number; // milisaniye cinsinden
  totalTime?: number; // milisaniye cinsinden
  cpuTime?: number; // milisaniye cinsinden
  memoryUsage?: number; // bayt cinsinden
  customMetrics?: Record<string, number>;
}

// Test adım sonuç şeması
export interface TestStepResultSchema {
  _id?: ObjectId;
  id: string;
  testResultId: string; // İlişkili test sonuç ID'si
  testStepId: string; // İlişkili test adım ID'si
  order: number;
  description: string;
  expectedResult?: string;
  actualResult?: string;
  status: TestStepResultStatus;
  duration?: number; // milisaniye cinsinden
  startTime?: Date;
  endTime?: Date;
  
  // Hata bilgileri
  errorMessage?: string | null;
  errorDetails?: TestStepErrorDetails;
  
  // Medya
  screenshot?: string | null;
  media?: TestStepMedia[];
  
  // Performans
  performanceMetrics?: TestStepPerformanceMetrics;
  
  // Loglar
  logs?: string[];
  consoleOutput?: string[];
  
  // Yeniden deneme bilgileri
  retryCount?: number;
  previousAttempts?: string[]; // Önceki deneme ID'leri
  
  // Ek bilgiler
  metadata?: Record<string, any>;
  tags?: string[];
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}
