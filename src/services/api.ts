import { ServerAgentSchema } from '../models/database/schemas';
import dataService from './DataService';

/**
 * API servisi
 *
 * Bu servis, backend API'si ile iletişim kurmak için kullanılır.
 * DataService üzerinden veri alır, böylece mock veya gerçek API arasında
 * kolayca geçiş yapılabilir.
 */
const api = {
  /**
   * Veri kaynağını ayarlar
   * @param useMockData Mock data kullanılıp kullanılmayacağı
   * @param apiBaseUrl Gerçek API kullanılacaksa API'nin base URL'i
   */
  setDataSource: (useMockData: boolean, apiBaseUrl?: string): void => {
    dataService.setDataSource(useMockData, apiBaseUrl);
  },

  /**
   * Şu anki veri kaynağını döndürür
   */
  getDataSourceInfo: (): { useMockData: boolean } => {
    return dataService.getDataSourceInfo();
  },

  /**
   * Server agent verilerini getirir
   */
  getServerAgent: async (): Promise<ServerAgentSchema> => {
    return dataService.getServerAgent();
  },

  /**
   * ID'ye göre agent verilerini getirir
   */
  getAgentById: async (id: string) => {
    return dataService.getAgentById(id);
  },

  /**
   * Kuyrukta bekleyen istekleri getirir
   */
  getQueuedRequests: async () => {
    return dataService.getQueuedRequests();
  },

  /**
   * İşlenen istekleri getirir
   */
  getProcessedRequests: async () => {
    return dataService.getProcessedRequests();
  },

  /**
   * Sistem kaynaklarını getirir
   */
  getSystemResources: async () => {
    return dataService.getSystemResources();
  },

  /**
   * ID'ye göre kuyrukta bekleyen isteği getirir
   */
  getQueuedRequestById: async (id: string) => {
    return dataService.getQueuedRequestById(id);
  },

  /**
   * ID'ye göre işlenen isteği getirir
   */
  getProcessedRequestById: async (id: string) => {
    return dataService.getProcessedRequestById(id);
  }
};



export default api;
