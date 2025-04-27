import { MongoClient } from 'mongodb';

// MongoDB connection string
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';

// Database name
const DB_NAME = 'testautomationdb';

// Reports endpoints to check
const reportsEndpoints = [
  'testExecutionData',
  'testDurationData',
  'testResults',
  'detailedTestResults',
  'statusDistributionData',
  'durationByStatusData',
  'coverageData',
  'coverageTrendData',
  'coverageByTypeData',
  'uncoveredLinesData',
  'performanceMetrics',
  'loadTimeData',
  'responseTimeData',
  'resourceUsageData',
  'browserComparisonData'
];

async function checkReportsData() {
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('Available collections:', collectionNames);
    
    // Check if reports endpoints exist as collections
    console.log('\nChecking Reports endpoints:');
    for (const endpoint of reportsEndpoints) {
      if (collectionNames.includes(endpoint)) {
        const count = await db.collection(endpoint).countDocuments();
        console.log(`✅ ${endpoint}: Collection exists with ${count} document(s)`);
      } else {
        console.log(`❌ ${endpoint}: Collection does not exist`);
      }
    }
  } catch (error) {
    console.error('Error checking reports data:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the check
checkReportsData();
