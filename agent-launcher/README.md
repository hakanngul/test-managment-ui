# Agent-Launcher

Test otomasyon yönetim aracı için agent-launcher servisi. Bu servis, test isteklerini alır, kuyrukta bekletir ve uygun agent'lara dağıtır.

## Özellikler

- Express.js API sunucusu
- WebSocket ile gerçek zamanlı veri iletişimi
- Çoklu agent yönetimi
- Test kuyruğu yönetimi
- Sistem kaynakları izleme
- Sağlık durumu kontrolü
- Playwright ile browser otomasyonu

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda başlat
npm run dev

# Derleme
npm run build

# Üretim modunda başlat
npm start
```

## API Endpoints

### Agent Endpoints

- `GET /api/agents` - Tüm agent'ları listele
- `POST /api/agents` - Yeni agent oluştur
- `GET /api/agents/:id` - ID'ye göre agent getir
- `PUT /api/agents/:id/status` - Agent durumunu güncelle

### Queue Endpoints

- `GET /api/queue` - Kuyruktaki tüm istekleri listele
- `POST /api/queue` - Kuyruğa yeni istek ekle
- `GET /api/queue/:id` - ID'ye göre kuyruk isteği getir

### Server Metrics Endpoints

- `GET /api/server-agent` - Sunucu metriklerini getir
- `GET /api/server-agent/health-status` - Sağlık durumunu getir

### Results Endpoints

- `GET /api/processed-requests` - İşlenmiş istekleri listele
- `GET /api/processed-requests/:id` - ID'ye göre işlenmiş istek getir

## WebSocket Events

### Sunucudan İstemciye

- `system-metrics` - Sistem kaynakları kullanımı
- `agent-status` - Agent durumu
- `queue-status` - Kuyruk durumu
- `health-status` - Sağlık durumu
- `detailed-data` - Detaylı veriler (aktif agent'lar, kuyrukta bekleyen istekler, işlenmiş istekler)

## Ortam Değişkenleri

`.env` dosyasında aşağıdaki değişkenleri ayarlayabilirsiniz:

- `PORT` - Sunucunun çalışacağı port (varsayılan: 5000)
- `MONGODB_URI` - MongoDB bağlantı URI'si
- `MAX_AGENTS` - Maksimum agent sayısı
- `DEFAULT_BROWSER` - Varsayılan browser tipi
- `AGENT_TIMEOUT` - Agent zaman aşımı süresi (ms)
- `LOG_LEVEL` - Loglama seviyesi

## Mimari

Agent-Launcher, aşağıdaki bileşenlerden oluşur:

1. **AgentLauncher**: Ana sınıf, Express.js sunucusu ve WebSocket sunucusunu başlatır.
2. **AgentManager**: Agent'ları yönetir, yeni agent'lar oluşturur ve mevcut agent'ları izler.
3. **QueueManager**: Test isteklerini kuyrukta bekletir ve öncelik sırasına göre işler.
4. **SystemMonitor**: Sistem kaynaklarını (CPU, bellek, disk, ağ) izler.
5. **HealthChecker**: Sistemin sağlık durumunu kontrol eder.
6. **MetricsPublisher**: Metrikleri WebSocket üzerinden yayınlar.
7. **BrowserController**: Playwright kullanarak browser otomasyonunu yönetir.

## Lisans

MIT
