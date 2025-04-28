import { BrowserType } from '../enums/TestEnums';

export interface ITestConfig {
  id: string;
  name: string;
  description: string;
  testRunId?: string;
  testSuiteId?: string;
  environmentId: string;
  timeoutSettings: {
    defaultTimeout: number; // Milisaniye cinsinden
    pageLoadTimeout: number;
    scriptTimeout: number;
    ajaxTimeout: number;
  };
  retrySettings: {
    maxRetries: number;
    retryDelay: number;
    retryOn: string[]; // Hangi durumlarda yeniden deneneceği
  };
  parallelSettings: {
    maxInstances: number;
    maxConcurrency: number;
    shardTestFiles: boolean;
  };
  browserSettings: {
    browser: BrowserType;
    headless: boolean;
    width: number;
    height: number;
    args?: string[];
    capabilities?: Record<string, any>;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
