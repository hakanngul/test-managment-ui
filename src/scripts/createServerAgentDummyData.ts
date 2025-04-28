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
      total: 0
    },
    activeAgents: agents.map(a => a.id),
    queuedRequests: [],
    processedRequests: [],
    version: '1.0.0'
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
  const priorities = ['high', 'medium', 'low'];
  const categories = ['regression', 'smoke', 'sanity', 'functional'];
  const browsers = ['chromium', 'firefox', 'webkit'];

  for (let i = 0; i < count; i++) {
    const queuedAt = new Date(now.getTime() - Math.floor(Math.random() * 3600000)); // 0-60 dakika önce
    const waitTimeMs = now.getTime() - queuedAt.getTime();
    const waitTimeMinutes = Math.floor(waitTimeMs / 60000);
    
    requests.push({
      id: uuidv4(),
      testName: `Test Case ${i + 1}`,
      description: `Run test case ${i + 1}`,
      status: 'queued',
      queuePosition: i + 1,
      estimatedStartTime: new Date(now.getTime() + (i + 1) * 60000), // i+1 dakika sonra
      queuedAt,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
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
  const statuses = ['completed', 'failed'];
  const results = ['success', 'error'];
  const browsers = ['chromium', 'firefox', 'webkit'];

  for (let i = 0; i < count; i++) {
    const startTime = new Date(now.getTime() - Math.floor(Math.random() * 86400000)); // 0-24 saat önce
    const processingTime = Math.floor(Math.random() * 300000) + 30000; // 30-330 saniye
    const endTime = new Date(startTime.getTime() + processingTime);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const result = status === 'completed' ? 'success' : 'error';
    
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
      assignedTo: `agent-${Math.floor(Math.random() * 3) + 1}`,
      agentId: `agent-${Math.floor(Math.random() * 3) + 1}`,
      browser: browsers[Math.floor(Math.random() * browsers.length)]
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
