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
  ServerAgentSchema,
  TestResultSchema,
  TestResultStatus,
  TestStepResultSchema,
  TestStepResultStatus
} from '../models/database/schemas';

/**
 * Dummy kullanıcılar oluşturur
 */
function createDummyUsers(count: number = 5): UserSchema[] {
  const users: UserSchema[] = [];
  const roles = Object.values(UserRole);
  const statuses = [UserStatus.ACTIVE, UserStatus.ACTIVE, UserStatus.ACTIVE, UserStatus.PENDING, UserStatus.INACTIVE];

  // Admin kullanıcısı her zaman olsun
  const adminUser: UserSchema = {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    password: 'admin123', // Gerçek uygulamada hash'lenmiş olmalı
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users.push(adminUser);

  // Diğer kullanıcılar
  for (let i = 1; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const now = new Date();

    users.push({
      id: uuidv4(),
      name: `User ${i}`,
      email: `user${i}@example.com`,
      role: role,
      status: status,
      password: `password${i}`, // Gerçek uygulamada hash'lenmiş olmalı
      emailVerified: status === UserStatus.ACTIVE,
      createdAt: now,
      updatedAt: now
    });
  }

  return users;
}

/**
 * Dummy projeler oluşturur
 */
function createDummyProjects(users: UserSchema[], count: number = 3): ProjectSchema[] {
  const projects: ProjectSchema[] = [];
  const statuses = Object.values(ProjectStatus);
  const priorities = Object.values(ProjectPriority);
  const categories = Object.values(ProjectCategory);

  for (let i = 0; i < count; i++) {
    const now = new Date();
    const adminUser = users.find(u => u.role === UserRole.ADMIN);
    const adminUserId = adminUser ? adminUser.id : users[0].id;

    // Projeye eklenecek kullanıcılar
    const projectMembers = users.slice(0, Math.min(3 + i, users.length)).map(user => {
      return {
        userId: user.id,
        role: user.role === UserRole.ADMIN ? ProjectMemberRole.OWNER :
              user.role === UserRole.MANAGER ? ProjectMemberRole.MANAGER :
              ProjectMemberRole.TESTER,
        joinedAt: now
      };
    });

    projects.push({
      id: uuidv4(),
      name: `Project ${i + 1}`,
      description: `This is a description for Project ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      tags: ['test', 'automation', `tag-${i}`],
      members: projectMembers,
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
    });
  }

  return projects;
}

/**
 * Dummy test adımları oluşturur
 */
function createDummyTestSteps(testCaseId: string): TestStepSchema[] {
  return [
    {
      id: uuidv4(),
      order: 1,
      action: TestStepActionType.NAVIGATE,
      target: 'https://example.com/login',
      targetType: TestStepTargetType.NONE,
      description: 'Navigate to login page',
      testCaseId
    },
    {
      id: uuidv4(),
      order: 2,
      action: TestStepActionType.TYPE,
      target: 'input[name="username"]',
      targetType: TestStepTargetType.CSS_SELECTOR,
      value: 'testuser',
      description: 'Enter username',
      testCaseId
    },
    {
      id: uuidv4(),
      order: 3,
      action: TestStepActionType.TYPE,
      target: 'input[name="password"]',
      targetType: TestStepTargetType.CSS_SELECTOR,
      value: 'password',
      description: 'Enter password',
      testCaseId
    },
    {
      id: uuidv4(),
      order: 4,
      action: TestStepActionType.CLICK,
      target: 'button[type="submit"]',
      targetType: TestStepTargetType.CSS_SELECTOR,
      description: 'Click login button',
      testCaseId
    },
    {
      id: uuidv4(),
      order: 5,
      action: TestStepActionType.ASSERT_TEXT,
      target: '.welcome-message',
      targetType: TestStepTargetType.CSS_SELECTOR,
      value: 'Welcome',
      description: 'Verify welcome message',
      testCaseId
    }
  ];
}

/**
 * Dummy test case'ler oluşturur
 */
function createDummyTestCases(projects: ProjectSchema[], users: UserSchema[], count: number = 5): { testCases: TestCaseSchema[], testSteps: TestStepSchema[] } {
  const testCases: TestCaseSchema[] = [];
  const allTestSteps: TestStepSchema[] = [];
  const statuses = Object.values(TestCaseStatus);
  const priorities = Object.values(TestCasePriority);

  for (let i = 0; i < count; i++) {
    const now = new Date();
    const projectIndex = i % projects.length;
    const userIndex = i % users.length;

    const testCaseId = uuidv4();
    const testCaseSteps = createDummyTestSteps(testCaseId);
    allTestSteps.push(...testCaseSteps);

    testCases.push({
      id: testCaseId,
      title: `Test Case ${i + 1}`,
      description: `Description for Test Case ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      steps: testCaseSteps.map(step => step.id),
      tags: ['login', 'authentication', `tag-${i}`],
      projectId: projects[projectIndex].id,
      browsers: [BrowserType.CHROMIUM],
      headless: true,
      browserPool: false,
      createdBy: users[userIndex].id,
      createdAt: now,
      updatedAt: now,
      executionStats: {
        totalRuns: Math.floor(Math.random() * 10),
        passCount: Math.floor(Math.random() * 8),
        failCount: Math.floor(Math.random() * 3),
        passRate: 0 // Hesaplanacak
      }
    });
  }

  // Pass rate hesapla
  testCases.forEach(tc => {
    if (tc.executionStats) {
      const total = tc.executionStats.totalRuns;
      const passed = tc.executionStats.passCount;
      tc.executionStats.passRate = total > 0 ? (passed / total) * 100 : 0;
    }
  });

  return { testCases, testSteps: allTestSteps };
}

/**
 * Dummy test suite'ler oluşturur
 */
function createDummyTestSuites(projects: ProjectSchema[], testCases: TestCaseSchema[], users: UserSchema[], count: number = 3): TestSuiteSchema[] {
  const testSuites: TestSuiteSchema[] = [];
  const statuses = Object.values(TestSuiteStatus);
  const priorities = Object.values(TestSuitePriority);

  for (let i = 0; i < count; i++) {
    const now = new Date();
    const projectIndex = i % projects.length;
    const userIndex = i % users.length;

    // Bu projeye ait test case'leri bul
    const projectTestCases = testCases.filter(tc => tc.projectId === projects[projectIndex].id);
    const testCaseIds = projectTestCases.length > 0
      ? projectTestCases.map(tc => tc.id)
      : testCases.slice(0, 3).map(tc => tc.id); // Eğer projeye ait test case yoksa, ilk 3 test case'i kullan

    testSuites.push({
      id: uuidv4(),
      name: `Test Suite ${i + 1}`,
      description: `Description for Test Suite ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      progress: Math.floor(Math.random() * 100),
      testCases: testCaseIds,
      projectId: projects[projectIndex].id,
      tags: ['regression', 'smoke', `tag-${i}`],
      executionMode: TestSuiteExecutionMode.SEQUENTIAL,
      maxParallelExecutions: 1,
      maxRetries: 1,
      browsers: [BrowserType.CHROMIUM],
      headless: true,
      browserPool: false,
      createdBy: users[userIndex].id,
      createdAt: now,
      updatedAt: now
    });
  }

  return testSuites;
}

/**
 * Dummy test run'lar oluşturur
 */
function createDummyTestRuns(testSuites: TestSuiteSchema[], _projects: ProjectSchema[], users: UserSchema[], count: number = 5): TestRunSchema[] {
  const testRuns: TestRunSchema[] = [];
  const statuses = Object.values(TestRunStatus);
  const priorities = Object.values(TestRunPriority);

  for (let i = 0; i < count; i++) {
    const now = new Date();
    const testSuiteIndex = i % testSuites.length;
    const userIndex = i % users.length;

    const testSuite = testSuites[testSuiteIndex];
    const projectId = testSuite.projectId;

    testRuns.push({
      id: uuidv4(),
      name: `Test Run ${i + 1}`,
      description: `Test run for ${testSuite.name}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      projectId: projectId,
      testSuiteId: testSuite.id,
      environment: 'testing',
      tags: ['regression', 'automated', `tag-${i}`],
      browsers: [BrowserType.CHROMIUM],
      headless: true,
      browserPool: false,
      createdBy: users[userIndex].id,
      createdAt: now,
      updatedAt: now,
      results: [] // Test sonuçları daha sonra eklenecek
    });
  }

  return testRuns;
}

/**
 * Dummy test sonuçları oluşturur
 */
function createDummyTestResults(testRuns: TestRunSchema[], testCases: TestCaseSchema[], testSteps: TestStepSchema[], testSuites: TestSuiteSchema[]): { testResults: TestResultSchema[], testStepResults: TestStepResultSchema[] } {
  const testResults: TestResultSchema[] = [];
  const testStepResults: TestStepResultSchema[] = [];
  const statuses = Object.values(TestResultStatus);

  testRuns.forEach(testRun => {
    // Test run'a ait test suite'i bul
    const testSuiteId = testRun.testSuiteId;
    if (!testSuiteId) return;

    // Test suite'e ait test case'leri bul
    const testSuite = testSuites.find(ts => ts.id === testSuiteId);
    if (!testSuite) return;

    const testCaseIds = testSuite.testCases;

    // Her test case için bir test sonucu oluştur
    testCaseIds.forEach(testCaseId => {
      const testCase = testCases.find(tc => tc.id === testCaseId);
      if (!testCase) return;

      const now = new Date();
      const startTime = new Date(now.getTime() - Math.floor(Math.random() * 60000)); // 0-60 saniye önce
      const duration = Math.floor(Math.random() * 10000); // 0-10 saniye
      const endTime = new Date(startTime.getTime() + duration);

      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const testResultId = uuidv4();

      // Test sonucu oluştur
      testResults.push({
        id: testResultId,
        testRunId: testRun.id,
        testCaseId: testCaseId,
        testSuiteId: testSuiteId,
        name: testCase.title,
        description: testCase.description,
        status: status,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        environment: testRun.environment || 'testing'
      });

      // Test adım sonuçları oluştur
      const testCaseSteps = testSteps.filter(step => step.testCaseId === testCaseId);

      testCaseSteps.forEach(step => {
        const stepStartTime = new Date(startTime.getTime() + Math.floor(Math.random() * duration));
        const stepDuration = Math.floor(Math.random() * 2000); // 0-2 saniye
        const stepEndTime = new Date(stepStartTime.getTime() + stepDuration);

        const stepStatus = status === TestResultStatus.PASSED
          ? TestStepResultStatus.PASSED
          : Math.random() > 0.7 ? TestStepResultStatus.FAILED : TestStepResultStatus.PASSED;

        testStepResults.push({
          id: uuidv4(),
          testResultId: testResultId,
          testStepId: step.id,
          order: step.order,
          description: step.description || '',
          status: stepStatus,
          duration: stepDuration,
          startTime: stepStartTime,
          endTime: stepEndTime,
          errorMessage: stepStatus === TestStepResultStatus.FAILED ? 'Element not found' : null
        });
      });

      // Test run'a test sonucu ID'sini ekle
      testRun.results?.push(testResultId);
    });
  });

  return { testResults, testStepResults };
}

/**
 * Dummy agent'lar oluşturur
 */
function createDummyAgents(count: number = 3): AgentSchema[] {
  const agents: AgentSchema[] = [];
  const statuses = Object.values(AgentStatus);
  const types = Object.values(AgentType);
  const browsers = Object.values(BrowserType);

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
 * MongoDB veritabanına dummy veriler ekler
 */
async function createDummyData() {
  try {
    // MongoDB'ye bağlan
    const db = await connectToMongoDB();
    console.log('MongoDB bağlantısı başarılı');

    // Dummy veriler oluştur
    const users = createDummyUsers(5);
    const projects = createDummyProjects(users, 3);
    const { testCases, testSteps } = createDummyTestCases(projects, users, 10);
    const testSuites = createDummyTestSuites(projects, testCases, users, 5);
    const testRuns = createDummyTestRuns(testSuites, projects, users, 8);
    const { testResults, testStepResults } = createDummyTestResults(testRuns, testCases, testSteps, testSuites);
    const agents = createDummyAgents(3);
    const serverAgent = createDummyServerAgent(agents);

    // Verileri veritabanına ekle
    await db.collection(COLLECTIONS.USERS).insertMany(users);
    console.log(`${users.length} kullanıcı eklendi`);

    await db.collection(COLLECTIONS.PROJECTS).insertMany(projects);
    console.log(`${projects.length} proje eklendi`);

    await db.collection(COLLECTIONS.TEST_CASES).insertMany(testCases);
    console.log(`${testCases.length} test case eklendi`);

    // Test adımlarını ekle
    const testStepsChunks = [];
    for (let i = 0; i < testSteps.length; i += 100) {
      testStepsChunks.push(testSteps.slice(i, i + 100));
    }

    for (const chunk of testStepsChunks) {
      await db.collection('testSteps').insertMany(chunk);
    }
    console.log(`${testSteps.length} test adımı eklendi`);

    await db.collection(COLLECTIONS.TEST_SUITES).insertMany(testSuites);
    console.log(`${testSuites.length} test suite eklendi`);

    await db.collection(COLLECTIONS.TEST_RUNS).insertMany(testRuns);
    console.log(`${testRuns.length} test run eklendi`);

    await db.collection(COLLECTIONS.TEST_RESULTS).insertMany(testResults);
    console.log(`${testResults.length} test sonucu eklendi`);

    // Test adım sonuçlarını ekle
    const testStepResultsChunks = [];
    for (let i = 0; i < testStepResults.length; i += 100) {
      testStepResultsChunks.push(testStepResults.slice(i, i + 100));
    }

    for (const chunk of testStepResultsChunks) {
      await db.collection(COLLECTIONS.TEST_STEP_RESULTS).insertMany(chunk);
    }
    console.log(`${testStepResults.length} test adım sonucu eklendi`);

    await db.collection(COLLECTIONS.AGENTS).insertMany(agents);
    console.log(`${agents.length} agent eklendi`);

    await db.collection(COLLECTIONS.SERVER_AGENT).insertOne(serverAgent);
    console.log(`Server agent eklendi`);

    // Diğer koleksiyonlar için örnek veriler
    await db.collection(COLLECTIONS.TEST_CATEGORIES).insertMany([
      { id: uuidv4(), name: 'Regression', description: 'Regression tests', color: '#FF5733' },
      { id: uuidv4(), name: 'Smoke', description: 'Smoke tests', color: '#33FF57' },
      { id: uuidv4(), name: 'Integration', description: 'Integration tests', color: '#3357FF' }
    ]);

    await db.collection(COLLECTIONS.TEST_PRIORITIES).insertMany([
      { id: uuidv4(), name: 'Critical', description: 'Critical priority', color: '#FF0000' },
      { id: uuidv4(), name: 'High', description: 'High priority', color: '#FF9900' },
      { id: uuidv4(), name: 'Medium', description: 'Medium priority', color: '#FFFF00' },
      { id: uuidv4(), name: 'Low', description: 'Low priority', color: '#00FF00' }
    ]);

    await db.collection(COLLECTIONS.TEST_STATUSES).insertMany([
      { id: uuidv4(), name: 'Passed', description: 'Test passed', color: '#00FF00' },
      { id: uuidv4(), name: 'Failed', description: 'Test failed', color: '#FF0000' },
      { id: uuidv4(), name: 'Blocked', description: 'Test blocked', color: '#FF9900' },
      { id: uuidv4(), name: 'Pending', description: 'Test pending', color: '#FFFF00' }
    ]);

    await db.collection(COLLECTIONS.TEST_ENVIRONMENTS).insertMany([
      { id: uuidv4(), name: 'Development', description: 'Development environment', color: '#33FF57' },
      { id: uuidv4(), name: 'Testing', description: 'Testing environment', color: '#FFFF00' },
      { id: uuidv4(), name: 'Staging', description: 'Staging environment', color: '#FF9900' },
      { id: uuidv4(), name: 'Production', description: 'Production environment', color: '#FF0000' }
    ]);

    await db.collection(COLLECTIONS.AVAILABLE_ACTIONS).insertMany([
      { id: uuidv4(), name: 'Click', description: 'Click on an element', icon: 'click' },
      { id: uuidv4(), name: 'Type', description: 'Type text into an element', icon: 'type' },
      { id: uuidv4(), name: 'Navigate', description: 'Navigate to a URL', icon: 'navigate' },
      { id: uuidv4(), name: 'Assert', description: 'Assert a condition', icon: 'assert' }
    ]);

    // TEST_FEATURES koleksiyonu için dummy veriler
    await db.collection(COLLECTIONS.TEST_FEATURES).insertMany([
      { id: uuidv4(), name: 'Authentication', description: 'User authentication features', projectId: projects[0].id, testCases: testCases.slice(0, 2).map(tc => tc.id) },
      { id: uuidv4(), name: 'User Management', description: 'User management features', projectId: projects[0].id, testCases: testCases.slice(2, 4).map(tc => tc.id) },
      { id: uuidv4(), name: 'Dashboard', description: 'Dashboard features', projectId: projects[1].id, testCases: testCases.slice(4, 6).map(tc => tc.id) },
      { id: uuidv4(), name: 'Reporting', description: 'Reporting features', projectId: projects[1].id, testCases: testCases.slice(6, 8).map(tc => tc.id) },
      { id: uuidv4(), name: 'Settings', description: 'Settings features', projectId: projects[2].id, testCases: testCases.slice(8, 10).map(tc => tc.id) }
    ]);

    // NOTIFICATIONS koleksiyonu için dummy veriler
    const notificationTypes = ['info', 'warning', 'error', 'success'];
    const notificationMessages = [
      'Test run completed successfully',
      'Test case failed',
      'New test suite created',
      'Project settings updated',
      'Agent went offline',
      'Server agent restarted',
      'Test execution scheduled',
      'User account created'
    ];

    const notifications = [];
    for (let i = 0; i < 15; i++) {
      const userIndex = Math.floor(Math.random() * users.length);
      const typeIndex = Math.floor(Math.random() * notificationTypes.length);
      const messageIndex = Math.floor(Math.random() * notificationMessages.length);
      const daysAgo = Math.floor(Math.random() * 10);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      notifications.push({
        id: uuidv4(),
        userId: users[userIndex].id,
        type: notificationTypes[typeIndex],
        message: notificationMessages[messageIndex],
        read: Math.random() > 0.5,
        createdAt: date,
        link: Math.random() > 0.7 ? `/projects/${projects[Math.floor(Math.random() * projects.length)].id}` : null
      });
    }
    await db.collection(COLLECTIONS.NOTIFICATIONS).insertMany(notifications);

    // EXECUTION_TIME_DATA koleksiyonu için dummy veriler
    const executionTimeData = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      executionTimeData.push({
        id: uuidv4(),
        date: date,
        avgExecutionTime: Math.floor(Math.random() * 5000) + 1000, // 1-6 saniye
        minExecutionTime: Math.floor(Math.random() * 500) + 500, // 0.5-1 saniye
        maxExecutionTime: Math.floor(Math.random() * 10000) + 5000, // 5-15 saniye
        totalTests: Math.floor(Math.random() * 50) + 10,
        projectId: i % 3 === 0 ? projects[0].id : i % 3 === 1 ? projects[1].id : projects[2].id
      });
    }
    await db.collection(COLLECTIONS.EXECUTION_TIME_DATA).insertMany(executionTimeData);

    // TEST_COUNTS_BY_DAY koleksiyonu için dummy veriler
    const testCountsByDay = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      testCountsByDay.push({
        id: uuidv4(),
        date: date,
        totalTests: Math.floor(Math.random() * 50) + 10,
        passedTests: Math.floor(Math.random() * 40) + 5,
        failedTests: Math.floor(Math.random() * 10) + 1,
        skippedTests: Math.floor(Math.random() * 5),
        projectId: i % 3 === 0 ? projects[0].id : i % 3 === 1 ? projects[1].id : projects[2].id
      });
    }
    await db.collection(COLLECTIONS.TEST_COUNTS_BY_DAY).insertMany(testCountsByDay);

    // SYSTEM_RESOURCES_DATA koleksiyonu için dummy veriler
    const systemResourcesData = [];
    for (let i = 0; i < 24; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);

      systemResourcesData.push({
        id: uuidv4(),
        timestamp: date,
        cpuUsage: Math.floor(Math.random() * 80) + 10, // 10-90%
        memoryUsage: Math.floor(Math.random() * 4000) + 1000, // 1000-5000 MB
        diskUsage: Math.floor(Math.random() * 50) + 30, // 30-80%
        networkUsage: Math.floor(Math.random() * 100) + 10, // 10-110 MB
        serverId: serverAgent.serverId
      });
    }
    await db.collection(COLLECTIONS.SYSTEM_RESOURCES_DATA).insertMany(systemResourcesData);

    // AGENT_STATUS_DATA koleksiyonu için dummy veriler
    const agentStatusData = [];
    for (let i = 0; i < 24; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);

      const total = agents.length;
      const available = Math.min(total, Math.floor(Math.random() * total) + 1);
      const busy = Math.min(total - available, Math.floor(Math.random() * (total - available)) + 1);
      const offline = total - available - busy;

      agentStatusData.push({
        id: uuidv4(),
        timestamp: date,
        total: total,
        available: available,
        busy: busy,
        offline: offline,
        error: Math.floor(Math.random() * 2),
        maintenance: Math.floor(Math.random() * 2),
        serverId: serverAgent.serverId
      });
    }
    await db.collection(COLLECTIONS.AGENT_STATUS_DATA).insertMany(agentStatusData);

    // QUEUE_STATUS_DATA koleksiyonu için dummy veriler
    const queueStatusData = [];
    for (let i = 0; i < 24; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);

      const queued = Math.floor(Math.random() * 10);
      const processing = Math.floor(Math.random() * 5);

      queueStatusData.push({
        id: uuidv4(),
        timestamp: date,
        queued: queued,
        processing: processing,
        total: queued + processing,
        serverId: serverAgent.serverId
      });
    }
    await db.collection(COLLECTIONS.QUEUE_STATUS_DATA).insertMany(queueStatusData);

    // ACTIVE_AGENTS_DATA koleksiyonu için dummy veriler
    const activeAgentsData = [];
    for (let i = 0; i < 24; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);

      const activeAgentIds = agents
        .filter(() => Math.random() > 0.2) // Rastgele bazı agent'ları seç
        .map(agent => agent.id);

      activeAgentsData.push({
        id: uuidv4(),
        timestamp: date,
        activeAgents: activeAgentIds,
        count: activeAgentIds.length,
        serverId: serverAgent.serverId
      });
    }
    await db.collection(COLLECTIONS.ACTIVE_AGENTS_DATA).insertMany(activeAgentsData);

    // QUEUED_REQUESTS ve QUEUED_REQUESTS_DATA koleksiyonları için dummy veriler
    const queuedRequests = [];
    const queuedRequestsData = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));

      const requestId = uuidv4();
      const testCaseIndex = Math.floor(Math.random() * testCases.length);
      const testCase = testCases[testCaseIndex];

      queuedRequests.push({
        id: requestId,
        name: `Run Test Case: ${testCase.title}`,
        description: `Queued request to run test case ${testCase.title}`,
        status: 'pending',
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        category: 'test_execution',
        source: 'manual',
        testCaseId: testCase.id,
        projectId: testCase.projectId,
        browser: BrowserType.CHROMIUM,
        environment: 'testing',
        headless: true,
        timeout: 30000,
        createdAt: date
      });

      queuedRequestsData.push({
        id: uuidv4(),
        timestamp: date,
        requestId: requestId,
        status: 'pending',
        queuePosition: i + 1,
        estimatedStartTime: new Date(date.getTime() + (i + 1) * 60000), // i+1 dakika sonra
        serverId: serverAgent.serverId
      });
    }

    await db.collection(COLLECTIONS.QUEUED_REQUESTS).insertMany(queuedRequests);
    await db.collection(COLLECTIONS.QUEUED_REQUESTS_DATA).insertMany(queuedRequestsData);

    // PROCESSED_REQUESTS ve PROCESSED_REQUESTS_DATA koleksiyonları için dummy veriler
    const processedRequests = [];
    const processedRequestsData = [];

    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));

      const requestId = uuidv4();
      const testCaseIndex = Math.floor(Math.random() * testCases.length);
      const testCase = testCases[testCaseIndex];
      const agentIndex = Math.floor(Math.random() * agents.length);
      const agent = agents[agentIndex];
      const processingTime = Math.floor(Math.random() * 30000) + 5000; // 5-35 saniye
      const success = Math.random() > 0.3;

      processedRequests.push({
        id: requestId,
        name: `Run Test Case: ${testCase.title}`,
        description: `Processed request to run test case ${testCase.title}`,
        status: success ? 'completed' : 'failed',
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        category: 'test_execution',
        source: 'manual',
        testCaseId: testCase.id,
        projectId: testCase.projectId,
        browser: BrowserType.CHROMIUM,
        environment: 'testing',
        headless: true,
        timeout: 30000,
        createdAt: date,
        startedAt: new Date(date.getTime() + 5000), // 5 saniye sonra başladı
        completedAt: new Date(date.getTime() + 5000 + processingTime), // başlangıçtan processingTime sonra tamamlandı
        processingTime: processingTime,
        assignedTo: agent.id,
        result: success ? 'success' : 'error',
        errorMessage: success ? null : 'Test execution failed'
      });

      processedRequestsData.push({
        id: uuidv4(),
        timestamp: date,
        requestId: requestId,
        status: success ? 'completed' : 'failed',
        processingTime: processingTime,
        agentId: agent.id,
        serverId: serverAgent.serverId
      });
    }

    await db.collection(COLLECTIONS.PROCESSED_REQUESTS).insertMany(processedRequests);
    await db.collection(COLLECTIONS.PROCESSED_REQUESTS_DATA).insertMany(processedRequestsData);

    // DETAILED_TEST_RESULTS koleksiyonu için dummy veriler
    const detailedTestResults = [];

    for (const testResult of testResults) {
      const testCase = testCases.find(tc => tc.id === testResult.testCaseId);
      if (!testCase) continue;

      const testStepsForCase = testSteps.filter(step => step.testCaseId === testCase.id);
      const testStepResultsForCase = testStepResults.filter(sr => sr.testResultId === testResult.id);

      const detailedResult = {
        id: uuidv4(),
        testResultId: testResult.id,
        testCaseId: testCase.id,
        testRunId: testResult.testRunId,
        title: testCase.title,
        status: testResult.status,
        startTime: testResult.startTime,
        endTime: testResult.endTime,
        duration: testResult.duration,
        environment: testResult.environment,
        browser: BrowserType.CHROMIUM,
        steps: testStepResultsForCase.map(sr => {
          const step = testStepsForCase.find(s => s.id === sr.testStepId);
          return {
            id: sr.id,
            order: sr.order,
            description: sr.description,
            action: step?.action || 'unknown',
            target: step?.target || '',
            value: step?.value || '',
            status: sr.status,
            duration: sr.duration,
            screenshot: sr.screenshot || null,
            errorMessage: sr.errorMessage || null
          };
        }),
        screenshots: testStepResultsForCase
          .filter(sr => sr.screenshot)
          .map(sr => sr.screenshot)
          .filter(Boolean) as string[],
        logs: [
          `[INFO] Test started at ${testResult.startTime?.toISOString()}`,
          `[INFO] Browser: Chrome`,
          `[INFO] Environment: ${testResult.environment}`,
          ...(testResult.status === TestResultStatus.PASSED
            ? [`[INFO] All steps passed`, `[INFO] Test completed successfully`]
            : [`[ERROR] Test failed`, `[ERROR] ${Math.random() > 0.5 ? 'Element not found' : 'Assertion failed'}`])
        ],
        metadata: {
          testSuiteId: testResult.testSuiteId,
          projectId: testCase.projectId,
          tags: testCase.tags
        }
      };

      detailedTestResults.push(detailedResult);
    }

    await db.collection(COLLECTIONS.DETAILED_TEST_RESULTS).insertMany(detailedTestResults);

    // PERFORMANCE_METRICS koleksiyonu için dummy veriler
    const performanceMetrics = [];

    for (let i = 0; i < 20; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - Math.floor(Math.random() * 72)); // Son 3 gün

      const testRunIndex = Math.floor(Math.random() * testRuns.length);
      const testRun = testRuns[testRunIndex];
      const testCaseIndex = Math.floor(Math.random() * testCases.length);
      const testCase = testCases[testCaseIndex];

      performanceMetrics.push({
        id: uuidv4(),
        timestamp: date,
        testRunId: testRun.id,
        testCaseId: testCase.id,
        projectId: testCase.projectId,
        environment: 'testing',
        browser: BrowserType.CHROMIUM,
        metrics: {
          loadTime: Math.floor(Math.random() * 2000) + 500, // 500-2500ms
          firstPaint: Math.floor(Math.random() * 500) + 100, // 100-600ms
          firstContentfulPaint: Math.floor(Math.random() * 800) + 200, // 200-1000ms
          domComplete: Math.floor(Math.random() * 1500) + 300, // 300-1800ms
          resourcesLoaded: Math.floor(Math.random() * 20) + 5, // 5-25 resources
          resourcesSize: Math.floor(Math.random() * 5000) + 500, // 500-5500 KB
          memoryUsage: Math.floor(Math.random() * 200) + 50, // 50-250 MB
          cpuUsage: Math.floor(Math.random() * 50) + 10, // 10-60%
        },
        url: 'https://example.com/test-page',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
    }

    await db.collection(COLLECTIONS.PERFORMANCE_METRICS).insertMany(performanceMetrics);

    console.log('Diğer koleksiyonlar için örnek veriler eklendi');

    console.log('MongoDB dummy veri ekleme işlemi başarıyla tamamlandı');
  } catch (error) {
    console.error('MongoDB dummy veri ekleme hatası:', error);
  } finally {
    // MongoDB bağlantısını kapat
    await closeMongoDBConnection();
  }
}

// Dummy veri oluşturma işlemini çalıştır
createDummyData();
