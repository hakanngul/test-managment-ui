import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

// MongoDB connection string
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';

// Database name
const DB_NAME = 'testautomationdb';

// Reset MongoDB database by dropping all collections and reinitializing with schema-compliant data
async function resetDatabase() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Step 1: Clean database
    console.log('Step 1: Cleaning database...');
    
    // Get list of all collections
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('Database is already empty. No collections to drop.');
    } else {
      // Drop each collection
      for (const collection of collections) {
        await db.collection(collection.name).drop();
        console.log(`Dropped collection: ${collection.name}`);
      }
      
      console.log('Database cleaned successfully. All collections have been dropped.');
    }
    
    // Step 2: Initialize database with schema-compliant data
    console.log('Step 2: Initializing database with schema-compliant data...');
    
    // Create users
    const users = [
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User'
      },
      {
        id: uuidv4(),
        name: 'Test Manager',
        email: 'manager@example.com',
        role: 'manager',
        avatar: 'https://ui-avatars.com/api/?name=Test+Manager'
      },
      {
        id: uuidv4(),
        name: 'Test Engineer',
        email: 'tester@example.com',
        role: 'tester',
        avatar: 'https://ui-avatars.com/api/?name=Test+Engineer'
      }
    ];
    
    await db.collection('users').insertMany(users);
    console.log(`Created ${users.length} users`);
    
    // Create projects
    const projects = [
      {
        id: uuidv4(),
        name: 'E-Commerce Website',
        description: 'Test automation for the e-commerce website',
        status: 'active',
        priority: 'high',
        members: [users[0].id, users[1].id, users[2].id],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mobile App',
        description: 'Test automation for the mobile app',
        status: 'active',
        priority: 'medium',
        members: [users[1].id, users[2].id],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('projects').insertMany(projects);
    console.log(`Created ${projects.length} projects`);
    
    // Create test suites
    const testSuites = [
      {
        id: uuidv4(),
        name: 'Login Tests',
        description: 'Test suite for login functionality',
        status: 'active',
        priority: 'high',
        progress: 75,
        testCases: [],  // Will be populated later
        projectId: projects[0].id,
        tags: ['login', 'authentication', 'security'],
        executionMode: 'sequential',
        browsers: ['chrome', 'firefox'],
        createdBy: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Checkout Tests',
        description: 'Test suite for checkout functionality',
        status: 'active',
        priority: 'high',
        progress: 50,
        testCases: [],  // Will be populated later
        projectId: projects[0].id,
        tags: ['checkout', 'payment', 'e-commerce'],
        executionMode: 'parallel',
        browsers: ['chrome', 'firefox', 'safari'],
        createdBy: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('testSuites').insertMany(testSuites);
    console.log(`Created ${testSuites.length} test suites`);
    
    // Create test cases
    const testCases = [
      {
        id: uuidv4(),
        title: 'Valid Login',
        description: 'Test case for valid login credentials',
        status: 'active',
        priority: 'high',
        steps: [],  // Will be populated later
        tags: ['login', 'authentication', 'positive'],
        projectId: projects[0].id,
        browsers: ['chrome', 'firefox', 'safari'],
        headless: false,
        browserPool: true,
        createdBy: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        executionStats: {
          totalRuns: 10,
          passCount: 9,
          failCount: 1,
          passRate: 90
        }
      },
      {
        id: uuidv4(),
        title: 'Invalid Login',
        description: 'Test case for invalid login credentials',
        status: 'active',
        priority: 'medium',
        steps: [],  // Will be populated later
        tags: ['login', 'authentication', 'negative'],
        projectId: projects[0].id,
        browsers: ['chrome', 'firefox'],
        headless: true,
        browserPool: false,
        createdBy: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        executionStats: {
          totalRuns: 8,
          passCount: 8,
          failCount: 0,
          passRate: 100
        }
      },
      {
        id: uuidv4(),
        title: 'Checkout with Credit Card',
        description: 'Test case for checkout with credit card',
        status: 'active',
        priority: 'high',
        steps: [],  // Will be populated later
        tags: ['checkout', 'payment', 'credit-card'],
        projectId: projects[0].id,
        browsers: ['chrome'],
        headless: false,
        browserPool: false,
        createdBy: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        executionStats: {
          totalRuns: 5,
          passCount: 4,
          failCount: 1,
          passRate: 80
        }
      }
    ];
    
    await db.collection('testCases').insertMany(testCases);
    console.log(`Created ${testCases.length} test cases`);
    
    // Update test suites with test cases
    testSuites[0].testCases = [testCases[0].id, testCases[1].id];
    testSuites[1].testCases = [testCases[2].id];
    
    for (const testSuite of testSuites) {
      await db.collection('testSuites').updateOne(
        { id: testSuite.id },
        { $set: { testCases: testSuite.testCases } }
      );
    }
    
    console.log('Updated test suites with test cases');
    
    // Create test steps
    const testSteps = [
      // Steps for Valid Login
      {
        id: uuidv4(),
        order: 1,
        action: 'navigate',
        target: 'https://example.com/login',
        targetType: 'url',
        value: '',
        description: 'Navigate to login page',
        expectedResult: 'Login page is displayed',
        type: 'automated',
        testCaseId: testCases[0].id
      },
      {
        id: uuidv4(),
        order: 2,
        action: 'type',
        target: '#username',
        targetType: 'css',
        value: 'validuser',
        description: 'Enter valid username',
        expectedResult: 'Username is entered in the field',
        type: 'automated',
        testCaseId: testCases[0].id
      },
      {
        id: uuidv4(),
        order: 3,
        action: 'type',
        target: '#password',
        targetType: 'css',
        value: 'validpassword',
        description: 'Enter valid password',
        expectedResult: 'Password is entered in the field',
        type: 'automated',
        testCaseId: testCases[0].id
      },
      {
        id: uuidv4(),
        order: 4,
        action: 'click',
        target: '#login-button',
        targetType: 'css',
        value: '',
        description: 'Click login button',
        expectedResult: 'User is logged in and redirected to dashboard',
        type: 'automated',
        testCaseId: testCases[0].id
      },
      {
        id: uuidv4(),
        order: 5,
        action: 'assert',
        target: '.dashboard-title',
        targetType: 'css',
        value: 'Dashboard',
        description: 'Verify dashboard title',
        expectedResult: 'Dashboard title is displayed',
        type: 'automated',
        testCaseId: testCases[0].id
      },
      
      // Steps for Invalid Login
      {
        id: uuidv4(),
        order: 1,
        action: 'navigate',
        target: 'https://example.com/login',
        targetType: 'url',
        value: '',
        description: 'Navigate to login page',
        expectedResult: 'Login page is displayed',
        type: 'automated',
        testCaseId: testCases[1].id
      },
      {
        id: uuidv4(),
        order: 2,
        action: 'type',
        target: '#username',
        targetType: 'css',
        value: 'invaliduser',
        description: 'Enter invalid username',
        expectedResult: 'Username is entered in the field',
        type: 'automated',
        testCaseId: testCases[1].id
      },
      {
        id: uuidv4(),
        order: 3,
        action: 'type',
        target: '#password',
        targetType: 'css',
        value: 'invalidpassword',
        description: 'Enter invalid password',
        expectedResult: 'Password is entered in the field',
        type: 'automated',
        testCaseId: testCases[1].id
      },
      {
        id: uuidv4(),
        order: 4,
        action: 'click',
        target: '#login-button',
        targetType: 'css',
        value: '',
        description: 'Click login button',
        expectedResult: 'Error message is displayed',
        type: 'automated',
        testCaseId: testCases[1].id
      },
      {
        id: uuidv4(),
        order: 5,
        action: 'assert',
        target: '.error-message',
        targetType: 'css',
        value: 'Invalid username or password',
        description: 'Verify error message',
        expectedResult: 'Error message is displayed',
        type: 'automated',
        testCaseId: testCases[1].id
      },
      
      // Steps for Checkout with Credit Card
      {
        id: uuidv4(),
        order: 1,
        action: 'navigate',
        target: 'https://example.com/cart',
        targetType: 'url',
        value: '',
        description: 'Navigate to cart page',
        expectedResult: 'Cart page is displayed',
        type: 'automated',
        testCaseId: testCases[2].id
      },
      {
        id: uuidv4(),
        order: 2,
        action: 'click',
        target: '#checkout-button',
        targetType: 'css',
        value: '',
        description: 'Click checkout button',
        expectedResult: 'Checkout page is displayed',
        type: 'automated',
        testCaseId: testCases[2].id
      },
      {
        id: uuidv4(),
        order: 3,
        action: 'type',
        target: '#card-number',
        targetType: 'css',
        value: '4111111111111111',
        description: 'Enter credit card number',
        expectedResult: 'Credit card number is entered in the field',
        type: 'automated',
        testCaseId: testCases[2].id
      },
      {
        id: uuidv4(),
        order: 4,
        action: 'type',
        target: '#card-expiry',
        targetType: 'css',
        value: '12/25',
        description: 'Enter credit card expiry date',
        expectedResult: 'Expiry date is entered in the field',
        type: 'automated',
        testCaseId: testCases[2].id
      },
      {
        id: uuidv4(),
        order: 5,
        action: 'type',
        target: '#card-cvc',
        targetType: 'css',
        value: '123',
        description: 'Enter credit card CVC',
        expectedResult: 'CVC is entered in the field',
        type: 'automated',
        testCaseId: testCases[2].id
      },
      {
        id: uuidv4(),
        order: 6,
        action: 'click',
        target: '#pay-button',
        targetType: 'css',
        value: '',
        description: 'Click pay button',
        expectedResult: 'Payment is processed and confirmation page is displayed',
        type: 'automated',
        testCaseId: testCases[2].id
      },
      {
        id: uuidv4(),
        order: 7,
        action: 'assert',
        target: '.confirmation-message',
        targetType: 'css',
        value: 'Payment successful',
        description: 'Verify confirmation message',
        expectedResult: 'Confirmation message is displayed',
        type: 'automated',
        testCaseId: testCases[2].id
      }
    ];
    
    await db.collection('testSteps').insertMany(testSteps);
    console.log(`Created ${testSteps.length} test steps`);
    
    // Update test cases with test steps
    for (const testCase of testCases) {
      const steps = testSteps.filter(step => step.testCaseId === testCase.id).map(step => step.id);
      await db.collection('testCases').updateOne(
        { id: testCase.id },
        { $set: { steps } }
      );
    }
    
    console.log('Updated test cases with test steps');
    
    // Create test runs
    const testRuns = [];
    const now = new Date();
    
    for (let i = 0; i < 5; i++) {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - (i * 2)); // Each run 2 days apart
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + 10); // Each run takes 10 minutes
      
      const testRun = {
        id: uuidv4(),
        name: `Test Run ${i + 1}`,
        description: `Automated test run ${i + 1}`,
        status: i % 5 === 0 ? 'failed' : 'completed',
        priority: 'high',
        projectId: projects[0].id,
        testSuiteId: testSuites[0].id,
        testCaseIds: [testCases[0].id, testCases[1].id],
        environment: i % 3 === 0 ? 'production' : i % 3 === 1 ? 'staging' : 'development',
        browsers: ['chrome'],
        startTime: startDate,
        endTime: endDate,
        duration: endDate.getTime() - startDate.getTime(),
        results: [],  // Will be populated later
        createdBy: users[1].id,
        createdAt: startDate,
        updatedAt: endDate
      };
      
      testRuns.push(testRun);
    }
    
    await db.collection('testRuns').insertMany(testRuns);
    console.log(`Created ${testRuns.length} test runs`);
    
    // Create test results
    const testResults = [];
    
    for (const testRun of testRuns) {
      for (const testCaseId of testRun.testCaseIds) {
        const testCase = testCases.find(tc => tc.id === testCaseId);
        const status = Math.random() > 0.2 ? 'passed' : 'failed';
        const startTime = new Date(testRun.startTime);
        const duration = Math.floor(Math.random() * 5000) + 1000; // 1-6 seconds
        const endTime = new Date(startTime.getTime() + duration);
        
        const testResult = {
          id: uuidv4(),
          testRunId: testRun.id,
          testCaseId: testCaseId,
          testSuiteId: testRun.testSuiteId,
          status: status,
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          environment: testRun.environment,
          browser: testRun.browsers[0],
          errorMessage: status === 'failed' ? 'Element not found: #login-button' : null,
          steps: [],  // Will be populated later
          createdAt: startTime
        };
        
        testResults.push(testResult);
        testRun.results.push(testResult.id);
      }
    }
    
    await db.collection('testResults').insertMany(testResults);
    console.log(`Created ${testResults.length} test results`);
    
    // Update test runs with test results
    for (const testRun of testRuns) {
      await db.collection('testRuns').updateOne(
        { id: testRun.id },
        { $set: { results: testRun.results } }
      );
    }
    
    console.log('Updated test runs with test results');
    
    // Create test step results
    const testStepResults = [];
    
    for (const testResult of testResults) {
      const testCase = testCases.find(tc => tc.id === testResult.testCaseId);
      const steps = testSteps.filter(step => step.testCaseId === testCase.id);
      
      for (const step of steps) {
        const status = testResult.status === 'failed' && step.order === 4 ? 'failed' : 'passed';
        const startTime = new Date(testResult.startTime);
        startTime.setSeconds(startTime.getSeconds() + (step.order - 1) * 1);
        const duration = Math.floor(Math.random() * 1000) + 500; // 0.5-1.5 seconds
        const endTime = new Date(startTime.getTime() + duration);
        
        const testStepResult = {
          id: uuidv4(),
          testResultId: testResult.id,
          testStepId: step.id,
          order: step.order,
          description: step.description,
          expectedResult: step.expectedResult,
          actualResult: status === 'passed' ? step.expectedResult : 'Element not found',
          status: status,
          duration: duration,
          startTime: startTime,
          endTime: endTime,
          errorMessage: status === 'failed' ? 'Element not found: #login-button' : null,
          screenshot: status === 'failed' ? 'https://example.com/screenshots/error.png' : null,
          createdAt: startTime
        };
        
        testStepResults.push(testStepResult);
        testResult.steps.push(testStepResult.id);
      }
    }
    
    await db.collection('testStepResults').insertMany(testStepResults);
    console.log(`Created ${testStepResults.length} test step results`);
    
    // Update test results with test step results
    for (const testResult of testResults) {
      await db.collection('testResults').updateOne(
        { id: testResult.id },
        { $set: { steps: testResult.steps } }
      );
    }
    
    console.log('Updated test results with test step results');
    
    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the script
resetDatabase()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
