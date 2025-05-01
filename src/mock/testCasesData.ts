import { TestCase, TestCaseStatus, TestCasePriority, TestCaseCategory, TestCaseResult, TestStepStatus } from '../models/interfaces/ITestCase';

// Login Test Case
export const loginTestCase: TestCase = {
  id: 'tc-001',
  name: 'Kullanıcı Girişi Testi',
  description: 'Kullanıcının sisteme başarılı bir şekilde giriş yapabildiğini doğrular.',
  status: TestCaseStatus.ACTIVE,
  priority: TestCasePriority.HIGH,
  category: TestCaseCategory.FUNCTIONAL,
  tags: ['login', 'authentication', 'security'],
  createdBy: 'Hakan Gül',
  createdAt: new Date('2023-08-15T10:30:00.000Z'),
  updatedAt: new Date('2023-11-10T14:45:00.000Z'),
  lastRun: new Date('2023-11-18T09:15:00.000Z'),
  lastResult: TestCaseResult.PASSED,
  browser: 'Chrome',
  environment: 'Production',
  estimatedDuration: 60,
  actualDuration: 45,
  steps: [
    {
      id: 'step-1',
      order: 1,
      description: 'Login sayfasına git',
      expectedResult: 'Login sayfası görüntülenir',
      action: 'NAVIGATE',
      selector: null,
      value: 'https://example.com/login',
      status: TestStepStatus.PASSED,
      duration: 1200
    },
    {
      id: 'step-2',
      order: 2,
      description: 'Kullanıcı adını gir',
      expectedResult: 'Kullanıcı adı alanına metin girilir',
      action: 'TYPE',
      selector: '#username',
      value: 'testuser',
      status: TestStepStatus.PASSED,
      duration: 800
    },
    {
      id: 'step-3',
      order: 3,
      description: 'Şifreyi gir',
      expectedResult: 'Şifre alanına metin girilir',
      action: 'TYPE',
      selector: '#password',
      value: 'password123',
      status: TestStepStatus.PASSED,
      duration: 750
    },
    {
      id: 'step-4',
      order: 4,
      description: 'Giriş butonuna tıkla',
      expectedResult: 'Giriş işlemi başlatılır',
      action: 'CLICK',
      selector: '#loginButton',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 500
    },
    {
      id: 'step-5',
      order: 5,
      description: 'Dashboard sayfasının yüklendiğini kontrol et',
      expectedResult: 'Dashboard sayfası görüntülenir',
      action: 'ASSERT_URL',
      selector: null,
      value: 'https://example.com/dashboard',
      status: TestStepStatus.PASSED,
      duration: 1500
    }
  ],
  prerequisites: ['Geçerli kullanıcı hesabı'],
  testSuiteId: 'ts-001',
  projectId: 'proj-001',
  automated: true
};

// Product Search Test Case
export const productSearchTestCase: TestCase = {
  id: 'tc-002',
  name: 'Ürün Arama Testi',
  description: 'Kullanıcının ürün arama özelliğini kullanarak ürünleri bulabildiğini doğrular.',
  status: TestCaseStatus.ACTIVE,
  priority: TestCasePriority.MEDIUM,
  category: TestCaseCategory.FUNCTIONAL,
  tags: ['search', 'product', 'ui'],
  createdBy: 'Ahmet Yılmaz',
  createdAt: new Date('2023-09-05T11:20:00.000Z'),
  updatedAt: new Date('2023-11-20T16:30:00.000Z'),
  lastRun: new Date('2023-11-17T10:45:00.000Z'),
  lastResult: TestCaseResult.FAILED,
  browser: 'Firefox',
  environment: 'Staging',
  estimatedDuration: 90,
  actualDuration: 105,
  steps: [
    {
      id: 'step-1',
      order: 1,
      description: 'Ana sayfaya git',
      expectedResult: 'Ana sayfa görüntülenir',
      action: 'NAVIGATE',
      selector: null,
      value: 'https://example.com',
      status: TestStepStatus.PASSED,
      duration: 1500
    },
    {
      id: 'step-2',
      order: 2,
      description: 'Arama kutusuna tıkla',
      expectedResult: 'Arama kutusu aktif hale gelir',
      action: 'CLICK',
      selector: '#searchBox',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 600
    },
    {
      id: 'step-3',
      order: 3,
      description: 'Arama terimini gir',
      expectedResult: 'Arama kutusuna metin girilir',
      action: 'TYPE',
      selector: '#searchBox',
      value: 'akıllı telefon',
      status: TestStepStatus.PASSED,
      duration: 1200
    },
    {
      id: 'step-4',
      order: 4,
      description: 'Ara butonuna tıkla',
      expectedResult: 'Arama işlemi başlatılır',
      action: 'CLICK',
      selector: '#searchButton',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 500
    },
    {
      id: 'step-5',
      order: 5,
      description: 'Arama sonuçlarının yüklendiğini kontrol et',
      expectedResult: 'Arama sonuçları sayfası görüntülenir',
      action: 'ASSERT_URL',
      selector: null,
      value: 'https://example.com/search?q=akıllı%20telefon',
      status: TestStepStatus.PASSED,
      duration: 1800
    },
    {
      id: 'step-6',
      order: 6,
      description: 'Sonuç listesinde ürünlerin görüntülendiğini kontrol et',
      expectedResult: 'En az bir ürün görüntülenir',
      action: 'ASSERT_ELEMENT',
      selector: '.product-item',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 1000
    },
    {
      id: 'step-7',
      order: 7,
      description: 'Sonuç sayısının doğru olduğunu kontrol et',
      expectedResult: 'Sonuç sayısı gösterilir ve sıfırdan büyüktür',
      action: 'ASSERT_TEXT',
      selector: '.results-count',
      value: '0 sonuç',
      status: TestStepStatus.FAILED,
      duration: 800
    }
  ],
  prerequisites: ['Sistemde kayıtlı ürünler'],
  testSuiteId: 'ts-001',
  projectId: 'proj-001',
  automated: true
};

// Checkout Test Case
export const checkoutTestCase: TestCase = {
  id: 'tc-003',
  name: 'Ödeme İşlemi Testi',
  description: 'Kullanıcının ödeme işlemini başarıyla tamamlayabildiğini doğrular.',
  status: TestCaseStatus.ACTIVE,
  priority: TestCasePriority.CRITICAL,
  category: TestCaseCategory.INTEGRATION,
  tags: ['payment', 'checkout', 'integration'],
  createdBy: 'Ayşe Kaya',
  createdAt: new Date('2023-07-01T14:45:00.000Z'),
  updatedAt: new Date('2023-11-12T11:10:00.000Z'),
  lastRun: new Date('2023-11-15T16:20:00.000Z'),
  lastResult: TestCaseResult.PASSED,
  browser: 'Chrome',
  environment: 'Production',
  estimatedDuration: 180,
  actualDuration: 165,
  steps: [
    {
      id: 'step-1',
      order: 1,
      description: 'Sepet sayfasına git',
      expectedResult: 'Sepet sayfası görüntülenir',
      action: 'NAVIGATE',
      selector: null,
      value: 'https://example.com/cart',
      status: TestStepStatus.PASSED,
      duration: 1300
    },
    {
      id: 'step-2',
      order: 2,
      description: 'Sepette ürün olduğunu kontrol et',
      expectedResult: 'En az bir ürün görüntülenir',
      action: 'ASSERT_ELEMENT',
      selector: '.cart-item',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 800
    },
    {
      id: 'step-3',
      order: 3,
      description: 'Ödeme adımına geç butonuna tıkla',
      expectedResult: 'Ödeme sayfasına yönlendirilir',
      action: 'CLICK',
      selector: '#proceedToCheckout',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 600
    },
    {
      id: 'step-4',
      order: 4,
      description: 'Teslimat adresini seç',
      expectedResult: 'Adres seçilir',
      action: 'CLICK',
      selector: '#address-1',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 700
    },
    {
      id: 'step-5',
      order: 5,
      description: 'Teslimat yöntemini seç',
      expectedResult: 'Teslimat yöntemi seçilir',
      action: 'CLICK',
      selector: '#shipping-method-2',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 600
    },
    {
      id: 'step-6',
      order: 6,
      description: 'Ödeme yöntemine geç butonuna tıkla',
      expectedResult: 'Ödeme yöntemi sayfasına yönlendirilir',
      action: 'CLICK',
      selector: '#nextToPayment',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 800
    },
    {
      id: 'step-7',
      order: 7,
      description: 'Kredi kartı ödeme yöntemini seç',
      expectedResult: 'Kredi kartı formu görüntülenir',
      action: 'CLICK',
      selector: '#payment-method-cc',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 700
    },
    {
      id: 'step-8',
      order: 8,
      description: 'Kart numarasını gir',
      expectedResult: 'Kart numarası alanına metin girilir',
      action: 'TYPE',
      selector: '#card-number',
      value: '4111111111111111',
      status: TestStepStatus.PASSED,
      duration: 900
    },
    {
      id: 'step-9',
      order: 9,
      description: 'Son kullanma tarihini gir',
      expectedResult: 'Son kullanma tarihi alanına metin girilir',
      action: 'TYPE',
      selector: '#expiry-date',
      value: '12/25',
      status: TestStepStatus.PASSED,
      duration: 700
    },
    {
      id: 'step-10',
      order: 10,
      description: 'CVV kodunu gir',
      expectedResult: 'CVV alanına metin girilir',
      action: 'TYPE',
      selector: '#cvv',
      value: '123',
      status: TestStepStatus.PASSED,
      duration: 600
    },
    {
      id: 'step-11',
      order: 11,
      description: 'Siparişi tamamla butonuna tıkla',
      expectedResult: 'Ödeme işlemi başlatılır',
      action: 'CLICK',
      selector: '#completeOrder',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 1000
    },
    {
      id: 'step-12',
      order: 12,
      description: 'Sipariş onay sayfasının görüntülendiğini kontrol et',
      expectedResult: 'Sipariş onay sayfası görüntülenir',
      action: 'ASSERT_URL',
      selector: null,
      value: 'https://example.com/order-confirmation',
      status: TestStepStatus.PASSED,
      duration: 2000
    }
  ],
  prerequisites: ['Kullanıcı girişi yapılmış olmalı', 'Sepette ürün bulunmalı', 'Geçerli ödeme bilgileri'],
  testSuiteId: 'ts-002',
  projectId: 'proj-001',
  automated: true
};

// User Registration Test Case
export const userRegistrationTestCase: TestCase = {
  id: 'tc-004',
  name: 'Kullanıcı Kaydı Testi',
  description: 'Yeni bir kullanıcının başarıyla kayıt olabildiğini doğrular.',
  status: TestCaseStatus.ACTIVE,
  priority: TestCasePriority.HIGH,
  category: TestCaseCategory.FUNCTIONAL,
  tags: ['registration', 'user', 'security'],
  createdBy: 'Mehmet Demir',
  createdAt: new Date('2023-08-10T09:15:00.000Z'),
  updatedAt: new Date('2023-10-05T13:20:00.000Z'),
  lastRun: new Date('2023-11-16T14:30:00.000Z'),
  lastResult: TestCaseResult.PASSED,
  browser: 'Chrome',
  environment: 'Staging',
  estimatedDuration: 120,
  actualDuration: 95,
  steps: [
    {
      id: 'step-1',
      order: 1,
      description: 'Kayıt sayfasına git',
      expectedResult: 'Kayıt sayfası görüntülenir',
      action: 'NAVIGATE',
      selector: null,
      value: 'https://example.com/register',
      status: TestStepStatus.PASSED,
      duration: 1200
    },
    {
      id: 'step-2',
      order: 2,
      description: 'Ad alanını doldur',
      expectedResult: 'Ad alanına metin girilir',
      action: 'TYPE',
      selector: '#firstName',
      value: 'Test',
      status: TestStepStatus.PASSED,
      duration: 700
    },
    {
      id: 'step-3',
      order: 3,
      description: 'Soyad alanını doldur',
      expectedResult: 'Soyad alanına metin girilir',
      action: 'TYPE',
      selector: '#lastName',
      value: 'User',
      status: TestStepStatus.PASSED,
      duration: 600
    },
    {
      id: 'step-4',
      order: 4,
      description: 'E-posta alanını doldur',
      expectedResult: 'E-posta alanına metin girilir',
      action: 'TYPE',
      selector: '#email',
      value: 'testuser@example.com',
      status: TestStepStatus.PASSED,
      duration: 800
    },
    {
      id: 'step-5',
      order: 5,
      description: 'Şifre alanını doldur',
      expectedResult: 'Şifre alanına metin girilir',
      action: 'TYPE',
      selector: '#password',
      value: 'SecurePassword123!',
      status: TestStepStatus.PASSED,
      duration: 700
    },
    {
      id: 'step-6',
      order: 6,
      description: 'Şifre tekrar alanını doldur',
      expectedResult: 'Şifre tekrar alanına metin girilir',
      action: 'TYPE',
      selector: '#confirmPassword',
      value: 'SecurePassword123!',
      status: TestStepStatus.PASSED,
      duration: 600
    },
    {
      id: 'step-7',
      order: 7,
      description: 'Kullanım şartlarını kabul et',
      expectedResult: 'Kullanım şartları onay kutusu işaretlenir',
      action: 'CLICK',
      selector: '#termsCheckbox',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 500
    },
    {
      id: 'step-8',
      order: 8,
      description: 'Kayıt ol butonuna tıkla',
      expectedResult: 'Kayıt işlemi başlatılır',
      action: 'CLICK',
      selector: '#registerButton',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 800
    },
    {
      id: 'step-9',
      order: 9,
      description: 'Kayıt işleminin başarılı olduğunu kontrol et',
      expectedResult: 'Başarılı kayıt mesajı görüntülenir',
      action: 'ASSERT_ELEMENT',
      selector: '.registration-success',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 1000
    },
    {
      id: 'step-10',
      order: 10,
      description: 'E-posta doğrulama sayfasına yönlendirildiğini kontrol et',
      expectedResult: 'E-posta doğrulama sayfası görüntülenir',
      action: 'ASSERT_URL',
      selector: null,
      value: 'https://example.com/verify-email',
      status: TestStepStatus.PASSED,
      duration: 1500
    }
  ],
  prerequisites: ['Geçerli e-posta adresi'],
  testSuiteId: 'ts-003',
  projectId: 'proj-001',
  automated: true
};

// Profile Update Test Case
export const profileUpdateTestCase: TestCase = {
  id: 'tc-005',
  name: 'Kullanıcı Profil Güncelleme Testi',
  description: 'Kullanıcının profil bilgilerini başarıyla güncelleyebildiğini doğrular.',
  status: TestCaseStatus.ACTIVE,
  priority: TestCasePriority.MEDIUM,
  category: TestCaseCategory.FUNCTIONAL,
  tags: ['profile', 'user', 'settings'],
  createdBy: 'Zeynep Aydın',
  createdAt: new Date('2023-09-20T13:45:00.000Z'),
  updatedAt: new Date('2023-11-08T10:30:00.000Z'),
  lastRun: new Date('2023-11-14T15:20:00.000Z'),
  lastResult: TestCaseResult.PASSED,
  browser: 'Edge',
  environment: 'Production',
  estimatedDuration: 150,
  actualDuration: 140,
  steps: [
    {
      id: 'step-1',
      order: 1,
      description: 'Kullanıcı girişi yap',
      expectedResult: 'Kullanıcı başarıyla giriş yapar',
      action: 'NAVIGATE',
      selector: null,
      value: 'https://example.com/login',
      status: TestStepStatus.PASSED,
      duration: 1200
    },
    {
      id: 'step-2',
      order: 2,
      description: 'Kullanıcı adını gir',
      expectedResult: 'Kullanıcı adı alanına metin girilir',
      action: 'TYPE',
      selector: '#username',
      value: 'testuser',
      status: TestStepStatus.PASSED,
      duration: 700
    },
    {
      id: 'step-3',
      order: 3,
      description: 'Şifreyi gir',
      expectedResult: 'Şifre alanına metin girilir',
      action: 'TYPE',
      selector: '#password',
      value: 'password123',
      status: TestStepStatus.PASSED,
      duration: 600
    },
    {
      id: 'step-4',
      order: 4,
      description: 'Giriş butonuna tıkla',
      expectedResult: 'Giriş işlemi başlatılır',
      action: 'CLICK',
      selector: '#loginButton',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 800
    },
    {
      id: 'step-5',
      order: 5,
      description: 'Profil sayfasına git',
      expectedResult: 'Profil sayfası görüntülenir',
      action: 'NAVIGATE',
      selector: null,
      value: 'https://example.com/profile',
      status: TestStepStatus.PASSED,
      duration: 1000
    },
    {
      id: 'step-6',
      order: 6,
      description: 'Düzenle butonuna tıkla',
      expectedResult: 'Profil düzenleme formu görüntülenir',
      action: 'CLICK',
      selector: '#editProfileButton',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 700
    },
    {
      id: 'step-7',
      order: 7,
      description: 'Ad alanını güncelle',
      expectedResult: 'Ad alanı güncellenir',
      action: 'TYPE',
      selector: '#firstName',
      value: 'Updated Name',
      status: TestStepStatus.PASSED,
      duration: 800
    },
    {
      id: 'step-8',
      order: 8,
      description: 'Telefon numarasını güncelle',
      expectedResult: 'Telefon numarası alanı güncellenir',
      action: 'TYPE',
      selector: '#phoneNumber',
      value: '5551234567',
      status: TestStepStatus.PASSED,
      duration: 700
    },
    {
      id: 'step-9',
      order: 9,
      description: 'Kaydet butonuna tıkla',
      expectedResult: 'Profil güncelleme işlemi başlatılır',
      action: 'CLICK',
      selector: '#saveProfileButton',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 900
    },
    {
      id: 'step-10',
      order: 10,
      description: 'Güncelleme başarılı mesajını kontrol et',
      expectedResult: 'Başarılı güncelleme mesajı görüntülenir',
      action: 'ASSERT_ELEMENT',
      selector: '.profile-update-success',
      value: null,
      status: TestStepStatus.PASSED,
      duration: 1000
    },
    {
      id: 'step-11',
      order: 11,
      description: 'Güncellenmiş ad alanını kontrol et',
      expectedResult: 'Ad alanı güncellenmiş değeri gösterir',
      action: 'ASSERT_TEXT',
      selector: '#profileName',
      value: 'Updated Name',
      status: TestStepStatus.PASSED,
      duration: 800
    }
  ],
  prerequisites: ['Geçerli kullanıcı hesabı'],
  testSuiteId: 'ts-004',
  projectId: 'proj-001',
  automated: true
};

// Tüm test case'leri içeren dizi
export const testCasesData: TestCase[] = [
  loginTestCase,
  productSearchTestCase,
  checkoutTestCase,
  userRegistrationTestCase,
  profileUpdateTestCase
];
