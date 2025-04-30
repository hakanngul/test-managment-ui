import { useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';

// Agent interface ve enum'ları
import {
  AgentStatus,
  AgentType,
  AgentOS,
  AgentHealthStatus,
  AgentLogLevel
} from "../enums/AgentEnums";
import { BrowserType } from "../enums/TestCaseEnums";

/**
 * WebSocket hook - Test otomasyonu için WebSocket bağlantısını yönetir
 *
 * @returns {Object} WebSocket durumu ve fonksiyonları
 * @property {boolean} connected - WebSocket bağlantı durumu
 * @property {Object} connectionState - Detaylı bağlantı durumu ('connecting', 'connected', 'disconnected', 'reconnecting')
 * @property {Object} testLogs - Test logları (testId -> log[] şeklinde)
 * @property {Object} testSteps - Test adımları (testId -> step şeklinde)
 * @property {Object} currentTests - Mevcut testler (testId -> test şeklinde)
 * @property {Object} stats - Bağlantı istatistikleri
 * @property {Array} notifications - Bildirimler
 * @property {Array} runningTests - Çalışan testler
 * @property {Array} completedTests - Tamamlanan testler
 * @property {Array} failedTests - Başarısız olan testler
 *
 * @property {Array} agents - Agent listesi
 * @property {Object} agentStatusSummary - Agent durum özeti
 * @property {Object} agentPerformanceSummary - Agent performans özeti
 * @property {Array} availableAgents - Müsait agent'lar
 * @property {Array} busyAgents - Meşgul agent'lar
 * @property {Array} offlineAgents - Çevrimdışı agent'lar
 * @property {Array} errorAgents - Hata durumundaki agent'lar
 *
 * @property {Function} getAgentById - ID'ye göre agent bulur
 * @property {Function} getAgentsByStatus - Duruma göre agent'ları filtreler
 * @property {Function} getAgentsByType - Tipine göre agent'ları filtreler
 * @property {Function} getAgentsByBrowser - Tarayıcı tipine göre agent'ları filtreler
 * @property {Function} getAgentsByHealth - Sağlık durumuna göre agent'ları filtreler
 *
 * @property {Function} clearTestLogs - Belirli bir testin loglarını temizler
 * @property {Function} clearAllLogs - Tüm logları temizler
 * @property {Function} clearNotification - Bildirimi temizler
 * @property {Function} filterTests - Testleri filtreler
 * @property {Function} simulateTestData - Test verilerini simüle eder
 */
export const useWebSocket = (config = {}) => {
  // Varsayılan yapılandırma
  const {
    url = 'http://localhost:3001',
    reconnectionAttempts = 10,
    reconnectionDelay = 1000,
    autoCleanupTime = 60 * 60 * 1000, // 1 saat
    cleanupInterval = 15 * 60 * 1000, // 15 dakika
    pingInterval = 30000, // 30 saniye
    maxLogEntries = 500, // Test başına maksimum log sayısı
    debug = false
  } = config;

  // Bağlantı durumu
  const [connected, setConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  // Test verileri
  const [testLogs, setTestLogs] = useState({});
  const [testSteps, setTestSteps] = useState({});
  const [currentTests, setCurrentTests] = useState({});

  // İstatistikler ve bildirimler
  const [stats, setStats] = useState({
    messagesReceived: 0,
    lastMessageTime: null,
    reconnectCount: 0,
    latency: 0,
    connectedSince: null
  });

  const [notifications, setNotifications] = useState([]);

  // Agent verileri
  const [agents, setAgents] = useState([]);
  const [agentStatusSummary, setAgentStatusSummary] = useState({
    total: 0,
    available: 0,
    busy: 0,
    offline: 0,
    error: 0,
    maintenance: 0,
    limit: 3 // Varsayılan değer
  });
  const [agentPerformanceSummary, setAgentPerformanceSummary] = useState({
    avgCpuUsage: 0,
    avgMemoryUsage: 0,
    avgDiskUsage: 0,
    avgNetworkUsage: 0,
    totalTests: 0,
    successfulTests: 0,
    failedTests: 0,
    avgTestDuration: 0
  });

  // Socket referansı
  const [socket, setSocket] = useState(null);

  // Hesaplanmış değerler
  const runningTests = useMemo(() => {
    return Object.values(currentTests).filter(test => test.status === 'running');
  }, [currentTests]);

  const completedTests = useMemo(() => {
    return Object.values(currentTests).filter(test => test.status === 'completed');
  }, [currentTests]);

  const failedTests = useMemo(() => {
    return Object.values(currentTests).filter(test => test.status === 'failed');
  }, [currentTests]);

  // Agent hesaplanmış değerleri
  const availableAgents = useMemo(() => {
    return agents.filter(agent => agent.status === AgentStatus.AVAILABLE);
  }, [agents]);

  const busyAgents = useMemo(() => {
    return agents.filter(agent => agent.status === AgentStatus.BUSY);
  }, [agents]);

  const offlineAgents = useMemo(() => {
    return agents.filter(agent => agent.status === AgentStatus.OFFLINE);
  }, [agents]);

  const errorAgents = useMemo(() => {
    return agents.filter(agent => agent.status === AgentStatus.ERROR);
  }, [agents]);

  // Debug log fonksiyonu
  const logDebug = useCallback((...args) => {
    if (debug) {
      console.log('[WebSocket]', ...args);
    }
  }, [debug]);

  // WebSocket bağlantısını kur
  useEffect(() => {
    logDebug('WebSocket bağlantısı kuruluyor:', url);
    setConnectionState('connecting');

    const socketInstance = io(url, {
      transports: ['websocket'],
      reconnectionAttempts,
      reconnectionDelay,
      // Üstel geri çekilme (exponential backoff) stratejisi
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5
    });

    setSocket(socketInstance);

    // Bağlantı olayları
    socketInstance.on('connect', () => {
      logDebug('WebSocket sunucusuna bağlandı');
      setConnected(true);
      setConnectionState('connected');
      setStats(prev => ({
        ...prev,
        connectedSince: new Date().toISOString()
      }));

      // Bildirim ekle
      addNotification('info', 'WebSocket sunucusuna bağlandı');
    });

    socketInstance.on('disconnect', () => {
      logDebug('WebSocket sunucusu ile bağlantı kesildi');
      setConnected(false);
      setConnectionState('disconnected');

      // Bildirim ekle
      addNotification('warning', 'WebSocket sunucusu ile bağlantı kesildi');
    });

    socketInstance.on('connect_error', (error) => {
      logDebug('Bağlantı hatası:', error.message);
      setConnectionState('error');

      // Bildirim ekle
      addNotification('error', `Bağlantı hatası: ${error.message}`);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      logDebug(`Yeniden bağlanma denemesi: ${attemptNumber}`);
      setConnectionState('reconnecting');

      // Bildirim ekle
      if (attemptNumber === 1) {
        addNotification('info', 'WebSocket sunucusuna yeniden bağlanılıyor...');
      }
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      logDebug(`Yeniden bağlandı, deneme: ${attemptNumber}`);
      setConnectionState('connected');
      setStats(prev => ({
        ...prev,
        reconnectCount: prev.reconnectCount + 1,
        connectedSince: new Date().toISOString()
      }));

      // Bildirim ekle
      addNotification('success', 'WebSocket sunucusuna yeniden bağlandı');
    });

    socketInstance.on('reconnect_failed', () => {
      logDebug('Yeniden bağlanma başarısız oldu');
      setConnectionState('failed');

      // Bildirim ekle
      addNotification('error', 'WebSocket sunucusuna yeniden bağlanma başarısız oldu');
    });

    // Tüm olayları dinle ve istatistikleri güncelle
    socketInstance.onAny((event, ...args) => {
      logDebug(`WebSocket olayı alındı: ${event}`, args);
      setStats(prev => ({
        ...prev,
        messagesReceived: prev.messagesReceived + 1,
        lastMessageTime: new Date().toISOString()
      }));
    });

    // Temizleme fonksiyonu
    return () => {
      logDebug('WebSocket bağlantısı kapatılıyor');
      socketInstance.disconnect();
    };
  }, [url, reconnectionAttempts, reconnectionDelay, logDebug]);

  // Ping-pong ile gecikme ölçümü
  useEffect(() => {
    if (!socket || !connected) return;

    const interval = setInterval(() => {
      const start = Date.now();
      socket.emit('ping', {}, () => {
        const latency = Date.now() - start;
        setStats(prev => ({ ...prev, latency }));
        logDebug(`Ping: ${latency}ms`);
      });
    }, pingInterval);

    return () => clearInterval(interval);
  }, [socket, connected, pingInterval, logDebug]);

  // Otomatik temizleme mekanizması
  useEffect(() => {
    if (!socket) return;

    const interval = setInterval(() => {
      logDebug('Otomatik temizleme çalışıyor...');

      // Tamamlanan ve belirli bir süre geçmiş testlerin loglarını temizle
      setTestLogs(prev => {
        const newLogs = { ...prev };
        let cleanedCount = 0;

        Object.keys(newLogs).forEach(testId => {
          const test = currentTests[testId];
          if (test && test.status !== 'running' && test.endTime) {
            const endTime = new Date(test.endTime).getTime();
            const now = new Date().getTime();
            if (now - endTime > autoCleanupTime) {
              delete newLogs[testId];
              cleanedCount++;
            }
          }
        });

        if (cleanedCount > 0) {
          logDebug(`${cleanedCount} testin logları temizlendi`);
        }

        return newLogs;
      });

      // Tamamlanan ve belirli bir süre geçmiş testlerin adımlarını temizle
      setTestSteps(prev => {
        const newSteps = { ...prev };
        let cleanedCount = 0;

        Object.keys(newSteps).forEach(testId => {
          const test = currentTests[testId];
          if (test && test.status !== 'running' && test.endTime) {
            const endTime = new Date(test.endTime).getTime();
            const now = new Date().getTime();
            if (now - endTime > autoCleanupTime) {
              delete newSteps[testId];
              cleanedCount++;
            }
          }
        });

        if (cleanedCount > 0) {
          logDebug(`${cleanedCount} testin adımları temizlendi`);
        }

        return newSteps;
      });

      // Tamamlanan ve belirli bir süre geçmiş testleri temizle
      setCurrentTests(prev => {
        const newTests = { ...prev };
        let cleanedCount = 0;

        Object.keys(newTests).forEach(testId => {
          const test = newTests[testId];
          if (test.status !== 'running' && test.endTime) {
            const endTime = new Date(test.endTime).getTime();
            const now = new Date().getTime();
            if (now - endTime > autoCleanupTime) {
              delete newTests[testId];
              cleanedCount++;
            }
          }
        });

        if (cleanedCount > 0) {
          logDebug(`${cleanedCount} test temizlendi`);
        }

        return newTests;
      });

      // Eski bildirimleri temizle
      setNotifications(prev => {
        const now = new Date().getTime();
        return prev.filter(notification => {
          const timestamp = new Date(notification.timestamp).getTime();
          return now - timestamp <= autoCleanupTime;
        });
      });

    }, cleanupInterval);

    return () => clearInterval(interval);
  }, [socket, currentTests, autoCleanupTime, cleanupInterval, logDebug]);

  // Bildirim ekleme fonksiyonu
  const addNotification = useCallback((type, message) => {
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now(),
        type,
        message,
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  // Bildirimi temizleme fonksiyonu
  const clearNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Log sıkıştırma fonksiyonu
  const compressLogs = useCallback((logs) => {
    if (logs.length > maxLogEntries) {
      // Sadece son maxLogEntries kadar logu tut
      return logs.slice(-maxLogEntries);
    }
    return logs;
  }, [maxLogEntries]);

  // Test loglarına yeni log ekle
  const addLogToTest = useCallback((testId, level, message) => {
    setTestLogs(prev => {
      if (!prev[testId]) {
        return {
          ...prev,
          [testId]: [{
            level,
            message,
            timestamp: new Date().toISOString()
          }]
        };
      }

      const updatedLogs = [
        ...prev[testId],
        {
          level,
          message,
          timestamp: new Date().toISOString()
        }
      ];

      return {
        ...prev,
        [testId]: compressLogs(updatedLogs)
      };
    });
  }, [compressLogs]);

  // Test olaylarını işleme fonksiyonu
  const handleTestEvent = useCallback((eventType, data) => {
    const testId = data.id || data.testId;
    const testName = data.name || data.testName || `Test-${testId}`;

    switch(eventType) {
      case 'started':
        // Yeni test ekle
        setCurrentTests(prev => ({
          ...prev,
          [testId]: {
            id: testId,
            name: testName,
            status: 'running',
            startTime: new Date().toISOString(),
            currentStep: 0,
            totalSteps: data.totalSteps || data.steps || 0
          }
        }));

        // Test için log listesi oluştur
        setTestLogs(prev => ({
          ...prev,
          [testId]: [{
            level: 'INFO',
            message: `Test başladı: ${testName}`,
            timestamp: new Date().toISOString()
          }]
        }));

        // Bildirim ekle
        addNotification('info', `Test başladı: ${testName}`);
        break;

      case 'completed':
        // Test durumunu güncelle
        setCurrentTests(prev => {
          if (!prev[testId]) return prev;

          return {
            ...prev,
            [testId]: {
              ...prev[testId],
              status: 'completed',
              endTime: new Date().toISOString()
            }
          };
        });

        // Test loglarına tamamlandı mesajı ekle
        addLogToTest(testId, 'INFO', 'Test başarıyla tamamlandı');

        // Bildirim ekle
        addNotification('success', `Test başarıyla tamamlandı: ${testName}`);
        break;

      case 'failed':
        // Test durumunu güncelle
        setCurrentTests(prev => {
          if (!prev[testId]) return prev;

          return {
            ...prev,
            [testId]: {
              ...prev[testId],
              status: 'failed',
              endTime: new Date().toISOString(),
              error: data.error
            }
          };
        });

        // Test loglarına hata mesajı ekle
        addLogToTest(testId, 'ERROR', `Test başarısız oldu: ${data.error || 'Bilinmeyen hata'}`);

        // Bildirim ekle
        addNotification('error', `Test başarısız oldu: ${testName} - ${data.error || 'Bilinmeyen hata'}`);
        break;

      case 'log':
        // Test loglarına yeni log ekle
        const level = data.level || 'INFO';
        const message = data.message || data.text || '';
        addLogToTest(testId, level, message);

        // Eğer bu bir test başlangıcı ise ve henüz test oluşturulmamışsa
        if (message.includes('Test başlatılıyor') && !currentTests[testId]) {
          // Test adını çıkar
          const testNameMatch = message.match(/Test başlatılıyor: (.+)/);
          const extractedTestName = testNameMatch ? testNameMatch[1] : `Test-${testId}`;

          // Yeni test ekle
          setCurrentTests(prev => ({
            ...prev,
            [testId]: {
              id: testId,
              name: extractedTestName,
              status: 'running',
              startTime: new Date().toISOString(),
              currentStep: 0,
              totalSteps: 0
            }
          }));

          // Bildirim ekle
          addNotification('info', `Test başladı: ${extractedTestName}`);
        }

        // Eğer bu bir adım başlangıcı ise
        const stepMatch = message.match(/Test adımı çalıştırılıyor \((\d+)\/(\d+)\): (.+)/);
        if (stepMatch) {
          const stepNumber = parseInt(stepMatch[1], 10);
          const totalSteps = parseInt(stepMatch[2], 10);
          const description = stepMatch[3];

          // Test adımını güncelle
          setTestSteps(prev => ({
            ...prev,
            [testId]: {
              step: {
                current: stepNumber,
                total: totalSteps,
                description: description
              }
            }
          }));

          // Test durumunu güncelle
          setCurrentTests(prev => {
            if (!prev[testId]) return prev;

            return {
              ...prev,
              [testId]: {
                ...prev[testId],
                currentStep: stepNumber,
                totalSteps: totalSteps
              }
            };
          });
        }

        // Eğer test tamamlandıysa
        if (message.includes('Test başarıyla tamamlandı')) {
          // Test durumunu güncelle
          setCurrentTests(prev => {
            if (!prev[testId]) return prev;

            return {
              ...prev,
              [testId]: {
                ...prev[testId],
                status: 'completed',
                endTime: new Date().toISOString()
              }
            };
          });

          // Bildirim ekle
          addNotification('success', `Test başarıyla tamamlandı: ${currentTests[testId]?.name || `Test-${testId}`}`);
        }
        break;

      case 'step':
        // Test adımını güncelle
        setTestSteps(prev => ({
          ...prev,
          [testId]: {
            step: {
              current: data.stepNumber || data.step?.current || 0,
              total: data.totalSteps || data.step?.total || 0,
              description: data.description || data.step?.description || `Adım ${data.stepNumber || data.step?.current || 0}`
            }
          }
        }));

        // Test durumunu güncelle
        setCurrentTests(prev => {
          if (!prev[testId]) return prev;

          return {
            ...prev,
            [testId]: {
              ...prev[testId],
              currentStep: data.stepNumber || data.step?.current || 0,
              totalSteps: data.totalSteps || data.step?.total || 0
            }
          };
        });

        // Test loglarına adım başladı mesajı ekle
        addLogToTest(
          testId,
          'INFO',
          `Adım ${data.stepNumber || data.step?.current || 0} başladı: ${data.description || data.step?.description || ''}`
        );
        break;

      case 'stepCompleted':
        // Test loglarına adım tamamlandı mesajı ekle
        addLogToTest(
          testId,
          'INFO',
          `Adım ${data.stepNumber || data.step?.current || 0} tamamlandı${data.duration ? ` (${data.duration}ms)` : ''}`
        );
        break;

      default:
        logDebug(`Bilinmeyen olay türü: ${eventType}`, data);
        break;
    }
  }, [currentTests, addLogToTest, addNotification, logDebug]);

  // Agent verilerini işleme fonksiyonu
  const handleAgentData = useCallback((data) => {
    if (!data) return;

    // Agent listesini güncelle
    if (data.agents && Array.isArray(data.agents)) {
      // Gelen verileri Agent tipine dönüştür
      const formattedAgents = data.agents.map(agent => {
        // Eksik alanları varsayılan değerlerle doldur
        return {
          id: agent.id,
          name: agent.name || `Agent-${agent.id.substring(0, 8)}`,
          type: agent.type || AgentType.BROWSER,
          status: agent.status || AgentStatus.OFFLINE,
          browser: agent.browser || BrowserType.CHROMIUM,
          browserInfo: agent.browserInfo || {},
          systemInfo: agent.systemInfo || {},
          networkInfo: agent.networkInfo || { ipAddress: 'unknown' },
          performanceMetrics: agent.performanceMetrics || {
            cpuUsage: 0,
            memoryUsage: 0,
            diskUsage: 0,
            networkUsage: 0,
            uptime: 0,
            lastUpdated: new Date()
          },
          securityInfo: agent.securityInfo || { sslEnabled: false },
          loggingInfo: agent.loggingInfo || { logLevel: AgentLogLevel.INFO },
          authInfo: agent.authInfo || {},
          healthCheck: agent.healthCheck || {
            status: AgentHealthStatus.UNKNOWN,
            lastCheck: new Date()
          },
          capabilities: agent.capabilities || [],
          detailedCapabilities: agent.detailedCapabilities || {},
          serverId: agent.serverId || 'unknown',
          serverUrl: agent.serverUrl || '',
          created: agent.created ? new Date(agent.created) : new Date(),
          lastActivity: agent.lastActivity ? new Date(agent.lastActivity) : new Date(),
          currentRequest: agent.currentRequest || null,
          version: agent.version || '1.0.0',
          updateAvailable: agent.updateAvailable || false,
          lastUpdated: agent.lastUpdated ? new Date(agent.lastUpdated) : null
        };
      });

      setAgents(formattedAgents);
      logDebug(`${formattedAgents.length} agent bilgisi güncellendi`);
    }

    // Agent durum özetini güncelle
    if (data.poolStatus) {
      const summary = {
        total: data.poolStatus.totalAgents || 0,
        available: data.poolStatus.idleAgents || 0,
        busy: data.poolStatus.busyAgents || 0,
        offline: data.poolStatus.offlineAgents || 0,
        error: data.poolStatus.errorAgents || 0,
        maintenance: data.poolStatus.maintenanceAgents || 0,
        limit: data.poolStatus.maxAgents || 3
      };

      setAgentStatusSummary(summary);
      logDebug('Agent durum özeti güncellendi:', summary);
    }

    // Agent performans özetini güncelle (eğer varsa)
    if (data.performanceSummary) {
      setAgentPerformanceSummary(data.performanceSummary);
      logDebug('Agent performans özeti güncellendi');
    }
  }, [logDebug]);

  // WebSocket olaylarını dinle
  useEffect(() => {
    if (!socket) return;

    // Test başlama olayları
    socket.on('testStarted', data => handleTestEvent('started', data));
    socket.on('test_started', data => handleTestEvent('started', data));

    // Test tamamlanma olayları
    socket.on('testCompleted', data => handleTestEvent('completed', data));
    socket.on('test_completed', data => handleTestEvent('completed', data));

    // Test hata olayları
    socket.on('testFailed', data => handleTestEvent('failed', data));
    socket.on('test_failed', data => handleTestEvent('failed', data));

    // Log olayları
    socket.on('testLog', data => handleTestEvent('log', data));
    socket.on('test_log', data => handleTestEvent('log', data));
    socket.on('agent_log', data => handleTestEvent('log', data));

    // Adım olayları
    socket.on('testStep', data => handleTestEvent('step', data));
    socket.on('test_step', data => handleTestEvent('step', data));
    socket.on('testStepStarted', data => handleTestEvent('step', data));
    socket.on('test_step_started', data => handleTestEvent('step', data));

    // Adım tamamlanma olayları
    socket.on('testStepCompleted', data => handleTestEvent('stepCompleted', data));
    socket.on('test_step_completed', data => handleTestEvent('stepCompleted', data));

    // Agent durumu olayları
    socket.on('agentStatus', (data) => {
      logDebug('Agent durumu alındı:', data);
      handleAgentData(data);
    });

    // Agent detay olayları (yeni)
    socket.on('agentDetails', (data) => {
      logDebug('Agent detayları alındı:', data);
      // Tek bir agent'ın detaylarını güncelle
      if (data && data.id) {
        setAgents(prev => {
          const index = prev.findIndex(a => a.id === data.id);
          if (index === -1) return prev;

          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            ...data
          };
          return updated;
        });
      }
    });

    // Agent performans olayları (yeni)
    socket.on('agentPerformance', (data) => {
      logDebug('Agent performans bilgileri alındı:', data);
      // Agent performans metriklerini güncelle
      if (data && data.id) {
        setAgents(prev => {
          const index = prev.findIndex(a => a.id === data.id);
          if (index === -1) return prev;

          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            performanceMetrics: {
              ...updated[index].performanceMetrics,
              ...data.metrics,
              lastUpdated: new Date()
            }
          };
          return updated;
        });
      }
    });

    // Agent sağlık durumu olayları (yeni)
    socket.on('agentHealth', (data) => {
      logDebug('Agent sağlık durumu alındı:', data);
      // Agent sağlık durumunu güncelle
      if (data && data.id) {
        setAgents(prev => {
          const index = prev.findIndex(a => a.id === data.id);
          if (index === -1) return prev;

          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            healthCheck: {
              ...updated[index].healthCheck,
              ...data.health,
              lastCheck: new Date()
            }
          };
          return updated;
        });
      }
    });

    // Kuyruk durumu olayları
    socket.on('queueStatus', (data) => {
      logDebug('Kuyruk durumu alındı:', data);
    });

    // Test durumları olayları
    socket.on('testStatuses', (data) => {
      logDebug('Test durumları alındı:', data);
    });

    // Agent çökme olayları
    socket.on('agentCrashed', (data) => {
      logDebug('Agent çöktü:', data);
      addNotification('error', `Agent çöktü: ${data.agentId} - ${data.error || 'Bilinmeyen hata'}`);

      // Agent durumunu güncelle
      setAgents(prev => {
        const index = prev.findIndex(a => a.id === data.agentId);
        if (index === -1) return prev;

        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          status: AgentStatus.ERROR,
          error: data.error || 'Bilinmeyen hata'
        };
        return updated;
      });
    });

    // Agent durumu değişme olayları
    socket.on('agentStateChanged', (data) => {
      logDebug('Agent durumu değişti:', data);

      // Agent durumunu güncelle
      if (data && data.agentId) {
        setAgents(prev => {
          const index = prev.findIndex(a => a.id === data.agentId);
          if (index === -1) return prev;

          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: data.newState,
            lastActivity: new Date()
          };
          return updated;
        });
      }
    });

    // Temizleme fonksiyonu
    return () => {
      socket.off('testStarted');
      socket.off('test_started');
      socket.off('testCompleted');
      socket.off('test_completed');
      socket.off('testFailed');
      socket.off('test_failed');
      socket.off('testLog');
      socket.off('test_log');
      socket.off('agent_log');
      socket.off('testStep');
      socket.off('test_step');
      socket.off('testStepStarted');
      socket.off('test_step_started');
      socket.off('testStepCompleted');
      socket.off('test_step_completed');
      socket.off('agentStatus');
      socket.off('agentDetails');
      socket.off('agentPerformance');
      socket.off('agentHealth');
      socket.off('queueStatus');
      socket.off('testStatuses');
      socket.off('agentCrashed');
      socket.off('agentStateChanged');
    };
  }, [socket, handleTestEvent, handleAgentData, addNotification, logDebug]);

  // Belirli bir testin loglarını temizle
  const clearTestLogs = useCallback((testId) => {
    setTestLogs(prev => {
      const newLogs = { ...prev };
      delete newLogs[testId];
      return newLogs;
    });

    setTestSteps(prev => {
      const newSteps = { ...prev };
      delete newSteps[testId];
      return newSteps;
    });

    logDebug(`${testId} ID'li testin logları temizlendi`);
  }, [logDebug]);

  // Tüm logları temizle
  const clearAllLogs = useCallback(() => {
    setTestLogs({});
    setTestSteps({});
    setCurrentTests({});
    logDebug('Tüm loglar temizlendi');
  }, [logDebug]);

  // Testleri filtrele
  const filterTests = useCallback((status = 'all', searchTerm = '') => {
    return Object.values(currentTests).filter(test => {
      const matchesStatus = status === 'all' || test.status === status;
      const matchesSearch = !searchTerm ||
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.id.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [currentTests]);

  // ExampleSimulator sayfasından gelen test verilerini simüle etmek için
  const simulateTestData = useCallback((testId, testName, steps, logs) => {
    // Test başlat
    setCurrentTests(prev => ({
      ...prev,
      [testId]: {
        id: testId,
        name: testName,
        status: 'running',
        startTime: new Date().toISOString(),
        currentStep: 0,
        totalSteps: steps.length
      }
    }));

    // Test loglarını ekle
    setTestLogs(prev => ({
      ...prev,
      [testId]: logs.map(log => ({
        level: log.includes('[ERROR]') ? 'ERROR' :
               log.includes('[WARNING]') ? 'WARNING' : 'INFO',
        message: log.replace(/\[\w+\]\s/, ''),
        timestamp: new Date().toISOString()
      }))
    }));

    // Mevcut adımı ayarla (son adım)
    const currentStepIndex = steps.findIndex(step => step.status === 'RUNNING');
    const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : steps.length;

    setTestSteps(prev => ({
      ...prev,
      [testId]: {
        step: {
          current: currentStep,
          total: steps.length,
          description: currentStepIndex !== -1 ? steps[currentStepIndex].description : ''
        }
      }
    }));

    // Test durumunu güncelle
    setCurrentTests(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        currentStep,
        totalSteps: steps.length,
        status: currentStep === steps.length ? 'completed' : 'running'
      }
    }));

    // Bildirim ekle
    addNotification('info', `Test simülasyonu başladı: ${testName}`);

    logDebug(`Test simülasyonu başladı: ${testName} (${testId})`);
    return testId;
  }, [addNotification, logDebug]);

  // Agent yardımcı fonksiyonları
  const getAgentById = useCallback((id) => {
    return agents.find(agent => agent.id === id);
  }, [agents]);

  const getAgentsByStatus = useCallback((status) => {
    return agents.filter(agent => agent.status === status);
  }, [agents]);

  const getAgentsByType = useCallback((type) => {
    return agents.filter(agent => agent.type === type);
  }, [agents]);

  const getAgentsByBrowser = useCallback((browser) => {
    return agents.filter(agent => agent.browser === browser);
  }, [agents]);

  const getAgentsByHealth = useCallback((health) => {
    return agents.filter(agent => agent.healthCheck?.status === health);
  }, [agents]);

  return {
    // Bağlantı durumu
    connected,
    connectionState,

    // Test verileri
    testLogs,
    testSteps,
    currentTests,

    // İstatistikler ve bildirimler
    stats,
    notifications,

    // Hesaplanmış değerler
    runningTests,
    completedTests,
    failedTests,

    // Agent verileri
    agents,
    agentStatusSummary,
    agentPerformanceSummary,
    availableAgents,
    busyAgents,
    offlineAgents,
    errorAgents,

    // Agent yardımcı fonksiyonları
    getAgentById,
    getAgentsByStatus,
    getAgentsByType,
    getAgentsByBrowser,
    getAgentsByHealth,

    // Fonksiyonlar
    clearTestLogs,
    clearAllLogs,
    clearNotification,
    filterTests,
    simulateTestData
  };
};

export default useWebSocket;
