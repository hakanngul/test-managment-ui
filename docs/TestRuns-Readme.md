# Test Runs Modülü Mimarisi ve Veritabanı Tasarımı

## Genel Bakış
Test Runs modülü, test senaryolarının çalıştırılmasını ve sonuçlarının izlenmesini sağlayan üç ana sayfadan oluşur:
1. **TestRuns.tsx**: Test çalıştırmalarının listelendiği ana sayfa
2. **CreateTestSuite.tsx**: Yeni test paketi oluşturma sayfası
3. **TestRunDetail.tsx**: Bir test çalıştırmasının detaylarını ve sonuçlarını görüntüleme sayfası

Bu modül, test otomasyonu sürecinin yürütme aşamasını yönetir ve test sonuçlarının izlenmesini sağlar.

## Bileşen Yapısı

### TestRuns.tsx
- **PageHeader**: Sayfa başlığı, arama kutusu ve yeni test çalıştırması oluşturma butonu
- **TestSuiteCard**: Her bir test paketini gösteren kart bileşeni
- **EmptyState**: Test çalıştırması bulunmadığında gösterilen durum
- **LoadingState**: Veri yüklenirken gösterilen durum
- **NewTestRunDialog**: Yeni test çalıştırması oluşturma iletişim kutusu

### CreateTestSuite.tsx
- **BasicInformation**: Test paketinin temel bilgilerini içeren form bölümü
- **TestCases**: Test senaryolarını seçme ve yönetme bölümü
- **SelectedTestCases**: Seçilen test senaryolarını gösteren tablo
- **AvailableTestCases**: Mevcut test senaryolarını gösteren tablo

### TestRunDetail.tsx
- **Breadcrumbs**: Gezinme kırıntıları
- **ProgressAndStatus**: İlerleme durumu ve durum bilgisi
- **SummaryCards**: Toplam, başarılı, başarısız ve atlanan test sayılarını gösteren kartlar
- **EnvironmentInfo**: Çalıştırma ortamı bilgilerini gösteren kart
- **TestResults**: Test sonuçlarını gösteren tablo

## Mevcut Veri Akışı
1. TestRuns.tsx: `useTestSuites()` hook'u ile test paketleri çekilir
2. CreateTestSuite.tsx: `api.getMockTestCases()` ve `api.getTeamMembers()` ile form verileri çekilir
3. TestRunDetail.tsx: `api.getTestSuiteById()` veya `api.getTestRunById()` ile test çalıştırma detayları çekilir

## Veritabanı Gereksinimleri (NoSQL - MongoDB/Firestore)

### Koleksiyonlar

#### 1. TestSuites Koleksiyonu
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "startDate": "Date",
  "endDate": "Date",
  "assignee": "ObjectId",  // Users koleksiyonuna referans
  "environment": "String",  // "development", "staging", "production"
  "testCases": ["ObjectId"],  // TestCases koleksiyonuna referanslar
  "status": "String",  // "pending", "running", "completed", "failed"
  "progress": "Number",  // 0-100 arası yüzde
  "results": {
    "passed": "Number",
    "failed": "Number",
    "blocked": "Number",
    "pending": "Number"
  },
  "createdBy": "ObjectId",  // Users koleksiyonuna referans
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastRunAt": "Date"
}
```

#### 2. TestRuns Koleksiyonu
```json
{
  "_id": "ObjectId",
  "testSuiteId": "ObjectId",  // TestSuites koleksiyonuna referans (opsiyonel)
  "name": "String",
  "status": "String",  // "pending", "running", "completed", "failed"
  "startTime": "Date",
  "endTime": "Date",
  "environment": "String",  // "development", "staging", "production"
  "browser": "String",
  "device": "String",
  "testCaseIds": ["ObjectId"],  // TestCases koleksiyonuna referanslar
  "createdBy": "ObjectId",  // Users koleksiyonuna referans
  "createdAt": "Date",
  "updatedAt": "Date",
  "triggeredBy": "ObjectId",  // Users koleksiyonuna referans
  "config": {
    "retryCount": "Number",
    "timeout": "Number",
    "parallel": "Boolean",
    "maxParallelTests": "Number"
  }
}
```

#### 3. TestResults Koleksiyonu
```json
{
  "_id": "ObjectId",
  "testRunId": "ObjectId",  // TestRuns koleksiyonuna referans
  "testCaseId": "ObjectId",  // TestCases koleksiyonuna referans
  "status": "String",  // "passed", "failed", "skipped", "running"
  "startTime": "Date",
  "endTime": "Date",
  "duration": "Number",  // Milisaniye cinsinden
  "errorMessage": "String",
  "errorStack": "String",
  "screenshots": ["String"],  // Screenshot URL'leri
  "logs": ["String"],
  "metadata": {
    "browser": "String",
    "browserVersion": "String",
    "os": "String",
    "resolution": "String"
  },
  "steps": [
    {
      "id": "String",
      "order": "Number",
      "description": "String",
      "status": "String",  // "passed", "failed", "skipped"
      "duration": "Number",
      "screenshot": "String",
      "errorMessage": "String"
    }
  ]
}
```

#### 4. TestRunLogs Koleksiyonu
```json
{
  "_id": "ObjectId",
  "testRunId": "ObjectId",  // TestRuns koleksiyonuna referans
  "timestamp": "Date",
  "level": "String",  // "info", "warning", "error"
  "message": "String",
  "source": "String",  // "system", "test", "agent"
  "metadata": "Object"
}
```

### Sorgular

#### TestRuns.tsx için Sorgular

1. **Test Paketlerini Listeleme**:
   ```javascript
   db.TestSuites.find().sort({ createdAt: -1 })
   ```

2. **Arama ile Filtreleme**:
   ```javascript
   db.TestSuites.find({
     $or: [
       { name: { $regex: searchQuery, $options: 'i' } },
       { 'assignee.name': { $regex: searchQuery, $options: 'i' } }
     ]
   })
   ```

3. **Aktif Çalışan Test Paketlerini Bulma**:
   ```javascript
   db.TestSuites.find({ status: "running" })
   ```

#### CreateTestSuite.tsx için Sorgular

1. **Mevcut Test Senaryolarını Getirme**:
   ```javascript
   db.TestCases.find().sort({ updatedAt: -1 })
   ```

2. **Takım Üyelerini Getirme**:
   ```javascript
   db.Users.find({ role: { $in: ["tester", "developer", "qa_lead"] } })
   ```

3. **Yeni Test Paketi Oluşturma**:
   ```javascript
   db.TestSuites.insertOne({
     name: formData.name,
     description: formData.description,
     startDate: formData.startDate,
     endDate: formData.endDate,
     assignee: ObjectId(formData.assignee),
     environment: formData.environment,
     testCases: selectedTestCases.map(tc => ObjectId(tc.id)),
     status: "pending",
     progress: 0,
     results: {
       passed: 0,
       failed: 0,
       blocked: 0,
       pending: selectedTestCases.length
     },
     createdBy: ObjectId(currentUserId),
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

#### TestRunDetail.tsx için Sorgular

1. **Test Çalıştırma Detaylarını Getirme**:
   ```javascript
   db.TestRuns.findOne({ _id: ObjectId(id) })
   ```

2. **Test Sonuçlarını Getirme**:
   ```javascript
   db.TestResults.find({ testRunId: ObjectId(id) })
   ```

3. **Test Çalıştırma Günlüklerini Getirme**:
   ```javascript
   db.TestRunLogs.find({ testRunId: ObjectId(id) }).sort({ timestamp: -1 })
   ```

4. **Test Çalıştırmasını Başlatma**:
   ```javascript
   db.TestRuns.updateOne(
     { _id: ObjectId(id) },
     { 
       $set: { 
         status: "running",
         startTime: new Date(),
         triggeredBy: ObjectId(currentUserId),
         updatedAt: new Date()
       } 
     }
   )
   ```

5. **Test Çalıştırmasını Durdurma**:
   ```javascript
   db.TestRuns.updateOne(
     { _id: ObjectId(id) },
     { 
       $set: { 
         status: "stopped",
         endTime: new Date(),
         updatedAt: new Date()
       } 
     }
   )
   ```

## Gerçek Zamanlı Güncellemeler

Test çalıştırmaları genellikle uzun süren işlemlerdir ve gerçek zamanlı güncellemeler önemlidir:

### MongoDB Change Streams Kullanımı

```javascript
// Server tarafında
const changeStream = db.collection('TestResults').watch();
changeStream.on('change', (change) => {
  // Test sonucu güncellendiğinde istemcilere bildir
  io.to(`test-run-${change.fullDocument.testRunId}`).emit('test-result-update', change.fullDocument);
  
  // Test çalıştırmasının ilerleme durumunu güncelle
  updateTestRunProgress(change.fullDocument.testRunId);
});

// İlerleme durumunu güncelleme fonksiyonu
async function updateTestRunProgress(testRunId) {
  const results = await db.TestResults.find({ testRunId: ObjectId(testRunId) }).toArray();
  const testRun = await db.TestRuns.findOne({ _id: ObjectId(testRunId) });
  
  const totalTests = testRun.testCaseIds.length;
  const completedTests = results.filter(r => r.status !== 'running').length;
  const progress = Math.round((completedTests / totalTests) * 100);
  
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  
  // Test çalıştırmasını güncelle
  await db.TestRuns.updateOne(
    { _id: ObjectId(testRunId) },
    {
      $set: {
        progress,
        results: { passed, failed, skipped, pending: totalTests - completedTests },
        status: completedTests === totalTests ? 'completed' : 'running',
        endTime: completedTests === totalTests ? new Date() : null,
        updatedAt: new Date()
      }
    }
  );
  
  // İstemcilere test çalıştırması güncellemesini bildir
  io.to(`test-run-${testRunId}`).emit('test-run-update', {
    progress,
    results: { passed, failed, skipped, pending: totalTests - completedTests },
    status: completedTests === totalTests ? 'completed' : 'running'
  });
}
```

### Firestore Gerçek Zamanlı Dinleyiciler

```javascript
// İstemci tarafında
db.collection('TestResults')
  .where('testRunId', '==', id)
  .onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        // Test sonucu eklendiğinde veya güncellendiğinde UI'ı güncelle
        updateTestResultInUI(change.doc.data());
      }
    });
  });

// Test çalıştırması dinleyicisi
db.collection('TestRuns')
  .doc(id)
  .onSnapshot((doc) => {
    if (doc.exists) {
      // Test çalıştırması güncellendiğinde UI'ı güncelle
      updateTestRunInUI(doc.data());
    }
  });
```

## Uygulama Değişiklikleri

1. **API Servisi Güncellemeleri**:
   - `fetchData` fonksiyonunu MongoDB/Firestore bağlantısı için güncelle
   - Test çalıştırma işlemleri için servis fonksiyonlarını güncelle
   - Gerçek zamanlı güncellemeler için Socket.IO veya WebSocket entegrasyonu ekle

2. **Veri Dönüşümleri**:
   - Veritabanı şemasına uygun veri dönüşüm mantığını güncelle
   - Tarih/saat formatlamasını standartlaştır
   - İlerleme ve durum hesaplamalarını güncelle

3. **Kullanıcı Arayüzü İyileştirmeleri**:
   - Test sonuçları için daha detaylı görünüm ekle
   - Test adımlarının sonuçlarını gösterme özelliği ekle
   - Test çalıştırma konfigürasyonu için gelişmiş seçenekler ekle

4. **Performans Optimizasyonu**:
   - Büyük test sonuç listeleri için sayfalama ekle
   - Test sonuçlarını kademeli olarak yükleme
   - Uzun süren test çalıştırmaları için otomatik yenileme mekanizması

## Performans İçin İndeksler

MongoDB için aşağıdaki indeksleri oluşturarak sorgu performansını optimize edebilirsiniz:

```javascript
db.TestSuites.createIndex({ createdAt: -1 })
db.TestSuites.createIndex({ status: 1 })
db.TestSuites.createIndex({ assignee: 1 })
db.TestRuns.createIndex({ testSuiteId: 1 })
db.TestRuns.createIndex({ status: 1 })
db.TestRuns.createIndex({ createdAt: -1 })
db.TestResults.createIndex({ testRunId: 1 })
db.TestResults.createIndex({ testCaseId: 1 })
db.TestResults.createIndex({ status: 1 })
db.TestRunLogs.createIndex({ testRunId: 1, timestamp: -1 })
```

Firestore için benzer indeksleme stratejileri sorgu desenlerinize göre uygulanabilir.

## Güvenlik Önlemleri

1. **Kimlik Doğrulama ve Yetkilendirme**:
   - Test çalıştırmalarına erişim için rol tabanlı yetkilendirme
   - Test çalıştırma başlatma ve durdurma için özel izinler

2. **Veri Doğrulama**:
   - Test çalıştırma parametrelerinin doğrulanması
   - Test sonuçlarının tutarlılık kontrolü

3. **Denetim ve İzleme**:
   - Tüm test çalıştırma işlemlerinin kaydedilmesi
   - Kritik işlemlerin günlüğe kaydedilmesi

## Ölçeklenebilirlik

1. **Paralel Test Çalıştırma**:
   - Birden fazla test ajanı kullanarak paralel test çalıştırma
   - Test çalıştırma kuyruğu yönetimi

2. **Dağıtık Test Çalıştırma**:
   - Farklı ortamlarda test çalıştırma
   - Farklı tarayıcı ve cihazlarda test çalıştırma

3. **Büyük Veri Yönetimi**:
   - Test sonuçlarının arşivlenmesi
   - Eski test sonuçlarının temizlenmesi

## Entegrasyon Noktaları

1. **CI/CD Entegrasyonu**:
   - Jenkins, GitHub Actions, GitLab CI gibi CI/CD sistemleriyle entegrasyon
   - Otomatik test çalıştırma tetikleme

2. **Hata Takip Sistemleri**:
   - Jira, GitHub Issues gibi hata takip sistemleriyle entegrasyon
   - Başarısız testler için otomatik sorun oluşturma

3. **Bildirim Sistemleri**:
   - E-posta, Slack gibi bildirim kanallarıyla entegrasyon
   - Test çalıştırma sonuçları için otomatik bildirimler
