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

// Test adımı için model
export interface TestStep {
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
}

// Belirli action'lar için hedef gerekli mi?
export const actionRequiresTarget = (action: TestStepActionType): boolean => {
  const actionsWithoutTarget = [
    TestStepActionType.BACK,
    TestStepActionType.FORWARD,
    TestStepActionType.REFRESH,
    TestStepActionType.WAIT,
    TestStepActionType.SCREENSHOT,
    TestStepActionType.COMMENT,
    TestStepActionType.EXECUTE_SCRIPT
  ];
  
  return !actionsWithoutTarget.includes(action);
};

// Belirli action'lar için değer gerekli mi?
export const actionRequiresValue = (action: TestStepActionType): boolean => {
  const actionsRequiringValue = [
    TestStepActionType.TYPE,
    TestStepActionType.SELECT,
    TestStepActionType.NAVIGATE,
    TestStepActionType.WAIT,
    TestStepActionType.ASSERT_TEXT,
    TestStepActionType.ASSERT_TITLE,
    TestStepActionType.ASSERT_URL,
    TestStepActionType.ASSERT_VALUE,
    TestStepActionType.UPLOAD_FILE,
    TestStepActionType.PRESS_KEY,
    TestStepActionType.EXECUTE_SCRIPT,
    TestStepActionType.COMMENT
  ];
  
  return actionsRequiringValue.includes(action);
};

// Action'lar için insan tarafından okunabilir etiketler
export const actionLabels: Record<TestStepActionType, string> = {
  [TestStepActionType.CLICK]: 'Tıkla',
  [TestStepActionType.DOUBLE_CLICK]: 'Çift Tıkla',
  [TestStepActionType.RIGHT_CLICK]: 'Sağ Tıkla',
  [TestStepActionType.TYPE]: 'Yaz',
  [TestStepActionType.CLEAR]: 'Temizle',
  [TestStepActionType.SELECT]: 'Seç',
  [TestStepActionType.CHECK]: 'İşaretle',
  [TestStepActionType.UNCHECK]: 'İşareti Kaldır',
  [TestStepActionType.NAVIGATE]: 'Git',
  [TestStepActionType.BACK]: 'Geri',
  [TestStepActionType.FORWARD]: 'İleri',
  [TestStepActionType.REFRESH]: 'Yenile',
  [TestStepActionType.WAIT]: 'Bekle',
  [TestStepActionType.WAIT_FOR_ELEMENT]: 'Element İçin Bekle',
  [TestStepActionType.WAIT_FOR_NAVIGATION]: 'Navigasyon İçin Bekle',
  [TestStepActionType.ASSERT_TEXT]: 'Metin Doğrula',
  [TestStepActionType.ASSERT_ELEMENT_PRESENT]: 'Element Var mı Doğrula',
  [TestStepActionType.ASSERT_ELEMENT_NOT_PRESENT]: 'Element Yok mu Doğrula',
  [TestStepActionType.ASSERT_TITLE]: 'Başlık Doğrula',
  [TestStepActionType.ASSERT_URL]: 'URL Doğrula',
  [TestStepActionType.ASSERT_VALUE]: 'Değer Doğrula',
  [TestStepActionType.ASSERT_CHECKED]: 'İşaretli mi Doğrula',
  [TestStepActionType.ASSERT_NOT_CHECKED]: 'İşaretli Değil mi Doğrula',
  [TestStepActionType.HOVER]: 'Üzerine Gel',
  [TestStepActionType.DRAG_AND_DROP]: 'Sürükle ve Bırak',
  [TestStepActionType.UPLOAD_FILE]: 'Dosya Yükle',
  [TestStepActionType.PRESS_KEY]: 'Tuşa Bas',
  [TestStepActionType.FOCUS]: 'Odaklan',
  [TestStepActionType.BLUR]: 'Odağı Kaldır',
  [TestStepActionType.SCROLL_TO]: 'Kaydır',
  [TestStepActionType.EXECUTE_SCRIPT]: 'Script Çalıştır',
  [TestStepActionType.CUSTOM]: 'Özel',
  [TestStepActionType.SCREENSHOT]: 'Ekran Görüntüsü Al',
  [TestStepActionType.COMMENT]: 'Yorum'
};

// Target türleri için insan tarafından okunabilir etiketler
export const targetTypeLabels: Record<TestStepTargetType, string> = {
  [TestStepTargetType.CSS_SELECTOR]: 'CSS Seçici',
  [TestStepTargetType.XPATH]: 'XPath',
  [TestStepTargetType.ID]: 'ID',
  [TestStepTargetType.NAME]: 'Name',
  [TestStepTargetType.LINK_TEXT]: 'Link Metni',
  [TestStepTargetType.PARTIAL_LINK_TEXT]: 'Kısmi Link Metni',
  [TestStepTargetType.TAG_NAME]: 'Etiket Adı',
  [TestStepTargetType.CLASS_NAME]: 'Sınıf Adı',
  [TestStepTargetType.NONE]: 'Hiçbiri'
};

// Yeni bir test adımı oluştur
export const createNewTestStep = (order: number): TestStep => ({
  id: `step-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  order,
  action: TestStepActionType.CLICK,
  targetType: TestStepTargetType.CSS_SELECTOR,
  target: '',
  value: '',
  description: '',
  expectedResult: '',
  screenshot: false,
  isManual: false
});

// Action'a göre hedef türü önerisi
export const suggestTargetTypeForAction = (action: TestStepActionType): TestStepTargetType => {
  if (!actionRequiresTarget(action)) {
    return TestStepTargetType.NONE;
  }
  
  // Navigasyon için URL kullanılır, bu yüzden hedef türü önemli değil
  if (action === TestStepActionType.NAVIGATE) {
    return TestStepTargetType.NONE;
  }
  
  // Varsayılan olarak CSS seçici kullan
  return TestStepTargetType.CSS_SELECTOR;
};

// Action'a göre değer alanı için ipucu
export const getValuePlaceholderForAction = (action: TestStepActionType): string => {
  switch (action) {
    case TestStepActionType.TYPE:
      return 'Yazılacak metin';
    case TestStepActionType.SELECT:
      return 'Seçilecek değer';
    case TestStepActionType.NAVIGATE:
      return 'https://example.com';
    case TestStepActionType.WAIT:
      return 'Bekleme süresi (ms)';
    case TestStepActionType.ASSERT_TEXT:
      return 'Doğrulanacak metin';
    case TestStepActionType.ASSERT_TITLE:
      return 'Doğrulanacak başlık';
    case TestStepActionType.ASSERT_URL:
      return 'Doğrulanacak URL';
    case TestStepActionType.ASSERT_VALUE:
      return 'Doğrulanacak değer';
    case TestStepActionType.UPLOAD_FILE:
      return 'Dosya yolu';
    case TestStepActionType.PRESS_KEY:
      return 'Tuş (örn: Enter, Tab, A)';
    case TestStepActionType.EXECUTE_SCRIPT:
      return 'JavaScript kodu';
    case TestStepActionType.COMMENT:
      return 'Yorum metni';
    default:
      return '';
  }
};

// Action'a göre hedef alanı için ipucu
export const getTargetPlaceholderForAction = (action: TestStepActionType): string => {
  if (!actionRequiresTarget(action)) {
    return '';
  }
  
  switch (action) {
    case TestStepActionType.CLICK:
    case TestStepActionType.DOUBLE_CLICK:
    case TestStepActionType.RIGHT_CLICK:
      return 'Tıklanacak elementin seçicisi';
    case TestStepActionType.TYPE:
    case TestStepActionType.CLEAR:
      return 'Metin alanının seçicisi';
    case TestStepActionType.SELECT:
      return 'Select elementinin seçicisi';
    case TestStepActionType.CHECK:
    case TestStepActionType.UNCHECK:
      return 'Checkbox elementinin seçicisi';
    case TestStepActionType.WAIT_FOR_ELEMENT:
      return 'Beklenecek elementin seçicisi';
    case TestStepActionType.ASSERT_TEXT:
    case TestStepActionType.ASSERT_ELEMENT_PRESENT:
    case TestStepActionType.ASSERT_ELEMENT_NOT_PRESENT:
      return 'Doğrulanacak elementin seçicisi';
    case TestStepActionType.ASSERT_VALUE:
      return 'Değeri doğrulanacak elementin seçicisi';
    case TestStepActionType.ASSERT_CHECKED:
    case TestStepActionType.ASSERT_NOT_CHECKED:
      return 'Checkbox elementinin seçicisi';
    case TestStepActionType.HOVER:
      return 'Üzerine gelinecek elementin seçicisi';
    case TestStepActionType.DRAG_AND_DROP:
      return 'Sürüklenecek elementin seçicisi';
    case TestStepActionType.UPLOAD_FILE:
      return 'Dosya input elementinin seçicisi';
    case TestStepActionType.FOCUS:
    case TestStepActionType.BLUR:
      return 'Odaklanılacak elementin seçicisi';
    case TestStepActionType.SCROLL_TO:
      return 'Kaydırılacak elementin seçicisi';
    default:
      return 'Elementin seçicisi';
  }
};
