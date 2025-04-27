# Test Cases Sayfaları Mimarisi ve Veritabanı Tasarımı

## Genel Bakış
Test Cases modülü, test senaryolarının yönetilmesini sağlayan üç ana sayfadan oluşur:
1. **TestCases.tsx**: Test senaryolarının listelendiği, filtrelendiği ve sıralandığı ana sayfa
2. **NewTestCase.tsx**: Yeni test senaryosu oluşturma sayfası
3. **TestCaseDetail.tsx**: Mevcut bir test senaryosunun detaylarını görüntüleme ve düzenleme sayfası

Bu sayfalar, test otomasyonu sürecinin temel yapı taşlarını oluşturur ve test senaryolarının yaşam döngüsünü yönetir.

## Bileşen Yapısı

### TestCases.tsx
- **TestCasesHeader**: Sayfa başlığı ve yeni test senaryosu oluşturma butonu
- **TestCasesFilter**: Arama, filtreleme ve sıralama kontrolleri
- **FilterMenu**: Durum ve öncelik filtresi için açılır menü
- **SortMenu**: Sıralama seçenekleri için açılır menü
- **TestCasesTable**: Test senaryolarını listeleyen tablo
- **EmptyState**: Test senaryosu bulunmadığında gösterilen durum
- **LoadingState**: Veri yüklenirken gösterilen durum

### NewTestCase.tsx
- **PageHeader**: Sayfa başlığı ve işlem butonları
- **BasicInformationForm**: Temel bilgileri (başlık, açıklama, durum, öncelik, etiketler) içeren form
- **TestStepsSection**: Test adımlarını ekleme ve düzenleme bölümü
- **DiscardChangesDialog**: Kaydedilmemiş değişiklikleri iptal etme onay iletişim kutusu
- **LoadingIndicator**: Veri yüklenirken gösterilen gösterge
- **ErrorDisplay**: Hata mesajı göstergesi

### TestCaseDetail.tsx
- **Breadcrumbs**: Gezinme kırıntıları
- **Tabs**: Detaylar, Test Adımları, Geçmiş ve İlgili Sorunlar sekmeleri
- **DragDropContext**: Test adımlarını sürükle-bırak ile yeniden sıralamak için konteyner
- **Accordion**: Otomasyon kodunu göstermek için genişletilebilir panel

## Mevcut Veri Akışı
1. TestCases.tsx: `api.getTestCases()` ile test senaryoları çekilir
2. NewTestCase.tsx: `api.getAvailableTags()` ve `api.getAvailableActions()` ile form verileri çekilir
3. TestCaseDetail.tsx: `api.getMockTestCases()` ile test senaryosu detayları çekilir

## Veritabanı Gereksinimleri (NoSQL - MongoDB/Firestore)

### Koleksiyonlar

#### 1. TestCases Koleksiyonu
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "status": "String",  // "active", "draft", "archived"
  "priority": "String",  // "critical", "high", "medium", "low"
  "tags": ["String"],
  "steps": [
    {
      "id": "String",
      "order": "Number",
      "action": "String",  // "click", "type", "wait", "select", "assert", "navigate", "hover", "scroll", "drag", "upload", "custom"
      "target": "String",
      "value": "String",
      "description": "String",
      "expectedResult": "String",
      "type": "String",  // "manual", "automated"
      "code": "String"  // Otomasyon kodu (varsa)
    }
  ],
  "preconditions": "String",
  "createdBy": "ObjectId",  // Users koleksiyonuna referans
  "createdAt": "Date",
  "updatedBy": "ObjectId",  // Users koleksiyonuna referans
  "updatedAt": "Date",
  "lastExecutedAt": "Date",
  "executionStats": {
    "totalRuns": "Number",
    "passCount": "Number",
    "failCount": "Number",
    "passRate": "Number"
  }
}
```

#### 2. TestCaseHistory Koleksiyonu
```json
{
  "_id": "ObjectId",
  "testCaseId": "ObjectId",  // TestCases koleksiyonuna referans
  "action": "String",  // "created", "updated", "deleted"
  "field": "String",  // Değişen alan (güncelleme durumunda)
  "oldValue": "Mixed",  // Eski değer (güncelleme durumunda)
  "newValue": "Mixed",  // Yeni değer (güncelleme durumunda)
  "userId": "ObjectId",  // Users koleksiyonuna referans
  "timestamp": "Date"
}
```

#### 3. TestCaseTags Koleksiyonu
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "color": "String",  // Etiket rengi (HEX kodu)
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### 4. TestActions Koleksiyonu
```json
{
  "_id": "ObjectId",
  "name": "String",  // "click", "type", "wait", vb.
  "description": "String",
  "icon": "String",  // İkon adı veya kodu
  "type": "String",  // "ui", "api", "database", "custom"
  "parameters": ["String"],  // Gereken parametreler
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### 5. TestCaseIssues Koleksiyonu (İlişkisel tablo)
```json
{
  "_id": "ObjectId",
  "testCaseId": "ObjectId",  // TestCases koleksiyonuna referans
  "issueId": "String",  // Dış sistemdeki sorun ID'si
  "issueSystem": "String",  // "jira", "github", "gitlab", vb.
  "issueUrl": "String",
  "issueTitle": "String",
  "issueStatus": "String",
  "linkType": "String",  // "blocks", "is-blocked-by", "relates-to", "tests", "is-tested-by"
  "createdBy": "ObjectId",
  "createdAt": "Date"
}
```

### Sorgular

#### TestCases.tsx için Sorgular

1. **Test Senaryolarını Listeleme**:
   ```javascript
   db.TestCases.find().sort({ updatedAt: -1 })
   ```

2. **Filtreleme ve Sıralama**:
   ```javascript
   db.TestCases.find({
     $and: [
       { title: { $regex: searchQuery, $options: 'i' } },
       selectedStatusFilter !== 'all' ? { status: selectedStatusFilter } : {},
       selectedPriorityFilter !== 'all' ? { priority: selectedPriorityFilter } : {}
     ]
   }).sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
   ```

3. **Etiketlere Göre Filtreleme**:
   ```javascript
   db.TestCases.find({ tags: { $in: selectedTags } })
   ```

#### NewTestCase.tsx için Sorgular

1. **Mevcut Etiketleri Getirme**:
   ```javascript
   db.TestCaseTags.find().sort({ name: 1 })
   ```

2. **Mevcut Aksiyonları Getirme**:
   ```javascript
   db.TestActions.find().sort({ name: 1 })
   ```

3. **Yeni Test Senaryosu Oluşturma**:
   ```javascript
   db.TestCases.insertOne({
     title: formData.title,
     description: formData.description,
     status: formData.status,
     priority: formData.priority,
     tags: formData.tags,
     steps: formData.steps,
     createdBy: currentUserId,
     createdAt: new Date(),
     updatedBy: currentUserId,
     updatedAt: new Date(),
     executionStats: {
       totalRuns: 0,
       passCount: 0,
       failCount: 0,
       passRate: 0
     }
   })
   ```

#### TestCaseDetail.tsx için Sorgular

1. **Test Senaryosu Detaylarını Getirme**:
   ```javascript
   db.TestCases.findOne({ _id: ObjectId(id) })
   ```

2. **Test Senaryosu Geçmişini Getirme**:
   ```javascript
   db.TestCaseHistory.find({ testCaseId: ObjectId(id) }).sort({ timestamp: -1 })
   ```

3. **İlgili Sorunları Getirme**:
   ```javascript
   db.TestCaseIssues.find({ testCaseId: ObjectId(id) })
   ```

4. **Test Senaryosunu Güncelleme**:
   ```javascript
   db.TestCases.updateOne(
     { _id: ObjectId(id) },
     { 
       $set: { 
         title: testCase.title,
         description: testCase.description,
         status: testCase.status,
         priority: testCase.priority,
         tags: testCase.tags,
         steps: testCase.steps,
         updatedBy: currentUserId,
         updatedAt: new Date()
       } 
     }
   )
   ```

5. **Geçmiş Kaydı Oluşturma**:
   ```javascript
   db.TestCaseHistory.insertOne({
     testCaseId: ObjectId(id),
     action: "updated",
     field: "description",
     oldValue: oldDescription,
     newValue: newDescription,
     userId: currentUserId,
     timestamp: new Date()
   })
   ```

## Gerçek Zamanlı Güncellemeler

Test senaryoları üzerinde yapılan değişikliklerin gerçek zamanlı olarak diğer kullanıcılara yansıtılması için:

### MongoDB Change Streams Kullanımı

```javascript
// Server tarafında
const changeStream = db.collection('TestCases').watch();
changeStream.on('change', (change) => {
  // Değişikliği istemcilere bildir
  io.emit('test-case-change', change);
});
```

### Firestore Gerçek Zamanlı Dinleyiciler

```javascript
// İstemci tarafında
db.collection('TestCases').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'modified') {
      // Test senaryosu güncellendiğinde UI'ı güncelle
    }
  });
});
```

## Uygulama Değişiklikleri

1. **API Servisi Güncellemeleri**:
   - `fetchData` fonksiyonunu MongoDB/Firestore bağlantısı için güncelle
   - Test senaryosu CRUD işlemleri için servis fonksiyonlarını güncelle
   - Geçmiş kayıtları için servis fonksiyonları ekle

2. **Veri Dönüşümleri**:
   - Veritabanı şemasına uygun veri dönüşüm mantığını güncelle
   - Test adımları için sıralama ve ID oluşturma mantığını güncelle

3. **Kullanıcı Arayüzü İyileştirmeleri**:
   - Test adımları için daha gelişmiş bir düzenleyici ekle
   - Otomasyon kodu için sözdizimi vurgulama ekle
   - Test senaryosu geçmişi için daha detaylı görünüm ekle

4. **Performans Optimizasyonu**:
   - Büyük test senaryosu listeleri için sayfalama ekle
   - Karmaşık test adımları için lazy loading ekle
   - Sık kullanılan verileri önbelleğe alma

## Performans İçin İndeksler

MongoDB için aşağıdaki indeksleri oluşturarak sorgu performansını optimize edebilirsiniz:

```javascript
db.TestCases.createIndex({ title: "text", description: "text" })
db.TestCases.createIndex({ status: 1 })
db.TestCases.createIndex({ priority: 1 })
db.TestCases.createIndex({ tags: 1 })
db.TestCases.createIndex({ updatedAt: -1 })
db.TestCases.createIndex({ createdAt: -1 })
db.TestCaseHistory.createIndex({ testCaseId: 1, timestamp: -1 })
db.TestCaseIssues.createIndex({ testCaseId: 1 })
```

Firestore için benzer indeksleme stratejileri sorgu desenlerinize göre uygulanabilir.

## Güvenlik Önlemleri

1. **Kimlik Doğrulama ve Yetkilendirme**:
   - Test senaryolarına erişim için rol tabanlı yetkilendirme
   - Hassas test senaryoları için özel izinler

2. **Veri Doğrulama**:
   - Test senaryosu verilerinin şema doğrulaması
   - Test adımlarının tutarlılık kontrolü

3. **Denetim ve İzleme**:
   - Tüm test senaryosu değişikliklerinin kaydedilmesi
   - Kritik işlemlerin günlüğe kaydedilmesi

## Veri Yedekleme ve Kurtarma

1. **Düzenli Yedekleme**:
   - Test senaryoları için günlük yedekleme
   - Geçmiş kayıtları için haftalık yedekleme

2. **Geri Alma Mekanizması**:
   - Test senaryosu değişikliklerini geri alma özelliği
   - Silinen test senaryolarını geri yükleme özelliği
