import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../../services/api';
// WebSocket bağlantısı için socket.io-client'ı import ediyoruz
import { io } from 'socket.io-client';

import { ServerAgentSchema } from '../../models/database/schemas';
import { Agent, ProcessedRequest, QueuedRequest, toAgent, toProcessedRequest, toQueuedRequest } from '../../models';
import { AgentStatus } from '../../models/enums/AgentEnums';
import { ProcessedRequestStatus } from '../../models/enums/ProcessedRequestEnums';
import { BrowserType } from '../../models/enums/TestCaseEnums';

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

    // WebSocket sunucusuna bağlan (3001 portu)
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Bağlantı durumunu izle
    socketInstance.on('connect', () => {
      console.log('WebSocket sunucusuna bağlandı');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket sunucusu ile bağlantı kesildi');
      setConnected(false);
    });

    // Agent durumlarını dinle
    socketInstance.on('agentStatus', (data) => {
      console.log('Agent durumu alındı:', data);

      if (data.agents && Array.isArray(data.agents)) {
        // Agent listesini güncelle
        const agentsList = data.agents.map((agent: any) => {
          return toAgent({
            id: agent.id,
            name: agent.name || `Agent-${agent.id}`,
            status: agent.state === 'idle' ? AgentStatus.AVAILABLE :
                   agent.state === 'busy' ? AgentStatus.BUSY :
                   agent.state === 'error' ? AgentStatus.ERROR : AgentStatus.OFFLINE,
            browser: agent.browser || BrowserType.CHROME,
            created: agent.created || new Date().toISOString(),
            lastActivity: agent.lastActivity || new Date().toISOString(),
            currentRequest: agent.currentTest?.testId || null,
            networkInfo: agent.networkInfo || { ipAddress: '192.168.1.100' },
            type: agent.type || 'browser',
            capabilities: agent.capabilities || ['chrome'],
            serverId: agent.serverId || 'server-001',
            version: agent.version || '1.0.0',
            error: agent.error || null
          });
        });

        setActiveAgents(agentsList);
      }

      if (data.poolStatus) {
        // Server agent durumunu güncelle
        setServerAgent(prev => {
          if (!prev) return prev;

          return {
            ...prev,
            agentStatus: {
              ...prev.agentStatus,
              total: data.poolStatus.totalAgents || 0,
              available: data.poolStatus.idleAgents || 0,
              busy: data.poolStatus.busyAgents || 0,
              offline: data.poolStatus.offlineAgents || 0,
              error: data.poolStatus.errorAgents || 0,
              maintenance: 0,
              // limit özelliği agentStatus'ta tanımlı değil, bu nedenle burada kullanmıyoruz
            },
            lastUpdated: new Date().toISOString()
          };
        });

        setLastUpdated(new Date().toLocaleString('tr-TR'));
      }
    });

    // Agent durumu değiştiğinde
    socketInstance.on('agentStateChanged', (data) => {
      console.log('Agent durumu değişti:', data);

      // Mevcut agent'ı güncelle ve güncel listeyi al
      setActiveAgents(prevAgents => {
        const updatedAgents = prevAgents.map(agent => {
          if (agent.id === data.agentId) {
            return {
              ...agent,
              status: data.state === 'idle' ? AgentStatus.AVAILABLE :
                     data.state === 'busy' ? AgentStatus.BUSY :
                     data.state === 'error' ? AgentStatus.ERROR : AgentStatus.OFFLINE,
              lastActivity: new Date(),
              currentRequest: data.currentTest?.testId || null
            };
          }
          return agent;
        });

        // Agent durumlarını güncel liste ile güncelle
        updateAgentStatusCounts(updatedAgents);

        return updatedAgents;
      });
    });

    // Agent çöktüğünde
    socketInstance.on('agentCrashed', (data) => {
      console.error('Agent çöktü:', data);

      // Mevcut agent'ı güncelle
      setActiveAgents(prevAgents => {
        const updatedAgents = prevAgents.map(agent => {
          if (agent.id === data.agentId) {
            return {
              ...agent,
              status: AgentStatus.ERROR,
              lastActivity: new Date(),
              error: data.error
            };
          }
          return agent;
        });

        // Agent durumlarını güncel liste ile güncelle
        updateAgentStatusCounts(updatedAgents);

        return updatedAgents;
      });
    });

    // Agent oluşturulduğunda
    socketInstance.on('agentCreated', (data) => {
      console.log('Agent oluşturuldu:', data);
      // Mevcut agent listesini güncelle
      setActiveAgents(prevAgents => {
        const updatedAgents = [
          ...prevAgents,
          toAgent({
            id: data.id,
            name: data.name || `Agent-${data.id}`,
            status: AgentStatus.AVAILABLE,
            browser: data.browser || BrowserType.CHROME,
            created: data.created || new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            currentRequest: null,
            networkInfo: data.networkInfo || { ipAddress: '192.168.1.100' },
            type: data.type || 'browser',
            capabilities: data.capabilities || ['chrome'],
            serverId: data.serverId || 'server-001',
            version: data.version || '1.0.0'
          })
        ];

        // Agent durumlarını güncel liste ile güncelle
        updateAgentStatusCounts(updatedAgents);

        return updatedAgents;
      });
    });

    // Agent kaldırıldığında
    socketInstance.on('agentRemoved', (data) => {
      console.log('Agent kaldırıldı:', data);
      // Kaldırılan agent'ı listeden çıkar
      setActiveAgents(prevAgents => {
        const updatedAgents = prevAgents.filter(agent => agent.id !== data.agentId);

        // Agent durumlarını güncel liste ile güncelle
        updateAgentStatusCounts(updatedAgents);

        return updatedAgents;
      });
    });

    // Test olaylarını dinle
    socketInstance.on('testQueued', (data) => {
      console.log('Test kuyruğa alındı:', data);
      // Test listesini güncelle
      setQueuedRequests(prevTests => [
        ...prevTests,
        toQueuedRequest({
          id: data.testId,
          testName: data.testName || `Test-${data.testId}`,
          status: 'queued',
          priority: data.priority || 'medium',
          category: data.category || 'regression',
          browser: data.browser || 'chrome',
          queuedAt: data.queuedAt || new Date().toISOString(),
          waitTime: 0,
          position: data.position || 0,
          timing: {
            queuedAt: new Date(data.queuedAt || new Date()),
            waitTime: 0
          }
        })
      ]);

      // Kuyruk durumunu güncelle
      updateQueueStatusCounts();
    });

    socketInstance.on('testStart', (data) => {
      console.log('Test başladı:', data);

      // Kuyruktan çıkar
      setQueuedRequests(prevTests => prevTests.filter(test => test.id !== data.testId));

      // İşlenen testlere ekle
      setProcessedRequests(prevTests => [
        ...prevTests,
        toProcessedRequest({
          id: data.testId,
          testName: data.testName || `Test-${data.testId}`,
          status: ProcessedRequestStatus.SUCCESS,
          result: 'pending',
          agentId: data.agentId,
          startTime: new Date().toISOString(),
          endTime: null,
          duration: '0',
          browser: data.browser || 'chrome'
        })
      ]);

      // Agent durumunu güncelle
      setActiveAgents(prevAgents => {
        const updatedAgents = prevAgents.map(agent => {
          if (agent.id === data.agentId) {
            return {
              ...agent,
              status: AgentStatus.BUSY,
              currentRequest: data.testId
            };
          }
          return agent;
        });

        // Agent durumlarını güncel liste ile güncelle
        updateAgentStatusCounts(updatedAgents);

        return updatedAgents;
      });

      // Kuyruk durumunu güncelle
      updateQueueStatusCounts();
    });

    socketInstance.on('testComplete', (data) => {
      console.log('Test tamamlandı:', data);
      const endTime = new Date();

      // İşlenen testleri güncelle
      setProcessedRequests(prevTests =>
        prevTests.map(test => {
          if (test.id === data.testId) {
            const startTime = new Date(test.startTime);
            const duration = endTime.getTime() - startTime.getTime();

            return toProcessedRequest({
              ...test,
              status: ProcessedRequestStatus.SUCCESS,
              result: data.success ? 'passed' : 'failed',
              endTime: endTime.toISOString(),
              duration: duration.toString()
            });
          }
          return test;
        })
      );

      // Agent durumunu güncelle
      setActiveAgents(prevAgents => {
        const updatedAgents = prevAgents.map(agent => {
          if (agent.id === data.agentId) {
            return {
              ...agent,
              status: AgentStatus.AVAILABLE,
              currentRequest: null,
              lastActivity: new Date()
            };
          }
          return agent;
        });

        // Agent durumlarını güncel liste ile güncelle
        updateAgentStatusCounts(updatedAgents);

        return updatedAgents;
      });
    });

    socketInstance.on('testError', (data) => {
      console.log('Test hatası:', data);
      const endTime = new Date();

      // İşlenen testleri güncelle
      setProcessedRequests(prevTests =>
        prevTests.map(test => {
          if (test.id === data.testId) {
            const startTime = new Date(test.startTime);
            const duration = endTime.getTime() - startTime.getTime();

            return toProcessedRequest({
              ...test,
              status: ProcessedRequestStatus.ERROR,
              result: 'error',
              error: data.error,
              endTime: endTime.toISOString(),
              duration: duration.toString()
            });
          }
          return test;
        })
      );

      // Agent durumunu güncelle
      setActiveAgents(prevAgents => {
        const updatedAgents = prevAgents.map(agent => {
          if (agent.id === data.agentId) {
            return {
              ...agent,
              status: AgentStatus.AVAILABLE,
              currentRequest: null,
              lastActivity: new Date()
            };
          }
          return agent;
        });

        // Agent durumlarını güncel liste ile güncelle
        updateAgentStatusCounts(updatedAgents);

        return updatedAgents;
      });
    });

    socketInstance.on('testTimeout', (data) => {
      console.log('Test zaman aşımı:', data);
      const endTime = new Date();

      // İşlenen testleri güncelle
      setProcessedRequests(prevTests =>
        prevTests.map(test => {
          if (test.id === data.testId) {
            const startTime = new Date(test.startTime);
            const duration = endTime.getTime() - startTime.getTime();

            return toProcessedRequest({
              ...test,
              status: ProcessedRequestStatus.TIMEOUT,
              result: 'timeout',
              endTime: endTime.toISOString(),
              duration: duration.toString()
            });
          }
          return test;
        })
      );

      // Agent durumunu güncelle
      setActiveAgents(prevAgents => {
        const updatedAgents = prevAgents.map(agent => {
          if (agent.id === data.agentId) {
            return {
              ...agent,
              status: AgentStatus.AVAILABLE,
              currentRequest: null,
              lastActivity: new Date()
            };
          }
          return agent;
        });

        // Agent durumlarını güncel liste ile güncelle
        updateAgentStatusCounts(updatedAgents);

        return updatedAgents;
      });
    });

    // Sistem kaynaklarını dinle
    socketInstance.on('systemResources', (data) => {
      console.log('Sistem kaynakları alındı:', data);

      // Sistem kaynaklarını güncelle
      setServerAgent(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          systemResources: {
            ...prev.systemResources,
            cpuUsage: data.cpuUsage || prev.systemResources.cpuUsage,
            memoryUsage: data.memoryUsage || prev.systemResources.memoryUsage,
            diskUsage: data.diskUsage || prev.systemResources.diskUsage,
            networkUsage: data.networkUsage || prev.systemResources.networkUsage,
            loadAverage: data.loadAverage || prev.systemResources.loadAverage,
            processes: data.processes || prev.systemResources.processes,
            uptime: data.uptime || prev.systemResources.uptime,
            cpuDetails: data.cpuDetails || prev.systemResources.cpuDetails
          },
          lastUpdated: new Date().toISOString()
        };
      });

      setLastUpdated(new Date().toLocaleString('tr-TR'));
    });

    // Kuyruk durumunu dinle
    socketInstance.on('queueStatus', (data) => {
      console.log('Kuyruk durumu alındı:', data);

      // Kuyruk durumunu güncelle
      if (data.tests && Array.isArray(data.tests)) {
        // Kuyrukta bekleyen testleri güncelle
        const queuedList = data.tests.map((test: any, index: number) => {
          return toQueuedRequest({
            id: test.testId,
            testName: test.testName || `Test-${test.testId}`,
            status: 'queued',
            priority: test.priority || 'medium',
            category: test.category || 'regression',
            browser: test.browser || 'chrome',
            queuedAt: test.queuedAt || new Date().toISOString(),
            waitTime: test.waitTime || 0,
            position: test.position || index + 1,
            timing: {
              queuedAt: new Date(test.queuedAt || new Date()),
              waitTime: test.waitTime || 0
            }
          });
        });

        setQueuedRequests(queuedList);
      }

      // Server agent kuyruk durumunu güncelle
      setServerAgent(prev => {
        if (!prev) return prev;

        // Sunucudan gelen veri yapısına göre değerleri al
        const queueLength = data.length !== undefined ? data.length : (data.tests ? data.tests.length : 0);
        const queueMaxSize = data.maxSize || 100;
        const estimatedWait = data.estimatedWaitTime || 0;
        const processingCount = activeAgents.filter(a => a.status === AgentStatus.BUSY).length;

        // Öncelik sayılarını hesapla
        const highPriorityCount = data.tests ? data.tests.filter((t: any) => t.priority === 'high').length : 0;
        const mediumPriorityCount = data.tests ? data.tests.filter((t: any) => t.priority === 'medium').length : 0;
        const lowPriorityCount = data.tests ? data.tests.filter((t: any) => t.priority === 'low').length : 0;

        return {
          ...prev,
          queueStatus: {
            ...prev.queueStatus,
            queued: queueLength,
            maxSize: queueMaxSize,
            estimatedWaitTime: estimatedWait,
            highPriority: highPriorityCount,
            mediumPriority: mediumPriorityCount,
            lowPriority: lowPriorityCount,
            processing: processingCount,
            total: queueLength + processingCount
          },
          lastUpdated: new Date().toISOString()
        };
      });

      setLastUpdated(new Date().toLocaleString('tr-TR'));
    });

    // Yardımcı fonksiyonlar
    const updateAgentStatusCounts = (agents = activeAgents) => {
      setServerAgent(prev => {
        if (!prev) return prev;

        const available = agents.filter(a => a.status === AgentStatus.AVAILABLE).length;
        const busy = agents.filter(a => a.status === AgentStatus.BUSY).length;
        const offline = agents.filter(a => a.status === AgentStatus.OFFLINE).length;
        const error = agents.filter(a => a.status === AgentStatus.ERROR).length;

        console.log('Agent durumları güncelleniyor:', { total: agents.length, available, busy, offline, error });

        return {
          ...prev,
          agentStatus: {
            ...prev.agentStatus,
            total: agents.length,
            available,
            busy,
            offline,
            error,
            maintenance: 0
          },
          lastUpdated: new Date().toISOString()
        };
      });
    };

    const updateQueueStatusCounts = () => {
      setServerAgent(prev => {
        if (!prev) return prev;

        const highPriority = queuedRequests.filter(q => q.priority === 'high').length;
        const mediumPriority = queuedRequests.filter(q => q.priority === 'medium').length;
        const lowPriority = queuedRequests.filter(q => q.priority === 'low').length;

        return {
          ...prev,
          queueStatus: {
            ...prev.queueStatus,
            queued: queuedRequests.length,
            processing: activeAgents.filter(a => a.status === AgentStatus.BUSY).length,
            total: queuedRequests.length + activeAgents.filter(a => a.status === AgentStatus.BUSY).length,
            highPriority,
            mediumPriority,
            lowPriority,
            estimatedWaitTime: queuedRequests.length > 0 ? queuedRequests.length * 2 : 0
          },
          lastUpdated: new Date().toISOString()
        };
      });
    };

    // Cleanup function
    return () => {
      isMounted = false;
      if (socketInstance) {
        socketInstance.disconnect();
      }
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
