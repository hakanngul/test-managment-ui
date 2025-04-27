# Reports Modülü Mimarisi ve Veritabanı Tasarımı

## Genel Bakış
Reports modülü, test otomasyonu sürecinin sonuçlarını ve performansını analiz etmek için kapsamlı raporlama araçları sunar. Bu modül, dört ana sekme altında organize edilmiştir:
1. **Overview**: Genel test performansı ve sonuçlarının özeti
2. **Test Results**: Detaylı test sonuçları ve durum dağılımı
3. **Coverage**: Kod kapsama analizi ve trendleri
4. **Performance**: Performans metrikleri ve karşılaştırmaları

Bu modül, test ekiplerine ve paydaşlara test süreçlerinin etkinliğini ve kalitesini değerlendirme imkanı sağlar.

## Bileşen Yapısı

### Reports.tsx (Ana Sayfa)
- **PageHeader**: Sayfa başlığı ve rapor işlemleri (dışa aktarma, paylaşma, rapor oluşturma)
- **Tabs**: Dört ana sekme arasında gezinme
- **LoadingIndicator**: Veri yüklenirken gösterilen gösterge
- **ErrorAlert**: Hata mesajı göstergesi

### OverviewTab.tsx
- **SummaryCard**: Toplam test sayısı, başarı oranı, ortalama süre ve başarısız test sayısı gibi özet metrikler
- **ChartCard**: Test çalıştırma trendi ve süre trendi grafikleri
- **TestResultsTable**: Son test sonuçlarını gösteren tablo

### TestResultsTab.tsx
- **FilterControls**: Test sonuçlarını filtreleme ve sıralama kontrolleri
- **StatusDistributionChart**: Test durumlarının dağılımını gösteren pasta grafik
- **DurationByStatusChart**: Durumlara göre test sürelerini gösteren çubuk grafik
- **TestResultsTable**: Detaylı test sonuçlarını gösteren tablo
- **TestDetailDialog**: Seçilen testin detaylarını gösteren iletişim kutusu
  - **TestStepsTable**: Test adımlarını ve sonuçlarını gösteren tablo
  - **TestLogsView**: Test günlüklerini gösteren görünüm
  - **TestScreenshotsView**: Test ekran görüntülerini gösteren görünüm

### CoverageTab.tsx
- **SummaryCard**: Satır, dal, fonksiyon ve ifade kapsaması için özet metrikler
- **CoverageTrendChart**: Zaman içindeki kapsama trendini gösteren çizgi grafik
- **CoverageByTypeChart**: Kapsama türlerine göre dağılımı gösteren radyal çubuk grafik
- **UncoveredLinesChart**: Kapsanmayan satırların en çok olduğu dosyaları gösteren çubuk grafik
- **CoverageFileTable**: Dosya bazında kapsama detaylarını gösteren tablo

### PerformanceTab.tsx
- **FilterControls**: Performans metriklerini filtreleme ve sıralama kontrolleri
- **LoadTimeChart**: Sayfa yükleme süresi trendini gösteren çizgi grafik
- **ResponseTimeChart**: API yanıt süresi trendini gösteren çizgi grafik
- **ResourceUsageChart**: Kaynak kullanımı trendini gösteren alan grafik
- **BrowserComparisonChart**: Tarayıcılara göre performans karşılaştırmasını gösteren çubuk grafik
- **PerformanceMetricsTable**: Detaylı performans metriklerini gösteren tablo
- **PerformanceDetailDialog**: Seçilen performans metriğinin detaylarını gösteren iletişim kutusu
  - **NetworkRequestsTable**: Ağ isteklerini gösteren tablo
  - **ResourceUsageDetails**: Kaynak kullanımı detaylarını gösteren grafikler
  - **PerformanceTimeline**: Performans zaman çizelgesini gösteren görünüm

## Mevcut Veri Akışı
Reports.tsx sayfası, aşağıdaki API çağrılarını kullanarak veri çeker:

```javascript
const [
  executionData,
  durationData,
  results,
  detailedResultsData,
  statusDistribution,
  durationByStatus,
  coverage,
  coverageTrend,
  coverageByType,
  uncoveredLines,
  performance,
  loadTime,
  responseTime,
  resourceUsage,
  browserComparison
] = await Promise.all([
  api.getTestExecutionData(),
  api.getTestDurationData(),
  api.getTestResults(),
  api.getDetailedTestResults(),
  api.getStatusDistributionData(),
  api.getDurationByStatusData(),
  api.getCoverageData(),
  api.getCoverageTrendData(),
  api.getCoverageByTypeData(),
  api.getUncoveredLinesData(),
  api.getPerformanceMetrics(),
  api.getLoadTimeData(),
  api.getResponseTimeData(),
  api.getResourceUsageData(),
  api.getBrowserComparisonData()
]);
```

## Veritabanı Gereksinimleri (NoSQL - MongoDB/Firestore)

### Koleksiyonlar

#### 1. TestReports Koleksiyonu
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "type": "String",  // "daily", "weekly", "monthly", "custom"
  "dateRange": {
    "startDate": "Date",
    "endDate": "Date"
  },
  "createdBy": "ObjectId",  // Users koleksiyonuna referans
  "createdAt": "Date",
  "updatedAt": "Date",
  "status": "String",  // "generated", "generating", "failed"
  "summary": {
    "totalTests": "Number",
    "passRate": "Number",
    "avgDuration": "Number",
    "failedTests": "Number",
    "skippedTests": "Number"
  },
  "filters": {
    "projects": ["ObjectId"],
    "testTypes": ["String"],
    "environments": ["String"],
    "browsers": ["String"]
  },
  "reportUrl": "String"  // Oluşturulan raporun URL'si
}
```

#### 2. TestExecutionResults Koleksiyonu
```json
{
  "_id": "ObjectId",
  "date": "Date",
  "totalTests": "Number",
  "passed": "Number",
  "failed": "Number",
  "skipped": "Number",
  "avgDuration": "Number",
  "environment": "String",
  "browser": "String",
  "testType": "String",  // "unit", "integration", "e2e", "api"
  "projectId": "ObjectId"  // Projects koleksiyonuna referans
}
```

#### 3. TestResultDetails Koleksiyonu
```json
{
  "_id": "ObjectId",
  "testRunId": "ObjectId",  // TestRuns koleksiyonuna referans
  "testCaseId": "ObjectId",  // TestCases koleksiyonuna referans
  "name": "String",
  "status": "String",  // "passed", "failed", "skipped"
  "duration": "Number",  // Milisaniye cinsinden
  "startTime": "Date",
  "endTime": "Date",
  "environment": "String",
  "browser": "String",
  "device": "String",
  "errorMessage": "String",
  "errorStack": "String",
  "testCases": [
    {
      "id": "String",
      "name": "String",
      "status": "String",
      "duration": "Number",
      "steps": [
        {
          "id": "String",
          "name": "String",
          "status": "String",
          "duration": "Number",
          "errorMessage": "String",
          "screenshot": "String"
        }
      ]
    }
  ],
  "metadata": {
    "branch": "String",
    "commit": "String",
    "buildNumber": "String",
    "ciJobId": "String"
  }
}
```

#### 4. CodeCoverage Koleksiyonu
```json
{
  "_id": "ObjectId",
  "date": "Date",
  "projectId": "ObjectId",  // Projects koleksiyonuna referans
  "branch": "String",
  "commit": "String",
  "buildNumber": "String",
  "summary": {
    "lines": {
      "total": "Number",
      "covered": "Number",
      "percentage": "Number"
    },
    "branches": {
      "total": "Number",
      "covered": "Number",
      "percentage": "Number"
    },
    "functions": {
      "total": "Number",
      "covered": "Number",
      "percentage": "Number"
    },
    "statements": {
      "total": "Number",
      "covered": "Number",
      "percentage": "Number"
    }
  },
  "files": [
    {
      "path": "String",
      "lines": {
        "total": "Number",
        "covered": "Number",
        "percentage": "Number"
      },
      "branches": {
        "total": "Number",
        "covered": "Number",
        "percentage": "Number"
      },
      "functions": {
        "total": "Number",
        "covered": "Number",
        "percentage": "Number"
      },
      "statements": {
        "total": "Number",
        "covered": "Number",
        "percentage": "Number"
      },
      "uncoveredLines": ["Number"]
    }
  ]
}
```

#### 5. PerformanceMetrics Koleksiyonu
```json
{
  "_id": "ObjectId",
  "testRunId": "ObjectId",  // TestRuns koleksiyonuna referans
  "testName": "String",
  "timestamp": "Date",
  "environment": "String",
  "browser": "String",
  "device": "String",
  "loadTime": "Number",  // Milisaniye cinsinden
  "responseTime": "Number",  // Milisaniye cinsinden
  "cpuUsage": "Number",  // Yüzde olarak
  "memoryUsage": "Number",  // MB cinsinden
  "networkRequests": "Number",
  "errors": "Number",
  "warnings": "Number",
  "status": "String",  // "good", "warning", "critical"
  "networkDetails": [
    {
      "url": "String",
      "type": "String",  // "XHR", "CSS", "JS", "Image", "Font", "Other"
      "size": "Number",  // KB cinsinden
      "time": "Number",  // Milisaniye cinsinden
      "status": "Number"  // HTTP durum kodu
    }
  ],
  "resourceUsage": {
    "javaScriptTime": "Number",
    "renderingTime": "Number",
    "layoutTime": "Number",
    "paintTime": "Number"
  }
}
```

### Sorgular

#### Overview Sekmesi için Sorgular

1. **Test Çalıştırma Trendi**:
   ```javascript
   db.TestExecutionResults.aggregate([
     { $match: { date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
         passed: { $sum: "$passed" },
         failed: { $sum: "$failed" },
         skipped: { $sum: "$skipped" }
       }
     },
     { $sort: { "_id": 1 } }
   ])
   ```

2. **Test Süresi Trendi**:
   ```javascript
   db.TestExecutionResults.aggregate([
     { $match: { date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
         avgDuration: { $avg: "$avgDuration" }
       }
     },
     { $sort: { "_id": 1 } }
   ])
   ```

3. **Son Test Sonuçları**:
   ```javascript
   db.TestResultDetails.find()
     .sort({ startTime: -1 })
     .limit(10)
   ```

#### Test Results Sekmesi için Sorgular

1. **Detaylı Test Sonuçları**:
   ```javascript
   db.TestResultDetails.find({
     $and: [
       searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {},
       statusFilter !== 'all' ? { status: statusFilter } : {},
       dateFilter === '7days' ? { startTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } : 
       dateFilter === '30days' ? { startTime: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } : 
       dateFilter === '90days' ? { startTime: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } } : {}
     ]
   }).sort({ [sortBy]: sortBy === 'startTime' ? -1 : 1 })
   ```

2. **Durum Dağılımı**:
   ```javascript
   db.TestResultDetails.aggregate([
     { $match: { startTime: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: "$status",
         count: { $sum: 1 }
       }
     }
   ])
   ```

3. **Durumlara Göre Süre**:
   ```javascript
   db.TestResultDetails.aggregate([
     { $match: { startTime: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: "$status",
         avgDuration: { $avg: "$duration" }
       }
     }
   ])
   ```

#### Coverage Sekmesi için Sorgular

1. **Kapsama Özeti**:
   ```javascript
   db.CodeCoverage.findOne().sort({ date: -1 })
   ```

2. **Kapsama Trendi**:
   ```javascript
   db.CodeCoverage.aggregate([
     { $match: { date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
         lines: { $avg: "$summary.lines.percentage" },
         branches: { $avg: "$summary.branches.percentage" },
         functions: { $avg: "$summary.functions.percentage" },
         statements: { $avg: "$summary.statements.percentage" }
       }
     },
     { $sort: { "_id": 1 } }
   ])
   ```

3. **Kapsanmayan Satırlar**:
   ```javascript
   db.CodeCoverage.aggregate([
     { $unwind: "$files" },
     { $project: {
         path: "$files.path",
         uncoveredCount: { $size: "$files.uncoveredLines" }
       }
     },
     { $sort: { uncoveredCount: -1 } },
     { $limit: 10 }
   ])
   ```

#### Performance Sekmesi için Sorgular

1. **Performans Metrikleri**:
   ```javascript
   db.PerformanceMetrics.find({
     $and: [
       searchTerm ? { testName: { $regex: searchTerm, $options: 'i' } } : {},
       statusFilter !== 'all' ? { status: statusFilter } : {},
       browserFilter !== 'all' ? { browser: browserFilter } : {}
     ]
   }).sort({ [sortBy]: sortBy === 'timestamp' ? -1 : 1 })
   ```

2. **Yükleme Süresi Trendi**:
   ```javascript
   db.PerformanceMetrics.aggregate([
     { $match: { timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
         avgLoadTime: { $avg: "$loadTime" }
       }
     },
     { $sort: { "_id": 1 } }
   ])
   ```

3. **Tarayıcı Karşılaştırması**:
   ```javascript
   db.PerformanceMetrics.aggregate([
     { $match: { timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: "$browser",
         avgLoadTime: { $avg: "$loadTime" },
         avgResponseTime: { $avg: "$responseTime" }
       }
     }
   ])
   ```

## Gerçek Zamanlı Güncellemeler

Raporlar genellikle periyodik olarak oluşturulur, ancak bazı durumlarda gerçek zamanlı güncellemeler gerekebilir:

### MongoDB Change Streams Kullanımı

```javascript
// Server tarafında
const changeStream = db.collection('TestResultDetails').watch();
changeStream.on('change', (change) => {
  // Yeni test sonucu eklendiğinde istemcilere bildir
  io.emit('test-result-update', change.fullDocument);
  
  // Test sonuçları özetini güncelle
  updateTestResultsSummary();
});

// Test sonuçları özetini güncelleme fonksiyonu
async function updateTestResultsSummary() {
  const summary = await db.TestResultDetails.aggregate([
    { $match: { startTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } },
    { $group: {
        _id: null,
        totalTests: { $sum: 1 },
        passed: { $sum: { $cond: [{ $eq: ["$status", "passed"] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
        skipped: { $sum: { $cond: [{ $eq: ["$status", "skipped"] }, 1, 0] } },
        avgDuration: { $avg: "$duration" }
      }
    }
  ]).toArray();
  
  // İstemcilere özet güncellemesini bildir
  io.emit('test-summary-update', summary[0]);
}
```

### Firestore Gerçek Zamanlı Dinleyiciler

```javascript
// İstemci tarafında
db.collection('TestResultDetails')
  .where('startTime', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000))
  .onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        // Yeni test sonucu eklendiğinde UI'ı güncelle
        updateTestResultsUI(change.doc.data());
      }
    });
  });
```

## Uygulama Değişiklikleri

1. **API Servisi Güncellemeleri**:
   - `fetchData` fonksiyonunu MongoDB/Firestore bağlantısı için güncelle
   - Rapor oluşturma ve dışa aktarma için servis fonksiyonlarını ekle
   - Veri filtreleme ve sıralama için gelişmiş sorgu fonksiyonları ekle

2. **Veri Dönüşümleri**:
   - Veritabanı şemasına uygun veri dönüşüm mantığını güncelle
   - Grafik verilerini oluşturmak için veri işleme fonksiyonları ekle
   - Tarih/saat formatlamasını standartlaştır

3. **Kullanıcı Arayüzü İyileştirmeleri**:
   - Rapor oluşturma için gelişmiş filtre seçenekleri ekle
   - Grafikleri özelleştirme seçenekleri ekle
   - Raporları PDF, Excel veya CSV olarak dışa aktarma özelliği ekle

4. **Performans Optimizasyonu**:
   - Büyük veri setleri için sayfalama ve sonsuz kaydırma ekle
   - Karmaşık sorguları önbelleğe alma
   - Grafik verilerini kademeli olarak yükleme

## Performans İçin İndeksler

MongoDB için aşağıdaki indeksleri oluşturarak sorgu performansını optimize edebilirsiniz:

```javascript
db.TestExecutionResults.createIndex({ date: -1 })
db.TestResultDetails.createIndex({ startTime: -1 })
db.TestResultDetails.createIndex({ status: 1 })
db.TestResultDetails.createIndex({ testRunId: 1 })
db.CodeCoverage.createIndex({ date: -1 })
db.CodeCoverage.createIndex({ projectId: 1, date: -1 })
db.PerformanceMetrics.createIndex({ timestamp: -1 })
db.PerformanceMetrics.createIndex({ browser: 1, timestamp: -1 })
db.PerformanceMetrics.createIndex({ status: 1 })
```

Firestore için benzer indeksleme stratejileri sorgu desenlerinize göre uygulanabilir.

## Veri Arşivleme ve Temizleme

Raporlama verileri zamanla büyüyebilir, bu nedenle veri arşivleme ve temizleme stratejileri önemlidir:

1. **Veri Arşivleme**:
   - Belirli bir süreden (örn. 6 ay) daha eski test sonuçlarını arşiv koleksiyonlarına taşıma
   - Arşivlenmiş verileri daha düşük maliyetli depolama çözümlerine taşıma

2. **Veri Temizleme**:
   - Belirli bir süreden (örn. 1 yıl) daha eski test sonuçlarını silme
   - Gereksiz detayları (ekran görüntüleri, günlükler) temizleme

3. **Veri Sıkıştırma**:
   - Eski test sonuçlarını günlük veya haftalık özetlere sıkıştırma
   - Detaylı verileri sadece özet metriklere dönüştürme

## Entegrasyon Noktaları

1. **CI/CD Entegrasyonu**:
   - Jenkins, GitHub Actions, GitLab CI gibi CI/CD sistemlerinden test sonuçlarını alma
   - Test çalıştırmaları tamamlandığında otomatik rapor oluşturma

2. **Bildirim Sistemleri**:
   - E-posta, Slack gibi bildirim kanallarıyla entegrasyon
   - Önemli test sonuçları ve kapsama değişiklikleri için otomatik bildirimler

3. **Dış Sistemler**:
   - Jira, Confluence gibi sistemlerle entegrasyon
   - Raporları dış sistemlere gömme veya bağlantı verme
