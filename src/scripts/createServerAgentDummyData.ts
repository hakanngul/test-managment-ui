import { v4 as uuidv4 } from 'uuid';
import {
  connectToMongoDB,
  closeMongoDBConnection,
  COLLECTIONS
} from '../models/database';

import {
  AgentSchema,
  AgentStatus,
  AgentType,
  ServerAgentSchema,
  BrowserType
} from '../models/database/schemas';

/**
 * Dummy agent'lar oluşturur
 */
function createDummyAgents(count: number = 3): AgentSchema[] {
  const agents: AgentSchema[] = [];
  const statuses = [AgentStatus.AVAILABLE, AgentStatus.BUSY, AgentStatus.OFFLINE, AgentStatus.ERROR];
  const types = [AgentType.BROWSER, AgentType.API];
  const browsers = [BrowserType.CHROMIUM, BrowserType.FIREFOX, BrowserType.WEBKIT];

  for (let i = 0; i < count; i++) {
    const now = new Date();

    agents.push({
      id: uuidv4(),
      name: `Agent ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      networkInfo: {
        ipAddress: `192.168.1.${10 + i}`,
        port: 9222 + i,
        connected: true
      },
      capabilities: ['browser', 'screenshot', 'video'],
      serverId: 'server-001',
      created: now,
      lastActivity: now,
      version: '1.0.0'
    });
  }

  return agents;
}

/**
 * Dummy server agent oluşturur
 */
function createDummyServerAgent(agents: AgentSchema[]): ServerAgentSchema {
  const now = new Date();

  return {
    id: uuidv4(),
    serverId: 'server-001',
    lastUpdated: now,
    systemResources: {
      cpuUsage: Math.floor(Math.random() * 50), // 0-50%
      memoryUsage: Math.floor(Math.random() * 4000), // 0-4000 MB
      diskUsage: Math.floor(Math.random() * 80) + 10, // 10-90%
      networkUsage: Math.floor(Math.random() * 100) + 5, // 5-105 MB
      loadAverage: [Math.random() * 2, Math.random() * 1.5, Math.random() * 1],
      processes: Math.floor(Math.random() * 100) + 50, // 50-150 processes
      uptime: Math.floor(Math.random() * 1209600) + 86400, // 1-15 gün (saniye cinsinden)
      cpuDetails: {
        model: 'Intel Core i7-10700K',
        cores: 8,
        speed: 3800,
        temperature: Math.floor(Math.random() * 30) + 40, // 40-70 derece
        usage: {
          user: Math.floor(Math.random() * 40) + 10, // 10-50%
          system: Math.floor(Math.random() * 20) + 5, // 5-25%
          idle: Math.floor(Math.random() * 40) + 30 // 30-70%
        }
      },
      lastUpdated: now
    },
    agentStatus: {
      total: agents.length,
      available: agents.filter(a => a.status === AgentStatus.AVAILABLE).length,
      busy: agents.filter(a => a.status === AgentStatus.BUSY).length,
      offline: agents.filter(a => a.status === AgentStatus.OFFLINE).length,
      error: agents.filter(a => a.status === AgentStatus.ERROR).length,
      maintenance: agents.filter(a => a.status === AgentStatus.MAINTENANCE).length
    },
    queueStatus: {
      queued: 0,
      processing: 0,
      total: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      estimatedWaitTime: 0
    },
    activeAgents: agents.map(a => a.id),
    queuedRequests: [],
    processedRequests: [],

    // Performans metrikleri
    performanceMetrics: {
      cpuUsage: Math.floor(Math.random() * 50), // 0-50%
      memoryUsage: Math.floor(Math.random() * 4000), // 0-4000 MB
      diskUsage: Math.floor(Math.random() * 80) + 10, // 10-90%
      networkUsage: Math.floor(Math.random() * 100) + 5, // 5-105 MB
      activeProcesses: Math.floor(Math.random() * 100) + 50, // 50-150 processes
      uptime: Math.floor(Math.random() * 1209600) + 86400, // 1-15 gün (saniye cinsinden)
      loadAverage: [Math.random() * 2, Math.random() * 1.5, Math.random() * 1],
      testExecutionTime: {
        avg: Math.floor(Math.random() * 60000) + 10000, // 10-70 saniye
        min: Math.floor(Math.random() * 5000) + 1000, // 1-6 saniye
        max: Math.floor(Math.random() * 120000) + 60000, // 60-180 saniye
        p95: Math.floor(Math.random() * 90000) + 30000 // 30-120 saniye
      },
      concurrentTests: Math.floor(Math.random() * 5) + 1, // 1-6 test
      queueLength: Math.floor(Math.random() * 10) // 0-10 test
    },

    // Sağlık durumu
    healthStatus: {
      status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'healthy',
      lastCheck: now,
      issues: Math.random() > 0.7 ? [
        {
          component: 'Database',
          status: 'warning',
          message: 'Database connection is slow',
          timestamp: new Date(now.getTime() - 1800000) // 30 dakika önce
        },
        {
          component: 'API',
          status: 'healthy',
          message: 'API is working normally',
          timestamp: new Date(now.getTime() - 300000) // 5 dakika önce
        }
      ] : []
    },

    // Yapılandırma
    config: {
      maxAgents: 10,
      maxConcurrentTests: 5,
      maxQueueSize: 100,
      agentTimeout: 300, // 5 dakika
      testTimeout: 1800, // 30 dakika
      logLevel: 'info',
      autoScaling: Math.random() > 0.5,
      autoScalingConfig: {
        minAgents: 2,
        maxAgents: 10,
        scaleUpThreshold: 80, // %80
        scaleDownThreshold: 20, // %20
        cooldownPeriod: 300 // 5 dakika
      }
    },

    // Sürüm bilgileri
    version: '1.0.0',

    // Metadata
    tags: ['production', 'stable', 'main'],
    metadata: {
      environment: 'production',
      region: 'eu-west-1',
      deployedAt: new Date(now.getTime() - 604800000), // 1 hafta önce
      deployedBy: 'CI/CD Pipeline'
    }
  };
}

/**
 * Dummy system resources data oluşturur
 */
function createDummySystemResourcesData(count: number = 24): any[] {
  const data = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 60 * 60 * 1000); // Her saat için bir kayıt

    data.push({
      id: uuidv4(),
      timestamp,
      cpuUsage: Math.floor(Math.random() * 80) + 10, // 10-90%
      memoryUsage: Math.floor(Math.random() * 8) + 1, // 1-9 GB
      serverId: 'server-001'
    });
  }

  return data;
}

/**
 * Dummy agent status data oluşturur
 */
function createDummyAgentStatusData(count: number = 24): any[] {
  const data = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 60 * 60 * 1000); // Her saat için bir kayıt

    const total = 3;
    const available = Math.floor(Math.random() * (total + 1));
    const busy = Math.floor(Math.random() * (total - available + 1));
    const offline = Math.floor(Math.random() * (total - available - busy + 1));
    const error = Math.max(0, total - available - busy - offline - 1);
    const maintenance = Math.max(0, total - available - busy - offline - error);

    data.push({
      id: uuidv4(),
      timestamp,
      total,
      available,
      busy,
      offline,
      error,
      maintenance,
      serverId: 'server-001'
    });
  }

  return data;
}

/**
 * Dummy queue status data oluşturur
 */
function createDummyQueueStatusData(count: number = 24): any[] {
  const data = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 60 * 60 * 1000); // Her saat için bir kayıt

    const queued = Math.floor(Math.random() * 5);
    const processing = Math.floor(Math.random() * 3);
    const total = queued + processing;

    data.push({
      id: uuidv4(),
      timestamp,
      queued,
      processing,
      total,
      serverId: 'server-001'
    });
  }

  return data;
}

/**
 * Dummy active agents data oluşturur
 */
function createDummyActiveAgentsData(agents: AgentSchema[], count: number = 24): any[] {
  const data = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 60 * 60 * 1000); // Her saat için bir kayıt

    // Rastgele 1-3 agent seç
    const activeAgentCount = Math.floor(Math.random() * 3) + 1;
    const shuffledAgents = [...agents].sort(() => 0.5 - Math.random());
    const activeAgents = shuffledAgents.slice(0, activeAgentCount).map(a => a.id);

    data.push({
      id: uuidv4(),
      timestamp,
      activeAgents,
      count: activeAgents.length,
      serverId: 'server-001'
    });
  }

  return data;
}

/**
 * Dummy queued requests oluşturur
 */
function createDummyQueuedRequests(count: number = 5): any[] {
  const requests = [];
  const now = new Date();
  const categories = ['regression', 'smoke', 'sanity', 'functional'];
  const browsers = ['chromium', 'firefox', 'webkit'];

  // Öncelik sayılarını hesapla
  const highPriorityCount = Math.floor(count * 0.2); // %20 high priority
  const mediumPriorityCount = Math.floor(count * 0.5); // %50 medium priority
  const lowPriorityCount = count - highPriorityCount - mediumPriorityCount; // Kalan low priority
  const priorityDistribution = [
    ...Array(highPriorityCount).fill('high'),
    ...Array(mediumPriorityCount).fill('medium'),
    ...Array(lowPriorityCount).fill('low')
  ].sort(() => Math.random() - 0.5); // Karıştır

  for (let i = 0; i < count; i++) {
    const queuedAt = new Date(now.getTime() - Math.floor(Math.random() * 3600000)); // 0-60 dakika önce
    const waitTimeMs = now.getTime() - queuedAt.getTime();
    const waitTimeMinutes = Math.floor(waitTimeMs / 60000);
    const priority = priorityDistribution[i];

    // Önceliğe göre tahmini başlama zamanını ayarla
    let estimatedDelay = 60000; // Varsayılan 1 dakika
    if (priority === 'high') {
      estimatedDelay = 30000; // Yüksek öncelik: 30 saniye
    } else if (priority === 'medium') {
      estimatedDelay = 120000; // Orta öncelik: 2 dakika
    } else {
      estimatedDelay = 300000; // Düşük öncelik: 5 dakika
    }

    requests.push({
      id: uuidv4(),
      testName: `Test Case ${i + 1}`,
      description: `Run test case ${i + 1}`,
      status: 'queued',
      queuePosition: i + 1,
      estimatedStartTime: new Date(now.getTime() + estimatedDelay + (i * 30000)), // Öncelik + sıra bazlı gecikme
      queuedAt,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      priority,
      category: categories[Math.floor(Math.random() * categories.length)],
      waitTime: `${waitTimeMinutes} dakika`,
      timing: {
        queuedAt,
        waitTime: `${waitTimeMinutes} dakika`,
        waitTimeMs
      }
    });
  }

  return requests;
}

/**
 * Dummy processed requests oluşturur
 */
function createDummyProcessedRequests(count: number = 10): any[] {
  const requests = [];
  const now = new Date();
  const browsers = ['chromium', 'firefox', 'webkit'];
  const categories = ['regression', 'smoke', 'sanity', 'functional'];

  // Başarı/başarısız oranını belirle
  const successCount = Math.floor(count * 0.7); // %70 başarılı
  const failureCount = count - successCount; // %30 başarısız

  // Sonuç dağılımını oluştur ve karıştır
  const resultDistribution = [
    ...Array(successCount).fill({ status: 'completed', result: 'success' }),
    ...Array(failureCount).fill({ status: 'failed', result: 'error' })
  ].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const startTime = new Date(now.getTime() - Math.floor(Math.random() * 86400000)); // 0-24 saat önce
    const processingTime = Math.floor(Math.random() * 300000) + 30000; // 30-330 saniye
    const endTime = new Date(startTime.getTime() + processingTime);
    const { status, result } = resultDistribution[i];
    const agentId = `agent-${Math.floor(Math.random() * 3) + 1}`;

    requests.push({
      id: uuidv4(),
      testName: `Test Case ${i + 1}`,
      description: `Run test case ${i + 1}`,
      status,
      result,
      startTime,
      endTime,
      processingTime,
      duration: `${Math.floor(processingTime / 1000)} saniye`,
      assignedTo: agentId,
      agentId,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      logs: result === 'error' ? 'Error: Test assertion failed at line 42' : 'Test completed successfully',
      screenshots: result === 'error' ? ['error-screenshot.png'] : []
    });
  }

  return requests;
}

/**
 * Dummy detailed test results oluşturur
 */
function createDummyDetailedTestResults(count: number = 20): any[] {
  const results = [];
  const now = new Date();
  const statuses = ['passed', 'failed', 'skipped'];
  const browsers = ['chromium', 'firefox', 'webkit'];
  const environments = ['development', 'testing', 'staging', 'production'];

  for (let i = 0; i < count; i++) {
    const startTime = new Date(now.getTime() - Math.floor(Math.random() * 604800000)); // 0-7 gün önce
    const duration = Math.floor(Math.random() * 300000) + 10000; // 10-310 saniye
    const endTime = new Date(startTime.getTime() + duration);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    results.push({
      id: uuidv4(),
      testId: `test-${i + 1}`,
      testName: `Test Case ${i + 1}`,
      status,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      environment: environments[Math.floor(Math.random() * environments.length)],
      startTime,
      endTime,
      duration,
      errorMessage: status === 'failed' ? 'Test assertion failed' : null,
      errorStack: status === 'failed' ? 'Error stack trace...' : null,
      screenshots: status === 'failed' ? ['screenshot1.png', 'screenshot2.png'] : [],
      logs: 'Test execution logs...',
      metadata: {
        testRunId: `run-${Math.floor(i / 5) + 1}`,
        testSuiteId: `suite-${Math.floor(i / 10) + 1}`,
        userId: `user-${Math.floor(Math.random() * 5) + 1}`
      }
    });
  }

  return results;
}

/**
 * MongoDB veritabanına dummy veriler ekler
 */
async function createServerAgentDummyData() {
  try {
    // MongoDB'ye bağlan
    const db = await connectToMongoDB();
    console.log('MongoDB bağlantısı başarılı');

    // Dummy veriler oluştur
    const agents = createDummyAgents(3);
    const serverAgent = createDummyServerAgent(agents);
    const systemResourcesData = createDummySystemResourcesData(24);
    const agentStatusData = createDummyAgentStatusData(24);
    const queueStatusData = createDummyQueueStatusData(24);
    const activeAgentsData = createDummyActiveAgentsData(agents, 24);
    const queuedRequests = createDummyQueuedRequests(5);
    const processedRequests = createDummyProcessedRequests(10);
    const detailedTestResults = createDummyDetailedTestResults(20);

    // Kuyruk durumu verilerini güncelle
    const highPriorityCount = queuedRequests.filter(req => req.priority === 'high').length;
    const mediumPriorityCount = queuedRequests.filter(req => req.priority === 'medium').length;
    const lowPriorityCount = queuedRequests.filter(req => req.priority === 'low').length;

    // Tahmini bekleme süresini hesapla (ms cinsinden)
    const estimatedWaitTime = queuedRequests.length > 0 ? 60000 * queuedRequests.length : 0;

    // ServerAgent'ın queueStatus alanını güncelle
    serverAgent.queueStatus = {
      queued: queuedRequests.length,
      processing: Math.min(serverAgent.agentStatus.busy, 3), // Meşgul agent sayısı kadar işleniyor
      total: queuedRequests.length + Math.min(serverAgent.agentStatus.busy, 3),
      highPriority: highPriorityCount,
      mediumPriority: mediumPriorityCount,
      lowPriority: lowPriorityCount,
      estimatedWaitTime: estimatedWaitTime
    };

    // ServerAgent'ın queuedRequests ve processedRequests alanlarını güncelle
    serverAgent.queuedRequests = queuedRequests.map(req => req.id);
    serverAgent.processedRequests = processedRequests.map(req => req.id);

    // Koleksiyonları temizle
    await db.collection(COLLECTIONS.AGENTS).deleteMany({});
    await db.collection(COLLECTIONS.SERVER_AGENT).deleteMany({});
    await db.collection(COLLECTIONS.SYSTEM_RESOURCES_DATA).deleteMany({});
    await db.collection(COLLECTIONS.AGENT_STATUS_DATA).deleteMany({});
    await db.collection(COLLECTIONS.QUEUE_STATUS_DATA).deleteMany({});
    await db.collection(COLLECTIONS.ACTIVE_AGENTS_DATA).deleteMany({});
    await db.collection(COLLECTIONS.QUEUED_REQUESTS_DATA).deleteMany({});
    await db.collection(COLLECTIONS.PROCESSED_REQUESTS_DATA).deleteMany({});
    await db.collection('detailedTestResults').deleteMany({});

    // Verileri ekle
    await db.collection(COLLECTIONS.AGENTS).insertMany(agents);
    await db.collection(COLLECTIONS.SERVER_AGENT).insertOne(serverAgent);
    await db.collection(COLLECTIONS.SYSTEM_RESOURCES_DATA).insertMany(systemResourcesData);
    await db.collection(COLLECTIONS.AGENT_STATUS_DATA).insertMany(agentStatusData);
    await db.collection(COLLECTIONS.QUEUE_STATUS_DATA).insertMany(queueStatusData);
    await db.collection(COLLECTIONS.ACTIVE_AGENTS_DATA).insertMany(activeAgentsData);
    await db.collection(COLLECTIONS.QUEUED_REQUESTS_DATA).insertMany(queuedRequests);
    await db.collection(COLLECTIONS.PROCESSED_REQUESTS_DATA).insertMany(processedRequests);
    await db.collection('detailedTestResults').insertMany(detailedTestResults);

    console.log('Dummy veriler başarıyla eklendi');
    console.log(`${agents.length} agent eklendi`);
    console.log('1 server agent eklendi');
    console.log(`${systemResourcesData.length} system resources data eklendi`);
    console.log(`${agentStatusData.length} agent status data eklendi`);
    console.log(`${queueStatusData.length} queue status data eklendi`);
    console.log(`${activeAgentsData.length} active agents data eklendi`);
    console.log(`${queuedRequests.length} queued request eklendi`);
    console.log(`${processedRequests.length} processed request eklendi`);
    console.log(`${detailedTestResults.length} detailed test result eklendi`);

    // MongoDB bağlantısını kapat
    await closeMongoDBConnection();
    console.log('MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('Hata:', error);
  }
}

// Script'i çalıştır
createServerAgentDummyData();
