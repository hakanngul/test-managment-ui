import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../../services/api';
// WebSocket bağlantısı için socket.io-client'ı import ediyoruz

import { ServerAgentSchema } from '../../models/database/schemas';
import { Agent, ProcessedRequest, QueuedRequest, toAgent, toProcessedRequest, toQueuedRequest } from '../../models';
import { AgentStatus } from '../../models/enums/AgentEnums';
import { BrowserType } from '../../models/enums/TestCaseEnums';
import { ConnectionStatus, WebSocketListener, WebSocketService } from '../../services/websocket';

// Context için tip tanımlamaları
interface ServerAgentContextType {
  loading: boolean;
  error: string | null;
  lastUpdated: string;
  serverAgent: ServerAgentSchema | null;
  activeAgents: Agent[];
  queuedRequests: QueuedRequest[];
  processedRequests: ProcessedRequest[];
  refreshData: () => Promise<void>;
  connected: boolean; // WebSocket bağlantı durumu
}

// Context oluşturma
const ServerAgentContext = createContext<ServerAgentContextType>({
  loading: true,
  error: null,
  lastUpdated: '',
  serverAgent: null,
  activeAgents: [],
  queuedRequests: [],
  processedRequests: [],
  refreshData: async () => {},
  connected: false // Başlangıçta bağlantı yok
});

// Context hook'u
const useServerAgentData = () => useContext(ServerAgentContext);

// Props tipi
interface ServerAgentDataProviderProps {
  children: ReactNode;
}

// Data Provider bileşeni
export const ServerAgentDataProvider: React.FC<ServerAgentDataProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [connected, setConnected] = useState(false); // WebSocket bağlantı durumu

  // Server agent state
  const [serverAgent, setServerAgent] = useState<ServerAgentSchema | null>(null);

  // Data lists state
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);
  const [processedRequests, setProcessedRequests] = useState<ProcessedRequest[]>([]);

  /**
   * API'den verileri çeker
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Server agent verilerini çek
      const serverAgentData = await api.getServerAgent();

      if (!serverAgentData) {
        setError('Server agent data not found');
        return;
      }

      // Server agent verilerini güncelle
      setServerAgent(serverAgentData);
      setLastUpdated(new Date(serverAgentData.lastUpdated).toLocaleString('tr-TR'));

      // 2. Aktif agent'ları çek
      let agentsList: Agent[] = [];
      if (serverAgentData.activeAgents && Array.isArray(serverAgentData.activeAgents)) {
        try {
          // Tüm agent detaylarını paralel olarak çek
          const agentPromises = (serverAgentData.activeAgents as string[]).map(id => api.getAgentById(id));
          const agentDetails = await Promise.all(agentPromises);

          // Geçerli agent'ları dönüştür
          agentsList = agentDetails
            .filter(agent => agent !== null)
            .map(agent => {
              // Tarih alanlarını kontrol et
              const created = agent.created || new Date();
              const lastActivity = agent.lastActivity || new Date();

              return toAgent({
                id: agent.id,
                name: agent.name,
                status: agent.status as AgentStatus,
                browser: agent.browser as BrowserType,
                created: created,
                lastActivity: lastActivity,
                currentRequest: agent.currentRequest || null,
                networkInfo: agent.networkInfo || { ipAddress: '192.168.1.100' },
                type: agent.type as any,
                capabilities: agent.capabilities || ['chrome'],
                serverId: agent.serverId || 'server-001',
                version: agent.version || '1.0.0'
              });
            });
        } catch (err) {
          // Hata durumunda boş liste kullan
          console.error('Error fetching agent details:', err);
          agentsList = [];
        }
      }
      setActiveAgents(agentsList);

      // 3. Kuyrukta bekleyen istekleri çek
      let queuedList: QueuedRequest[] = [];
      if (serverAgentData.queuedRequests && Array.isArray(serverAgentData.queuedRequests)) {
        try {
          // Tüm kuyruk detaylarını paralel olarak çek
          const queuePromises = (serverAgentData.queuedRequests as string[]).map(id => api.getQueuedRequestById(id));
          const queueDetails = await Promise.all(queuePromises);

          // Geçerli istekleri dönüştür
          queuedList = queueDetails
            .filter(request => request !== null)
            .map(request => {
              return toQueuedRequest({
                id: request.id,
                testName: request.testName,
                status: request.status,
                priority: request.priority || 'medium',
                category: request.category || 'regression',
                browser: request.browser as string,
                queuedAt: request.queuedAt,
                waitTime: request.waitTime || 0,
                timing: {
                  queuedAt: new Date(request.queuedAt),
                  waitTime: request.waitTime || 0
                }
              });
            });
        } catch (err) {
          // Hata durumunda boş liste kullan
          console.error('Error fetching queue details:', err);
          queuedList = [];
        }
      }
      setQueuedRequests(queuedList);

      // 4. İşlenmiş istekleri çek
      let processedList: ProcessedRequest[] = [];
      if (serverAgentData.processedRequests && Array.isArray(serverAgentData.processedRequests)) {
        try {
          // Tüm işlenmiş istek detaylarını paralel olarak çek
          const processedPromises = (serverAgentData.processedRequests as string[]).map(id => api.getProcessedRequestById(id));
          const processedDetails = await Promise.all(processedPromises);

          // Geçerli istekleri dönüştür
          processedList = processedDetails
            .filter(request => request !== null)
            .map(request => {
              return toProcessedRequest({
                  id: request.id,
                  testName: request.testName,
                  status: request.status,
                  result: request.result || 'unknown',
                  browser: request.browser as string,
                  startTime: request.startTime,
                  endTime: request.endTime,
                  duration: request.duration || 0,
                  agentId: request.agentId || ''
              });
            });
        } catch (err) {
          // Hata durumunda boş liste kullan
          console.error('Error fetching processed details:', err);
          processedList = [];
        }
      }
      setProcessedRequests(processedList);

    } catch (err) {
      // Genel hata durumu
      console.error('Failed to load server agent data:', err);
      setError('Failed to load server agent data. Please try again later.');
    } finally {
      // Her durumda yükleme durumunu kapat
      setLoading(false);
    }
  };

  // WebSocket bağlantısı ve veri dinleme
  useEffect(() => {
    // İlk veri çekme
    let isMounted = true;

    const initialFetch = async () => {
      if (isMounted) {
        try {
          await fetchData();
        } catch (error) {
          console.error('Initial data fetch failed:', error);
        }
      }
    };

    initialFetch();

    // WebSocketService'i kullan
    const service = WebSocketService.getInstance();
    const manager = service.getManager();
    
    // WebSocket bağlantı durumunu izle
    const listener: WebSocketListener = {
      onStatusChange: (newStatus) => {
        setConnected(newStatus === ConnectionStatus.CONNECTED);
      },
      // Diğer event handler'lar...
    };
    
    // Dinleyiciyi ekle
    const removeListener = manager.addListener(listener);
    
    // Temizleme fonksiyonu
    return () => {
      isMounted = false;
      removeListener();
    };
  }, []); // Boş bağımlılık dizisi - sadece bir kez çalışır

  // Bağlantı yoksa varsayılan değerler oluştur
  const defaultServerAgent = serverAgent ? {
    ...serverAgent,
    agentStatus: {
      total: 0,
      available: 0,
      busy: 0,
      offline: 0,
      error: 0,
      maintenance: 0
    },
    queueStatus: {
      queued: 0,
      scheduled: 0,
      assigned: 0,
      processing: 0,
      total: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      estimatedWaitTime: 0
    },
    systemResources: {
      ...serverAgent.systemResources,
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkUsage: 0
    }
  } : null;

  // Context değeri
  const value: ServerAgentContextType = {
    loading,
    error,
    lastUpdated,
    serverAgent: connected ? serverAgent : defaultServerAgent, // Bağlantı yoksa varsayılan değerleri göster
    activeAgents: connected ? activeAgents : [],
    queuedRequests: connected ? queuedRequests : [],
    processedRequests: connected ? processedRequests : [],
    refreshData: fetchData,
    connected // WebSocket bağlantı durumunu ekledik
  };

  return (
    <ServerAgentContext.Provider value={value}>
      {children}
    </ServerAgentContext.Provider>
  );
};

// Default export for the provider and named export for the hook
export default ServerAgentDataProvider;
export { useServerAgentData };
