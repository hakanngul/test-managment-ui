// clean-importData.js
import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

// __dirname ve __filename'i ES modüllerinde kullanabilmek için
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB bağlantı bilgileri
const uri = "mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin";
const client = new MongoClient(uri);

// Tarihleri ISO formatından Date nesnesine dönüştürme yardımcı fonksiyonu
function convertISOToDate(obj) {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'string') {
      // ISO tarih formatını kontrol et (2023-04-20T10:00:00Z gibi)
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(obj[key])) {
        obj[key] = new Date(obj[key]);
      }
    } else if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      convertISOToDate(obj[key]);
    } else if (obj[key] && Array.isArray(obj[key])) {
      obj[key].forEach(item => {
        if (item && typeof item === 'object') {
          convertISOToDate(item);
        }
      });
    }
  }
  return obj;
}

// ID referanslarını string'den ObjectId'ye dönüştürme
async function convertStringsToObjectIds(data, idMap) {
  if (!data) return;

  // Users verilerini ObjectId'ye dönüştürme
  if (data.users) {
    const saltRounds = 10;
    const promises = data.users.map(async (user) => {
      const objectId = new ObjectId();
      idMap.users[user.id] = objectId;
      
      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash(user.password || 'admin', saltRounds);
      
      return {
        _id: objectId,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        avatar: user.avatar,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    
    data.users = await Promise.all(promises);
  }

  // Projects verilerini ObjectId'ye dönüştürme
  if (data.projects) {
    data.projects = data.projects.map(project => {
      const objectId = new ObjectId();
      idMap.projects[project.id] = objectId;

      // members ID'lerini ObjectId'ye dönüştürme
      const members = project.members.map(memberId => idMap.users[memberId]);

      return {
        _id: objectId,
        name: project.name,
        description: project.description,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
        members: members
      };
    });
  }

  // TestEnvironments verilerini ekleyelim
  if (data.testEnvironments) {
    data.testEnvironmentDocs = data.testEnvironments.map(env => {
      return {
        _id: new ObjectId(),
        name: env,
        baseUrl: `https://${env.toLowerCase()}.example.com`,
        description: `${env} environment for testing`,
        isDefault: env === "Development",
        createdAt: new Date(),
        updatedAt: new Date(),
        variables: [
          {
            key: "API_URL",
            value: `https://${env.toLowerCase()}-api.example.com`,
            isSecret: false
          },
          {
            key: "API_KEY",
            value: `${env.toLowerCase()}_secret_key_${Math.floor(Math.random() * 10000)}`,
            isSecret: true
          }
        ]
      };
    });
  }

  // Agents koleksiyonu için temel veri oluşturalım
  data.agents = [
    {
      _id: new ObjectId(),
      browser: "chrome",
      status: "available",
      created: new Date(),
      lastActivity: new Date(),
      currentRequest: null,
      serverId: "server-001",
      ipAddress: "127.0.0.1",
      version: "1.0.0",
      capabilities: ["javascript", "screenshot", "video"]
    }
  ];

  // SystemResources verilerini ekleyelim
  if (data.serverAgent && data.serverAgent.systemResources) {
    data.systemResources = {
      _id: new ObjectId(),
      cpuUsage: data.serverAgent.systemResources.cpuUsage,
      memoryUsage: data.serverAgent.systemResources.memoryUsage,
      lastUpdated: new Date(data.serverAgent.systemResources.lastUpdated),
      serverId: "server-001"
    };
  }

  return data;
}

async function importData() {
  try {
    console.log("MongoDB'ye bağlanılıyor...");
    await client.connect();
    console.log("MongoDB'ye başarıyla bağlandı");

    const db = client.db("testautomationdb");

    try {
      // JSON dosyasını oku
      console.log("clean-db.json dosyası okunuyor...");
      const dbJsonPath = path.join(path.dirname(__filename), 'clean-db.json');
      console.log(`Dosya yolu: ${dbJsonPath}`);
      const rawData = fs.readFileSync(dbJsonPath);
      const data = JSON.parse(rawData);
      console.log("clean-db.json dosyası başarıyla okundu");

      // ID eşleşmeleri için bir harita oluştur
      const idMap = {
        users: {},
        projects: {},
        testCases: {},
        testSuites: {},
        testRuns: {}
      };

      // Verileri dönüştür
      console.log("Veriler dönüştürülüyor...");
      const convertedData = await convertStringsToObjectIds(data, idMap);

      // Tarihleri dönüştür
      convertISOToDate(convertedData);
      console.log("Veriler başarıyla dönüştürüldü");

      // Verileri MongoDB'ye ekle
      console.log("Veriler ekleniyor...");

      // Önce tüm koleksiyonları temizle
      console.log("Mevcut koleksiyonlar temizleniyor...");

      // Koleksiyonların var olup olmadığını kontrol et ve varsa temizle
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);

      const requiredCollections = [
        "Users", "Projects", "TestCases", "TestSuites", "TestRuns",
        "TestResults", "TestEnvironments", "Agents", "SystemResources",
        "TestMetrics", "Notifications"
      ];

      for (const collectionName of requiredCollections) {
        if (collectionNames.includes(collectionName)) {
          await db.collection(collectionName).deleteMany({});
          console.log(`${collectionName} koleksiyonu temizlendi`);
        } else {
          console.log(`${collectionName} koleksiyonu oluşturulacak`);
        }
      }

      // Verileri ekle
      if (convertedData.users && convertedData.users.length > 0) {
        await db.collection("Users").insertMany(convertedData.users);
        console.log(`${convertedData.users.length} kullanıcı eklendi`);
      }

      if (convertedData.projects && convertedData.projects.length > 0) {
        await db.collection("Projects").insertMany(convertedData.projects);
        console.log(`${convertedData.projects.length} proje eklendi`);
      }

      if (convertedData.testEnvironmentDocs && convertedData.testEnvironmentDocs.length > 0) {
        await db.collection("TestEnvironments").insertMany(convertedData.testEnvironmentDocs);
        console.log(`${convertedData.testEnvironmentDocs.length} test ortamı eklendi`);
      }

      if (convertedData.agents && convertedData.agents.length > 0) {
        await db.collection("Agents").insertMany(convertedData.agents);
        console.log(`${convertedData.agents.length} agent eklendi`);
      }

      if (convertedData.systemResources) {
        await db.collection("SystemResources").insertOne(convertedData.systemResources);
        console.log("Sistem kaynakları eklendi");
      }

      console.log("Tüm veriler başarıyla eklendi");
    } catch (error) {
      console.error("Veri dönüştürme veya ekleme hatası:", error);
    }
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
  } finally {
    try {
      await client.close();
      console.log("MongoDB bağlantısı kapatıldı");
    } catch (error) {
      console.error("MongoDB bağlantısını kapatma hatası:", error);
    }
  }
}

importData();
