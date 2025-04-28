import { ServerAgentSchema } from '../models/database/schemas';
import { mockServerAgent } from '../mock/serverAgentMock';

/**
 * API servisi
 * 
 * Bu servis, backend API'si ile iletişim kurmak için kullanılır.
 * Şu anda mock veriler kullanılıyor, gerçek API entegrasyonu için
 * bu fonksiyonlar gerçek API çağrıları ile değiştirilmelidir.
 */
const api = {
  /**
   * Server agent verilerini getirir
   */
  getServerAgent: async (): Promise<ServerAgentSchema> => {
    // Mock veri kullanıyoruz
    console.log('Fetching server agent data (mock)');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockServerAgent as unknown as ServerAgentSchema);
      }, 500);
    });
  },

  /**
   * ID'ye göre agent verilerini getirir
   */
  getAgentById: async (id: string) => {
    // Mock veri kullanıyoruz
    console.log(`Fetching agent data for ID: ${id} (mock)`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const agent = mockServerAgent.activeAgents.find(a => a.id === id);
        resolve(agent || null);
      }, 300);
    });
  },

  /**
   * Kuyrukta bekleyen istekleri getirir
   */
  getQueuedRequests: async () => {
    // Mock veri kullanıyoruz
    console.log('Fetching queued requests (mock)');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockServerAgent.queuedRequests);
      }, 300);
    });
  },

  /**
   * İşlenen istekleri getirir
   */
  getProcessedRequests: async () => {
    // Mock veri kullanıyoruz
    console.log('Fetching processed requests (mock)');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockServerAgent.processedRequests);
      }, 300);
    });
  },

  /**
   * Sistem kaynaklarını getirir
   */
  getSystemResources: async () => {
    // Mock veri kullanıyoruz
    console.log('Fetching system resources (mock)');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockServerAgent.systemResources);
      }, 200);
    });
  }
};

export default api;
