import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../../services/api';

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

// Context oluştur
const ServerAgentContext = createContext<ServerAgentContextType | undefined>(undefined);

// Context hook'u - Ayrı bir fonksiyon olarak tanımla
function useServerAgentData() {
  const context = useContext(ServerAgentContext);
  if (!context) {
    throw new Error('useServerAgentData must be used within a ServerAgentDataProvider');
  }
  return context;
}

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
            .filter(Boolean)
            .map(agent => {
              // TypeScript hatalarını önlemek için tip dönüşümü yapıyoruz
              const typedAgent = agent as any;
              const agentWithDates = {
                ...typedAgent,
                created: typedAgent.created || new Date().toISOString(),
                lastActivity: typedAgent.lastActivity || new Date().toISOString()
              };
              return toAgent(agentWithDates);
            });
        } catch (error) {
          // Hata durumunda boş liste kullan
          agentsList = [];
        }
      }
      setActiveAgents(agentsList);

      // 3. Kuyrukta bekleyen istekleri çek
      let queuedList: QueuedRequest[] = [];
      try {
        const queuedData = await api.getQueuedRequests();

        if (queuedData && Array.isArray(queuedData)) {
          queuedList = queuedData.map(request => {
            try {
              // Tarih alanlarını düzelt
              const withDates = {
                ...request,
                queuedAt: request.queuedAt || request.createdAt || new Date().toISOString(),
                estimatedStartTime: request.estimatedStartTime || new Date(Date.now() + 60000).toISOString()
              };
              return toQueuedRequest(withDates);
            } catch {
              // Dönüştürme hatası durumunda basit bir nesne döndür
              return {
                id: request.id || request._id || 'unknown',
                testName: request.testName || request.name || `Test ${request.id || 'unknown'}`,
                status: request.status || 'queued',
                priority: request.priority || 'low',
                category: request.category || 'regression',
                browser: request.browser || 'chromium',
                queuedAt: new Date(request.queuedAt || request.createdAt || new Date()),
                waitTime: request.waitTime || '1 dakika',
                timing: {
                  queuedAt: new Date(request.queuedAt || request.createdAt || new Date()),
                  waitTime: request.waitTime || '1 dakika'
                }
              } as unknown as QueuedRequest;
            }
          });
        }
      } catch {
        // Hata durumunda boş liste kullan
        queuedList = [];
      }
      setQueuedRequests(queuedList);

      // 4. İşlenmiş istekleri çek
      let processedList: ProcessedRequest[] = [];
      try {
        const processedData = await api.getProcessedRequests();

        if (processedData && Array.isArray(processedData)) {
          processedList = processedData.map(request => {
            try {
              // Tarih alanlarını düzelt
              const withDates = {
                ...request,
                startTime: request.startTime || request.startedAt || new Date(Date.now() - 300000).toISOString(),
                endTime: request.endTime || request.completedAt || new Date(Date.now() - 240000).toISOString()
              };
              return toProcessedRequest(withDates);
            } catch {
              // Dönüştürme hatası durumunda basit bir nesne döndür
              return {
                id: request.id || request._id || 'unknown',
                testName: request.testName || request.name || `Test ${request.id || 'unknown'}`,
                status: request.status || 'completed',
                result: request.result || 'success',
                startTime: new Date(request.startTime || request.startedAt || new Date(Date.now() - 300000)),
                endTime: new Date(request.endTime || request.completedAt || new Date(Date.now() - 240000)),
                processingTime: request.processingTime || 60000,
                duration: request.duration || '1 dakika',
                browser: request.browser || 'chromium',
                agentId: request.agentId || request.assignedTo || 'agent-001',
                assignedTo: request.assignedTo || request.agentId || 'agent-001'
              } as unknown as ProcessedRequest;
            }
          });
        }
      } catch {
        // Hata durumunda boş liste kullan
        processedList = [];
      }
      setProcessedRequests(processedList);

    } catch (err) {
      // Genel hata durumu
      setError('Failed to load server agent data. Please try again later.');
    } finally {
      // Her durumda yükleme durumunu kapat
      setLoading(false);
    }
  };

  // Initial data fetch only
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

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

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

// Default export for the provider
const ServerAgentDataProviderExport = ServerAgentDataProvider;
export default ServerAgentDataProviderExport;

// Named export for the hook
export { useServerAgentData };
