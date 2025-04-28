# Test Otomasyon Yönetim Aracı Modelleri

Bu klasör, Test Otomasyon Yönetim Aracı'nın veri modellerini içerir. Bu modeller, uygulamanın temel yapı taşlarını oluşturur ve veritabanı şemasıyla uyumlu çalışır.

## Klasör Yapısı

- `enums/`: Enum tanımlamaları
- `interfaces/`: Interface tanımlamaları
- `*.ts`: Model sınıfları

## Ana Modeller

### Test Planı Hiyerarşisi

- **TestPlan**: Test planları, test süreçlerinin en üst düzey organizasyonudur.
- **TestSuite**: Test planlarının altında yer alan, belirli bir amaca yönelik test gruplarıdır.
- **TestCase**: Test senaryolarını tanımlar, test adımlarını içerir.
- **TestStep**: Test senaryolarının adımlarını tanımlar.

### Test Çalıştırma ve Sonuçlar

- **TestRun**: Test çalıştırmalarını yönetir.
- **TestExecution**: Bir test case'in çalıştırılmasını temsil eder.
- **TestResult**: Test çalıştırma sonuçlarını saklar.
- **TestHistory**: Test sonuçlarının geçmişini tutar.
- **TestDefect**: Test sırasında bulunan hataları tanımlar.

### Yapılandırma ve Ortam

- **Environment**: Test ortamlarını tanımlar.
- **TestConfig**: Test yapılandırmalarını saklar.
- **TestParameter**: Test parametrelerini tanımlar.
- **TestData**: Test verilerini saklar.

### Planlama ve Bildirimler

- **TestScheduler**: Otomatik test çalıştırmalarını planlar.
- **TestListener**: Belirli olaylarda tetiklenen işlemleri tanımlar.
- **Notification**: Bildirim sistemini yönetir.

### Kullanıcı ve Raporlama

- **User**: Kullanıcı bilgilerini saklar.
- **TestReport**: Test raporlarını oluşturur ve yönetir.

## İlişkiler

Modeller arasındaki temel ilişkiler şu şekildedir:

1. **TestPlan → TestSuite → TestCase**: Hiyerarşik test organizasyonu
2. **TestCase → TestStep**: Test adımları ve akışı
3. **TestStep → TestData**: Test adımlarında kullanılan veriler
4. **TestRun → TestResult**: Test çalıştırmalarının sonuçları
5. **TestResult → TestDefect**: Tespit edilen hatalar
6. **TestResult → TestHistory**: Test sonuçlarının geçmişi
7. **Environment → TestConfig**: Çalıştırma ortamı yapılandırmaları
8. **TestScheduler → TestRun**: Otomatik test çalıştırmaları
9. **TestListener → Notification**: Olay tabanlı bildirimler

## Kullanım

Model sınıfları, interface'leri uygular ve temel CRUD işlemlerini destekler. Örneğin:

```typescript
import { TestCase, TestCaseStatus, TestCasePriority, TestCaseType } from './models';

// Yeni bir test case oluştur
const testCase = new TestCase({
  name: 'Login Test',
  description: 'Verifies that a user can log in successfully',
  status: TestCaseStatus.ACTIVE,
  priority: TestCasePriority.HIGH,
  type: TestCaseType.FUNCTIONAL,
  // ...diğer özellikler
});

// Test case'i güncelle
testCase.updateStatus(TestCaseStatus.DEPRECATED);

// Test adımı ekle
testCase.addTestStep({
  stepNumber: 1,
  description: 'Navigate to login page',
  action: 'Open browser and go to /login',
  expectedResult: 'Login page is displayed'
});
```
