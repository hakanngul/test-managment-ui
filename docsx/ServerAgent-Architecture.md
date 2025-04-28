# ServerAgent Mimari Yapısı

Bu belge, `src/models/ServerAgent.ts` dosyasının mimari yapısını ve ilişkili modelleri açıklamaktadır.

## ServerAgent Modeli Genel Bakış

ServerAgent modeli, test otomasyon sistemindeki bir sunucu ajanını temsil eder. Bu model, sunucu kaynakları, ajan durumu, kuyruk durumu, aktif ajanlar, kuyrukta bekleyen istekler ve işlenmiş istekler gibi bilgileri içerir.

## Arayüz Yapısı

```typescript
export interface ServerAgent {
  id: string;
  systemResources: SystemResource;
  agentStatus: AgentStatusSummary;
  queueStatus: QueueStatusSummary;
  activeAgents: Agent[];
  queuedRequests: QueuedRequest[];
  processedRequests: ProcessedRequest[];
}
```

## İlişkili Modeller

ServerAgent modeli aşağıdaki modellerle ilişkilidir:

1. **SystemResource**: Sunucu kaynaklarını (CPU kullanımı, bellek kullanımı vb.) temsil eder.
2. **AgentStatusSummary**: Ajanların durumunu özetler (toplam, kullanılabilir, meşgul, çevrimdışı vb.).
3. **QueueStatusSummary**: Kuyruk durumunu özetler (kuyruktaki, işlenen, toplam vb.).
4. **Agent**: Bir test ajanını temsil eder.
5. **QueuedRequest**: Kuyrukta bekleyen bir test isteğini temsil eder.
6. **ProcessedRequest**: İşlenmiş bir test isteğini temsil eder.

## Veri Dönüşüm Fonksiyonları

ServerAgent modeli, ham veriyi model yapısına ve model yapısını ham veriye dönüştürmek için iki fonksiyon içerir:

1. **toServerAgent**: Ham veriyi ServerAgent modeline dönüştürür.
2. **fromServerAgent**: ServerAgent modelini ham veriye dönüştürür.

## İlişkili Model Detayları

### SystemResource

```typescript
export interface SystemResource {
  id: string;
  cpuUsage: number; // percentage (0-100)
  memoryUsage: number; // percentage (0-100)
  lastUpdated: Date;
  serverId: string;
}
```

### AgentStatusSummary

```typescript
export interface AgentStatusSummary {
  total: number;
  available: number;
  busy: number;
  offline: number;
  error: number;
  maintenance: number;
  limit: number;
}
```

### QueueStatusSummary

```typescript
export interface QueueStatusSummary {
  queued: number;
  scheduled: number;
  assigned: number;
  processing: number;
  total: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  estimatedWaitTime: number; // in milliseconds
}
```

### Agent (Özet)

Agent modeli, bir test ajanını temsil eder ve aşağıdaki ana bileşenleri içerir:
- Temel bilgiler (id, name, type, status)
- Tarayıcı bilgileri (browser, browserInfo)
- Sistem bilgileri (systemInfo)
- Ağ bilgileri (networkInfo)
- Performans metrikleri (performanceMetrics)
- Güvenlik bilgileri (securityInfo)
- Günlük bilgileri (loggingInfo)
- Kimlik doğrulama bilgileri (authInfo)
- Sağlık kontrolü (healthCheck)
- Yetenekler (capabilities, detailedCapabilities)
- Sunucu bilgileri (serverId, serverUrl)
- Aktivite bilgileri (created, lastActivity, currentRequest)
- Sürüm bilgileri (version, updateAvailable, lastUpdated)

### QueuedRequest (Özet)

QueuedRequest modeli, kuyrukta bekleyen bir test isteğini temsil eder ve aşağıdaki ana bileşenleri içerir:
- Temel bilgiler (id, testName, testRunId, testCaseId, testSuiteId, projectId)
- Durum ve kategori (status, priority, category, source)
- Ortam (browser, environment)
- Zamanlama (timing)
- Bağımlılıklar ve yeniden deneme (dependencies, retryConfig)
- Yük ve meta veriler (payload, tags, metadata)
- Kullanıcı bilgileri (createdBy, createdAt, updatedAt)
- Ajan atama (assignedAgentId)

### ProcessedRequest (Özet)

ProcessedRequest modeli, işlenmiş bir test isteğini temsil eder ve aşağıdaki ana bileşenleri içerir:
- Temel bilgiler (id, testName, testRunId, testCaseId, testSuiteId, projectId)
- Durum ve sonuç (status, result, error)
- Yürütme detayları (browser, agentId, priority, source)
- Zamanlama (startTime, endTime, duration, durationMs)
- Performans ve kaynaklar (performance, resources)
- Ortam (environment)
- Günlükler ve eserler (logs, screenshots, videos, artifacts)
- Yeniden deneme bilgileri (retryCount, previousAttempts, maxRetries)
- Meta veriler (tags, metadata, createdBy, createdAt, updatedAt)

## Mimari Diyagramı

```
+------------------+
|   ServerAgent    |
+------------------+
| id: string       |
+------------------+
         |
         | İlişkiler
         |
+--------+---------+--------+---------+--------+---------+
|                  |                  |                  |
v                  v                  v                  v
+------------------+ +----------------+ +----------------+
| SystemResource   | | AgentStatus    | | QueueStatus    |
+------------------+ +----------------+ +----------------+
| id: string       | | total: number  | | queued: number |
| cpuUsage: number | | available: num | | processing: num|
| memoryUsage: num | | busy: number   | | total: number  |
| lastUpdated: Date| | offline: number| | ...            |
| serverId: string | | ...            | |                |
+------------------+ +----------------+ +----------------+
         |
         | Koleksiyonlar
         |
+--------+---------+--------+---------+--------+---------+
|                  |                  |                  |
v                  v                  v                  v
+------------------+ +----------------+ +----------------+
| Agent[]          | | QueuedRequest[]| | ProcessedReq[] |
+------------------+ +----------------+ +----------------+
| id: string       | | id: string     | | id: string     |
| name?: string    | | testName: str  | | testName: str  |
| type: AgentType  | | status: ReqStat| | status: ProcSta|
| status: AgentStat| | priority: Prio | | result?: any   |
| browser: Browser | | browser: string| | browser: string|
| ...              | | ...            | | ...            |
+------------------+ +----------------+ +----------------+
```

## Kullanım Örneği

ServerAgent modeli, test otomasyon sisteminin sunucu durumunu izlemek ve yönetmek için kullanılır. Bu model, aşağıdaki bilgileri sağlar:

1. Sunucu kaynaklarının durumu (CPU ve bellek kullanımı)
2. Ajanların durumu (toplam, kullanılabilir, meşgul vb.)
3. Kuyruk durumu (kuyruktaki, işlenen, toplam vb.)
4. Aktif ajanların listesi
5. Kuyrukta bekleyen isteklerin listesi
6. İşlenmiş isteklerin listesi

Bu bilgiler, test otomasyon sisteminin genel durumunu izlemek ve yönetmek için kullanılır.
