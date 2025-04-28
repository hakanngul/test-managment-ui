import { TestResultStatus } from '../enums/TestEnums';

export interface ITestResult {
  id: string;
  testRunId: string;
  testCaseId: string;
  status: TestResultStatus;
  executionTime: number; // Milisaniye cinsinden
  errorMessage?: string;
  errorDetails?: string;
  screenshot?: string;
  stackTrace?: string;
  logs?: string[];
  videoRecording?: string;
  performance?: {
    loadTime?: number;
    renderTime?: number;
    networkRequests?: number;
    memoryUsage?: number;
    cpuUsage?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  testDefectIds?: string[]; // İlişkili hataların ID'leri
}
