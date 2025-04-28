import { MongoClient, Db } from 'mongodb';

// MongoDB bağlantı bilgileri
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';
const DB_NAME = 'testautomationdb';

// MongoDB istemci örneği
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * MongoDB'ye bağlanır
 */
export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('MongoDB bağlantısı başarılı');
    
    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    throw error;
  }
}

/**
 * MongoDB veritabanı örneğini döndürür
 */
export async function getDb(): Promise<Db> {
  if (!db) {
    return connectToMongoDB();
  }
  return db;
}

/**
 * MongoDB bağlantısını kapatır
 */
export async function closeMongoDBConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB bağlantısı kapatıldı');
  }
}

export default {
  connectToMongoDB,
  getDb,
  closeMongoDBConnection
};
