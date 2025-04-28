import { MongoClient } from 'mongodb';

// MongoDB connection string
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';

// Database name
const DB_NAME = 'testautomationdb';

// Clean MongoDB database by dropping all collections
async function cleanDatabase() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Get list of all collections
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('Database is already empty. No collections to drop.');
      return;
    }
    
    // Drop each collection
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Dropped collection: ${collection.name}`);
    }
    
    console.log('Database cleaned successfully. All collections have been dropped.');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the script
cleanDatabase()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
