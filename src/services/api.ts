import { ServerAgentSchema } from '../models/database/schemas';
import { mockServerAgentSchema, mockAgents, mockQueuedRequests, mockProcessedRequests } from '../mock/serverAgentMock';

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
    return new Promise((resolve) => {
      setTimeout(() => {
        // Import edilen mockServerAgentSchema kullan
        resolve(mockServerAgentSchema as unknown as ServerAgentSchema);
      }, 500);
    });
  },

  /**
   * ID'ye göre agent verilerini getirir
   */
  getAgentById: async (id: string) => {
    // Mock veri kullanıyoruz
    return new Promise((resolve) => {
      setTimeout(() => {
        // Import edilen mockAgents kullan
        const agent = mockAgents.find(a => a.id === id);
        resolve(agent || null);
      }, 300);
    });
  },

  /**
   * Kuyrukta bekleyen istekleri getirir
   */
  getQueuedRequests: async () => {
    // Mock veri kullanıyoruz
    return new Promise((resolve) => {
      setTimeout(() => {
        // Import edilen mockQueuedRequests kullan
        resolve(mockQueuedRequests);
      }, 300);
    });
  },

  /**
   * İşlenen istekleri getirir
   */
  getProcessedRequests: async () => {
    // Mock veri kullanıyoruz
    return new Promise((resolve) => {
      setTimeout(() => {
        // Import edilen mockProcessedRequests kullan
        resolve(mockProcessedRequests);
      }, 300);
    });
  },

  /**
   * Sistem kaynaklarını getirir
   */
  getSystemResources: async () => {
    // Mock veri kullanıyoruz
    return new Promise((resolve) => {
      setTimeout(() => {
        // Import edilen mockServerAgentSchema kullan
        resolve(mockServerAgentSchema.systemResources);
      }, 200);
    });
  }
};

export default api;
