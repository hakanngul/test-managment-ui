# Agent Mimarisi

Bu doküman, test otomasyon yönetim aracının agent mimarisini detaylandırmaktadır. Bu mimari, Express.js ile farklı bir portta çalışacak backend servisi için tasarlanmıştır.

## 1. Veri Modelleri

### Agent Modeli
```typescript
interface Agent {
  id: string;
  name: string;
  type: AgentType; // BROWSER, API, MOBILE
  status: AgentStatus; // AVAILABLE, BUSY, OFFLINE, ERROR, MAINTENANCE
  browser: BrowserType; // CHROME, FIREFOX, SAFARI, EDGE
  networkInfo: {
    ipAddress: string;
    // Diğer ağ bilgileri eklenebilir
  };
  capabilities: string[]; // ['chrome', 'headless', 'screenshot', 'video'] gibi
  serverId: string;
  created: Date;
  lastActivity: Date;
  currentRequest: string | null;
  version: string;
  systemInfo: {
    os: string; // WINDOWS, LINUX, MACOS, IOS, ANDROID
    osVersion: string;
    cpuModel: string;
    cpuCores: number;
    totalMemory: number; // MB cinsinden
    totalDisk: number; // MB cinsinden
    hostname: string;
    username: string;
  };
  performanceMetrics: {
    cpuUsage: number; // Yüzde cinsinden
    memoryUsage: number; // Yüzde cinsinden
    diskUsage: number; // Yüzde cinsinden
    networkUsage: number; // MB cinsinden
    uptime: number; // Saniye cinsinden
    lastUpdated: Date;
  };
  healthCheck: {
    status: AgentHealthStatus; // HEALTHY, WARNING, CRITICAL, UNKNOWN, MAINTENANCE
    lastCheck: Date;
    message: string;
  };
}
```

### QueuedRequest Modeli
```typescript
interface QueuedRequest {
  id: string;
  testName: string;
  testCaseId: string;
  testSuiteId: string;
  projectId: string;
  status: RequestStatus; // QUEUED, SCHEDULED, ASSIGNED, PROCESSING
  priority: RequestPriority; // HIGH, MEDIUM, LOW, CRITICAL
  category: RequestCategory; // UI_TEST, API_TEST, PERFORMANCE_TEST, SECURITY_TEST, ...
  source: RequestSource; // MANUAL, SCHEDULED, CI_CD, API
  browser: BrowserType;
  timing: {
    queuedAt: Date;
    scheduledAt?: Date;
    assignedAt?: Date;
    startedAt?: Date;
    estimatedStartTime: Date;
    waitTime: string; // İnsan tarafından okunabilir format (örn: "5m 30s")
    waitTimeMs: number; // Milisaniye cinsinden
  };
  assignedAgentId?: string;
  createdBy: string;
  createdAt: Date;
  description: string;
  tags: string[];
}
```

### ProcessedRequest Modeli
```typescript
interface ProcessedRequest {
  id: string;
  testName: string;
  testCaseId: string;
  testSuiteId: string;
  projectId: string;
  status: ProcessedRequestStatus; // SUCCESS, FAILED, CANCELLED, TIMEOUT, ERROR, INTERRUPTED, PARTIAL, PARTIAL_SUCCESS
  error?: {
    type: ProcessedRequestErrorType; // BROWSER, NETWORK, SCRIPT, ASSERTION, TIMEOUT, ...
    message: string;
    timestamp: Date;
    stackTrace?: string;
  };
  browser: BrowserType;
  agentId: string;
  priority: ProcessedRequestPriority;
  source: ProcessedRequestSource;
  startTime: Date;
  endTime: Date;
  duration: string; // İnsan tarafından okunabilir format (örn: "1m 30s")
  durationMs: number; // Milisaniye cinsinden
  performance: {
    setupTime: number;
    executionTime: number;
    teardownTime: number;
    totalTime: number;
    cpuUsage: number;
    memoryUsage: number;
    networkUsage: number;
  };
  description: string;
  tags: string[];
  result: {
    passed: boolean;
    failedAssertions: number;
    totalAssertions: number;
    screenshots: string[];
    logs: string[];
  };
}
```

### ServerAgent Modeli
```typescript
interface ServerAgent {
  id: string;
  name: string;
  status: string; // online, offline, maintenance
  version: {
    current: string;
    latest: string;
    updateAvailable: boolean;
    lastUpdated: string;
    releaseNotes: string;
  };
  systemResources: {
    id: string;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkUsage: number;
    loadAverage: number[];
    processes: number;
    uptime: number;
    cpuDetails: {
      model: string;
      cores: number;
      speed: number;
    };
    lastUpdated: Date;
    serverId: string;
  };
  agentStatus: {
    total: number;
    available: number;
    busy: number;
    offline: number;
    error: number;
    maintenance: number;
    limit: number;
  };
  queueStatus: {
    queued: number;
    scheduled: number;
    assigned: number;
    processing: number;
    total: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    estimatedWaitTime: number;
  };
  performanceMetrics: {
    requestsPerMinute: number;
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
    resourceUtilization: {
      cpu: number;
      memory: number;
      disk: number;
      network: number;
    };
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkUsage: number;
    activeProcesses: number;
    uptime: number;
    queueLength: number;
    concurrentTests: {
      current: number;
      max: number;
    };
    history: Array<{
      timestamp: string;
      requestsPerMinute: number;
      averageResponseTime: number;
      successRate: number;
    }>;
  };
  healthStatus: {
    status: string;
    lastCheck: string;
    uptime: number;
    message: string;
    checks: Array<{
      name: string;
      status: string;
      message: string;
      timestamp: string;
    }>;
  };
  activeAgents: string[]; // Agent ID'leri
  queuedRequests: string[]; // QueuedRequest ID'leri
  processedRequests: string[]; // ProcessedRequest ID'leri
  tags: string[];
  metadata: {
    location: string;
    environment: string;
    responsible: string;
    contact: string;
  };
  lastUpdated: string;
  createdAt: string;
}
```

## 2. Express.js API Yapısı

Express.js ile oluşturacağımız API için aşağıdaki endpoint'leri tasarlayabiliriz:

### Server Agent Endpoints
```
GET /api/server-agent - Server agent bilgilerini getirir
GET /api/server-agent/system-resources - Sistem kaynaklarını getirir
GET /api/server-agent/performance-metrics - Performans metriklerini getirir
GET /api/server-agent/health-status - Sağlık durumunu getirir
```

### Agent Endpoints
```
GET /api/agents - Tüm agent'ları listeler
GET /api/agents/:id - Belirli bir agent'ın detaylarını getirir
POST /api/agents - Yeni bir agent oluşturur
PUT /api/agents/:id - Bir agent'ı günceller
DELETE /api/agents/:id - Bir agent'ı siler
GET /api/agents/:id/status - Bir agent'ın durumunu getirir
PUT /api/agents/:id/status - Bir agent'ın durumunu günceller
```

### Queue Endpoints
```
GET /api/queue - Kuyrukta bekleyen tüm istekleri listeler
GET /api/queue/:id - Belirli bir kuyruktaki isteğin detaylarını getirir
POST /api/queue - Yeni bir istek ekler
PUT /api/queue/:id - Bir isteği günceller
DELETE /api/queue/:id - Bir isteği siler
```

### Processed Requests Endpoints
```
GET /api/processed-requests - İşlenmiş tüm istekleri listeler
GET /api/processed-requests/:id - Belirli bir işlenmiş isteğin detaylarını getirir
GET /api/processed-requests/stats - İşlenmiş isteklerin istatistiklerini getirir
```

## 3. MongoDB Şeması

MongoDB için aşağıdaki koleksiyonları oluşturabiliriz:

### Agents Koleksiyonu
```javascript
const AgentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['BROWSER', 'API', 'MOBILE'], required: true },
  status: { type: String, enum: ['AVAILABLE', 'BUSY', 'OFFLINE', 'ERROR', 'MAINTENANCE'], required: true },
  browser: { type: String, enum: ['CHROME', 'FIREFOX', 'SAFARI', 'EDGE'] },
  networkInfo: {
    ipAddress: { type: String }
  },
  capabilities: [{ type: String }],
  serverId: { type: String, required: true },
  created: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  currentRequest: { type: String, default: null },
  version: { type: String },
  systemInfo: {
    os: { type: String },
    osVersion: { type: String },
    cpuModel: { type: String },
    cpuCores: { type: Number },
    totalMemory: { type: Number },
    totalDisk: { type: Number },
    hostname: { type: String },
    username: { type: String }
  },
  performanceMetrics: {
    cpuUsage: { type: Number },
    memoryUsage: { type: Number },
    diskUsage: { type: Number },
    networkUsage: { type: Number },
    uptime: { type: Number },
    lastUpdated: { type: Date, default: Date.now }
  },
  healthCheck: {
    status: { type: String, enum: ['HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN', 'MAINTENANCE'] },
    lastCheck: { type: Date, default: Date.now },
    message: { type: String }
  }
});
```

### QueuedRequests Koleksiyonu
```javascript
const QueuedRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  testName: { type: String, required: true },
  testCaseId: { type: String, required: true },
  testSuiteId: { type: String, required: true },
  projectId: { type: String, required: true },
  status: { type: String, enum: ['QUEUED', 'SCHEDULED', 'ASSIGNED', 'PROCESSING'], required: true },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW', 'CRITICAL'], required: true },
  category: { type: String, required: true },
  source: { type: String, enum: ['MANUAL', 'SCHEDULED', 'CI_CD', 'API'], required: true },
  browser: { type: String },
  timing: {
    queuedAt: { type: Date, required: true },
    scheduledAt: { type: Date },
    assignedAt: { type: Date },
    startedAt: { type: Date },
    estimatedStartTime: { type: Date, required: true },
    waitTime: { type: String },
    waitTimeMs: { type: Number }
  },
  assignedAgentId: { type: String },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  description: { type: String },
  tags: [{ type: String }]
});
```

### ProcessedRequests Koleksiyonu
```javascript
const ProcessedRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  testName: { type: String, required: true },
  testCaseId: { type: String, required: true },
  testSuiteId: { type: String, required: true },
  projectId: { type: String, required: true },
  status: { type: String, enum: ['SUCCESS', 'FAILED', 'CANCELLED', 'TIMEOUT', 'ERROR', 'INTERRUPTED', 'PARTIAL', 'PARTIAL_SUCCESS'], required: true },
  error: {
    type: { type: String },
    message: { type: String },
    timestamp: { type: Date },
    stackTrace: { type: String }
  },
  browser: { type: String },
  agentId: { type: String, required: true },
  priority: { type: String, required: true },
  source: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: String },
  durationMs: { type: Number },
  performance: {
    setupTime: { type: Number },
    executionTime: { type: Number },
    teardownTime: { type: Number },
    totalTime: { type: Number },
    cpuUsage: { type: Number },
    memoryUsage: { type: Number },
    networkUsage: { type: Number }
  },
  description: { type: String },
  tags: [{ type: String }],
  result: {
    passed: { type: Boolean },
    failedAssertions: { type: Number },
    totalAssertions: { type: Number },
    screenshots: [{ type: String }],
    logs: [{ type: String }]
  }
});
```

### ServerAgent Koleksiyonu
```javascript
const ServerAgentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  version: {
    current: { type: String },
    latest: { type: String },
    updateAvailable: { type: Boolean },
    lastUpdated: { type: String },
    releaseNotes: { type: String }
  },
  systemResources: {
    id: { type: String },
    cpuUsage: { type: Number },
    memoryUsage: { type: Number },
    diskUsage: { type: Number },
    networkUsage: { type: Number },
    loadAverage: [{ type: Number }],
    processes: { type: Number },
    uptime: { type: Number },
    cpuDetails: {
      model: { type: String },
      cores: { type: Number },
      speed: { type: Number }
    },
    lastUpdated: { type: Date },
    serverId: { type: String }
  },
  agentStatus: {
    total: { type: Number },
    available: { type: Number },
    busy: { type: Number },
    offline: { type: Number },
    error: { type: Number },
    maintenance: { type: Number },
    limit: { type: Number }
  },
  queueStatus: {
    queued: { type: Number },
    scheduled: { type: Number },
    assigned: { type: Number },
    processing: { type: Number },
    total: { type: Number },
    highPriority: { type: Number },
    mediumPriority: { type: Number },
    lowPriority: { type: Number },
    estimatedWaitTime: { type: Number }
  },
  performanceMetrics: {
    requestsPerMinute: { type: Number },
    averageResponseTime: { type: Number },
    successRate: { type: Number },
    errorRate: { type: Number },
    resourceUtilization: {
      cpu: { type: Number },
      memory: { type: Number },
      disk: { type: Number },
      network: { type: Number }
    },
    cpuUsage: { type: Number },
    memoryUsage: { type: Number },
    diskUsage: { type: Number },
    networkUsage: { type: Number },
    activeProcesses: { type: Number },
    uptime: { type: Number },
    queueLength: { type: Number },
    concurrentTests: {
      current: { type: Number },
      max: { type: Number }
    },
    history: [{
      timestamp: { type: String },
      requestsPerMinute: { type: Number },
      averageResponseTime: { type: Number },
      successRate: { type: Number }
    }]
  },
  healthStatus: {
    status: { type: String },
    lastCheck: { type: String },
    uptime: { type: Number },
    message: { type: String },
    checks: [{
      name: { type: String },
      status: { type: String },
      message: { type: String },
      timestamp: { type: String }
    }]
  },
  activeAgents: [{ type: String }],
  queuedRequests: [{ type: String }],
  processedRequests: [{ type: String }],
  tags: [{ type: String }],
  metadata: {
    location: { type: String },
    environment: { type: String },
    responsible: { type: String },
    contact: { type: String }
  },
  lastUpdated: { type: String, required: true },
  createdAt: { type: String, required: true }
});
```

## 4. Express.js Proje Yapısı

```
/server
  /src
    /config
      db.js                  # MongoDB bağlantı yapılandırması
      server.js              # Express sunucu yapılandırması
    /models
      Agent.js               # Agent modeli
      QueuedRequest.js       # QueuedRequest modeli
      ProcessedRequest.js    # ProcessedRequest modeli
      ServerAgent.js         # ServerAgent modeli
    /controllers
      agentController.js     # Agent endpoint'leri için controller
      queueController.js     # Queue endpoint'leri için controller
      processedController.js # ProcessedRequest endpoint'leri için controller
      serverController.js    # ServerAgent endpoint'leri için controller
    /routes
      agentRoutes.js         # Agent route'ları
      queueRoutes.js         # Queue route'ları
      processedRoutes.js     # ProcessedRequest route'ları
      serverRoutes.js        # ServerAgent route'ları
    /middleware
      auth.js                # Kimlik doğrulama middleware'i
      error.js               # Hata işleme middleware'i
      logger.js              # Loglama middleware'i
    /utils
      helpers.js             # Yardımcı fonksiyonlar
      validators.js          # Veri doğrulama fonksiyonları
    /services
      agentService.js        # Agent ile ilgili iş mantığı
      queueService.js        # Queue ile ilgili iş mantığı
      processedService.js    # ProcessedRequest ile ilgili iş mantığı
      serverService.js       # ServerAgent ile ilgili iş mantığı
    app.js                   # Ana uygulama dosyası
  package.json
  .env                       # Ortam değişkenleri
  README.md
```

## 5. Örnek Controller Yapısı

### agentController.js
```javascript
const Agent = require('../models/Agent');
const agentService = require('../services/agentService');

// Tüm agent'ları getir
exports.getAllAgents = async (req, res, next) => {
  try {
    const agents = await agentService.getAllAgents();
    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (error) {
    next(error);
  }
};

// Belirli bir agent'ı getir
exports.getAgentById = async (req, res, next) => {
  try {
    const agent = await agentService.getAgentById(req.params.id);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent with id ${req.params.id} not found`
      });
    }
    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
};

// Yeni bir agent oluştur
exports.createAgent = async (req, res, next) => {
  try {
    const agent = await agentService.createAgent(req.body);
    res.status(201).json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
};

// Bir agent'ı güncelle
exports.updateAgent = async (req, res, next) => {
  try {
    const agent = await agentService.updateAgent(req.params.id, req.body);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent with id ${req.params.id} not found`
      });
    }
    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
};

// Bir agent'ı sil
exports.deleteAgent = async (req, res, next) => {
  try {
    const agent = await agentService.deleteAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent with id ${req.params.id} not found`
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Bir agent'ın durumunu getir
exports.getAgentStatus = async (req, res, next) => {
  try {
    const status = await agentService.getAgentStatus(req.params.id);
    if (!status) {
      return res.status(404).json({
        success: false,
        message: `Agent with id ${req.params.id} not found`
      });
    }
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
};

// Bir agent'ın durumunu güncelle
exports.updateAgentStatus = async (req, res, next) => {
  try {
    const status = await agentService.updateAgentStatus(req.params.id, req.body.status);
    if (!status) {
      return res.status(404).json({
        success: false,
        message: `Agent with id ${req.params.id} not found`
      });
    }
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
};
```

## 6. Örnek Service Yapısı

### agentService.js
```javascript
const Agent = require('../models/Agent');

// Tüm agent'ları getir
exports.getAllAgents = async () => {
  return await Agent.find();
};

// Belirli bir agent'ı getir
exports.getAgentById = async (id) => {
  return await Agent.findOne({ id });
};

// Yeni bir agent oluştur
exports.createAgent = async (agentData) => {
  return await Agent.create(agentData);
};

// Bir agent'ı güncelle
exports.updateAgent = async (id, agentData) => {
  return await Agent.findOneAndUpdate({ id }, agentData, {
    new: true,
    runValidators: true
  });
};

// Bir agent'ı sil
exports.deleteAgent = async (id) => {
  return await Agent.findOneAndDelete({ id });
};

// Bir agent'ın durumunu getir
exports.getAgentStatus = async (id) => {
  const agent = await Agent.findOne({ id });
  if (!agent) {
    return null;
  }
  return {
    status: agent.status,
    healthCheck: agent.healthCheck
  };
};

// Bir agent'ın durumunu güncelle
exports.updateAgentStatus = async (id, status) => {
  const agent = await Agent.findOne({ id });
  if (!agent) {
    return null;
  }
  
  agent.status = status;
  agent.lastActivity = new Date();
  
  await agent.save();
  
  return {
    status: agent.status,
    lastActivity: agent.lastActivity
  };
};
```

## 7. Örnek Route Yapısı

### agentRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.route('/')
  .get(agentController.getAllAgents)
  .post(agentController.createAgent);

router.route('/:id')
  .get(agentController.getAgentById)
  .put(agentController.updateAgent)
  .delete(agentController.deleteAgent);

router.route('/:id/status')
  .get(agentController.getAgentStatus)
  .put(agentController.updateAgentStatus);

module.exports = router;
```

## 8. Ana Uygulama Dosyası

### app.js
```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');

// Ortam değişkenlerini yükle
dotenv.config();

// Veritabanına bağlan
connectDB();

// Route'ları içe aktar
const agentRoutes = require('./routes/agentRoutes');
const queueRoutes = require('./routes/queueRoutes');
const processedRoutes = require('./routes/processedRoutes');
const serverRoutes = require('./routes/serverRoutes');

const app = express();

// Body parser
app.use(express.json());

// CORS
app.use(cors());

// Logger middleware
app.use(logger);

// Route'ları tanımla
app.use('/api/agents', agentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/processed-requests', processedRoutes);
app.use('/api/server-agent', serverRoutes);

// Hata işleme middleware'i
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Beklenmeyen hataları yakala
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Sunucuyu kapat ve process'i sonlandır
  server.close(() => process.exit(1));
});
```
