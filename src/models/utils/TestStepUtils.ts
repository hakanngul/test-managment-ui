import { TestStepActionType, TestStepTargetType } from '../enums/TestStepEnums';
import { TestStep } from '../interfaces/TestStep';

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
