import { ITestConfig } from './interfaces/ITestConfig';
import { BrowserType } from './enums/TestEnums';

export class TestConfig implements ITestConfig {
  id: string;
  name: string;
  description: string;
  testRunId?: string;
  testSuiteId?: string;
  environmentId: string;
  timeoutSettings: {
    defaultTimeout: number;
    pageLoadTimeout: number;
    scriptTimeout: number;
    ajaxTimeout: number;
  };
  retrySettings: {
    maxRetries: number;
    retryDelay: number;
    retryOn: string[];
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

  constructor(data: Partial<ITestConfig>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.testRunId = data.testRunId;
    this.testSuiteId = data.testSuiteId;
    this.environmentId = data.environmentId || '';
    this.timeoutSettings = data.timeoutSettings || {
      defaultTimeout: 30000,
      pageLoadTimeout: 60000,
      scriptTimeout: 30000,
      ajaxTimeout: 30000
    };
    this.retrySettings = data.retrySettings || {
      maxRetries: 2,
      retryDelay: 1000,
      retryOn: ['failure']
    };
    this.parallelSettings = data.parallelSettings || {
      maxInstances: 5,
      maxConcurrency: 3,
      shardTestFiles: true
    };
    this.browserSettings = data.browserSettings || {
      browser: BrowserType.CHROME,
      headless: false,
      width: 1366,
      height: 768
    };
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Zaman aşımı ayarlarını güncelle
  updateTimeoutSettings(settings: Partial<TestConfig['timeoutSettings']>): void {
    this.timeoutSettings = { ...this.timeoutSettings, ...settings };
    this.updatedAt = new Date();
  }

  // Yeniden deneme ayarlarını güncelle
  updateRetrySettings(settings: Partial<TestConfig['retrySettings']>): void {
    this.retrySettings = { ...this.retrySettings, ...settings };
    this.updatedAt = new Date();
  }

  // Paralel çalıştırma ayarlarını güncelle
  updateParallelSettings(settings: Partial<TestConfig['parallelSettings']>): void {
    this.parallelSettings = { ...this.parallelSettings, ...settings };
    this.updatedAt = new Date();
  }

  // Tarayıcı ayarlarını güncelle
  updateBrowserSettings(settings: Partial<TestConfig['browserSettings']>): void {
    this.browserSettings = { ...this.browserSettings, ...settings };
    this.updatedAt = new Date();
  }

  // Tarayıcı argümanı ekle
  addBrowserArg(arg: string): void {
    if (!this.browserSettings.args) {
      this.browserSettings.args = [];
    }
    if (!this.browserSettings.args.includes(arg)) {
      this.browserSettings.args.push(arg);
      this.updatedAt = new Date();
    }
  }

  // Tarayıcı argümanı kaldır
  removeBrowserArg(arg: string): void {
    if (this.browserSettings.args) {
      this.browserSettings.args = this.browserSettings.args.filter(a => a !== arg);
      this.updatedAt = new Date();
    }
  }

  // Tarayıcı özelliği ekle veya güncelle
  setBrowserCapability(key: string, value: any): void {
    if (!this.browserSettings.capabilities) {
      this.browserSettings.capabilities = {};
    }
    this.browserSettings.capabilities[key] = value;
    this.updatedAt = new Date();
  }

  // Tarayıcı özelliği kaldır
  removeBrowserCapability(key: string): void {
    if (this.browserSettings.capabilities && key in this.browserSettings.capabilities) {
      delete this.browserSettings.capabilities[key];
      this.updatedAt = new Date();
    }
  }

  // Test yapılandırmasını JSON formatına dönüştür
  toJSON(): ITestConfig {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      testRunId: this.testRunId,
      testSuiteId: this.testSuiteId,
      environmentId: this.environmentId,
      timeoutSettings: this.timeoutSettings,
      retrySettings: this.retrySettings,
      parallelSettings: this.parallelSettings,
      browserSettings: this.browserSettings,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
