import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../../services/api';
import agentSocketService from '../../services/AgentSocketService';

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
              return toAgent({
                id: agent.id,
                name: agent.name,
                status: agent.status === 'IDLE' ? 'available' : agent.status === 'BUSY' ? 'busy' : 'offline',
                browser: agent.capabilities?.browsers?.[0]?.name || 'chrome',
                created: agent.createdAt,
                lastActivity: agent.lastHeartbeat
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

  // Initial data fetch and WebSocket setup
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

    // WebSocket bağlantısını kur
    agentSocketService.connect();

    // WebSocket event listener'larını ekle
    agentSocketService.on('initial_data', (data) => {
      if (isMounted) {
        console.log('WebSocket initial data received:', data);

        // Veri kontrolü
        if (!data) {
          console.warn('WebSocket initial data is empty or invalid');
          return;
        }

        try {
          // Server agent verilerini güncelle
          if (data.agentLauncher) {
            const serverAgentData: ServerAgentSchema = {
              id: data.agentLauncher.id || 'unknown',
              name: data.agentLauncher.name || 'Agent Launcher',
              status: data.agentLauncher.status || 'OFFLINE',
              version: {
                current: '1.0.0',
                updateAvailable: false
              },
              systemResources: data.systemResources || {
                cpuUsage: 0,
                memoryUsage: 0
              },
              agentStatus: {
                total: data.agents?.length || 0,
                available: data.agents?.filter(a => a.status === 'IDLE').length || 0,
                busy: data.agents?.filter(a => a.status === 'BUSY').length || 0,
                offline: data.agents?.filter(a => a.status === 'OFFLINE').length || 0,
                error: data.agents?.filter(a => a.status === 'ERROR').length || 0,
                maintenance: 0
              },
              queueStatus: {
                queued: data.queuedRequests?.filter(q => q.status === 'QUEUED').length || 0,
                processing: data.queuedRequests?.filter(q => q.status === 'RUNNING').length || 0,
                total: data.queuedRequests?.length || 0,
                highPriority: data.queuedRequests?.filter(q => q.priority === 'high').length || 0,
                mediumPriority: data.queuedRequests?.filter(q => q.priority === 'medium').length || 0,
                lowPriority: data.queuedRequests?.filter(q => q.priority === 'low').length || 0,
                estimatedWaitTime: 0
              },
              performanceMetrics: {
                testExecutionTime: {
                  average: 0,
                  min: 0,
                  max: 0
                },
                successRate: 100,
                throughput: 0,
                requestsPerMinute: 0,
                averageResponseTime: 0,
                errorRate: 0,
                resourceUtilization: {
                  cpu: 0,
                  memory: 0,
                  disk: 0,
                  network: 0
                },
                concurrentTests: {
                  current: 0,
                  max: 5
                }
              },
              healthStatus: {
                status: 'healthy',
                lastCheck: new Date().toISOString(),
                uptime: 0,
                checks: []
              },
              config: {
                maxConcurrentTests: data.agentLauncher.maxAgents || 5,
                queueLimit: 100,
                testTimeout: 300000,
                retryPolicy: {
                  enabled: true,
                  maxRetries: 3,
                  retryInterval: 5000
                },
                logging: {
                  level: 'info',
                  retention: 7
                },
                security: {
                  authEnabled: false,
                  sslEnabled: false
                },
                notifications: {
                  email: false,
                  slack: false,
                  webhook: false
                }
              },
              activeAgents: data.agents?.map(a => a.id) || [],
              queuedRequests: data.queuedRequests?.map(q => q.id) || [],
              processedRequests: [],
              lastUpdated: new Date().toISOString(),
              createdAt: new Date().toISOString()
            };

            setServerAgent(serverAgentData);
            setLastUpdated(new Date().toLocaleString('tr-TR'));
          }

          // Agent'ları güncelle
          if (data.agents && Array.isArray(data.agents)) {
            const agentsList = data.agents.map(agent => {
              return toAgent({
                id: agent.id || 'unknown',
                name: agent.name || 'Unknown Agent',
                status: agent.status === 'IDLE' ? 'available' : agent.status === 'BUSY' ? 'busy' : 'offline',
                browser: agent.capabilities?.browsers?.[0]?.name || 'chrome',
                created: agent.createdAt || new Date().toISOString(),
                lastActivity: agent.lastHeartbeat || new Date().toISOString()
              });
            });
            setActiveAgents(agentsList);
          }

          // Kuyruk isteklerini güncelle
          if (data.queuedRequests && Array.isArray(data.queuedRequests)) {
            const queuedList = data.queuedRequests.map(request => {
              return toQueuedRequest({
                id: request.id || 'unknown',
                testName: request.testName || 'Unknown Test',
                status: request.status || 'QUEUED',
                priority: request.priority || 'medium',
                category: request.category || 'regression',
                browser: request.browser?.name || 'chrome',
                queuedAt: request.queuedAt || new Date().toISOString(),
                waitTime: request.waitTime || 0,
                timing: {
                  queuedAt: new Date(request.queuedAt || new Date()),
                  waitTime: request.waitTime || 0
                }
              });
            });
            setQueuedRequests(queuedList);
          }
        } catch (error) {
          console.error('Error processing initial data:', error);
        }
      }
    });

    // Agents update event - hem eski hem de yeni event isimlerini dinle
    const handleAgentsUpdate = (agents: any[]) => {
      if (isMounted) {
        console.log('WebSocket agents update received:', agents);

        // Veri kontrolü
        if (!agents || !Array.isArray(agents)) {
          console.warn('WebSocket agents update is empty or invalid');
          return;
        }

        try {
          const agentsList = agents.map(agent => {
            return toAgent({
              id: agent.id || 'unknown',
              name: agent.name || 'Unknown Agent',
              status: agent.status === 'IDLE' ? 'available' : agent.status === 'BUSY' ? 'busy' : 'offline',
              browser: agent.capabilities?.browsers?.[0]?.name || 'chrome',
              created: agent.createdAt || new Date().toISOString(),
              lastActivity: agent.lastHeartbeat || new Date().toISOString()
            });
          });
          setActiveAgents(agentsList);

          // Server agent durumunu da güncelle
          setServerAgent(prev => {
            if (!prev) return prev;

            return {
              ...prev,
              agentStatus: {
                ...prev.agentStatus,
                total: agents.length,
                available: agents.filter(a => a.status === 'IDLE').length,
                busy: agents.filter(a => a.status === 'BUSY').length,
                offline: agents.filter(a => a.status === 'OFFLINE').length,
                error: agents.filter(a => a.status === 'ERROR').length,
                maintenance: 0
              },
              activeAgents: agents.map(a => a.id),
              lastUpdated: new Date().toISOString()
            };
          });

          setLastUpdated(new Date().toLocaleString('tr-TR'));
        } catch (error) {
          console.error('Error processing agents update:', error);
        }
      }
    };

    // Hem eski hem de yeni event isimlerini dinle
    agentSocketService.on('agents_update', handleAgentsUpdate);
    agentSocketService.on('agent_update_all', handleAgentsUpdate);

    // Queue update event
    agentSocketService.on('queue_update_all', (requests) => {
      if (isMounted) {
        console.log('WebSocket queue update received:', requests);

        // Veri kontrolü
        if (!requests || !Array.isArray(requests)) {
          console.warn('WebSocket queue update is empty or invalid');
          return;
        }

        try {
          const queuedList = requests.map(request => {
            return toQueuedRequest({
              id: request.id || 'unknown',
              testName: request.testName || 'Unknown Test',
              status: request.status || 'QUEUED',
              priority: request.priority || 'medium',
              category: request.category || 'regression',
              browser: request.browser?.name || 'chrome',
              queuedAt: request.queuedAt || new Date().toISOString(),
              waitTime: request.waitTime || 0,
              timing: {
                queuedAt: new Date(request.queuedAt || new Date()),
                waitTime: request.waitTime || 0
              }
            });
          });
          setQueuedRequests(queuedList);

          // Server agent durumunu da güncelle
          setServerAgent(prev => {
            if (!prev) return prev;

            return {
              ...prev,
              queueStatus: {
                ...prev.queueStatus,
                queued: requests.filter(q => q.status === 'QUEUED').length,
                processing: requests.filter(q => q.status === 'RUNNING').length,
                total: requests.length,
                highPriority: requests.filter(q => q.priority === 'high').length,
                mediumPriority: requests.filter(q => q.priority === 'medium').length,
                lowPriority: requests.filter(q => q.priority === 'low').length
              },
              queuedRequests: requests.map(q => q.id),
              lastUpdated: new Date().toISOString()
            };
          });

          setLastUpdated(new Date().toLocaleString('tr-TR'));
        } catch (error) {
          console.error('Error processing queue update:', error);
        }
      }
    });

    // System resources update event
    agentSocketService.on('system_resources_update', (resources) => {
      if (isMounted) {
        console.log('WebSocket system resources update received:', resources);

        // Veri kontrolü
        if (!resources) {
          console.warn('WebSocket system resources update is empty or invalid');
          return;
        }

        try {
          // CPU ve memory kullanımını doğru şekilde çıkar
          let cpuUsage = 0;
          let memoryUsage = 0;

          if (resources.cpu && typeof resources.cpu.usage === 'number') {
            cpuUsage = resources.cpu.usage;
          } else if (typeof resources.cpu === 'number') {
            cpuUsage = resources.cpu;
          }

          if (resources.memory && typeof resources.memory.usage === 'number') {
            memoryUsage = resources.memory.usage;
          } else if (typeof resources.memory === 'number') {
            memoryUsage = resources.memory;
          }

          // Server agent durumunu güncelle
          setServerAgent(prev => {
            if (!prev) return prev;

            return {
              ...prev,
              systemResources: {
                cpuUsage: cpuUsage,
                memoryUsage: memoryUsage,
                diskUsage: resources.disk?.usage || typeof resources.disk === 'number' ? resources.disk : 0,
                networkUsage: resources.network?.bytesIn || typeof resources.network === 'number' ? resources.network : 0,
                loadAverage: Array.isArray(resources.cpu?.loadAverage) ? resources.cpu.loadAverage : [0, 0, 0],
                processes: resources.processes?.total || typeof resources.processes === 'number' ? resources.processes : 0,
                uptime: typeof resources.uptime === 'number' ? resources.uptime : 0,
                cpuDetails: resources.cpuDetails && typeof resources.cpuDetails === 'object' ? {
                  model: resources.cpuDetails.model || 'Unknown',
                  cores: resources.cpuDetails.cores || 0,
                  speed: resources.cpuDetails.speed || 0
                } : {
                  model: 'Unknown',
                  cores: 0,
                  speed: 0
                }
              },
              lastUpdated: new Date().toISOString()
            };
          });

          setLastUpdated(new Date().toLocaleString('tr-TR'));
        } catch (error) {
          console.error('Error processing system resources update:', error);
        }
      }
    });

    // Launcher update event
    agentSocketService.on('launcher_update', (launcher) => {
      if (isMounted) {
        console.log('WebSocket launcher update received:', launcher);

        // Veri kontrolü
        if (!launcher) {
          console.warn('WebSocket launcher update is empty or invalid');
          return;
        }

        try {
          // Server agent durumunu güncelle
          setServerAgent(prev => {
            if (!prev) return prev;

            return {
              ...prev,
              id: launcher.id || prev.id,
              name: launcher.name || prev.name,
              status: launcher.status || prev.status,
              config: {
                ...prev.config,
                maxConcurrentTests: launcher.maxAgents || prev.config.maxConcurrentTests
              },
              lastUpdated: new Date().toISOString()
            };
          });

          setLastUpdated(new Date().toLocaleString('tr-TR'));
        } catch (error) {
          console.error('Error processing launcher update:', error);
        }
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;

      // WebSocket bağlantısını kapat
      agentSocketService.disconnect();
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

// Default export for the provider and named export for the hook
export default ServerAgentDataProvider;
export { useServerAgentData };
