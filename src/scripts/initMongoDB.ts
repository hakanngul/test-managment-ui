import { MongoClient, Db } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTIONS } from '../models';
import {
  UserRole,
  UserStatus,
  TestCaseStatus,
  TestCasePriority,
  BrowserType,
  TestStepActionType,
  TestSuiteStatus,
  TestSuitePriority,
  TestSuiteExecutionMode,
  TestRunStatus,
  TestRunPriority,
  ProjectStatus,
  ProjectPriority,
  ProjectCategory,
  ProjectMemberRole,
  ProjectEnvironment,
  AgentStatus,
  AgentType
} from '../models';

// MongoDB connection string
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';

// Database name
const DB_NAME = 'testautomationdb';

// MongoDB client instance
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB
 */
async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Close MongoDB connection
 */
async function closeMongoDBConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

/**
 * Create default admin user
 */
function createDefaultAdminUser() {
  const now = new Date();
  return {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    password: 'admin', // In a real application, this would be hashed
    createdAt: now,
    updatedAt: now,
    emailVerified: true
  };
}

/**
 * Create default project
 */
function createDefaultProject(adminUserId: string) {
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
 * Create default test case
 */
function createDefaultTestCase(projectId: string, adminUserId: string) {
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
        action: TestStepActionType.NAVIGATE,
        target: 'https://example.com/login',
        value: '',
        description: 'Navigate to login page'
      },
      {
        id: uuidv4(),
        action: TestStepActionType.TYPE,
        target: 'input[name="username"]',
        value: 'admin',
        description: 'Enter username'
      },
      {
        id: uuidv4(),
        action: TestStepActionType.TYPE,
        target: 'input[name="password"]',
        value: 'password',
        description: 'Enter password'
      },
      {
        id: uuidv4(),
        action: TestStepActionType.CLICK,
        target: 'button[type="submit"]',
        value: '',
        description: 'Click login button'
      },
      {
        id: uuidv4(),
        action: TestStepActionType.ASSERT_TEXT,
        target: '.welcome-message',
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
    updatedAt: now
  };
}

/**
 * Create default test suite
 */
function createDefaultTestSuite(projectId: string, testCaseIds: string[], adminUserId: string) {
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
 * Create default test run
 */
function createDefaultTestRun(testSuiteId: string, _projectId: string, adminUserId: string) {
  const now = new Date();
  return {
    id: uuidv4(),
    name: 'Authentication Test Run',
    description: 'Test run for authentication functionality',
    status: TestRunStatus.PENDING,
    priority: TestRunPriority.HIGH,
    testSuiteId: testSuiteId,
    environment: 'testing',
    tags: ['authentication', 'critical'],
    browsers: [BrowserType.CHROMIUM],
    headless: true,
    browserPool: false,
    createdBy: adminUserId,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Create default server agent
 */
function createDefaultServerAgent() {
  const now = new Date();
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
      limit: 5
    },
    queueStatus: {
      queued: 0,
      processing: 0,
      total: 0
    },
    activeAgents: [
      {
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
        serverId: 'server-001',
        created: now,
        lastActivity: now,
        currentRequest: null,
        version: '1.0.0'
      }
    ],
    queuedRequests: [],
    processedRequests: []
  };
}

/**
 * Initialize MongoDB with model-based collections and default data
 */
async function initMongoDB() {
  try {
    // Connect to MongoDB
    db = await connectToMongoDB();

    // Drop existing collections
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Dropped collection: ${collection.name}`);
    }

    // Create collections based on model structure
    for (const [_key, value] of Object.entries(COLLECTIONS)) {
      await db.createCollection(value);
      console.log(`Created collection: ${value}`);
    }

    // Create default admin user
    const adminUser = createDefaultAdminUser();
    await db.collection(COLLECTIONS.USERS).insertOne(adminUser);
    console.log(`Created default admin user: ${adminUser.email}`);

    // Create default project
    const project = createDefaultProject(adminUser.id);
    await db.collection(COLLECTIONS.PROJECTS).insertOne(project);
    console.log(`Created default project: ${project.name}`);

    // Create default test case
    const testCase = createDefaultTestCase(project.id, adminUser.id);
    await db.collection(COLLECTIONS.TEST_CASES).insertOne(testCase);
    console.log(`Created default test case: ${testCase.title}`);

    // Create default test suite
    const testSuite = createDefaultTestSuite(project.id, [testCase.id], adminUser.id);
    await db.collection(COLLECTIONS.TEST_SUITES).insertOne(testSuite);
    console.log(`Created default test suite: ${testSuite.name}`);

    // Create default test run
    const testRun = createDefaultTestRun(testSuite.id, project.id, adminUser.id);
    await db.collection(COLLECTIONS.TEST_RUNS).insertOne(testRun);
    console.log(`Created default test run: ${testRun.name}`);

    // Create default server agent
    const serverAgent = createDefaultServerAgent();
    await db.collection(COLLECTIONS.SERVER_AGENT).insertOne(serverAgent);
    console.log(`Created default server agent: ${serverAgent.serverId}`);

    // Create indexes for better performance
    await db.collection(COLLECTIONS.TEST_CASES).createIndex({ status: 1 });
    await db.collection(COLLECTIONS.TEST_CASES).createIndex({ updatedAt: -1 });
    await db.collection(COLLECTIONS.TEST_RUNS).createIndex({ startTime: -1 });
    await db.collection(COLLECTIONS.TEST_RUNS).createIndex({ testCaseId: 1 });
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true });
    await db.collection(COLLECTIONS.PROJECTS).createIndex({ name: 1 });
    console.log('Created indexes for better performance');

    console.log('MongoDB initialization completed successfully');
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
  } finally {
    // Close MongoDB connection
    await closeMongoDBConnection();
  }
}

// Run the initialization
initMongoDB();