import { v4 as uuidv4 } from 'uuid';
import { 
  connectToMongoDB, 
  closeMongoDBConnection, 
  COLLECTIONS 
} from '../models/database';

import {
  UserSchema,
  UserRole,
  UserStatus,
  ProjectSchema,
  ProjectStatus,
  ProjectPriority,
  ProjectCategory,
  ProjectMemberRole,
  ProjectEnvironment,
  TestCaseSchema,
  TestCaseStatus,
  TestCasePriority,
  BrowserType,
  TestStepSchema,
  TestStepActionType,
  TestStepTargetType,
  TestSuiteSchema,
  TestSuiteStatus,
  TestSuitePriority,
  TestSuiteExecutionMode,
  TestRunSchema,
  TestRunStatus,
  TestRunPriority,
  AgentSchema,
  AgentStatus,
  AgentType,
  ServerAgentSchema
} from '../models/database/schemas';

/**
 * Varsayılan admin kullanıcısı oluşturur
 */
function createDefaultAdminUser(): UserSchema {
  const now = new Date();
  return {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    password: 'admin', // Gerçek uygulamada hash'lenmiş olmalı
    createdAt: now,
    updatedAt: now,
    emailVerified: true
  };
}

/**
 * Varsayılan proje oluşturur
 */
function createDefaultProject(adminUserId: string): ProjectSchema {
  const now = new Date();
  return {
    id: uuidv4(),
    name: 'Demo Project',
    description: 'A demo project for testing purposes',
    status: ProjectStatus.ACTIVE,
    priority: ProjectPriority.MEDIUM,
    category: ProjectCategory.WEB,
    tags: ['demo', 'web', 'testing'],
    members: [
      {
        userId: adminUserId,
        role: ProjectMemberRole.OWNER,
        joinedAt: now
      }
    ],
    config: {
      defaultEnvironment: ProjectEnvironment.TESTING,
      supportedEnvironments: [
        ProjectEnvironment.DEVELOPMENT,
        ProjectEnvironment.TESTING,
        ProjectEnvironment.STAGING
      ],
      defaultBrowsers: [BrowserType.CHROMIUM],
      defaultHeadless: true,
      defaultRetryCount: 1,
      defaultTimeout: 30000,
      screenshotOnFailure: true,
      videoRecording: false,
      parallelExecution: false,
      maxParallelTests: 1
    },
    createdBy: adminUserId,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Varsayılan test case oluşturur
 */
function createDefaultTestCase(projectId: string, adminUserId: string): TestCaseSchema {
  const now = new Date();
  return {
    id: uuidv4(),
    title: 'Login Test',
    description: 'Test the login functionality',
    status: TestCaseStatus.ACTIVE,
    priority: TestCasePriority.HIGH,
    steps: [
      {
        id: uuidv4(),
        order: 1,
        action: TestStepActionType.NAVIGATE,
        target: 'https://example.com/login',
        targetType: TestStepTargetType.NONE,
        description: 'Navigate to login page'
      },
      {
        id: uuidv4(),
        order: 2,
        action: TestStepActionType.TYPE,
        target: 'input[name="username"]',
        targetType: TestStepTargetType.CSS_SELECTOR,
        value: 'testuser',
        description: 'Enter username'
      },
      {
        id: uuidv4(),
        order: 3,
        action: TestStepActionType.TYPE,
        target: 'input[name="password"]',
        targetType: TestStepTargetType.CSS_SELECTOR,
        value: 'password',
        description: 'Enter password'
      },
      {
        id: uuidv4(),
        order: 4,
        action: TestStepActionType.CLICK,
        target: 'button[type="submit"]',
        targetType: TestStepTargetType.CSS_SELECTOR,
        description: 'Click login button'
      },
      {
        id: uuidv4(),
        order: 5,
        action: TestStepActionType.ASSERT_TEXT,
        target: '.welcome-message',
        targetType: TestStepTargetType.CSS_SELECTOR,
        value: 'Welcome',
        description: 'Verify welcome message'
      }
    ],
    tags: ['login', 'authentication', 'critical'],
    projectId: projectId,
    browsers: [BrowserType.CHROMIUM],
    headless: true,
    browserPool: false,
    createdBy: adminUserId,
    createdAt: now,
    updatedAt: now,
    executionStats: {
      totalRuns: 0,
      passCount: 0,
      failCount: 0,
      passRate: 0
    }
  };
}

/**
 * Varsayılan test suite oluşturur
 */
function createDefaultTestSuite(projectId: string, testCaseIds: string[], adminUserId: string): TestSuiteSchema {
  const now = new Date();
  return {
    id: uuidv4(),
    name: 'Authentication Test Suite',
    description: 'Test suite for authentication functionality',
    status: TestSuiteStatus.ACTIVE,
    priority: TestSuitePriority.HIGH,
    progress: 0,
    testCases: testCaseIds,
    projectId: projectId,
    tags: ['authentication', 'critical'],
    executionMode: TestSuiteExecutionMode.SEQUENTIAL,
    maxParallelExecutions: 1,
    maxRetries: 1,
    browsers: [BrowserType.CHROMIUM],
    headless: true,
    browserPool: false,
    createdBy: adminUserId,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Varsayılan test run oluşturur
 */
function createDefaultTestRun(testSuiteId: string, projectId: string, adminUserId: string): TestRunSchema {
  const now = new Date();
  return {
    id: uuidv4(),
    name: 'Authentication Test Run',
    description: 'Test run for authentication functionality',
    status: TestRunStatus.PENDING,
    priority: TestRunPriority.HIGH,
    projectId: projectId,
    testSuiteId: testSuiteId,
    environment: 'testing',
    tags: ['authentication', 'critical'],
    browsers: [BrowserType.CHROMIUM],
    headless: true,
    browserPool: false,
    createdBy: adminUserId,
    createdAt: now,
    updatedAt: now,
    results: []
  };
}

/**
 * Varsayılan server agent oluşturur
 */
function createDefaultServerAgent(): ServerAgentSchema {
  const now = new Date();
  const agentId = uuidv4();
  
  return {
    id: uuidv4(),
    serverId: 'server-001',
    lastUpdated: now,
    systemResources: {
      cpuUsage: 0,
      memoryUsage: 0,
      lastUpdated: now
    },
    agentStatus: {
      total: 1,
      available: 1,
      busy: 0,
      offline: 0,
      error: 0,
      maintenance: 0
    },
    queueStatus: {
      queued: 0,
      processing: 0,
      total: 0
    },
    activeAgents: [agentId],
    queuedRequests: [],
    processedRequests: [],
    version: '1.0.0'
  };
}

/**
 * Varsayılan agent oluşturur
 */
function createDefaultAgent(serverId: string): AgentSchema {
  const now = new Date();
  return {
    id: uuidv4(),
    name: 'Agent 1',
    type: AgentType.BROWSER,
    status: AgentStatus.AVAILABLE,
    browser: BrowserType.CHROMIUM,
    networkInfo: {
      ipAddress: '127.0.0.1',
      port: 9222,
      connected: true
    },
    capabilities: ['browser', 'screenshot', 'video'],
    serverId: serverId,
    created: now,
    lastActivity: now,
    version: '1.0.0'
  };
}

/**
 * MongoDB veritabanını model tabanlı koleksiyonlar ve varsayılan verilerle başlatır
 */
async function initDatabase() {
  try {
    // MongoDB'ye bağlan
    const db = await connectToMongoDB();

    // Mevcut koleksiyonları düşür
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Koleksiyon düşürüldü: ${collection.name}`);
    }

    // Model yapısına göre koleksiyonlar oluştur
    for (const [_key, value] of Object.entries(COLLECTIONS)) {
      await db.createCollection(value);
      console.log(`Koleksiyon oluşturuldu: ${value}`);
    }

    // Varsayılan admin kullanıcısı oluştur
    const adminUser = createDefaultAdminUser();
    await db.collection(COLLECTIONS.USERS).insertOne(adminUser);
    console.log(`Varsayılan admin kullanıcısı oluşturuldu: ${adminUser.email}`);

    // Varsayılan proje oluştur
    const project = createDefaultProject(adminUser.id);
    await db.collection(COLLECTIONS.PROJECTS).insertOne(project);
    console.log(`Varsayılan proje oluşturuldu: ${project.name}`);

    // Varsayılan test case oluştur
    const testCase = createDefaultTestCase(project.id, adminUser.id);
    await db.collection(COLLECTIONS.TEST_CASES).insertOne(testCase);
    console.log(`Varsayılan test case oluşturuldu: ${testCase.title}`);

    // Varsayılan test suite oluştur
    const testSuite = createDefaultTestSuite(project.id, [testCase.id], adminUser.id);
    await db.collection(COLLECTIONS.TEST_SUITES).insertOne(testSuite);
    console.log(`Varsayılan test suite oluşturuldu: ${testSuite.name}`);

    // Varsayılan test run oluştur
    const testRun = createDefaultTestRun(testSuite.id, project.id, adminUser.id);
    await db.collection(COLLECTIONS.TEST_RUNS).insertOne(testRun);
    console.log(`Varsayılan test run oluşturuldu: ${testRun.name}`);

    // Varsayılan server agent oluştur
    const serverAgent = createDefaultServerAgent();
    await db.collection(COLLECTIONS.SERVER_AGENT).insertOne(serverAgent);
    console.log(`Varsayılan server agent oluşturuldu: ${serverAgent.serverId}`);

    // Varsayılan agent oluştur
    const agent = createDefaultAgent(serverAgent.serverId);
    await db.collection(COLLECTIONS.AGENTS).insertOne(agent);
    console.log(`Varsayılan agent oluşturuldu: ${agent.name}`);

    // Daha iyi performans için indeksler oluştur
    await db.collection(COLLECTIONS.TEST_CASES).createIndex({ status: 1 });
    await db.collection(COLLECTIONS.TEST_CASES).createIndex({ updatedAt: -1 });
    await db.collection(COLLECTIONS.TEST_RUNS).createIndex({ startTime: -1 });
    await db.collection(COLLECTIONS.TEST_RUNS).createIndex({ testCaseId: 1 });
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true });
    await db.collection(COLLECTIONS.PROJECTS).createIndex({ name: 1 });
    console.log('Daha iyi performans için indeksler oluşturuldu');

    console.log('MongoDB başlatma işlemi başarıyla tamamlandı');
  } catch (error) {
    console.error('MongoDB başlatma hatası:', error);
  } finally {
    // MongoDB bağlantısını kapat
    await closeMongoDBConnection();
  }
}

// Başlatma işlemini çalıştır
initDatabase();
