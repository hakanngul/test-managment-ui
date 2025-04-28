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
createTestHistory()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
