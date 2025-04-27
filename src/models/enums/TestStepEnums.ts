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
