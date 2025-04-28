import { BrowserType } from '../../models/enums/TestEnums';

// Tarayıcı ayarları arayüzü
export interface BrowserSettings {
  browser: BrowserType;
  headless: boolean;
  width: number;
  height: number;
  timeout: number;
  takeScreenshots?: boolean; // Ekran görüntüsü alma özelliği
  screenshotOnFailure?: boolean; // Sadece hata durumunda ekran görüntüsü al
  screenshotPath?: string; // Ekran görüntülerinin kaydedileceği yol
  userAgent?: string;
  args?: string[];
  ignoreHTTPSErrors?: boolean;
  slowMo?: number;
  recordVideo?: boolean;
  recordHAR?: boolean;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
  proxy?: {
    server: string;
    username?: string;
    password?: string;
  };
}

// Test adımı türleri
export enum TestStepActionType {
  NAVIGATE = 'navigate',
  CLICK = 'click',
  TYPE = 'type',
  WAIT = 'wait',
  TAKE_SCREENSHOT = 'takeScreenshot',
  ASSERT_TEXT = 'assertText',
  ASSERT_ELEMENT = 'assertElement',
  ASSERT_URL = 'assertUrl',
  HOVER = 'hover',
  SELECT = 'select',
  CHECK = 'check',
  UNCHECK = 'uncheck',
  PRESS_KEY = 'pressKey',
  SCROLL = 'scroll',
  EXECUTE_JS = 'executeJs',
  CLEAR = 'clear',
  FOCUS = 'focus',
  BLUR = 'blur',
  DRAG_AND_DROP = 'dragAndDrop',
  UPLOAD_FILE = 'uploadFile',
  REFRESH = 'refresh',
  BACK = 'back',
  FORWARD = 'forward'
}

// Test adımı arayüzü
export interface TestStep {
  id: string;
  action: TestStepActionType;
  description: string;
  selector?: string;
  value?: string;
  order: number;
}

// Adım türüne göre gerekli alanları belirle
export const getRequiredFields = (action: TestStepActionType): { selector: boolean; value: boolean } => {
  switch (action) {
    case TestStepActionType.NAVIGATE:
      return { selector: false, value: true };
    case TestStepActionType.CLICK:
    case TestStepActionType.HOVER:
    case TestStepActionType.ASSERT_ELEMENT:
    case TestStepActionType.FOCUS:
    case TestStepActionType.BLUR:
    case TestStepActionType.CHECK:
    case TestStepActionType.UNCHECK:
      return { selector: true, value: false };
    case TestStepActionType.TYPE:
    case TestStepActionType.ASSERT_TEXT:
    case TestStepActionType.SELECT:
      return { selector: true, value: true };
    case TestStepActionType.WAIT:
    case TestStepActionType.PRESS_KEY:
    case TestStepActionType.EXECUTE_JS:
      return { selector: false, value: true };
    case TestStepActionType.TAKE_SCREENSHOT:
      return { selector: false, value: true };
    case TestStepActionType.ASSERT_URL:
      return { selector: false, value: true };
    case TestStepActionType.DRAG_AND_DROP:
      return { selector: true, value: true }; // value alanı hedef seçici olarak kullanılır
    case TestStepActionType.UPLOAD_FILE:
      return { selector: true, value: true }; // value alanı dosya yolu olarak kullanılır
    case TestStepActionType.SCROLL:
      return { selector: true, value: true }; // value alanı kaydırma miktarı olarak kullanılır
    case TestStepActionType.REFRESH:
    case TestStepActionType.BACK:
    case TestStepActionType.FORWARD:
    case TestStepActionType.CLEAR:
      return { selector: false, value: false };
    default:
      return { selector: false, value: false };
  }
};

// Adım türüne göre açıklama metni
export const getActionDescription = (action: TestStepActionType): string => {
  switch (action) {
    case TestStepActionType.NAVIGATE: return 'Belirtilen URL\'ye git';
    case TestStepActionType.CLICK: return 'Belirtilen elemana tıkla';
    case TestStepActionType.TYPE: return 'Belirtilen elemana metin yaz';
    case TestStepActionType.WAIT: return 'Belirtilen süre kadar bekle (ms)';
    case TestStepActionType.TAKE_SCREENSHOT: return 'Ekran görüntüsü al';
    case TestStepActionType.ASSERT_TEXT: return 'Belirtilen elemanda metin olduğunu doğrula';
    case TestStepActionType.ASSERT_ELEMENT: return 'Belirtilen elemanın varlığını doğrula';
    case TestStepActionType.ASSERT_URL: return 'Mevcut URL\'yi doğrula';
    case TestStepActionType.HOVER: return 'Belirtilen elemanın üzerine gel';
    case TestStepActionType.SELECT: return 'Belirtilen select elemanından değer seç';
    case TestStepActionType.CHECK: return 'Belirtilen checkbox\'ı işaretle';
    case TestStepActionType.UNCHECK: return 'Belirtilen checkbox\'ın işaretini kaldır';
    case TestStepActionType.PRESS_KEY: return 'Belirtilen tuşa bas';
    case TestStepActionType.SCROLL: return 'Sayfayı veya elemanı kaydır';
    case TestStepActionType.EXECUTE_JS: return 'JavaScript kodu çalıştır';
    case TestStepActionType.CLEAR: return 'Belirtilen elemanın içeriğini temizle';
    case TestStepActionType.FOCUS: return 'Belirtilen elemana odaklan';
    case TestStepActionType.BLUR: return 'Belirtilen elemandan odağı kaldır';
    case TestStepActionType.DRAG_AND_DROP: return 'Belirtilen elemanı sürükle ve bırak';
    case TestStepActionType.UPLOAD_FILE: return 'Belirtilen elemana dosya yükle';
    case TestStepActionType.REFRESH: return 'Sayfayı yenile';
    case TestStepActionType.BACK: return 'Tarayıcıda geri git';
    case TestStepActionType.FORWARD: return 'Tarayıcıda ileri git';
    default: return '';
  }
};

// Adım türüne göre değer alanı etiketi
export const getValueLabel = (action: TestStepActionType): string => {
  switch (action) {
    case TestStepActionType.NAVIGATE: return 'URL';
    case TestStepActionType.TYPE: return 'Metin';
    case TestStepActionType.WAIT: return 'Süre (ms)';
    case TestStepActionType.TAKE_SCREENSHOT: return 'Dosya Adı';
    case TestStepActionType.ASSERT_TEXT: return 'Beklenen Metin';
    case TestStepActionType.ASSERT_URL: return 'Beklenen URL';
    case TestStepActionType.SELECT: return 'Seçilecek Değer';
    case TestStepActionType.PRESS_KEY: return 'Tuş';
    case TestStepActionType.EXECUTE_JS: return 'JavaScript Kodu';
    case TestStepActionType.DRAG_AND_DROP: return 'Hedef Seçici';
    case TestStepActionType.UPLOAD_FILE: return 'Dosya Yolu';
    case TestStepActionType.SCROLL: return 'Kaydırma Miktarı';
    default: return 'Değer';
  }
};
