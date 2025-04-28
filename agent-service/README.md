# Agent Service

Agent Service, test otomasyon sisteminin agent yönetim bileşenidir. Bu servis, agent'ların başlatılması, durdurulması, izlenmesi ve test isteklerinin kuyruğa alınması gibi işlemleri yönetir.

## Özellikler

- Agent Launcher yönetimi
- Birden fazla Agent'ı dinamik olarak başlatma ve durdurma
- Test istekleri için kuyruk yönetimi
- Sistem kaynakları ve performans metriklerinin izlenmesi
- WebSocket ile gerçek zamanlı veri iletişimi
- MongoDB ile veri depolama

## Başlangıç

### Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (v4.4 veya üzeri)

### Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. `.env` dosyasını yapılandırın:

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/agent-service
NODE_ENV=development
MAX_AGENTS=5
MIN_AGENTS=1
HEALTH_CHECK_INTERVAL=10000
METRICS_COLLECTION_INTERVAL=60000
```

### Çalıştırma

Geliştirme modunda çalıştırma:

```bash
npm run dev
```

Üretim modunda çalıştırma:

```bash
npm start
```

## API Endpoints

### Agent Launcher

- `POST /api/launcher/initialize` - Agent Launcher'ı başlat
- `GET /api/launcher/status` - Launcher durumunu al
- `PUT /api/launcher/config` - Launcher yapılandırmasını güncelle
- `POST /api/launcher/agents` - Yeni bir agent başlat
- `DELETE /api/launcher/agents/:id` - Bir agent'ı durdur
- `POST /api/launcher/scale` - Agent sayısını ölçeklendir

### Agents

- `GET /api/agents` - Tüm agent'ları listele
- `GET /api/agents/:id` - Belirli bir agent'ı al
- `PUT /api/agents/:id/status` - Agent durumunu güncelle
- `PUT /api/agents/:id/capabilities` - Agent yeteneklerini güncelle
- `PUT /api/agents/:id/health` - Agent sağlık durumunu güncelle
- `POST /api/agents/:id/heartbeat` - Agent heartbeat gönder

### Queue

- `POST /api/queue` - Kuyruğa yeni bir test isteği ekle
- `GET /api/queue` - Kuyrukta bekleyen istekleri listele
- `GET /api/queue/processed` - İşlenmiş istekleri listele
- `DELETE /api/queue/:id` - Bir isteği iptal et
- `PUT /api/queue/:id/progress` - İstek ilerleme durumunu güncelle
- `PUT /api/queue/:id/complete` - Bir isteği tamamla

### Metrics

- `GET /api/metrics/system` - Sistem kaynaklarını al
- `GET /api/metrics/system/latest` - En son sistem kaynaklarını al
- `POST /api/metrics/system/collect` - Sistem kaynaklarını topla
- `GET /api/metrics/performance` - Performans metriklerini al
- `GET /api/metrics/performance/latest` - En son performans metriklerini al

## WebSocket Events

### Client -> Server

- `subscribe` - Belirli kanallara abone ol
- `unsubscribe` - Belirli kanallardan aboneliği iptal et

### Server -> Client

- `initial_data` - Bağlantı kurulduğunda gönderilen ilk veriler
- `agent_update` - Agent güncellendiğinde
- `agent_created` - Yeni agent oluşturulduğunda
- `agent_deleted` - Agent silindiğinde
- `queue_update` - Kuyruk güncellendiğinde
- `queue_created` - Yeni istek eklendiğinde
- `queue_deleted` - İstek silindiğinde
- `system_resources_update` - Sistem kaynakları güncellendiğinde
- `launcher_update` - Launcher güncellendiğinde

## Mimari

Agent Service, aşağıdaki bileşenlerden oluşur:

1. **Agent Launcher**: Agent'ları başlatır ve yönetir
2. **Agents**: Test çalıştırma birimleri
3. **Queue Manager**: Test isteklerini yönetir
4. **Metrics Collector**: Sistem ve performans metriklerini toplar
5. **WebSocket Server**: Gerçek zamanlı veri iletişimi sağlar

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
