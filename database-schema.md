# Test Automation Platform - MongoDB Şeması

## Koleksiyonlar ve İlişkiler

### Temel Koleksiyonlar

1. **users**
   - Kullanıcı bilgilerini içerir
   - Alanlar: id, name, email, role, avatar

2. **projects**
   - Proje bilgilerini içerir
   - Alanlar: id, name, description, status, priority, members, createdAt, updatedAt
   - İlişkiler: members -> users

3. **testCases**
   - Test case bilgilerini içerir
   - Alanlar: id, title, description, status, priority, steps, tags, projectId, browsers, createdBy, createdAt, updatedAt
   - İlişkiler: projectId -> projects, steps -> testSteps, createdBy -> users

4. **testSteps**
   - Test adımlarını içerir
   - Alanlar: id, order, action, target, targetType, value, description, expectedResult, screenshot, isManual, testCaseId
   - İlişkiler: testCaseId -> testCases

5. **testSuites**
   - Test suite bilgilerini içerir
   - Alanlar: id, name, description, status, priority, progress, testCases, projectId, tags, executionMode, browsers, createdBy, createdAt, updatedAt
   - İlişkiler: testCases -> testCases, projectId -> projects, createdBy -> users
   - Not: Test Suite'ler Test Case'leri içerir, bu nedenle testCases alanı Test Case ID'lerinin bir dizisidir

6. **testRuns**
   - Test çalıştırma bilgilerini içerir
   - Alanlar: id, name, description, status, priority, projectId, testSuiteId, testCaseIds, environment, browsers, startTime, endTime, duration, results, createdBy, createdAt, updatedAt
   - İlişkiler: projectId -> projects, testSuiteId -> testSuites, testCaseIds -> testCases, results -> testResults, createdBy -> users

7. **testResults**
   - Test sonuçlarını içerir
   - Alanlar: id, testRunId, testCaseId, testSuiteId, status, startTime, endTime, duration, environment, browser, errorMessage, steps, createdAt
   - İlişkiler: testRunId -> testRuns, testCaseId -> testCases, testSuiteId -> testSuites, steps -> testStepResults
   - Not: Bu koleksiyon, test geçmişi (test history) için kullanılır. Her test çalıştırması için test sonuçları burada saklanır.

8. **testStepResults**
   - Test adım sonuçlarını içerir
   - Alanlar: id, testResultId, testStepId, order, description, expectedResult, actualResult, status, duration, startTime, endTime, errorMessage, screenshot, createdAt
   - İlişkiler: testResultId -> testResults, testStepId -> testSteps

### Yardımcı Koleksiyonlar

9. **testCategories**
   - Test kategorilerini içerir
   - Alanlar: id, name, description

10. **testPriorities**
    - Test önceliklerini içerir
    - Alanlar: id, name, description, color

11. **testStatuses**
    - Test durumlarını içerir
    - Alanlar: id, name, description, color

12. **testEnvironments**
    - Test ortamlarını içerir
    - Alanlar: id, name, description, url

13. **availableActions**
    - Kullanılabilir test adımı aksiyonlarını içerir
    - Alanlar: id, name, description, type

### İzleme ve Metrik Koleksiyonları

14. **systemResourcesData**
    - Sistem kaynak kullanım verilerini içerir
    - Alanlar: id, timestamp, cpu, memory, disk, network

15. **agentStatusData**
    - Test ajanı durum verilerini içerir
    - Alanlar: id, timestamp, agentId, status, lastHeartbeat, version

16. **queueStatusData**
    - Kuyruk durum verilerini içerir
    - Alanlar: id, timestamp, queueLength, processingTime, waitTime

17. **activeAgentsData**
    - Aktif test ajanlarını içerir
    - Alanlar: id, agentId, name, status, currentTest, uptime, lastHeartbeat

18. **queuedRequestsData**
    - Kuyrukta bekleyen test isteklerini içerir
    - Alanlar: id, testName, description, status, queuePosition, estimatedStartTime, queuedAt, browser, priority

19. **processedRequestsData**
    - İşlenmiş test isteklerini içerir
    - Alanlar: id, testName, testRunId, testCaseId, status, result, startTime, endTime, duration, browser, agentId

20. **detailedTestResults**
    - Detaylı test sonuçlarını içerir
    - Alanlar: id, testRunId, testCaseId, status, startTime, endTime, duration, browser, environment, errorMessage, screenshots, logs
    - Not: Bu koleksiyon, testResults koleksiyonunun daha detaylı bir versiyonudur ve test geçmişi (test history) için ek bilgiler sağlar.

21. **performanceMetrics**
    - Performans metriklerini içerir
    - Alanlar: id, timestamp, metric, value, tags

## Şema Diyagramı

```
                                 +------------+
                                 |            |
                                 v            |
users <---- projects <------- testSuites     |
  ^           ^                  |           |
  |           |                  |           |
  |           |                  v           |
  |           +------- testCases <---- testSteps
  |                       ^                  ^
  |                       |                  |
  |                       |                  |
  +------- testRuns ----->+                  |
              |                              |
              v                              |
         testResults ----------------------->+
              |
              v
        testStepResults
```

### İlişki Açıklamaları

1. **Projects - TestSuites**: Bir proje birden fazla test suite içerebilir.
2. **TestSuites - TestCases**: Bir test suite birden fazla test case içerir.
3. **TestCases - TestSteps**: Bir test case birden fazla test adımı içerir.
4. **Users - Projects**: Kullanıcılar projelere atanabilir.
5. **Users - TestRuns**: Kullanıcılar test çalıştırmaları başlatabilir.
6. **TestRuns - TestCases**: Bir test çalıştırması birden fazla test case içerebilir.
7. **TestRuns - TestResults**: Bir test çalıştırması birden fazla test sonucu üretir.
8. **TestResults - TestStepResults**: Bir test sonucu birden fazla test adımı sonucu içerir.
9. **TestResults - TestCases**: Her test sonucu bir test case'e aittir.
10. **TestStepResults - TestSteps**: Her test adımı sonucu bir test adımına aittir.

## İlişki Modelleri ve Veri Yapıları

### MongoDB İlişki Modeli

MongoDB, ilişkisel veritabanlarından farklı olarak doküman tabanlı bir veritabanıdır. MongoDB'de ilişkiler iki şekilde modellenebilir:

1. **Gömülü Belgeler (Embedded Documents)**: İlişkili veriler, ana belgenin içinde gömülü olarak saklanır.
2. **Referanslar (References)**: İlişkili belgeler ayrı koleksiyonlarda saklanır ve birbirlerine referanslar ile bağlanır.

Bu projede, çoğunlukla referans yaklaşımı kullanılmıştır. Örneğin:

- Test case'ler ve test adımları arasındaki ilişki: Test adımları ayrı bir koleksiyonda saklanır ve test case belgesinde sadece referanslar bulunur.
- Test suite'ler ve test case'ler arasındaki ilişki: Test case'ler ayrı bir koleksiyonda saklanır ve test suite belgesinde sadece referanslar bulunur.
- Test çalıştırmaları ve test sonuçları arasındaki ilişki: Test sonuçları ayrı bir koleksiyonda saklanır ve test çalıştırma belgesinde sadece referanslar bulunur.

Bu yaklaşım, verilerin daha esnek bir şekilde sorgulanmasını ve güncellenmesini sağlar.

### Test Case ve Test Steps İlişkisi

Test case ve test steps arasındaki ilişki iki şekilde olabilir:

1. **Gömülü Belge (Embedded Document)**: Test adımları, test case belgesinin içinde bir dizi olarak saklanır.
   ```json
   {
     "id": "a408acf5-72f2-43d8-8d73-7f8c203c30b0",
     "title": "Test Case 1",
     "description": "Description for Test Case 1",
     "status": "active",
     "priority": "medium",
     "steps": [
       {
         "id": "step-1",
         "order": 1,
         "action": "navigate",
         "target": "https://example.com",
         "description": "Navigate to example.com",
         "expectedResult": "Page loads successfully",
         "type": "automated"
       },
       {
         "id": "step-2",
         "order": 2,
         "action": "click",
         "target": "#login-button",
         "description": "Click on login button",
         "expectedResult": "Login form appears",
         "type": "automated"
       }
     ],
     "tags": ["login", "authentication"],
     "projectId": "project-1",
     "createdBy": "John Doe",
     "createdAt": "2023-04-28T01:03:00.000Z",
     "updatedAt": "2023-04-28T01:03:00.000Z"
   }
   ```

2. **Referans (Reference)**: Test adımları ayrı bir koleksiyonda saklanır ve test case belgesinde sadece referanslar bulunur.
   ```json
   // testCases koleksiyonu
   {
     "id": "a408acf5-72f2-43d8-8d73-7f8c203c30b0",
     "title": "Test Case 1",
     "description": "Description for Test Case 1",
     "status": "active",
     "priority": "medium",
     "steps": ["step-1", "step-2", "step-3"],
     "tags": ["login", "authentication"],
     "projectId": "project-1",
     "createdBy": "John Doe",
     "createdAt": "2023-04-28T01:03:00.000Z",
     "updatedAt": "2023-04-28T01:03:00.000Z"
   }

   // testSteps koleksiyonu
   {
     "id": "step-1",
     "order": 1,
     "action": "navigate",
     "target": "https://example.com",
     "description": "Navigate to example.com",
     "expectedResult": "Page loads successfully",
     "type": "automated",
     "testCaseId": "a408acf5-72f2-43d8-8d73-7f8c203c30b0"
   }
   ```

Projede kullanılan yaklaşım, referans yaklaşımıdır. Test adımları ayrı bir koleksiyonda saklanır ve test case belgesinde sadece referanslar bulunur.

### Test History Veri Yapısı

Test geçmişi (test history), testResults ve testStepResults koleksiyonlarında saklanır. Her test çalıştırması için bir veya daha fazla test sonucu oluşturulur ve bu sonuçlar testResults koleksiyonunda saklanır.

```json
// testRuns koleksiyonu
{
  "id": "run-1",
  "name": "Test Run 1",
  "description": "Automated test run for Test Case 1",
  "status": "completed",
  "projectId": "project-1",
  "testCaseIds": ["a408acf5-72f2-43d8-8d73-7f8c203c30b0"],
  "environment": "production",
  "browsers": ["chrome"],
  "startTime": "2023-05-15T10:30:00.000Z",
  "endTime": "2023-05-15T10:30:05.000Z",
  "createdBy": "admin",
  "createdAt": "2023-05-15T10:30:00.000Z",
  "updatedAt": "2023-05-15T10:30:05.000Z"
}

// testResults koleksiyonu
{
  "id": "result-1",
  "testRunId": "run-1",
  "testCaseId": "a408acf5-72f2-43d8-8d73-7f8c203c30b0",
  "status": "passed",
  "startTime": "2023-05-15T10:30:00.000Z",
  "endTime": "2023-05-15T10:30:05.000Z",
  "duration": 5000,
  "environment": "production",
  "browser": "chrome",
  "createdAt": "2023-05-15T10:30:05.000Z"
}

// testStepResults koleksiyonu
{
  "id": "step-result-1",
  "testResultId": "result-1",
  "testStepId": "step-1",
  "order": 1,
  "description": "Navigate to example.com",
  "expectedResult": "Page loads successfully",
  "actualResult": "Page loaded successfully",
  "status": "passed",
  "duration": 1200,
  "startTime": "2023-05-15T10:30:00.000Z",
  "endTime": "2023-05-15T10:30:01.200Z",
  "createdAt": "2023-05-15T10:30:01.200Z"
}
```

Bu yapı, test geçmişini detaylı bir şekilde takip etmeyi sağlar. Her test çalıştırması için hangi test case'lerin çalıştırıldığı, her test case için hangi adımların çalıştırıldığı ve her adımın sonucu gibi bilgiler saklanır.

### Mock Data Yapısı ve MongoDB Entegrasyonu

Geliştirme sürecinde, API henüz hazır olmadığında veya veritabanı verilerine erişim olmadığında mock data kullanılır. Bu projede, test geçmişi ve test adımları için mock data kullanılmıştır.

#### Mock Data Örnekleri

1. **Test History Mock Data**:
```typescript
// src/mocks/testHistoryMock.ts
export const testHistoryMock: TestResult[] = [
  {
    id: 'result-1',
    testCaseId: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
    testRunId: 'run-1',
    status: 'passed',
    duration: 5200,
    createdAt: '2023-05-15T10:30:00.000Z',
    environment: 'production',
    browser: 'chrome'
  },
  {
    id: 'result-2',
    testCaseId: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
    testRunId: 'run-2',
    status: 'failed',
    duration: 4800,
    errorMessage: 'Element not found: #login-button',
    createdAt: '2023-05-10T14:45:00.000Z',
    environment: 'staging',
    browser: 'firefox'
  }
  // Diğer test sonuçları...
];
```

2. **Test Case Detail Mock Data**:
```typescript
// src/mocks/testCaseDetailMock.ts
export const testCaseDetailMock: TestCase = {
  id: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
  title: 'Test Case 1',
  description: 'Description for Test Case 1',
  status: 'active',
  priority: 'medium',
  createdBy: 'John Doe',
  createdAt: '2023-04-28T01:03:00.000Z',
  updatedAt: '2023-04-28T01:03:00.000Z',
  tags: ['login', 'authentication', 'tag-0'],
  projectId: 'project-1',
  steps: [
    {
      id: 'step-1',
      order: 1,
      action: 'navigate',
      target: 'https://example.com',
      description: 'Navigate to example.com',
      expectedResult: 'Page loads successfully',
      type: 'automated'
    },
    {
      id: 'step-2',
      order: 2,
      action: 'click',
      target: '#login-button',
      description: 'Click on login button',
      expectedResult: 'Login form appears',
      type: 'automated'
    }
    // Diğer test adımları...
  ]
};
```

#### MongoDB'ye Veri Ekleme

Mock data'yı MongoDB'ye eklemek için bir script oluşturulmuştur. Bu script, test geçmişi verilerini oluşturur ve MongoDB'ye ekler:

```javascript
// server/scripts/createTestHistory.js
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

// MongoDB connection string
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';

// Database name
const DB_NAME = 'testautomationdb';

// Test case ID
const TEST_CASE_ID = 'a408acf5-72f2-43d8-8d73-7f8c203c30b0';

// Generate random test results for a test case
async function createTestHistory() {
  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Check if test case exists
    const testCase = await db.collection('testCases').findOne({ id: TEST_CASE_ID });
    if (!testCase) {
      console.error(`Test case with ID ${TEST_CASE_ID} not found.`);
      return;
    }

    console.log(`Creating test history for test case: ${testCase.title}`);

    // Generate test runs
    const testRuns = [];
    for (let i = 0; i < 5; i++) {
      const testRunId = uuidv4();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (i * 5)); // Each run 5 days apart

      const testRun = {
        id: testRunId,
        name: `Test Run ${i + 1}`,
        description: `Automated test run for ${testCase.title}`,
        status: getRandomStatus(),
        projectId: testCase.projectId,
        testCaseIds: [TEST_CASE_ID],
        environment: getRandomEnvironment(),
        browsers: [getRandomBrowser()],
        startTime: startDate,
        endTime: new Date(startDate.getTime() + getRandomDuration()),
        createdBy: 'admin',
        createdAt: startDate,
        updatedAt: startDate
      };

      testRuns.push(testRun);
    }

    // Insert test runs
    if (testRuns.length > 0) {
      await db.collection('testRuns').insertMany(testRuns);
      console.log(`Created ${testRuns.length} test runs`);
    }

    // Generate test results
    const testResults = [];
    for (const testRun of testRuns) {
      const status = getRandomResultStatus();
      const duration = getRandomDuration();
      const startTime = new Date(testRun.startTime);
      const endTime = new Date(startTime.getTime() + duration);

      const testResult = {
        id: uuidv4(),
        testRunId: testRun.id,
        testCaseId: TEST_CASE_ID,
        status: status,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        environment: testRun.environment,
        browser: testRun.browsers[0],
        errorMessage: status === 'failed' ? getRandomErrorMessage() : null,
        createdAt: startTime
      };

      testResults.push(testResult);
    }

    // Insert test results
    if (testResults.length > 0) {
      await db.collection('testResults').insertMany(testResults);
      console.log(`Created ${testResults.length} test results`);
    }

    console.log('Test history created successfully');
  } catch (error) {
    console.error('Error creating test history:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Helper functions
function getRandomStatus() {
  const statuses = ['completed', 'failed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomResultStatus() {
  const statuses = ['passed', 'failed'];
  const weights = [0.7, 0.3]; // 70% passed, 30% failed

  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return statuses[i];
    }
  }

  return statuses[0];
}

function getRandomEnvironment() {
  const environments = ['development', 'staging', 'production'];
  return environments[Math.floor(Math.random() * environments.length)];
}

function getRandomBrowser() {
  const browsers = ['chrome', 'firefox', 'safari', 'edge'];
  return browsers[Math.floor(Math.random() * browsers.length)];
}

function getRandomDuration() {
  // Random duration between 3000ms and 10000ms
  return Math.floor(Math.random() * 7000) + 3000;
}

function getRandomErrorMessage() {
  const errors = [
    'Element not found: #login-button',
    'Timeout waiting for page load',
    'Assertion failed: expected "Welcome" but got "Login"',
    'Network error: connection refused',
    'JavaScript error: Cannot read property "value" of null'
  ];

  return errors[Math.floor(Math.random() * errors.length)];
}

// Run the script
createTestHistory();
```

Bu script, package.json dosyasına eklenen bir komut ile çalıştırılabilir:

```json
"scripts": {
  "create-test-history": "node server/scripts/createTestHistory.js"
}
```

#### API Entegrasyonu

Mock data'dan gerçek veritabanı verilerine geçiş için API güncellenmiştir:

1. **Test Adımlarını Çekmek İçin**:
```javascript
// server/index.js
app.get('/api/testCases/:id/steps', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const id = req.params.id;

    // Get test steps for this test case from MongoDB
    let testSteps = await db.collection('testSteps').find({ testCaseId: id }).sort({ order: 1 }).toArray();

    // If no data, try lowercase collection
    if (!testSteps || testSteps.length === 0) {
      testSteps = await db.collection('TestSteps').find({ testCaseId: id }).sort({ order: 1 }).toArray();
    }

    // Return empty array if nothing found
    if (!testSteps || testSteps.length === 0) {
      return res.json([]);
    }

    res.json(testSteps);
  } catch (error) {
    console.error('Error getting test steps:', error);
    res.status(500).json({ error: error.message });
  }
});
```

2. **Test Geçmişini Çekmek İçin**:
```javascript
// server/index.js
app.get('/api/testCases/:id/history', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const id = req.params.id;

    // Get test results for this test case from MongoDB
    let testResults = await db.collection('testResults').find({ testCaseId: id }).sort({ createdAt: -1 }).toArray();

    // If no data, try lowercase collection
    if (!testResults || testResults.length === 0) {
      testResults = await db.collection('TestResults').find({ testCaseId: id }).sort({ createdAt: -1 }).toArray();
    }

    // Return empty array if nothing found
    if (!testResults || testResults.length === 0) {
      return res.json([]);
    }

    res.json(testResults);
  } catch (error) {
    console.error('Error getting test history:', error);
    res.status(500).json({ error: error.message });
  }
});
```

3. **Test Case Detaylarını Çekmek İçin**:
```javascript
// server/index.js
app.get('/api/testCases/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const id = req.params.id;

    // Get test case from MongoDB
    const testCase = await db.collection('testCases').findOne({ id: id });

    // If no data, try with _id
    if (!testCase) {
      const testCaseById = await db.collection('testCases').findOne({ _id: id });
      if (testCaseById) {
        return res.json(testCaseById);
      }

      // Try lowercase collection
      const lowerCaseTestCase = await db.collection('TestCases').findOne({ id: id });
      if (lowerCaseTestCase) {
        return res.json(lowerCaseTestCase);
      }

      // Return 404 if not found
      return res.status(404).json({ error: `Test case with ID ${id} not found.` });
    }

    // Get test steps for this test case
    const testSteps = await db.collection('testSteps').find({ testCaseId: id }).sort({ order: 1 }).toArray();

    // Add test steps to test case
    testCase.steps = testSteps;

    res.json(testCase);
  } catch (error) {
    console.error('Error getting test case by ID:', error);
    res.status(500).json({ error: error.message });
  }
});
```

Bu API güncellemeleri, mock data'dan gerçek veritabanı verilerine geçişi sağlar.
