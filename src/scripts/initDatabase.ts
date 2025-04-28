import {
  connectToMongoDB,
  closeMongoDBConnection,
  COLLECTIONS
} from '../models/database';

// Not: Dummy veri oluşturma fonksiyonları kaldırıldı.
// Gelecekte dummy veri eklemek isterseniz, bu dosyanın önceki versiyonlarına bakabilirsiniz.

/**
 * MongoDB veritabanını model tabanlı koleksiyonlar ile başlatır (dummy veri olmadan)
 */
async function initDatabase() {
  try {
    // MongoDB'ye bağlan
    const db = await connectToMongoDB();

    // Mevcut koleksiyonları düşür
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Koleksiyon düşürüldü: ${collection.name}`);
    }

    // Model yapısına göre koleksiyonlar oluştur
    for (const [_key, value] of Object.entries(COLLECTIONS)) {
      await db.createCollection(value);
      console.log(`Koleksiyon oluşturuldu: ${value}`);
    }

    // Daha iyi performans için indeksler oluştur
    await db.collection(COLLECTIONS.TEST_CASES).createIndex({ status: 1 });
    await db.collection(COLLECTIONS.TEST_CASES).createIndex({ updatedAt: -1 });
    await db.collection(COLLECTIONS.TEST_RUNS).createIndex({ startTime: -1 });
    await db.collection(COLLECTIONS.TEST_RUNS).createIndex({ testCaseId: 1 });
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true });
    await db.collection(COLLECTIONS.PROJECTS).createIndex({ name: 1 });
    console.log('Daha iyi performans için indeksler oluşturuldu');

    console.log('MongoDB başlatma işlemi başarıyla tamamlandı (dummy veri olmadan)');
  } catch (error) {
    console.error('MongoDB başlatma hatası:', error);
  } finally {
    // MongoDB bağlantısını kapat
    await closeMongoDBConnection();
  }
}

// Başlatma işlemini çalıştır
initDatabase();
