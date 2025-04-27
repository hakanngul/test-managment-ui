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
app.use(cors());
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
    
    console.log('MongoDB initialization completed successfully');
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
  }
}

// Generic endpoint for all collections
app.get('/api/:collection', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = req.params.collection;
    const query = req.query;
    
    // Remove pagination parameters from the query
    const { _page, _limit, ...filters } = query;
    
    // Get data from MongoDB
    let result = await db.collection(collection).find(filters).toArray();
    
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
    const result = await db.collection(collection).findOne({ $or: [{ id }, { _id: id }] });
    
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
