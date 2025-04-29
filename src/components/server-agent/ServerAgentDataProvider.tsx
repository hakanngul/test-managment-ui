import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../../services/api';
// Socket servisini kaldırdık, mock data kullanıyoruz
// import agentSocketService from '../../services/AgentSocketService';

import { ServerAgentSchema } from '../../models/database/schemas';
import { Agent, ProcessedRequest, QueuedRequest, toAgent, toProcessedRequest, toQueuedRequest } from '../../models';

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
  refreshData: async () => {}
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
              const created = agent.createdAt || agent.created || new Date();
              const lastActivity = agent.lastHeartbeat || agent.lastActivity || new Date();

              return toAgent({
                id: agent.id,
                name: agent.name,
                status: agent.status === 'IDLE' ? 'available' : agent.status === 'BUSY' ? 'busy' : 'offline',
                browser: agent.capabilities?.browsers?.[0]?.name || agent.browser || 'chrome',
                created: created,
                lastActivity: lastActivity,
                currentRequest: agent.currentRequest || agent.currentTest?.testId || null,
                networkInfo: agent.networkInfo || { ipAddress: '192.168.1.100' },
                type: agent.type || 'BROWSER',
                capabilities: agent.capabilities?.supportedFeatures || agent.capabilities || ['chrome'],
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

      // 3. Kuyruk isteklerini çek
      let queuedList: QueuedRequest[] = [];
      if (serverAgentData.queuedRequests && Array.isArray(serverAgentData.queuedRequests)) {
        try {
          // Tüm kuyruk isteklerini paralel olarak çek
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
                browser: request.browser?.name || 'chrome',
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

      // 4. İşlenen istekleri çek
      let processedList: ProcessedRequest[] = [];
      if (serverAgentData.processedRequests && Array.isArray(serverAgentData.processedRequests)) {
        try {
          // Tüm işlenen istekleri paralel olarak çek
          const processedPromises = (serverAgentData.processedRequests as string[]).map(id => api.getProcessedRequestById(id));
          const processedDetails = await Promise.all(processedPromises);

          // Geçerli istekleri dönüştür
          processedList = processedDetails
            .filter(request => request !== null)
            .map(request => {
              if (request) {
                return toProcessedRequest({
                  id: request.id,
                  testName: request.testName,
                  status: request.status,
                  result: request.result || 'unknown',
                  browser: request.browser?.name || 'chrome',
                  startTime: request.startTime,
                  endTime: request.endTime,
                  duration: request.duration || 0
                });
              } else {
                return {
                  id: 'unknown',
                  testName: 'Unknown Test',
                  status: 'unknown',
                  result: 'unknown',
                  browser: 'chrome',
                  startTime: new Date().toISOString(),
                  endTime: new Date().toISOString(),
                  duration: 0
                } as unknown as ProcessedRequest;
              }
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

  // Initial data fetch and periodic updates
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

    // Periyodik olarak verileri güncelle (socket yerine)
    // Her 5 saniyede bir sistem kaynaklarını güncelle
    const systemResourcesInterval = setInterval(() => {
      if (isMounted) {
        // Sistem kaynaklarını güncelle
        setServerAgent(prev => {
          if (!prev) return prev;

          // Rastgele değişiklikler yap (gerçek zamanlı güncelleme simülasyonu)
          const cpuUsage = Math.min(100, Math.max(0, prev.systemResources.cpuUsage + (Math.random() * 10 - 5)));
          const memoryUsage = Math.min(100, Math.max(0, prev.systemResources.memoryUsage + (Math.random() * 8 - 4)));
          const diskUsage = prev.systemResources.diskUsage || 28;
          const networkUsage = prev.systemResources.networkUsage || 35;

          return {
            ...prev,
            systemResources: {
              ...prev.systemResources,
              cpuUsage,
              memoryUsage,
              diskUsage,
              networkUsage,
              lastUpdated: new Date().toISOString()
            },
            lastUpdated: new Date().toISOString()
          };
        });

        setLastUpdated(new Date().toLocaleString('tr-TR'));
      }
    }, 5000); // 5 saniyede bir güncelle

    // Her 30 saniyede bir agent durumlarını güncelle
    const agentsInterval = setInterval(() => {
      if (isMounted && activeAgents.length > 0) {
        // Rastgele bir agent'ın durumunu değiştir
        const randomIndex = Math.floor(Math.random() * activeAgents.length);
        const randomAgent = activeAgents[randomIndex];

        // Rastgele bir durum seç
        const statuses = ['available', 'busy', 'offline', 'error'];
        const currentStatusIndex = statuses.indexOf(randomAgent.status);
        const newStatusIndex = (currentStatusIndex + 1) % statuses.length;
        const newStatus = statuses[newStatusIndex];

        // Agent'ı güncelle
        const updatedAgents = [...activeAgents];
        updatedAgents[randomIndex] = {
          ...randomAgent,
          status: newStatus,
          lastActivity: new Date() // Doğrudan Date nesnesi kullan
        };

        setActiveAgents(updatedAgents);

        // Server agent durumunu da güncelle
        setServerAgent(prev => {
          if (!prev) return prev;

          // Agent durumlarını say
          const available = updatedAgents.filter(a => a.status === 'available').length;
          const busy = updatedAgents.filter(a => a.status === 'busy').length;
          const offline = updatedAgents.filter(a => a.status === 'offline').length;
          const error = updatedAgents.filter(a => a.status === 'error').length;

          return {
            ...prev,
            agentStatus: {
              ...prev.agentStatus,
              total: updatedAgents.length,
              available,
              busy,
              offline,
              error,
              maintenance: 0
            },
            lastUpdated: new Date().toISOString()
          };
        });

        setLastUpdated(new Date().toLocaleString('tr-TR'));
      }
    }, 30000); // 30 saniyede bir güncelle

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(systemResourcesInterval);
      clearInterval(agentsInterval);
    };
  }, []); // Boş bağımlılık dizisi - sadece bir kez çalışır

  // Context değeri
  const value: ServerAgentContextType = {
    loading,
    error,
    lastUpdated,
    serverAgent,
    activeAgents,
    queuedRequests,
    processedRequests,
    refreshData: fetchData
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
