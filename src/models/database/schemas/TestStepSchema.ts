import { ObjectId } from 'mongodb';

// Test adımı için action türleri
export enum TestStepActionType {
  // Temel etkileşimler
  CLICK = 'click',
  DOUBLE_CLICK = 'doubleClick',
  RIGHT_CLICK = 'rightClick',
  TYPE = 'type',
  CLEAR = 'clear',
  SELECT = 'select',
  CHECK = 'check',
  UNCHECK = 'uncheck',
  
  // Navigasyon
  NAVIGATE = 'navigate',
  BACK = 'back',
  FORWARD = 'forward',
  REFRESH = 'refresh',
  
  // Bekleme
  WAIT = 'wait',
  WAIT_FOR_ELEMENT = 'waitForElement',
  WAIT_FOR_NAVIGATION = 'waitForNavigation',
  
  // Doğrulama
  ASSERT_TEXT = 'assertText',
  ASSERT_ELEMENT_PRESENT = 'assertElementPresent',
  ASSERT_ELEMENT_NOT_PRESENT = 'assertElementNotPresent',
  ASSERT_TITLE = 'assertTitle',
  ASSERT_URL = 'assertUrl',
  ASSERT_VALUE = 'assertValue',
  ASSERT_CHECKED = 'assertChecked',
  ASSERT_NOT_CHECKED = 'assertNotChecked',
  
  // Gelişmiş etkileşimler
  HOVER = 'hover',
  DRAG_AND_DROP = 'dragAndDrop',
  UPLOAD_FILE = 'uploadFile',
  PRESS_KEY = 'pressKey',
  FOCUS = 'focus',
  BLUR = 'blur',
  SCROLL_TO = 'scrollTo',
  EXECUTE_SCRIPT = 'executeScript',
  
  // Özel
  CUSTOM = 'custom',
  SCREENSHOT = 'screenshot',
  COMMENT = 'comment'
}

// Test adımı için target türleri
export enum TestStepTargetType {
  CSS_SELECTOR = 'cssSelector',
  XPATH = 'xpath',
  ID = 'id',
  NAME = 'name',
  LINK_TEXT = 'linkText',
  PARTIAL_LINK_TEXT = 'partialLinkText',
  TAG_NAME = 'tagName',
  CLASS_NAME = 'className',
  NONE = 'none'
}

// Test adımı şeması
export interface TestStepSchema {
  _id?: ObjectId;
  id: string;
  order: number;
  action: TestStepActionType;
  target?: string;
  targetType?: TestStepTargetType;
  value?: string;
  description?: string;
  expectedResult?: string;
  screenshot?: boolean;
  isManual?: boolean;
  testCaseId?: string; // İlişkili test case ID'si
}
