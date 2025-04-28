# Test Modelleri Mimari Yapısı

Bu belge, test otomasyon sistemindeki TestCase, TestSuite, TestRun, TestStep, TestResult ve TestReport modellerinin mimari yapısını açıklamaktadır.

## Genel Mimari Yapı

Test otomasyon sistemindeki modeller, aşağıdaki ana bileşenlerden oluşmaktadır:

1. **TestCase**: Test senaryolarını tanımlar
2. **TestSuite**: Test senaryolarını gruplar
3. **TestRun**: Test senaryolarının çalıştırılmasını yönetir
4. **TestStep**: Test senaryolarının adımlarını tanımlar
5. **TestResult**: Test çalıştırma sonuçlarını saklar
6. **TestStepResult**: Test adımlarının çalıştırma sonuçlarını saklar
7. **TestReportData**: Test raporlama verilerini tanımlar

Her model için üç temel bileşen bulunmaktadır:
- **Interface**: Model yapısını tanımlar
- **Enum**: Model için sabit değerleri tanımlar
- **Utils**: Model için yardımcı fonksiyonları içerir

Ayrıca, veritabanı şemaları için:
- **Schema**: MongoDB veritabanı şemasını tanımlar
- **Repository**: Veritabanı işlemlerini yönetir

## Model İlişkileri

```
+-------------+       +-------------+       +-------------+
| TestSuite   |<------| TestRun     |------>| TestResult  |
+-------------+       +-------------+       +-------------+
       |                                           |
       |                                           |
       v                                           v
+-------------+                           +-------------+
| TestCase    |                           | TestStepResult
+-------------+                           +-------------+
       |                                           ^
       |                                           |
       v                                           |
+-------------+                                    |
| TestStep    |------------------------------------+
+-------------+
```

## TestCase Modeli

TestCase modeli, bir test senaryosunu tanımlar. Her test senaryosu, bir dizi test adımından (TestStep) oluşur.

### Arayüz Yapısı

```typescript
export interface TestCase {
  id: string;
  title: string;
  description: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  steps: TestStep[];
  tags: string[];
  projectId: string;
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  executionStats?: TestCaseExecutionStats;
}
```

### İlişkili Bileşenler

- **TestCaseStatus**: Test senaryosunun durumunu tanımlar (active, draft, archived, inactive)
- **TestCasePriority**: Test senaryosunun önceliğini tanımlar (critical, high, medium, low)
- **BrowserType**: Desteklenen tarayıcı türlerini tanımlar (chromium, firefox, webkit)
- **TestCaseExecutionStats**: Test senaryosunun çalıştırma istatistiklerini tanımlar

## TestSuite Modeli

TestSuite modeli, bir dizi test senaryosunu (TestCase) gruplar. Test senaryoları, belirli bir sırada veya paralel olarak çalıştırılabilir.

### Arayüz Yapısı

```typescript
export interface TestSuite {
  id: string;
  name: string;
  description: string;
  status: TestSuiteStatus;
  priority?: TestSuitePriority;
  progress: number;
  testCases: string[];
  projectId: string;
  tags?: string[];
  executionMode?: TestSuiteExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestSuiteRetryStrategy;
  maxRetries?: number;
  dependencies?: TestCaseDependency[];
  dependencyMode?: TestSuiteDependencyMode;
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  schedule?: TestSuiteSchedule;
  notifications?: TestSuiteNotification;
  assignee?: string;
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
  environment?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  results?: TestSuiteResults;
}
```

### İlişkili Bileşenler

- **TestSuiteStatus**: Test paketinin durumunu tanımlar
- **TestSuitePriority**: Test paketinin önceliğini tanımlar
- **TestSuiteExecutionMode**: Test paketinin çalıştırma modunu tanımlar (sequential, parallel)
- **TestSuiteRetryStrategy**: Test paketinin yeniden deneme stratejisini tanımlar
- **TestCaseDependency**: Test senaryoları arasındaki bağımlılıkları tanımlar
- **TestSuiteDependencyMode**: Test paketi bağımlılık modunu tanımlar
- **TestSuiteSchedule**: Test paketinin zamanlama bilgilerini tanımlar
- **TestSuiteNotification**: Test paketi bildirim ayarlarını tanımlar
- **TestSuiteResults**: Test paketi sonuçlarını tanımlar

## TestRun Modeli

TestRun modeli, bir test paketinin (TestSuite) veya test senaryosunun (TestCase) çalıştırılmasını yönetir.

### Arayüz Yapısı

```typescript
export interface TestRun {
  id: string;
  name: string;
  description?: string;
  status: TestRunStatus;
  priority?: TestRunPriority;
  testSuiteId: string;
  environment: string;
  tags?: string[];
  executionMode?: TestRunExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestRunRetryStrategy;
  maxRetries?: number;
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  logging?: TestRunLogging;
  reporting?: TestRunReporting;
  notifications?: TestRunNotification;
  context?: TestRunContext;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  results?: TestResult[];
  stats?: TestRunStats;
  agentId?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### İlişkili Bileşenler

- **TestRunStatus**: Test çalıştırmasının durumunu tanımlar
- **TestRunPriority**: Test çalıştırmasının önceliğini tanımlar
- **TestRunExecutionMode**: Test çalıştırmasının modunu tanımlar
- **TestRunRetryStrategy**: Test çalıştırmasının yeniden deneme stratejisini tanımlar
- **TestRunLogging**: Test çalıştırmasının loglama ayarlarını tanımlar
- **TestRunReporting**: Test çalıştırmasının raporlama ayarlarını tanımlar
- **TestRunNotification**: Test çalıştırmasının bildirim ayarlarını tanımlar
- **TestRunContext**: Test çalıştırmasının bağlam bilgilerini tanımlar
- **TestRunStats**: Test çalıştırmasının istatistiklerini tanımlar

## TestStep Modeli

TestStep modeli, bir test senaryosundaki (TestCase) adımları tanımlar.

### Arayüz Yapısı

```typescript
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
```

### İlişkili Bileşenler

- **TestStepActionType**: Test adımının eylem türünü tanımlar (click, type, navigate, wait, assert, vb.)
- **TestStepTargetType**: Test adımının hedef türünü tanımlar (cssSelector, xpath, id, name, vb.)

## TestResult Modeli

TestResult modeli, bir test çalıştırmasının (TestRun) sonuçlarını saklar.

### Arayüz Yapısı

```typescript
export interface TestResult {
  id: string;
  testRunId: string;
  testCaseId: string;
  testSuiteId?: string;
  name?: string;
  description?: string;
  status: TestResultStatus;
  priority?: TestPriority;
  severity?: TestSeverity;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  environment?: string;
  environmentInfo?: TestEnvironmentInfo;
  errorMessage?: string;
  errorStack?: string;
  errorDetails?: TestErrorDetails;
  screenshots?: string[];
  media?: TestMedia[];
  performanceMetrics?: TestPerformanceMetrics;
  networkInfo?: TestNetworkInfo;
  logs?: string[];
  consoleOutput?: string[];
  steps?: TestStepResult[];
  retryInfo?: TestRetryInfo;
  metadata?: Record<string, any>;
  tags?: string[];
  categories?: string[];
  traceId?: string;
  spanId?: string;
}
```

### İlişkili Bileşenler

- **TestResultStatus**: Test sonucunun durumunu tanımlar (passed, failed, pending, blocked, skipped, error)
- **TestPriority**: Test önceliğini tanımlar
- **TestSeverity**: Test şiddetini tanımlar
- **TestEnvironmentInfo**: Test ortam bilgilerini tanımlar
- **TestErrorDetails**: Test hata detaylarını tanımlar
- **TestMedia**: Test medya bilgilerini tanımlar
- **TestPerformanceMetrics**: Test performans metriklerini tanımlar
- **TestNetworkInfo**: Test ağ bilgilerini tanımlar
- **TestRetryInfo**: Test yeniden deneme bilgilerini tanımlar

## TestStepResult Modeli

TestStepResult modeli, bir test adımının (TestStep) çalıştırma sonuçlarını saklar.

### Arayüz Yapısı

```typescript
export interface TestStepResult {
  id: string;
  order: number;
  description: string;
  expectedResult?: string;
  actualResult?: string;
  status: TestStepResultStatus;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  errorMessage?: string | null;
  errorDetails?: TestStepErrorDetails;
  screenshot?: string | null;
  media?: TestStepMedia[];
  performanceMetrics?: TestStepPerformanceMetrics;
  logs?: string[];
  consoleOutput?: string[];
  retryCount?: number;
  previousAttempts?: string[];
  metadata?: Record<string, any>;
  tags?: string[];
}
```

### İlişkili Bileşenler

- **TestStepResultStatus**: Test adım sonucunun durumunu tanımlar
- **TestStepErrorDetails**: Test adım hata detaylarını tanımlar
- **TestStepMedia**: Test adım medya bilgilerini tanımlar
- **TestStepPerformanceMetrics**: Test adım performans metriklerini tanımlar

## TestReportData Modeli

TestReportData modeli, test raporlama verilerini tanımlar.

### Arayüz Yapısı

```typescript
export interface TestResultSummary {
  id: string;
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  blocked?: number;
  pending?: number;
  error?: number;
  duration: string;
  durationMs?: number;
  lastRun: Date;
  passRate?: number;
  priority?: TestPriority;
  severity?: TestSeverity;
  tags?: string[];
  categories?: string[];
}

export interface TestExecutionTrendData {
  options: ApexOptions;
  series: any[];
  timeRange?: string;
  interval?: string;
  filters?: Record<string, any>;
}

export interface StatusDistributionData {
  options: ApexOptions;
  series: any[];
  filters?: Record<string, any>;
}

// ... diğer rapor veri tipleri
```

### İlişkili Bileşenler

- **TestResultSummary**: Test sonuç özetini tanımlar
- **TestExecutionTrendData**: Test çalıştırma trend verilerini tanımlar
- **StatusDistributionData**: Durum dağılım verilerini tanımlar
- **DurationByStatusData**: Durum bazında süre verilerini tanımlar
- **ErrorDistributionData**: Hata dağılım verilerini tanımlar
- **PerformanceMetricsData**: Performans metrik verilerini tanımlar
- **TestCoverageData**: Test kapsama verilerini tanımlar
- **TestQualityMetrics**: Test kalite metriklerini tanımlar
- **TestReportSummary**: Test rapor özetini tanımlar
- **ComparativeReportData**: Karşılaştırmalı rapor verilerini tanımlar
- **CustomReportConfig**: Özel rapor yapılandırmasını tanımlar

## Veritabanı Şemaları

Veritabanı şemaları, modellerin MongoDB veritabanında nasıl saklanacağını tanımlar. Her model için bir şema ve bu şemayı yöneten bir repository bulunmaktadır.

### TestCaseSchema

```typescript
export interface TestCaseSchema {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  steps: TestStepSchema[] | string[];
  tags: string[];
  projectId: string;
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  executionStats?: TestCaseExecutionStats;
}
```

### TestSuiteSchema

```typescript
export interface TestSuiteSchema {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  status: TestSuiteStatus;
  priority?: TestSuitePriority;
  progress: number;
  testCases: string[];
  projectId: string;
  tags?: string[];
  executionMode?: TestSuiteExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestSuiteRetryStrategy;
  maxRetries?: number;
  dependencies?: TestCaseDependency[];
  dependencyMode?: TestSuiteDependencyMode;
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  schedule?: TestSuiteSchedule;
  notifications?: TestSuiteNotification;
  assignee?: string;
  startDate?: Date;
  endDate?: Date;
  environment?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
```

### TestRunSchema

```typescript
export interface TestRunSchema {
  _id?: ObjectId;
  id: string;
  name: string;
  description?: string;
  status: TestRunStatus;
  priority?: TestRunPriority;
  projectId: string;
  testSuiteId?: string;
  testCaseIds?: string[];
  environment?: string;
  browsers?: BrowserType[];
  headless?: boolean;
  browserPool?: boolean;
  executionMode?: TestRunExecutionMode;
  maxParallelExecutions?: number;
  retryStrategy?: TestRunRetryStrategy;
  maxRetries?: number;
  timeout?: number;
  context?: TestRunContext;
  logging?: TestRunLogging;
  reporting?: TestRunReporting;
  notifications?: TestRunNotification;
  results?: string[];
  stats?: TestRunStats;
  scheduledStart?: Date;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  tags?: string[];
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
  notes?: string;
  artifacts?: string[];
  metadata?: Record<string, any>;
}
```

### TestStepSchema

```typescript
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
  testCaseId?: string;
}
```

### TestResultSchema

```typescript
export interface TestResultSchema {
  _id?: ObjectId;
  id: string;
  testRunId: string;
  testCaseId: string;
  testSuiteId?: string;
  name?: string;
  description?: string;
  status: TestResultStatus;
  priority?: TestPriority;
  severity?: TestSeverity;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  environment?: string;
  environmentInfo?: TestEnvironmentInfo;
  errorMessage?: string;
  errorStack?: string;
  errorDetails?: TestErrorDetails;
  screenshots?: string[];
  media?: TestMedia[];
  performanceMetrics?: TestPerformanceMetrics;
  networkInfo?: TestNetworkInfo;
  logs?: string[];
  consoleOutput?: string[];
  steps?: string[];
  retryInfo?: TestRetryInfo;
  metadata?: Record<string, any>;
  tags?: string[];
  categories?: string[];
  traceId?: string;
  spanId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### TestStepResultSchema

```typescript
export interface TestStepResultSchema {
  _id?: ObjectId;
  id: string;
  testResultId: string;
  testStepId: string;
  order: number;
  description: string;
  expectedResult?: string;
  actualResult?: string;
  status: TestStepResultStatus;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  errorMessage?: string | null;
  errorDetails?: TestStepErrorDetails;
  screenshot?: string | null;
  media?: TestStepMedia[];
  performanceMetrics?: TestStepPerformanceMetrics;
  logs?: string[];
  consoleOutput?: string[];
  retryCount?: number;
  previousAttempts?: string[];
  metadata?: Record<string, any>;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Veri Akışı

Test otomasyon sistemindeki veri akışı aşağıdaki gibidir:

1. **TestSuite** oluşturulur ve içine **TestCase**'ler eklenir
2. Her **TestCase** içinde **TestStep**'ler tanımlanır
3. **TestRun** oluşturularak bir **TestSuite** çalıştırılır
4. **TestRun** çalıştırıldığında, her **TestCase** için bir **TestResult** oluşturulur
5. Her **TestStep** için bir **TestStepResult** oluşturulur
6. **TestResult** ve **TestStepResult** verileri kullanılarak **TestReportData** oluşturulur

## Özet

Test otomasyon sistemindeki modeller, test senaryolarının tanımlanması, çalıştırılması ve sonuçlarının raporlanması için kapsamlı bir yapı sağlar. Bu modeller, test otomasyon sisteminin temelini oluşturur ve sistemin esnekliğini ve genişletilebilirliğini sağlar.
