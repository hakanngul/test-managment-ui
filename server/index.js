import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection string
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';

// Database name
const DB_NAME = 'testautomationdb';

// MongoDB client instance
let client = null;
let db = null;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
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

// Generate sample test runs
function generateSampleTestRuns() {
  // Son 7 günü kapsayan tarihler oluştur
  const getLast7Days = () => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });
  };

  const last7Days = getLast7Days();

  // Test sonuçları için statüsler
  const statuses = ['passed', 'failed', 'pending', 'blocked'];

  // Rastgele test sonuçları oluştur
  const generateTestResults = (count, date) => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const statusIndex = Math.floor(Math.random() * 100);
      let status;

      // Dağılım: %60 passed, %20 failed, %10 pending, %10 blocked
      if (statusIndex < 60) {
        status = 'passed';
      } else if (statusIndex < 80) {
        status = 'failed';
      } else if (statusIndex < 90) {
        status = 'pending';
      } else {
        status = 'blocked';
      }

      results.push({
        id: `result-${date.getTime()}-${i}`,
        testCaseId: `tc-${Math.floor(Math.random() * 1000)}`,
        status,
        duration: Math.floor(Math.random() * 120) + 10, // 10-130 saniye arası
        errorMessage: status === 'failed' ? 'Test assertion failed' : null,
        screenshot: status === 'failed' ? 'screenshot.png' : null,
        logs: 'Test execution logs...',
        startTime: new Date(date.getTime() + Math.floor(Math.random() * 3600000)).toISOString(),
        endTime: new Date(date.getTime() + Math.floor(Math.random() * 3600000) + 120000).toISOString(),
      });
    }
    return results;
  };

  // Test runs oluştur
  return last7Days.flatMap((day, index) => {
    // Her gün için 1-3 test run oluştur
    const runsPerDay = Math.floor(Math.random() * 3) + 1;

    return Array.from({ length: runsPerDay }).map((_, runIndex) => {
      const testCount = Math.floor(Math.random() * 10) + 5; // 5-15 test arası
      const startTime = new Date(day.getTime() + runIndex * 3600000);
      const endTime = new Date(startTime.getTime() + (testCount * 60 * 1000) + Math.floor(Math.random() * 3600000));

      return {
        id: `run-${day.getTime()}-${runIndex}`,
        name: `Daily Test Run ${index + 1}-${runIndex + 1}`,
        description: `Automated test run for day ${index + 1}`,
        status: 'completed',
        environment: ['production', 'staging', 'development'][Math.floor(Math.random() * 3)],
        browser: ['chrome', 'firefox', 'safari'][Math.floor(Math.random() * 3)],
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: (endTime.getTime() - startTime.getTime()) / 1000, // saniye cinsinden
        testSuiteId: `suite-${Math.floor(Math.random() * 5) + 1}`,
        triggeredBy: 'admin',
        results: generateTestResults(testCount, day),
        tags: ['automated', 'daily'],
        createdAt: startTime.toISOString(),
        updatedAt: endTime.toISOString(),
      };
    });
  });
}

// Generate sample test results
function generateSampleTestResults(testRuns) {
  // Tüm test sonuçlarını topla
  return testRuns.flatMap(run => {
    return run.results.map(result => {
      return {
        ...result,
        testRunId: run.id,
        environment: run.environment,
        browser: run.browser,
      };
    });
  });
}

// Initialize MongoDB with data from json-server if collections are empty
async function initMongoDB() {
  try {
    const db = await connectToMongoDB();

    // Check if collections exist
    const collections = await db.listCollections().toArray();
    if (collections.length > 0) {
      console.log('MongoDB already initialized');
      return;
    }

    console.log('Initializing MongoDB with data from json-server');

    // Create sample test runs and results
    const testRuns = generateSampleTestRuns();
    const testResults = generateSampleTestResults(testRuns);

    // Read the JSON file
    const jsonFilePath = path.join(__dirname, '../data/db.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Insert data into MongoDB collections
    for (const [key, value] of Object.entries(jsonData)) {
      if (Array.isArray(value)) {
        // Check if it's an array of primitive values (strings, numbers)
        if (value.length > 0 && (typeof value[0] === 'string' || typeof value[0] === 'number')) {
          // Convert primitive array to objects with _id
          const documents = value.map((item, index) => ({
            _id: `${key}-${index}`,
            value: item
          }));
          await db.collection(key).insertMany(documents);
          console.log(`Inserted ${documents.length} documents into collection: ${key}`);
        } else if (value.length > 0 && typeof value[0] === 'object') {
          // For arrays of objects, make sure each has an _id
          const documents = value.map((item, index) => {
            if (!item._id && !item.id) {
              return { ...item, _id: `${key}-${index}` };
            } else if (item.id && !item._id) {
              return { ...item, _id: item.id };
            }
            return item;
          });
          await db.collection(key).insertMany(documents);
          console.log(`Inserted ${documents.length} documents into collection: ${key}`);
        } else {
          // Empty array or other cases
          console.log(`Skipping empty array for collection: ${key}`);
        }
      } else {
        // For single objects
        if (!value._id) {
          value._id = key;
        }
        await db.collection(key).insertOne(value);
        console.log(`Inserted 1 document into collection: ${key}`);
      }
    }

    // Insert test runs and results
    if (testRuns && testRuns.length > 0) {
      await db.collection('testRuns').insertMany(testRuns);
      console.log(`Inserted ${testRuns.length} documents into testRuns`);
    }

    if (testResults && testResults.length > 0) {
      await db.collection('testResults').insertMany(testResults);
      console.log(`Inserted ${testResults.length} documents into testResults`);
    }

    console.log('MongoDB initialization completed successfully');
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
  }
}

// Special endpoint for executionTimeData
app.get('/api/executionTimeData', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get test results from MongoDB
    const testResults = await db.collection('TestResults').find({}).toArray();

    // If no test results, try to get from lowercase collection name
    if (!testResults || testResults.length === 0) {
      const lowerCaseResults = await db.collection('testResults').find({}).toArray();
      if (lowerCaseResults && lowerCaseResults.length > 0) {
        testResults.push(...lowerCaseResults);
      }
    }

    if (!testResults || testResults.length === 0) {
      return res.json(Array(7).fill(0));
    }

    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    // Calculate average duration for each day
    const executionTimeData = last7Days.map(day => {
      const dayResults = testResults.filter(result => {
        const resultDate = new Date(result.startTime || result.createdAt);
        resultDate.setHours(0, 0, 0, 0);
        return resultDate.getTime() === day;
      });

      if (dayResults.length === 0) return 0;

      const totalDuration = dayResults.reduce((sum, result) => sum + (result.duration || 0), 0);
      return Math.round((totalDuration / dayResults.length) / 1000); // Convert to seconds
    });

    res.json(executionTimeData);
  } catch (error) {
    console.error('Error getting execution time data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for availableActions
app.get('/api/availableActions', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get available actions from MongoDB
    const data = await db.collection('availableActions').find({}).toArray();

    if (data && data.length > 0) {
      // If data is stored as objects with 'value' property
      if ('value' in data[0]) {
        return res.json(data.map(item => item.value));
      }
      return res.json(data);
    }

    // Return default actions if not found in database
    return res.json([
      "click", "doubleClick", "rightClick", "type", "clear", "select", "check", "uncheck",
      "navigate", "back", "forward", "refresh",
      "wait", "waitForElement", "waitForNavigation",
      "assertText", "assertElementPresent", "assertElementNotPresent", "assertTitle", "assertUrl", "assertValue", "assertChecked", "assertNotChecked",
      "hover", "dragAndDrop", "uploadFile", "pressKey", "focus", "blur", "scrollTo", "executeScript",
      "custom", "screenshot", "comment"
    ]);
  } catch (error) {
    console.error('Error getting available actions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for Server Agent data
app.get('/api/systemResources', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get system resources from MongoDB
    const systemResources = await db.collection('SystemResources').findOne({});

    // If no data, try lowercase collection
    if (!systemResources) {
      const lowerCaseResources = await db.collection('systemResources').findOne({});
      if (lowerCaseResources) {
        return res.json(lowerCaseResources);
      }

      // Return default data if nothing found
      return res.json({
        lastUpdated: new Date().toLocaleString('tr-TR'),
        cpuUsage: 0,
        memoryUsage: 0,
        serverId: "server-001"
      });
    }

    res.json(systemResources);
  } catch (error) {
    console.error('Error getting system resources data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for Agent Status
app.get('/api/agentStatus', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get agent status from MongoDB
    const serverAgent = await db.collection('ServerAgent').findOne({});

    // If no data, try lowercase collection
    if (!serverAgent || !serverAgent.agentStatus) {
      const lowerCaseAgent = await db.collection('serverAgent').findOne({});
      if (lowerCaseAgent && lowerCaseAgent.agentStatus) {
        return res.json(lowerCaseAgent.agentStatus);
      }

      // Return default data if nothing found
      return res.json({
        total: 0,
        available: 0,
        busy: 0,
        limit: 1
      });
    }

    res.json(serverAgent.agentStatus);
  } catch (error) {
    console.error('Error getting agent status data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for Queue Status
app.get('/api/queueStatus', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get queue status from MongoDB
    const serverAgent = await db.collection('ServerAgent').findOne({});

    // If no data, try lowercase collection
    if (!serverAgent || !serverAgent.queueStatus) {
      const lowerCaseAgent = await db.collection('serverAgent').findOne({});
      if (lowerCaseAgent && lowerCaseAgent.queueStatus) {
        return res.json(lowerCaseAgent.queueStatus);
      }

      // Return default data if nothing found
      return res.json({
        queued: 0,
        processing: 0,
        total: 0
      });
    }

    res.json(serverAgent.queueStatus);
  } catch (error) {
    console.error('Error getting queue status data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for Active Agents
app.get('/api/activeAgents', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get active agents from MongoDB
    const serverAgent = await db.collection('ServerAgent').findOne({});

    // If no data, try lowercase collection
    if (!serverAgent || !serverAgent.activeAgents) {
      const lowerCaseAgent = await db.collection('serverAgent').findOne({});
      if (lowerCaseAgent && lowerCaseAgent.activeAgents) {
        return res.json(lowerCaseAgent.activeAgents);
      }

      // Return empty array if nothing found
      return res.json([]);
    }

    res.json(serverAgent.activeAgents);
  } catch (error) {
    console.error('Error getting active agents data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for Queued Requests
app.get('/api/queuedRequests', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get queued requests from MongoDB - first try queuedRequestsData collection
    const queuedRequestsData = await db.collection('queuedRequestsData').find({}).toArray();

    if (queuedRequestsData && queuedRequestsData.length > 0) {
      console.log(`Found ${queuedRequestsData.length} queued requests in queuedRequestsData collection`);
      return res.json(queuedRequestsData);
    }

    // If no data in queuedRequestsData, try serverAgent collection
    const serverAgent = await db.collection('ServerAgent').findOne({});

    // If no data, try lowercase collection
    if (!serverAgent || !serverAgent.queuedRequests) {
      const lowerCaseAgent = await db.collection('serverAgent').findOne({});
      if (lowerCaseAgent && lowerCaseAgent.queuedRequests) {
        return res.json(lowerCaseAgent.queuedRequests);
      }

      // Return empty array if nothing found
      return res.json([]);
    }

    res.json(serverAgent.queuedRequests);
  } catch (error) {
    console.error('Error getting queued requests data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for Processed Requests
app.get('/api/processedRequests', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get processed requests from MongoDB - first try processedRequestsData collection
    const processedRequestsData = await db.collection('processedRequestsData').find({}).toArray();

    if (processedRequestsData && processedRequestsData.length > 0) {
      console.log(`Found ${processedRequestsData.length} processed requests in processedRequestsData collection`);
      return res.json(processedRequestsData);
    }

    // If no data in processedRequestsData, try serverAgent collection
    const serverAgent = await db.collection('ServerAgent').findOne({});

    // If no data, try lowercase collection
    if (!serverAgent || !serverAgent.processedRequests) {
      const lowerCaseAgent = await db.collection('serverAgent').findOne({});
      if (lowerCaseAgent && lowerCaseAgent.processedRequests) {
        return res.json(lowerCaseAgent.processedRequests);
      }

      // Return empty array if nothing found
      return res.json([]);
    }

    res.json(serverAgent.processedRequests);
  } catch (error) {
    console.error('Error getting processed requests data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for testCases/:id - PUT
app.put('/api/testCases/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const id = req.params.id;
    const testCaseData = req.body;

    // Update updatedAt and updatedBy fields
    testCaseData.updatedAt = new Date().toISOString();
    testCaseData.updatedBy = testCaseData.updatedBy || 'Admin';

    // Update test case in MongoDB
    const result = await db.collection('testCases').updateOne(
      { id: id },
      { $set: testCaseData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Test case with ID ${id} not found.` });
    }

    res.json(testCaseData);
  } catch (error) {
    console.error('Error updating test case:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for testCases/:id - DELETE
app.delete('/api/testCases/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const id = req.params.id;

    // Delete test case from MongoDB
    const result = await db.collection('testCases').deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: `Test case with ID ${id} not found.` });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting test case:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for testCases/:id - GET
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

    res.json(testCase);
  } catch (error) {
    console.error('Error getting test case by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for testCases - GET
app.get('/api/testCases', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get test cases from MongoDB
    const testCases = await db.collection('testCases').find({}).toArray();

    // If no data, try lowercase collection
    if (!testCases || testCases.length === 0) {
      const lowerCaseTestCases = await db.collection('TestCases').find({}).toArray();
      if (lowerCaseTestCases && lowerCaseTestCases.length > 0) {
        return res.json(lowerCaseTestCases);
      }

      // Return empty array if nothing found
      return res.json([]);
    }

    res.json(testCases);
  } catch (error) {
    console.error('Error getting test cases:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for testCases - POST
app.post('/api/testCases', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const testCase = req.body;

    // Generate an ID if not provided
    if (!testCase.id) {
      testCase.id = `tc-${Date.now()}`;
    }

    // Add timestamps if not provided
    if (!testCase.createdAt) {
      testCase.createdAt = new Date().toISOString();
    }
    if (!testCase.updatedAt) {
      testCase.updatedAt = new Date().toISOString();
    }

    // Add MongoDB _id field
    testCase._id = testCase.id;

    // Insert into MongoDB
    const result = await db.collection('testCases').insertOne(testCase);

    // Return the created test case
    res.status(201).json({ ...testCase, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating test case:', error);
    res.status(500).json({ error: error.message });
  }
});

// Special endpoint for testCountsByDay
app.get('/api/testCountsByDay', async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Get test runs from MongoDB
    const testRuns = await db.collection('TestRuns').find({}).toArray();

    // If no test runs, try to get from lowercase collection name
    if (!testRuns || testRuns.length === 0) {
      const lowerCaseRuns = await db.collection('testRuns').find({}).toArray();
      if (lowerCaseRuns && lowerCaseRuns.length > 0) {
        testRuns.push(...lowerCaseRuns);
      }
    }

    if (!testRuns || testRuns.length === 0) {
      return res.json({
        passed: Array(7).fill(0),
        failed: Array(7).fill(0),
        pending: Array(7).fill(0),
        blocked: Array(7).fill(0)
      });
    }

    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    // Initialize counts
    const counts = {
      passed: Array(7).fill(0),
      failed: Array(7).fill(0),
      pending: Array(7).fill(0),
      blocked: Array(7).fill(0)
    };

    // Count tests by status for each day
    testRuns.forEach(run => {
      const runDate = new Date(run.startTime || run.createdAt);
      runDate.setHours(0, 0, 0, 0);
      const dayIndex = last7Days.findIndex(day => day === runDate.getTime());

      if (dayIndex !== -1 && run.results) {
        // Count by status
        run.results.forEach(result => {
          const status = result.status.toLowerCase();
          if (status === 'passed' || status === 'pass') {
            counts.passed[dayIndex]++;
          } else if (status === 'failed' || status === 'fail') {
            counts.failed[dayIndex]++;
          } else if (status === 'pending') {
            counts.pending[dayIndex]++;
          } else if (status === 'blocked') {
            counts.blocked[dayIndex]++;
          }
        });
      }
    });

    res.json(counts);
  } catch (error) {
    console.error('Error getting test counts by day:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generic endpoint for all collections
app.get('/api/:collection', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = req.params.collection;
    const query = req.query;

    // Remove pagination parameters from the query
    const { _page, _limit, ...filters } = query;

    // Get data from MongoDB
    let result = [];

    // Try with original collection name
    const originalResult = await db.collection(collection).find(filters).toArray();
    if (originalResult && originalResult.length > 0) {
      result = originalResult;
    } else {
      // Try with capitalized collection name
      const capitalizedCollection = collection.charAt(0).toUpperCase() + collection.slice(1);
      const capitalizedResult = await db.collection(capitalizedCollection).find(filters).toArray();
      if (capitalizedResult && capitalizedResult.length > 0) {
        result = capitalizedResult;
      }
    }

    // Handle special collections with primitive values
    if (result.length > 0 && 'value' in result[0]) {
      // For collections that store primitive values (strings, numbers)
      result = result.map(item => item.value);
    } else {
      // Map MongoDB _id to id for compatibility with existing code
      result = result.map(item => {
        if (item._id && !item.id) {
          return { ...item, id: item._id.toString() };
        }
        return item;
      });
    }

    // Apply pagination if _page and _limit are provided
    if (_page && _limit) {
      const page = parseInt(_page);
      const limit = parseInt(_limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      result = result.slice(startIndex, endIndex);
    }

    res.json(result);
  } catch (error) {
    console.error(`Error getting data from ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single document by ID
app.get('/api/:collection/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = req.params.collection;
    const id = req.params.id;

    // Get data from MongoDB
    let result = null;

    // Try with original collection name
    result = await db.collection(collection).findOne({ $or: [{ id }, { _id: id }] });

    // If not found, try with capitalized collection name
    if (!result) {
      const capitalizedCollection = collection.charAt(0).toUpperCase() + collection.slice(1);
      result = await db.collection(capitalizedCollection).findOne({ $or: [{ id }, { _id: id }] });
    }

    if (!result) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Map MongoDB _id to id for compatibility with existing code
    if (result._id && !result.id) {
      result.id = result._id.toString();
    }

    res.json(result);
  } catch (error) {
    console.error(`Error getting document from ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new document
app.post('/api/:collection', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = req.params.collection;
    const data = req.body;

    // Ensure data has an id field for MongoDB
    if (data.id && !data._id) {
      data._id = data.id;
    }

    // Insert data into MongoDB
    const result = await db.collection(collection).insertOne(data);

    if (!result.acknowledged) {
      return res.status(500).json({ error: 'Failed to insert document' });
    }

    // Return the inserted document
    res.status(201).json({
      ...data,
      _id: result.insertedId,
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error(`Error creating document in ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Update a document
app.put('/api/:collection/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = req.params.collection;
    const id = req.params.id;
    const data = req.body;

    // Update data in MongoDB
    const result = await db.collection(collection).updateOne(
      { $or: [{ id }, { _id: id }] },
      { $set: data }
    );

    if (!result.acknowledged) {
      return res.status(500).json({ error: 'Failed to update document' });
    }

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Return the updated document
    res.json({
      ...data,
      id
    });
  } catch (error) {
    console.error(`Error updating document in ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Patch a document
app.patch('/api/:collection/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = req.params.collection;
    const id = req.params.id;
    const data = req.body;

    // Get the existing document
    const existingDoc = await db.collection(collection).findOne({ $or: [{ id }, { _id: id }] });

    if (!existingDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Merge the existing document with the new data
    const updatedDoc = { ...existingDoc, ...data };

    // Update data in MongoDB
    const result = await db.collection(collection).updateOne(
      { $or: [{ id }, { _id: id }] },
      { $set: data }
    );

    if (!result.acknowledged) {
      return res.status(500).json({ error: 'Failed to update document' });
    }

    // Return the updated document
    res.json({
      ...updatedDoc,
      id: existingDoc.id || existingDoc._id.toString()
    });
  } catch (error) {
    console.error(`Error patching document in ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a document
app.delete('/api/:collection/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = req.params.collection;
    const id = req.params.id;

    // Delete data from MongoDB
    const result = await db.collection(collection).deleteOne({ $or: [{ id }, { _id: id }] });

    if (!result.acknowledged) {
      return res.status(500).json({ error: 'Failed to delete document' });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Return success
    res.json({ success: true });
  } catch (error) {
    console.error(`Error deleting document from ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);

  // Initialize MongoDB
  await initMongoDB();
});

// Handle server shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
