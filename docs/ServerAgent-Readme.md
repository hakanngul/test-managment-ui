# Server Agent Sayfası Mimarisi ve Veritabanı Tasarımı

## Genel Bakış
Server Agent sayfası, test otomasyonu için kullanılan agent'ların durumunu ve test isteklerinin işlenme sürecini izlemek için kullanılır. Sayfa, sistem kaynaklarını (CPU/bellek kullanımı), agent durumunu (toplam/müsait/meşgul agent'lar) ve kuyruk durumunu (bekleyen/işlenen/toplam istekler) görüntüler.

## Bileşen Yapısı
Server Agent sayfası aşağıdaki bileşenlerden oluşur:
- **PageHeader**: Sayfa başlığı ve son güncelleme zamanını gösteren başlık bileşeni
- **SystemResourcesCard**: CPU ve bellek kullanımını gösteren kart
- **AgentStatusCard**: Agent'ların durumunu (toplam, müsait, meşgul) gösteren kart
- **QueueStatusCard**: İstek kuyruğunun durumunu gösteren kart
- **TabsContainer**: Sekme konteynerı
  - **ActiveAgentsTable**: Aktif agent'ları listeleyen tablo
  - **QueuedRequestsTable**: Kuyrukta bekleyen istekleri listeleyen tablo
  - **ProcessedRequestsTable**: İşlenen istekleri listeleyen tablo
- **LoadingIndicator**: Yükleme göstergesi
- **ErrorDisplay**: Hata mesajı göstergesi

## Mevcut Veri Akışı
1. `useEffect` hook'u ile API'den veriler çekilir
2. Çekilen veriler state'e atanır
3. State'deki veriler ilgili bileşenlere aktarılır
4. Otomatik yenileme için 10 saniyede bir `refreshData` fonksiyonu çağrılır

## Veritabanı Gereksinimleri (NoSQL - MongoDB/Firestore)

### Koleksiyonlar

#### 1. SystemResources Koleksiyonu
```json
{
  "_id": "ObjectId",
  "cpuUsage": "Number",
  "memoryUsage": "Number",
  "lastUpdated": "Date",
  "serverId": "String"
}
```

#### 2. Agents Koleksiyonu
```json
{
  "_id": "ObjectId",
  "browser": "String",
  "status": "String",  // "available", "busy", "offline"
  "created": "Date",
  "lastActivity": "Date",
  "currentRequest": "String",  // İşlenen isteğin ID'si veya null
  "serverId": "String",
  "ipAddress": "String",
  "version": "String",
  "capabilities": ["String"]
}
```

#### 3. QueueStatus Koleksiyonu
```json
{
  "_id": "ObjectId",
  "queued": "Number",
  "processing": "Number",
  "total": "Number",
  "lastUpdated": "Date",
  "serverId": "String"
}
```

#### 4. TestRequests Koleksiyonu
```json
{
  "_id": "ObjectId",
  "testName": "String",
  "testId": "String",
  "browser": "String",
  "priority": "String",  // "high", "medium", "low"
  "category": "String",
  "status": "String",  // "queued", "processing", "completed", "failed"
  "queuedAt": "Date",
  "startTime": "Date",
  "endTime": "Date",
  "duration": "Number",  // Milisaniye cinsinden
  "agentId": "String",
  "results": {
    "success": "Boolean",
    "errorMessage": "String",
    "screenshots": ["String"],
    "logs": ["String"]
  }
}
```

### Dashboard Verileri İçin Sorgular

1. **Sistem Kaynakları**:
   ```javascript
   db.SystemResources.findOne({ serverId: "main" }).sort({ lastUpdated: -1 })
   ```

2. **Agent Durumu**:
   ```javascript
   db.Agents.aggregate([
     { $group: { 
         _id: "$status", 
         count: { $sum: 1 } 
       } 
     }
   ])
   ```

3. **Kuyruk Durumu**:
   ```javascript
   db.QueueStatus.findOne({ serverId: "main" }).sort({ lastUpdated: -1 })
   ```

4. **Aktif Agent'lar**:
   ```javascript
   db.Agents.find({ status: { $in: ["available", "busy"] } }).sort({ lastActivity: -1 })
   ```

5. **Kuyrukta Bekleyen İstekler**:
   ```javascript
   db.TestRequests.find({ status: "queued" }).sort({ queuedAt: 1, priority: 1 })
   ```

6. **İşlenen İstekler**:
   ```javascript
   db.TestRequests.find({ status: { $in: ["completed", "failed"] } }).sort({ endTime: -1 })
   ```

## Gerçek Zamanlı Veri Güncellemeleri

Server Agent sayfası, test agent'larının durumunu ve test isteklerinin işlenme sürecini gerçek zamanlı olarak izlemek için tasarlanmıştır. Bu nedenle, veritabanı tasarımı gerçek zamanlı güncellemeleri desteklemelidir.

### MongoDB Change Streams Kullanımı

MongoDB Change Streams, veritabanındaki değişiklikleri gerçek zamanlı olarak izlemek için kullanılabilir:

```javascript
// Server tarafında
const changeStream = db.collection('Agents').watch();
changeStream.on('change', (change) => {
  // Değişikliği istemcilere bildir (Socket.IO veya WebSocket kullanarak)
  io.emit('agent-status-change', change);
});
```

### Firestore Gerçek Zamanlı Dinleyiciler

Firestore kullanılıyorsa, gerçek zamanlı dinleyiciler kullanılabilir:

```javascript
// İstemci tarafında
db.collection('Agents').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      // Yeni agent eklendiğinde
    }
    if (change.type === 'modified') {
      // Agent durumu değiştiğinde
    }
    if (change.type === 'removed') {
      // Agent kaldırıldığında
    }
  });
});
```

## Uygulama Değişiklikleri

1. **API Servisi Güncellemeleri**:
   - `fetchData` fonksiyonunu MongoDB/Firestore bağlantısı için güncelle
   - Gerçek zamanlı güncellemeler için Socket.IO veya WebSocket entegrasyonu ekle
   - Veritabanı bağlantı sorunları için hata yönetimi ekle

2. **Veri Dönüşümleri**:
   - Veritabanı şemasına uygun veri dönüşüm mantığını güncelle
   - Tarih/saat formatlamasını standartlaştır

3. **Gerçek Zamanlı Güncellemeler**:
   - `useEffect` içindeki 10 saniyelik interval yerine gerçek zamanlı güncellemeleri kullan
   - Socket.IO veya WebSocket bağlantısı için custom hook oluştur

4. **Performans Optimizasyonu**:
   - İşlenen istekler tablosu için sunucu taraflı sayfalama ekle
   - Sık erişilen veriler için önbellek mekanizması ekle
   - Büyük veri setleri için sanal liste (virtualized list) kullan

## Performans İçin İndeksler

MongoDB için aşağıdaki indeksleri oluşturarak sorgu performansını optimize edebilirsiniz:

```javascript
db.Agents.createIndex({ status: 1 })
db.Agents.createIndex({ lastActivity: -1 })
db.TestRequests.createIndex({ status: 1 })
db.TestRequests.createIndex({ queuedAt: 1 })
db.TestRequests.createIndex({ endTime: -1 })
db.TestRequests.createIndex({ priority: 1 })
```

Firestore için benzer indeksleme stratejileri sorgu desenlerinize göre uygulanabilir.

## Güvenlik Önlemleri

1. **Kimlik Doğrulama ve Yetkilendirme**:
   - Agent'ların kimlik doğrulaması için güvenli token sistemi
   - Kullanıcı rollerine göre yetkilendirme (admin, test yöneticisi, geliştirici)

2. **Veri Doğrulama**:
   - Agent'lardan gelen verilerin doğrulanması
   - İstek parametrelerinin doğrulanması

3. **Veri Şifreleme**:
   - Hassas verilerin şifrelenmesi (kimlik bilgileri, test ortamı erişim bilgileri)
   - İletişim kanallarının TLS/SSL ile şifrelenmesi
