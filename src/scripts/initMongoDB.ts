import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COLLECTIONS } from '../models';

// MongoDB connection string
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';

// Database name
const DB_NAME = 'testautomationdb';

// Path to the JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_FILE_PATH = path.join(__dirname, '../../data/db.json');

/**
 * Initialize MongoDB with data from json-server
 */
async function initMongoDB() {
  let client: MongoClient | null = null;

  try {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE_PATH, 'utf8'));

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Drop existing collections
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Dropped collection: ${collection.name}`);
    }

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

    console.log('MongoDB initialization completed successfully');
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the initialization
initMongoDB();
