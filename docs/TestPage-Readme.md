# Test Page Modülü Mimarisi ve Veritabanı Tasarımı

## Genel Bakış
Test Page modülü, test otomasyonu platformunun demo ve test işlevlerini gösteren kapsamlı bir sayfadır. Bu modül, dört ana sekme altında organize edilmiştir:
1. **Test Execution**: Test çalıştırma simülatörü ve aktif çalışan testlerin tablosu
2. **Test Metrics**: Test metrikleri ve sonuçlarının gösterildiği dashboard
3. **API Testing**: API test senaryolarının gösterildiği demo
4. **Component Showcase**: Platformda kullanılan UI bileşenlerinin gösterimi

Bu modül, test otomasyonu platformunun temel işlevlerini ve kullanıcı arayüzü bileşenlerini göstermek için tasarlanmıştır.

## Bileşen Yapısı

### TestPage.tsx (Ana Sayfa)
- **Tabs**: Dört ana sekme arasında gezinme
- **TabPanel**: Her sekme için içerik paneli

### Test Execution Sekmesi
- **Active Running Tests Table**: Aktif çalışan testleri gösteren tablo
  - Test adı, durum, ilerleme, başlangıç zamanı, tahmini tamamlanma zamanı ve işlemler
  - Durum filtreleme ve arama özellikleri
  - Socket.io entegrasyonu için bilgi bölümü
- **Test Execution Simulator**: Test çalıştırma simülatörü
  - Test adımlarını gösteren dikey adım göstergesi (Stepper)
  - İlerleme çubuğu ve durum göstergeleri
  - Test çalıştırma, durdurma ve sıfırlama butonları

### Test Metrics Sekmesi
- **Metrics Cards**: Toplam test sayısı, başarı oranı, ortalama süre ve başarısız test sayısı
- **Test Status Distribution Chart**: Test durumlarının dağılımını gösteren pasta grafik
- **Recent Test Runs List**: Son test çalıştırmalarını gösteren liste

### API Testing Sekmesi
- **Test Cases Grid**: API'den çekilen test senaryolarını gösteren grid
- **API Code Example**: API çağrısı örneği gösteren kod bloğu

### Component Showcase Sekmesi
- **Status Chips**: Durum çipleri örnekleri
- **Progress Indicators**: İlerleme göstergeleri örnekleri
- **Alert States**: Uyarı durumları örnekleri
- **Action Buttons**: İşlem butonları örnekleri

## Mevcut Veri Akışı
TestPage.tsx sayfası, aşağıdaki API çağrılarını kullanarak veri çeker:

```javascript
// API Testing sekmesi için test senaryolarını çekme
const fetchTestCases = async () => {
  try {
    setLoading(true);
    const data = await api.getTestCases();
    setTestCases(data.slice(0, 3)); // Demo için ilk 3 test senaryosu
    setError(null);
  } catch (err) {
    console.error('Error fetching test cases:', err);
    setError('Failed to load test cases. Please try again later.');
  } finally {
    setLoading(false);
  }
};
```

Ayrıca, Test Execution Simulator için örnek test adımları ve Test Metrics Dashboard için statik veriler kullanılmaktadır.

## Veritabanı Gereksinimleri (NoSQL - MongoDB/Firestore)

### Koleksiyonlar

#### 1. TestExecutions Koleksiyonu
```json
{
  "_id": "ObjectId",
  "name": "String",
  "status": "String",  // "queued", "running", "completed", "failed", "paused"
  "progress": "Number",  // 0-100 arası yüzde
  "startTime": "Date",
  "estimatedCompletionTime": "Date",
  "actualCompletionTime": "Date",
  "testSuiteId": "ObjectId",  // TestSuites koleksiyonuna referans
  "environment": "String",  // "development", "staging", "production"
  "browser": "String",  // "chrome", "firefox", "safari", "edge"
  "device": "String",  // "desktop", "tablet", "mobile"
  "createdBy": "ObjectId",  // Users koleksiyonuna referans
  "createdAt": "Date",
  "updatedAt": "Date",
  "agentId": "String",  // Test çalıştıran agent ID'si
  "metadata": {
    "buildNumber": "String",
    "commitHash": "String",
    "branch": "String"
  }
}
```

#### 2. TestExecutionSteps Koleksiyonu
```json
{
  "_id": "ObjectId",
  "executionId": "ObjectId",  // TestExecutions koleksiyonuna referans
  "testCaseId": "ObjectId",  // TestCases koleksiyonuna referans
  "stepId": "String",  // Test adımı ID'si
  "order": "Number",
  "action": "String",  // "click", "type", "wait", "select", "assert", "navigate", "hover", "scroll", "drag", "upload", "custom"
  "target": "String",
  "value": "String",
  "description": "String",
  "expectedResult": "String",
  "status": "String",  // "pending", "running", "passed", "failed"
  "startTime": "Date",
  "endTime": "Date",
  "duration": "Number",  // Milisaniye cinsinden
  "errorMessage": "String",
  "screenshot": "String",  // Screenshot URL'si
  "logs": ["String"]
}
```

#### 3. TestMetrics Koleksiyonu
```json
{
  "_id": "ObjectId",
  "date": "Date",
  "totalTests": "Number",
  "passedTests": "Number",
  "failedTests": "Number",
  "skippedTests": "Number",
  "passRate": "Number",  // Yüzde olarak
  "avgDuration": "Number",  // Milisaniye cinsinden
  "environment": "String",  // "development", "staging", "production"
  "browser": "String",  // "chrome", "firefox", "safari", "edge"
  "device": "String",  // "desktop", "tablet", "mobile"
  "projectId": "ObjectId"  // Projects koleksiyonuna referans
}
```

#### 4. TestExecutionLogs Koleksiyonu
```json
{
  "_id": "ObjectId",
  "executionId": "ObjectId",  // TestExecutions koleksiyonuna referans
  "timestamp": "Date",
  "level": "String",  // "info", "warning", "error", "debug"
  "message": "String",
  "source": "String",  // "system", "test", "agent"
  "metadata": "Object"
}
```

### Sorgular

#### Test Execution Sekmesi için Sorgular

1. **Aktif Çalışan Testleri Getirme**:
   ```javascript
   db.TestExecutions.find({
     status: { $in: ["running", "queued", "paused"] }
   }).sort({ startTime: -1 })
   ```

2. **Test Çalıştırma Detaylarını Getirme**:
   ```javascript
   db.TestExecutions.findOne({ _id: ObjectId(executionId) })
   ```

3. **Test Adımlarını Getirme**:
   ```javascript
   db.TestExecutionSteps.find({ executionId: ObjectId(executionId) }).sort({ order: 1 })
   ```

4. **Test Çalıştırma Durumunu Güncelleme**:
   ```javascript
   db.TestExecutions.updateOne(
     { _id: ObjectId(executionId) },
     { 
       $set: { 
         status: "paused",
         updatedAt: new Date()
       } 
     }
   )
   ```

#### Test Metrics Sekmesi için Sorgular

1. **Özet Metrikleri Getirme**:
   ```javascript
   db.TestMetrics.aggregate([
     { $match: { date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: null,
         totalTests: { $sum: "$totalTests" },
         passedTests: { $sum: "$passedTests" },
         failedTests: { $sum: "$failedTests" },
         skippedTests: { $sum: "$skippedTests" },
         avgDuration: { $avg: "$avgDuration" }
       }
     },
     { $project: {
         _id: 0,
         totalTests: 1,
         passedTests: 1,
         failedTests: 1,
         skippedTests: 1,
         avgDuration: 1,
         passRate: { $multiply: [{ $divide: ["$passedTests", "$totalTests"] }, 100] }
       }
     }
   ])
   ```

2. **Durum Dağılımını Getirme**:
   ```javascript
   db.TestMetrics.aggregate([
     { $match: { date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
     { $group: {
         _id: null,
         passed: { $sum: "$passedTests" },
         failed: { $sum: "$failedTests" },
         skipped: { $sum: "$skippedTests" }
       }
     },
     { $project: {
         _id: 0,
         passed: 1,
         failed: 1,
         skipped: 1
       }
     }
   ])
   ```

3. **Son Test Çalıştırmalarını Getirme**:
   ```javascript
   db.TestExecutions.find({ 
     status: "completed" 
   }).sort({ endTime: -1 }).limit(5)
   ```

#### API Testing Sekmesi için Sorgular

1. **Test Senaryolarını Getirme**:
   ```javascript
   db.TestCases.find().limit(3)
   ```

## Gerçek Zamanlı Güncellemeler

Test çalıştırmaları genellikle uzun süren işlemlerdir ve gerçek zamanlı güncellemeler önemlidir:

### Socket.io Entegrasyonu

```javascript
// Server tarafında
const io = require('socket.io')(server);

// Test çalıştırma güncellemeleri için bir oda oluştur
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // İstemci bir test çalıştırmasını izlemek istediğinde
  socket.on('join-execution', (executionId) => {
    socket.join(`execution-${executionId}`);
  });
  
  // İstemci bir test çalıştırmasını izlemeyi bıraktığında
  socket.on('leave-execution', (executionId) => {
    socket.leave(`execution-${executionId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Test adımı güncellendiğinde
function updateTestStep(executionId, stepId, status, data) {
  io.to(`execution-${executionId}`).emit('step-update', {
    executionId,
    stepId,
    status,
    ...data
  });
}

// Test çalıştırma durumu güncellendiğinde
function updateTestExecution(executionId, status, progress) {
  io.to(`execution-${executionId}`).emit('execution-update', {
    executionId,
    status,
    progress
  });
}
```

### İstemci Tarafında Socket.io Kullanımı

```javascript
// İstemci tarafında
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Test çalıştırmasını izlemeye başla
function watchTestExecution(executionId) {
  socket.emit('join-execution', executionId);
  
  // Test adımı güncellemelerini dinle
  socket.on('step-update', (data) => {
    // UI'ı güncelle
    updateStepInUI(data);
  });
  
  // Test çalıştırma güncellemelerini dinle
  socket.on('execution-update', (data) => {
    // UI'ı güncelle
    updateExecutionInUI(data);
  });
}

// Test çalıştırmasını izlemeyi bırak
function unwatchTestExecution(executionId) {
  socket.emit('leave-execution', executionId);
  socket.off('step-update');
  socket.off('execution-update');
}
```

## Uygulama Değişiklikleri

1. **API Servisi Güncellemeleri**:
   - `fetchData` fonksiyonunu MongoDB/Firestore bağlantısı için güncelle
   - Test çalıştırma işlemleri için servis fonksiyonlarını güncelle
   - Socket.io entegrasyonu için servis fonksiyonları ekle

2. **Test Execution Simulator**:
   - Simülatörü gerçek test çalıştırma işlemleriyle entegre et
   - Test adımlarını veritabanından çek
   - Test sonuçlarını veritabanına kaydet

3. **Active Running Tests Table**:
   - Tabloyu Socket.io ile entegre et
   - Gerçek zamanlı güncellemeleri göster
   - Test çalıştırma işlemlerini kontrol etme özelliği ekle

4. **Test Metrics Dashboard**:
   - Metrikleri veritabanından çek
   - Grafikleri dinamik verilerle güncelle
   - Filtreleme ve tarih aralığı seçme özellikleri ekle

## Performans Optimizasyonu

1. **Veritabanı İndeksleri**:
   ```javascript
   db.TestExecutions.createIndex({ status: 1 })
   db.TestExecutions.createIndex({ startTime: -1 })
   db.TestExecutions.createIndex({ createdBy: 1 })
   db.TestExecutionSteps.createIndex({ executionId: 1, order: 1 })
   db.TestExecutionSteps.createIndex({ status: 1 })
   db.TestMetrics.createIndex({ date: -1 })
   db.TestExecutionLogs.createIndex({ executionId: 1, timestamp: -1 })
   ```

2. **Sayfalama ve Sonsuz Kaydırma**:
   - Büyük veri setleri için sayfalama ekle
   - Test adımlarını kademeli olarak yükle
   - Test günlüklerini sonsuz kaydırma ile göster

3. **Önbelleğe Alma**:
   - Sık kullanılan metrikleri önbelleğe al
   - Test çalıştırma detaylarını önbelleğe al
   - Önbellek süresini optimize et

## Güvenlik Önlemleri

1. **Kimlik Doğrulama ve Yetkilendirme**:
   - Test çalıştırma işlemleri için rol tabanlı yetkilendirme
   - Test sonuçlarına erişim için izin kontrolü
   - Socket.io bağlantıları için kimlik doğrulama

2. **Veri Doğrulama**:
   - Test çalıştırma parametrelerinin doğrulanması
   - Test adımlarının tutarlılık kontrolü
   - Kullanıcı girdilerinin doğrulanması

3. **Günlük Kaydı ve İzleme**:
   - Tüm test çalıştırma işlemlerinin kaydedilmesi
   - Kritik işlemlerin günlüğe kaydedilmesi
   - Anormal davranışların izlenmesi

## Entegrasyon Noktaları

1. **CI/CD Entegrasyonu**:
   - Jenkins, GitHub Actions, GitLab CI gibi CI/CD sistemleriyle entegrasyon
   - Test çalıştırmalarını otomatik olarak tetikleme
   - Test sonuçlarını CI/CD pipeline'ına geri bildirme

2. **Bildirim Sistemleri**:
   - E-posta, Slack gibi bildirim kanallarıyla entegrasyon
   - Test çalıştırma sonuçları için otomatik bildirimler
   - Kritik hatalar için anlık bildirimler

3. **Raporlama Sistemleri**:
   - Test sonuçlarını raporlama sistemine aktarma
   - Özelleştirilmiş raporlar oluşturma
   - Raporları dışa aktarma (PDF, Excel, CSV)

## Mobil Uyumluluk

1. **Duyarlı Tasarım**:
   - Tüm bileşenlerin mobil cihazlarda düzgün görüntülenmesi
   - Dokunmatik ekranlar için optimize edilmiş kontroller
   - Mobil cihazlar için basitleştirilmiş görünümler

2. **Performans Optimizasyonu**:
   - Mobil cihazlar için veri kullanımını optimize etme
   - Grafikleri ve tabloları mobil cihazlar için ölçeklendirme
   - Düşük bant genişliği durumlarını ele alma

## Gelecek Geliştirmeler

1. **Test Adımı Düzenleyici**:
   - Sürükle ve bırak ile test adımlarını düzenleme
   - Test adımları için zengin düzenleyici
   - Test adımlarını şablonlardan oluşturma

2. **Test Sonuçları Karşılaştırma**:
   - Farklı test çalıştırmaları arasında karşılaştırma
   - Performans trendlerini analiz etme
   - Regresyonları otomatik olarak tespit etme

3. **Gelişmiş Metrikler**:
   - Test kapsama analizi
   - Kod kalitesi metrikleri
   - Test etkinliği ve ROI analizi
