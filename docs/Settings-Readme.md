# Settings Modülü Mimarisi ve Veritabanı Tasarımı

## Genel Bakış
Settings modülü, test otomasyonu platformunun tüm yapılandırma ayarlarını yönetmek için kapsamlı bir arayüz sunar. Bu modül, altı ana kategoride organize edilmiştir:
1. **General**: Temel uygulama ayarları ve varsayılan test çalıştırma parametreleri
2. **Environments**: Test ortamlarının yapılandırması ve ortam değişkenleri
3. **Browsers**: Test çalıştırma için tarayıcı yapılandırmaları
4. **Notifications**: Test çalıştırmaları hakkında bildirim ayarları
5. **Integrations**: Diğer araçlar ve hizmetlerle entegrasyon ayarları
6. **Security**: API anahtarları ve erişim kontrolü yönetimi

Bu modül, test otomasyonu sürecinin tüm yönlerini özelleştirmek ve yapılandırmak için merkezi bir yer sağlar.

## Bileşen Yapısı

### Settings.tsx (Ana Sayfa)
- **Tabs**: Altı ana ayar kategorisi arasında gezinme
- **TabPanel**: Her sekme için içerik paneli

### Ortak Bileşenler
- **SettingsSection**: Her ayar bölümü için başlık, açıklama ve içerik alanı sağlayan konteyner
- **SettingsCard**: Her ayar kartı için başlık, açıklama, simge ve içerik alanı sağlayan bileşen

### GeneralSettings.tsx
- **Application Settings Card**: Uygulama adı ve günlük seviyesi gibi temel ayarlar
- **Test Execution Defaults Card**: Varsayılan zaman aşımı, yeniden deneme sayısı ve rapor formatı
- **Screenshot on Failure Card**: Test başarısız olduğunda ekran görüntüsü alma ayarı
- **Video Recording Card**: Test çalıştırma sırasında video kaydetme ayarı

### TestEnvironmentSettings.tsx
- **Environment List**: Mevcut test ortamlarının listesi
- **Environment Dialog**: Yeni ortam ekleme veya mevcut ortamı düzenleme iletişim kutusu
- **Environment Variables**: Her ortam için değişken anahtar-değer çiftleri

### BrowserSettings.tsx
- **Execution Settings Card**: Varsayılan tarayıcı, paralel çalıştırma ve maksimum örnek sayısı
- **Browser Capabilities Card**: Her tarayıcı için başsız mod, pencere boyutu, kullanıcı ajanı ve diğer ayarlar

### NotificationSettings.tsx
- **Email Notifications Card**: E-posta bildirimleri için alıcılar ve tetikleyiciler
- **Slack Notifications Card**: Slack bildirimleri için webhook, kanal ve tetikleyiciler
- **General Notification Settings Card**: Bildirim zamanlaması ve detay seviyesi

### IntegrationSettings.tsx
- **JIRA Integration Card**: JIRA bağlantısı için URL, API anahtarı ve kullanıcı adı
- **GitHub Integration Card**: GitHub bağlantısı için URL, kişisel erişim belirteci ve depo
- **GitLab Integration Card**: GitLab bağlantısı için URL, API anahtarı ve proje
- **Jenkins Integration Card**: Jenkins bağlantısı için URL, API anahtarı ve iş adı

### SecuritySettings.tsx
- **API Keys Card**: API anahtarları oluşturma, görüntüleme, yenileme ve silme
- **API Key Dialog**: Yeni API anahtarı oluşturma iletişim kutusu
- **API Key Table**: Mevcut API anahtarlarının listesi

## Mevcut Veri Akışı
Şu anda Settings modülü, yerel durum yönetimi kullanarak çalışmaktadır. Her bileşen, kendi yerel durumunu yönetir ve ayarları saklar. Gerçek bir API entegrasyonu bulunmamaktadır.

```javascript
// Örnek yerel durum yönetimi (GeneralSettings.tsx)
const [settings, setSettings] = useState(initialSettings);

// Ayarları kaydetme işlevi
const handleSave = () => {
  console.log('Saving settings:', settings);
  setSnackbarOpen(true);
};
```

## Veritabanı Gereksinimleri (NoSQL - MongoDB/Firestore)

### Koleksiyonlar

#### 1. Settings Koleksiyonu
```json
{
  "_id": "ObjectId",
  "type": "String",  // "general", "environment", "browser", "notification", "integration", "security"
  "createdAt": "Date",
  "updatedAt": "Date",
  "createdBy": "ObjectId",  // Users koleksiyonuna referans
  "updatedBy": "ObjectId",  // Users koleksiyonuna referans
  "data": "Object"  // Her ayar türüne özgü veri
}
```

#### 2. GeneralSettings Alt Koleksiyonu
```json
{
  "_id": "ObjectId",
  "appName": "String",
  "defaultTimeout": "Number",
  "defaultRetries": "Number",
  "reportFormat": "String",  // "html", "pdf", "xml", "json"
  "screenshotOnFailure": "Boolean",
  "videoRecording": "Boolean",
  "logLevel": "String",  // "debug", "info", "warn", "error"
  "updatedAt": "Date",
  "updatedBy": "ObjectId"  // Users koleksiyonuna referans
}
```

#### 3. TestEnvironments Koleksiyonu
```json
{
  "_id": "ObjectId",
  "name": "String",
  "baseUrl": "String",
  "description": "String",
  "isDefault": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date",
  "createdBy": "ObjectId",  // Users koleksiyonuna referans
  "updatedBy": "ObjectId",  // Users koleksiyonuna referans
  "variables": [
    {
      "key": "String",
      "value": "String",
      "isSecret": "Boolean"
    }
  ]
}
```

#### 4. BrowserSettings Koleksiyonu
```json
{
  "_id": "ObjectId",
  "defaultBrowser": "String",
  "parallelExecution": "Boolean",
  "maxInstances": "Number",
  "updatedAt": "Date",
  "updatedBy": "ObjectId",  // Users koleksiyonuna referans
  "browsers": [
    {
      "name": "String",  // "chrome", "firefox", "safari", "edge"
      "enabled": "Boolean",
      "headless": "Boolean",
      "windowSize": "String",
      "userAgent": "String",
      "arguments": "String",
      "extensions": "Boolean",
      "proxy": "String"
    }
  ]
}
```

#### 5. NotificationSettings Koleksiyonu
```json
{
  "_id": "ObjectId",
  "email": {
    "enabled": "Boolean",
    "recipients": "String",
    "onSuccess": "Boolean",
    "onFailure": "Boolean"
  },
  "slack": {
    "enabled": "Boolean",
    "webhook": "String",
    "channel": "String",
    "onSuccess": "Boolean",
    "onFailure": "Boolean"
  },
  "general": {
    "notifyOnStart": "Boolean",
    "notifyOnComplete": "Boolean",
    "notificationLevel": "String"  // "suite", "test", "step"
  },
  "updatedAt": "Date",
  "updatedBy": "ObjectId"  // Users koleksiyonuna referans
}
```

#### 6. IntegrationSettings Koleksiyonu
```json
{
  "_id": "ObjectId",
  "jira": {
    "enabled": "Boolean",
    "url": "String",
    "apiKey": "String",
    "username": "String",
    "project": "String"
  },
  "github": {
    "enabled": "Boolean",
    "url": "String",
    "apiKey": "String",
    "repository": "String"
  },
  "gitlab": {
    "enabled": "Boolean",
    "url": "String",
    "apiKey": "String",
    "project": "String"
  },
  "jenkins": {
    "enabled": "Boolean",
    "url": "String",
    "apiKey": "String",
    "job": "String"
  },
  "updatedAt": "Date",
  "updatedBy": "ObjectId"  // Users koleksiyonuna referans
}
```

#### 7. ApiKeys Koleksiyonu
```json
{
  "_id": "ObjectId",
  "name": "String",
  "key": "String",  // Şifrelenmiş olarak saklanmalı
  "createdAt": "Date",
  "expiresAt": "Date",
  "lastUsed": "Date",
  "createdBy": "ObjectId",  // Users koleksiyonuna referans
  "scopes": ["String"],  // "read", "write", "execute", "admin"
  "isActive": "Boolean"
}
```

### Sorgular

#### GeneralSettings için Sorgular

1. **Genel Ayarları Getirme**:
   ```javascript
   db.GeneralSettings.findOne()
   ```

2. **Genel Ayarları Güncelleme**:
   ```javascript
   db.GeneralSettings.updateOne(
     { _id: ObjectId("generalSettingsId") },
     { 
       $set: { 
         appName: "Test Automation Manager",
         defaultTimeout: 30,
         defaultRetries: 2,
         reportFormat: "html",
         screenshotOnFailure: true,
         videoRecording: false,
         logLevel: "info",
         updatedAt: new Date(),
         updatedBy: ObjectId(currentUserId)
       } 
     },
     { upsert: true }
   )
   ```

#### TestEnvironments için Sorgular

1. **Tüm Ortamları Getirme**:
   ```javascript
   db.TestEnvironments.find().sort({ name: 1 })
   ```

2. **Yeni Ortam Ekleme**:
   ```javascript
   db.TestEnvironments.insertOne({
     name: "Development",
     baseUrl: "https://dev-api.example.com",
     description: "Development environment for testing new features",
     isDefault: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     createdBy: ObjectId(currentUserId),
     updatedBy: ObjectId(currentUserId),
     variables: [
       { key: "API_KEY", value: "dev-api-key-123", isSecret: true },
       { key: "TIMEOUT", value: "30000", isSecret: false }
     ]
   })
   ```

3. **Ortam Güncelleme**:
   ```javascript
   db.TestEnvironments.updateOne(
     { _id: ObjectId(environmentId) },
     { 
       $set: { 
         name: "Development Updated",
         baseUrl: "https://dev-api-updated.example.com",
         description: "Updated description",
         variables: updatedVariables,
         updatedAt: new Date(),
         updatedBy: ObjectId(currentUserId)
       } 
     }
   )
   ```

#### BrowserSettings için Sorgular

1. **Tarayıcı Ayarlarını Getirme**:
   ```javascript
   db.BrowserSettings.findOne()
   ```

2. **Tarayıcı Ayarlarını Güncelleme**:
   ```javascript
   db.BrowserSettings.updateOne(
     { _id: ObjectId("browserSettingsId") },
     { 
       $set: { 
         defaultBrowser: "chrome",
         parallelExecution: true,
         maxInstances: 5,
         browsers: updatedBrowsers,
         updatedAt: new Date(),
         updatedBy: ObjectId(currentUserId)
       } 
     },
     { upsert: true }
   )
   ```

#### ApiKeys için Sorgular

1. **Tüm API Anahtarlarını Getirme**:
   ```javascript
   db.ApiKeys.find({ isActive: true }).sort({ createdAt: -1 })
   ```

2. **Yeni API Anahtarı Oluşturma**:
   ```javascript
   db.ApiKeys.insertOne({
     name: "Test API Key",
     key: encryptedApiKey,
     createdAt: new Date(),
     expiresAt: expirationDate,
     lastUsed: null,
     createdBy: ObjectId(currentUserId),
     scopes: ["read", "write"],
     isActive: true
   })
   ```

3. **API Anahtarını Silme**:
   ```javascript
   db.ApiKeys.updateOne(
     { _id: ObjectId(apiKeyId) },
     { $set: { isActive: false } }
   )
   ```

## Uygulama Değişiklikleri

1. **API Servisi Güncellemeleri**:
   - `fetchData` fonksiyonunu MongoDB/Firestore bağlantısı için güncelle
   - Her ayar kategorisi için CRUD işlemleri ekle
   - Hassas bilgileri şifreleme ve şifre çözme işlevleri ekle

2. **Durum Yönetimi**:
   - Yerel durum yönetiminden global durum yönetimine geçiş (Context API veya Redux)
   - Ayarları merkezi bir yerden yönetme
   - Ayar değişikliklerini gerçek zamanlı olarak izleme

3. **Kullanıcı Arayüzü İyileştirmeleri**:
   - Ayarları kaydetme ve iptal etme işlevleri için tutarlı bir yaklaşım
   - Değişiklikleri izleme ve kaydedilmemiş değişiklikler için uyarı
   - Hassas bilgiler için maskeleme ve güvenlik önlemleri

4. **Doğrulama ve Hata İşleme**:
   - Ayarlar için kapsamlı doğrulama kuralları
   - Hata mesajları ve kullanıcı geri bildirimi için tutarlı bir yaklaşım
   - API hataları için yeniden deneme mekanizması

## Güvenlik Önlemleri

1. **Hassas Bilgilerin Korunması**:
   - API anahtarları, parolalar ve diğer hassas bilgileri şifrelenmiş olarak saklama
   - Hassas bilgileri maskeleme ve gizleme
   - Hassas bilgilere erişimi kısıtlama

2. **Erişim Kontrolü**:
   - Ayarlara erişim için rol tabanlı yetkilendirme
   - Ayar değişikliklerini izleme ve denetleme
   - API anahtarları için ayrıntılı izinler ve kapsamlar

3. **Veri Doğrulama**:
   - Tüm kullanıcı girdilerini doğrulama
   - Zararlı girdilere karşı koruma
   - Güvenli varsayılan değerler

## Çok Kullanıcılı Ortam Desteği

1. **Kullanıcı Bazlı Ayarlar**:
   - Bazı ayarları kullanıcı bazında özelleştirme
   - Kullanıcı tercihlerini saklama
   - Kullanıcı bazlı API anahtarları

2. **Çakışma Çözümü**:
   - Aynı anda birden fazla kullanıcının ayarları değiştirmesi durumunda çakışmaları çözme
   - Optimistik kilitleme veya son yazma kazanır stratejisi
   - Değişiklik geçmişi ve geri alma özelliği

3. **Denetim ve İzleme**:
   - Ayar değişikliklerini kim, ne zaman, ne değiştirdi şeklinde izleme
   - Değişiklik geçmişini görüntüleme
   - Kritik ayar değişiklikleri için bildirimler

## Entegrasyon Noktaları

1. **Kullanıcı Yönetimi**:
   - Kullanıcı kimlik doğrulama ve yetkilendirme sistemiyle entegrasyon
   - Kullanıcı rolleri ve izinleri

2. **Test Çalıştırma**:
   - Test çalıştırma ayarlarını test çalıştırma motoruna aktarma
   - Test çalıştırma sırasında ayarları kullanma

3. **Bildirim Sistemleri**:
   - E-posta ve Slack gibi bildirim kanallarıyla entegrasyon
   - Bildirim ayarlarını test sonuçlarına uygulama

4. **Dış Sistemler**:
   - JIRA, GitHub, GitLab, Jenkins gibi dış sistemlerle entegrasyon
   - API anahtarlarını ve kimlik bilgilerini güvenli bir şekilde yönetme
