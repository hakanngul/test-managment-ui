import { BrowserType, ExecutionStatus } from '../models/enums/TestEnums';
import { v4 as uuidv4 } from 'uuid';

// Test adımı çalıştırma durumu
export enum TestStepExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PASSED = 'passed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

// Test çalıştırma ayarları
export interface TestExecutionSettings {
  browser: BrowserType;
  headless: boolean;
  takeScreenshots: boolean;
}

// Test adımı
export interface TestStep {
  action: string;
  value?: string;
  target?: string;
  strategy?: string;
  description: string;
}

// Test case
export interface ExampleTest {
  id?: string;
  name: string;
  description: string;
  browserPreference: string;
  headless: boolean;
  takeScreenshots: boolean;
  steps: TestStep[];
}

// Test adımı çalıştırma sonucu
export interface TestStepExecution {
  id: string;
  order: number;
  action: string;
  value?: string;
  target?: string;
  strategy?: string;
  description: string;
  status: TestStepExecutionStatus;
  screenshot?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milisaniye cinsinden
  error?: string;
  logs: string[];
}

// Test çalıştırma sonucu
export interface TestExecution {
  id: string;
  testName: string;
  status: ExecutionStatus;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // milisaniye cinsinden
  browser: string;
  headless: boolean;
  takeScreenshots: boolean;
  executedBy: string;
  steps: TestStepExecution[];
  logs: string[];
  screenshots: string[];
  error?: string;
}

// Varsayılan test çalıştırma ayarları
export const defaultTestExecutionSettings: TestExecutionSettings = {
  browser: BrowserType.CHROMIUM,
  headless: true,
  takeScreenshots: false
};

// Örnek test
export const exampleTest: ExampleTest = {
  id: uuidv4(),
  name: "Example.com Test",
  description: "Navigate to Example.com and check elements",
  browserPreference: "chromium",
  headless: true,
  takeScreenshots: false,
  steps: [
    {
      action: "navigate",
      value: "https://example.com",
      description: "Navigate to Example.com"
    },
    {
      action: "wait",
      value: "1000",
      description: "Wait for page to load"
    },
    {
      action: "takeScreenshot",
      description: "Take screenshot of Example.com"
    },
    {
      action: "click",
      target: "a[href='https://www.iana.org/domains/example']",
      strategy: "css",
      description: "Click on More information link"
    },
    {
      action: "wait",
      value: "2000",
      description: "Wait for IANA page to load"
    },
    {
      action: "takeScreenshot",
      description: "Take screenshot of IANA page"
    },
    {
      action: "wait",
      value: "10000",
      description: "Wait for IANA page to load"
    }
  ]
};

// Örnek test çalıştırma logları
export const sampleTestLogs: string[] = [
  '[INFO] Test başlatılıyor...',
  '[INFO] Tarayıcı başlatılıyor: Chromium',
  '[INFO] Tarayıcı başlatıldı',
  '[INFO] URL açılıyor: https://example.com',
  '[INFO] Sayfa yüklendi',
  '[INFO] Bekleniyor: 1000ms',
  '[INFO] Ekran görüntüsü alındı',
  '[INFO] Element bulunuyor: a[href=\'https://www.iana.org/domains/example\']',
  '[INFO] Element bulundu ve tıklandı',
  '[INFO] Bekleniyor: 2000ms',
  '[INFO] Ekran görüntüsü alındı',
  '[INFO] Bekleniyor: 10000ms',
  '[INFO] Test tamamlandı: BAŞARILI'
];

// Örnek hata logları
export const sampleErrorLogs: string[] = [
  '[INFO] Test başlatılıyor...',
  '[INFO] Tarayıcı başlatılıyor: Chromium',
  '[INFO] Tarayıcı başlatıldı',
  '[INFO] URL açılıyor: https://example.com',
  '[INFO] Sayfa yüklendi',
  '[INFO] Bekleniyor: 1000ms',
  '[INFO] Ekran görüntüsü alındı',
  '[INFO] Element bulunuyor: a[href=\'https://www.iana.org/domains/example\']',
  '[ERROR] Element bulunamadı: a[href=\'https://www.iana.org/domains/example\']',
  '[ERROR] Test adımı başarısız: Click on More information link',
  '[INFO] Test durduruldu',
  '[INFO] Test tamamlandı: BAŞARISIZ'
];

// Örnek ekran görüntüleri
export const sampleScreenshots: string[] = [
  'example-com.png',
  'iana-page.png'
];
