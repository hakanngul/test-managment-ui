import { io, Socket } from 'socket.io-client';
import {
  ConnectionStatus,
  WebSocketConfig,
  WebSocketListener,
  WebSocketState,
  AgentData,
  AgentStatus,
  AgentType,
  BrowserType,
  AgentHealthStatus,
  Test
} from './types/index';
import {
  connectionHandlers,
  testHandlers,
  logHandlers,
  stepHandlers
} from './handlers/index';
import { agentHandlers } from './handlers/agentHandlers';

/**
 * WebSocket bağlantısını yöneten sınıf
 */
export class WebSocketManager {
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private state: WebSocketState = {
    status: ConnectionStatus.DISCONNECTED,
    tests: {},
    logs: {},
    steps: {},
    agents: [],
    agentStatusSummary: {
      total: 0,
      available: 0,
      busy: 0,
      offline: 0,
      error: 0,
      maintenance: 0,
      limit: 3
    },
    agentPerformanceSummary: {
      avgCpuUsage: 0,
      avgMemoryUsage: 0,
      avgDiskUsage: 0,
      avgNetworkUsage: 0,
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      avgTestDuration: 0
    },
    queueStatus: {
      totalTests: 0,
      pendingTests: 0,
      runningTests: 0,
      completedTests: 0,
      failedTests: 0,
      maxConcurrentTests: 5
    },
    testStatusSummary: {
      total: 0,
      running: 0,
      completed: 0,
      failed: 0,
      aborted: 0,
      pending: 0,
      successRate: 0,
      avgDuration: 0
    },
    notifications: [],
    stats: {
      messagesReceived: 0,
      lastMessageTime: null,
      reconnectCount: 0,
      latency: 0,
      connectedSince: null
    }
  };
  private listeners: WebSocketListener[] = [];
  private pingInterval: number | null = null;
  private cleanupInterval: number | null = null;

  /**
   * WebSocketManager sınıfını oluşturur
   * @param config WebSocket yapılandırması
   */
  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  /**
   * WebSocket bağlantısını başlatır
   */
  public connect(): void {
    if (this.socket) {
      console.warn('WebSocket bağlantısı zaten kurulu');
      return;
    }

    // Bağlanıyor durumuna geç
    this.updateState((state) => ({
      ...state,
      status: ConnectionStatus.CONNECTING
    }));

    // Socket.IO bağlantısını oluştur
    this.socket = io(this.config.url, {
      transports: this.config.options?.transports || ['websocket'],
      reconnectionAttempts: this.config.options?.reconnectionAttempts || 5,
      reconnectionDelay: this.config.options?.reconnectionDelay || 1000,
      reconnectionDelayMax: this.config.options?.reconnectionDelayMax || 5000,
      randomizationFactor: this.config.options?.randomizationFactor || 0.5,
      timeout: this.config.options?.timeout || 20000,
      autoConnect: this.config.options?.autoConnect !== false,
      query: this.config.options?.query
    });

    // Bağlantı olaylarını dinle
    this.socket.on('connect', () => {
      connectionHandlers.handleConnect(this.socket!, this.updateState.bind(this));

      // İstatistikleri güncelle
      this.updateState((state) => ({
        ...state,
        stats: {
          ...state.stats,
          connectedSince: new Date().toISOString()
        }
      }));

      // Bildirim ekle
      this.addNotification('info', 'WebSocket sunucusuna bağlandı');

      // Client özelliklerini gönder
      this.socket?.emit('client_capabilities', {
        compression: true,
        clientType: 'web-ui',
        clientVersion: '1.0.0',
        platform: 'web-browser',
        userAgent: navigator.userAgent
      });

      // Kanallara abone ol
      this.socket?.emit('subscribe', ['agents', 'queue', 'system', 'launcher']);

      // Ping timer'ı başlat
      this.startPingTimer();
    });

    this.socket.on('disconnect', (reason) => {
      connectionHandlers.handleDisconnect(reason, this.updateState.bind(this));

      // Bildirim ekle
      this.addNotification('warning', 'WebSocket sunucusu ile bağlantı kesildi');

      // Ping timer'ı durdur
      this.stopPingTimer();
    });

    this.socket.on('connect_error', (error) => {
      connectionHandlers.handleConnectError(error, this.updateState.bind(this));

      // Bildirim ekle
      this.addNotification('error', `Bağlantı hatası: ${error.message}`);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Yeniden bağlanma denemesi: ${attemptNumber}`);

      // Bildirim ekle
      if (attemptNumber === 1) {
        this.addNotification('info', 'WebSocket sunucusuna yeniden bağlanılıyor...');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Yeniden bağlandı, deneme: ${attemptNumber}`);

      // İstatistikleri güncelle
      this.updateState((state) => ({
        ...state,
        stats: {
          ...state.stats,
          reconnectCount: (state.stats.reconnectCount || 0) + 1,
          connectedSince: new Date().toISOString()
        }
      }));

      // Bildirim ekle
      this.addNotification('success', 'WebSocket sunucusuna yeniden bağlandı');
    });

    // Tüm olayları konsola yazdır (debug için)
    this.socket.onAny((event, ...args) => {
      console.log(`WebSocket olayı alındı: ${event}`, args);

      // İstatistikleri güncelle
      this.updateState((state) => ({
        ...state,
        stats: {
          ...state.stats,
          messagesReceived: (state.stats.messagesReceived || 0) + 1,
          lastMessageTime: new Date().toISOString()
        }
      }));
    });

    // Test olaylarını dinle
    this.socket.on('testStarted', (data) => {
      testHandlers.handleTestStarted(data, this.updateState.bind(this));
    });

    this.socket.on('test_started', (data) => {
      testHandlers.handleTestStarted(data, this.updateState.bind(this));
    });

    this.socket.on('testCompleted', (data) => {
      testHandlers.handleTestCompleted(data, this.updateState.bind(this));
    });

    this.socket.on('test_completed', (data) => {
      testHandlers.handleTestCompleted(data, this.updateState.bind(this));
    });

    this.socket.on('testFailed', (data) => {
      testHandlers.handleTestFailed(data, this.updateState.bind(this));
    });

    this.socket.on('test_failed', (data) => {
      testHandlers.handleTestFailed(data, this.updateState.bind(this));
    });

    // Log olaylarını dinle
    this.socket.on('testLog', (data) => {
      logHandlers.handleTestLog(data, this.updateState.bind(this));
    });

    this.socket.on('test_log', (data) => {
      logHandlers.handleTestLog(data, this.updateState.bind(this));
    });

    this.socket.on('agent_log', (data) => {
      logHandlers.handleAgentLog(data, this.updateState.bind(this));
    });

    // Adım olaylarını dinle
    this.socket.on('testStepStarted', (data) => {
      stepHandlers.handleStepStarted(data, this.updateState.bind(this));
    });

    this.socket.on('test_step_started', (data) => {
      stepHandlers.handleStepStarted(data, this.updateState.bind(this));
    });

    this.socket.on('testStepCompleted', (data) => {
      stepHandlers.handleStepCompleted(data, this.updateState.bind(this));
    });

    this.socket.on('test_step_completed', (data) => {
      stepHandlers.handleStepCompleted(data, this.updateState.bind(this));
    });

    // Agent olaylarını dinle
    this.socket.on('agentStatus', (data) => {
      agentHandlers.handleAgentStatus(data, this.updateState.bind(this));
    });

    this.socket.on('agentDetails', (data) => {
      agentHandlers.handleAgentDetails(data, this.updateState.bind(this));
    });

    this.socket.on('agentPerformance', (data) => {
      agentHandlers.handleAgentPerformance(data, this.updateState.bind(this));
    });

    this.socket.on('agentHealth', (data) => {
      agentHandlers.handleAgentHealth(data, this.updateState.bind(this));
    });

    this.socket.on('agentCrashed', (data) => {
      agentHandlers.handleAgentCrashed(data, this.updateState.bind(this));

      // Bildirim ekle
      this.addNotification('error', `Agent çöktü: ${data.agentId} - ${data.error || 'Bilinmeyen hata'}`);
    });

    this.socket.on('agentStateChanged', (data) => {
      agentHandlers.handleAgentStateChanged(data, this.updateState.bind(this));
    });

    // Kuyruk durumu olaylarını dinle
    this.socket.on('queueStatus', (data) => {
      this.updateState((state) => ({
        ...state,
        queueStatus: {
          ...state.queueStatus,
          totalTests: data.totalTests || 0,
          pendingTests: data.pendingTests || 0,
          runningTests: data.runningTests || 0,
          completedTests: data.completedTests || 0,
          failedTests: data.failedTests || 0,
          queuedSince: data.queuedSince,
          estimatedWaitTime: data.estimatedWaitTime,
          maxConcurrentTests: data.maxConcurrentTests || state.queueStatus?.maxConcurrentTests || 5
        }
      }));

      console.log('Kuyruk durumu güncellendi:', data);
    });

    // Test durumları olaylarını dinle
    this.socket.on('testStatuses', (data) => {
      this.updateState((state) => ({
        ...state,
        testStatusSummary: {
          ...state.testStatusSummary,
          total: data.total || 0,
          running: data.running || 0,
          completed: data.completed || 0,
          failed: data.failed || 0,
          aborted: data.aborted || 0,
          pending: data.pending || 0,
          successRate: data.successRate || 0,
          avgDuration: data.avgDuration || 0
        }
      }));

      console.log('Test durumları güncellendi:', data);
    });

    // Temizleme aralığını başlat
    this.startCleanupInterval();
  }

  /**
   * WebSocket bağlantısını kapatır
   */
  public disconnect(): void {
    if (!this.socket) {
      console.warn('WebSocket bağlantısı zaten kapalı');
      return;
    }

    // Tüm olay dinleyicilerini kaldır
    if (this.socket) {
      // Bağlantı olayları
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.socket.off('connect_error');
      this.socket.off('reconnect_attempt');
      this.socket.off('reconnect');

      // Test olayları
      this.socket.off('testStarted');
      this.socket.off('test_started');
      this.socket.off('testCompleted');
      this.socket.off('test_completed');
      this.socket.off('testFailed');
      this.socket.off('test_failed');

      // Log olayları
      this.socket.off('testLog');
      this.socket.off('test_log');
      this.socket.off('agent_log');

      // Adım olayları
      this.socket.off('testStepStarted');
      this.socket.off('test_step_started');
      this.socket.off('testStepCompleted');
      this.socket.off('test_step_completed');

      // Agent olayları
      this.socket.off('agentStatus');
      this.socket.off('agentDetails');
      this.socket.off('agentPerformance');
      this.socket.off('agentHealth');
      this.socket.off('agentCrashed');
      this.socket.off('agentStateChanged');

      // Kuyruk ve test durumları olayları
      this.socket.off('queueStatus');
      this.socket.off('testStatuses');

      // Tüm olayları dinlemeyi durdur
      this.socket.offAny();
    }

    this.socket.disconnect();
    this.socket = null;

    this.updateState((state) => ({
      ...state,
      status: ConnectionStatus.DISCONNECTED
    }));

    // Ping ve temizleme aralıklarını durdur
    this.stopPingTimer();
    this.stopCleanupInterval();
  }

  /**
   * WebSocket bağlantısını yeniden başlatır
   */
  public reconnect(): void {
    this.disconnect();
    this.connect();
  }

  /**
   * Ping timer'ı başlatır
   */
  private startPingTimer(): void {
    this.stopPingTimer();

    this.pingInterval = setInterval(() => {
      if (!this.socket || !this.isConnected()) return;

      const start = Date.now();
      this.socket.emit('ping', {}, () => {
        const latency = Date.now() - start;

        this.updateState((state) => ({
          ...state,
          stats: {
            ...state.stats,
            latency
          }
        }));

        console.log(`Ping: ${latency}ms`);
      });
    }, this.config.options?.pingInterval || 30000);
  }

  /**
   * Ping timer'ı durdurur
   */
  private stopPingTimer(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Temizleme aralığını başlatır
   */
  private startCleanupInterval(): void {
    this.stopCleanupInterval();

    this.cleanupInterval = setInterval(() => {
      console.log('Otomatik temizleme çalışıyor...');

      // Eski bildirimleri temizle
      this.updateState((state) => {
        const now = new Date().getTime();
        const autoCleanupTime = this.config.options?.autoCleanupTime || 60 * 60 * 1000; // 1 saat

        return {
          ...state,
          notifications: state.notifications.filter(notification => {
            const timestamp = new Date(notification.timestamp).getTime();
            return now - timestamp <= autoCleanupTime;
          })
        };
      });

      // Tamamlanan ve belirli bir süre geçmiş testleri temizle
      this.cleanupOldTests();

    }, this.config.options?.cleanupInterval || 15 * 60 * 1000); // 15 dakika
  }

  /**
   * Temizleme aralığını durdurur
   */
  private stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Eski testleri temizler
   */
  private cleanupOldTests(): void {
    const autoCleanupTime = this.config.options?.autoCleanupTime || 60 * 60 * 1000; // 1 saat

    this.updateState((state) => {
      const now = new Date().getTime();
      const newTests = { ...state.tests };
      const newLogs = { ...state.logs };
      const newSteps = { ...state.steps };
      let cleanedCount = 0;

      Object.keys(newTests).forEach(testId => {
        const test = newTests[testId];
        if (test.status !== 'running' && test.endTime) {
          const endTime = new Date(test.endTime).getTime();
          if (now - endTime > autoCleanupTime) {
            delete newTests[testId];
            delete newLogs[testId];
            delete newSteps[testId];
            cleanedCount++;
          }
        }
      });

      if (cleanedCount > 0) {
        console.log(`${cleanedCount} test temizlendi`);
      }

      return {
        ...state,
        tests: newTests,
        logs: newLogs,
        steps: newSteps
      };
    });
  }

  /**
   * Bildirim ekler
   * @param type Bildirim tipi
   * @param message Bildirim mesajı
   */
  private addNotification(type: string, message: string): void {
    this.updateState((state) => ({
      ...state,
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          type,
          message,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  }

  /**
   * Bildirimi temizler
   * @param notificationId Bildirim ID
   */
  public clearNotification(notificationId: number): void {
    this.updateState((state) => ({
      ...state,
      notifications: state.notifications.filter(n => n.id !== notificationId)
    }));
  }

  /**
   * WebSocket durumunu günceller ve dinleyicilere bildirir
   * @param updater Durum güncelleyici fonksiyon
   */
  private updateState(updater: (state: WebSocketState) => WebSocketState): void {
    const prevState = { ...this.state };
    this.state = updater(prevState);

    // Durum değişikliklerini kontrol et ve dinleyicilere bildir
    if (prevState.status !== this.state.status) {
      this.notifyListeners('onStatusChange', this.state.status);
    }

    if (prevState.tests !== this.state.tests) {
      this.notifyListeners('onTestsChange', this.state.tests);
    }

    if (prevState.logs !== this.state.logs) {
      this.notifyListeners('onLogsChange', this.state.logs);
    }

    if (prevState.steps !== this.state.steps) {
      this.notifyListeners('onStepsChange', this.state.steps);
    }

    if (prevState.agents !== this.state.agents) {
      this.notifyListeners('onAgentsChange', this.state.agents);
    }

    if (prevState.agentStatusSummary !== this.state.agentStatusSummary) {
      this.notifyListeners('onAgentStatusSummaryChange', this.state.agentStatusSummary);
    }

    if (prevState.agentPerformanceSummary !== this.state.agentPerformanceSummary) {
      this.notifyListeners('onAgentPerformanceSummaryChange', this.state.agentPerformanceSummary);
    }

    if (prevState.notifications !== this.state.notifications) {
      this.notifyListeners('onNotificationsChange', this.state.notifications);
    }

    if (prevState.queueStatus !== this.state.queueStatus && this.state.queueStatus) {
      this.notifyListeners('onQueueStatusChange', this.state.queueStatus);
    }

    if (prevState.testStatusSummary !== this.state.testStatusSummary && this.state.testStatusSummary) {
      this.notifyListeners('onTestStatusSummaryChange', this.state.testStatusSummary);
    }

    if (prevState.stats !== this.state.stats) {
      this.notifyListeners('onStatsChange', this.state.stats);
    }

    if (this.state.error && prevState.error !== this.state.error) {
      this.notifyListeners('onError', this.state.error);
    }
  }

  /**
   * Dinleyicilere bildirim gönderir
   * @param event Olay adı
   * @param data Olay verisi
   */
  private notifyListeners<K extends keyof WebSocketListener>(
    event: K,
    data: Parameters<NonNullable<WebSocketListener[K]>>[0]
  ): void {
    this.listeners.forEach((listener) => {
      const callback = listener[event];
      if (callback) {
        try {
          // @ts-ignore
          callback(data);
        } catch (error) {
          console.error(`Dinleyici hatası (${event}):`, error);
        }
      }
    });
  }

  /**
   * WebSocket durumunu dinlemek için bir dinleyici ekler
   * @param listener Dinleyici
   * @returns Dinleyiciyi kaldırmak için fonksiyon
   */
  public addListener(listener: WebSocketListener): () => void {
    this.listeners.push(listener);

    // Mevcut durumu yeni dinleyiciye bildir
    if (listener.onStatusChange) {
      listener.onStatusChange(this.state.status);
    }

    if (listener.onTestsChange) {
      listener.onTestsChange(this.state.tests);
    }

    if (listener.onLogsChange) {
      listener.onLogsChange(this.state.logs);
    }

    if (listener.onStepsChange) {
      listener.onStepsChange(this.state.steps);
    }

    if (listener.onAgentsChange) {
      listener.onAgentsChange(this.state.agents);
    }

    if (listener.onAgentStatusSummaryChange) {
      listener.onAgentStatusSummaryChange(this.state.agentStatusSummary);
    }

    if (listener.onAgentPerformanceSummaryChange) {
      listener.onAgentPerformanceSummaryChange(this.state.agentPerformanceSummary);
    }

    if (listener.onNotificationsChange) {
      listener.onNotificationsChange(this.state.notifications);
    }

    if (listener.onQueueStatusChange && this.state.queueStatus) {
      listener.onQueueStatusChange(this.state.queueStatus);
    }

    if (listener.onTestStatusSummaryChange && this.state.testStatusSummary) {
      listener.onTestStatusSummaryChange(this.state.testStatusSummary);
    }

    if (listener.onStatsChange) {
      listener.onStatsChange(this.state.stats);
    }

    if (this.state.error && listener.onError) {
      listener.onError(this.state.error);
    }

    // Dinleyiciyi kaldırmak için fonksiyon döndür
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * WebSocket durumunu döndürür
   * @returns WebSocket durumu
   */
  public getState(): WebSocketState {
    return { ...this.state };
  }

  /**
   * WebSocket bağlantı durumunu döndürür
   * @returns Bağlantı durumu
   */
  public getStatus(): ConnectionStatus {
    return this.state.status;
  }

  /**
   * WebSocket bağlantısının kurulu olup olmadığını döndürür
   * @returns Bağlantı kurulu mu
   */
  public isConnected(): boolean {
    return this.state.status === ConnectionStatus.CONNECTED;
  }

  /**
   * Belirli bir agent'ı ID'ye göre bulur
   * @param id Agent ID
   * @returns Bulunan agent veya undefined
   */
  public getAgentById(id: string): AgentData | undefined {
    return agentHandlers.getAgentById(this.state.agents, id);
  }

  /**
   * Agent'ları duruma göre filtreler
   * @param status Agent durumu
   * @returns Filtrelenmiş agent listesi
   */
  public getAgentsByStatus(status: AgentStatus): AgentData[] {
    return agentHandlers.getAgentsByStatus(this.state.agents, status);
  }

  /**
   * Agent'ları tipine göre filtreler
   * @param type Agent tipi
   * @returns Filtrelenmiş agent listesi
   */
  public getAgentsByType(type: AgentType): AgentData[] {
    return agentHandlers.getAgentsByType(this.state.agents, type);
  }

  /**
   * Agent'ları tarayıcı tipine göre filtreler
   * @param browser Tarayıcı tipi
   * @returns Filtrelenmiş agent listesi
   */
  public getAgentsByBrowser(browser: BrowserType): AgentData[] {
    return agentHandlers.getAgentsByBrowser(this.state.agents, browser);
  }

  /**
   * Agent'ları sağlık durumuna göre filtreler
   * @param health Sağlık durumu
   * @returns Filtrelenmiş agent listesi
   */
  public getAgentsByHealth(health: AgentHealthStatus): AgentData[] {
    return agentHandlers.getAgentsByHealth(this.state.agents, health);
  }

  /**
   * Testleri filtreler
   * @param status Test durumu (all, running, completed, failed)
   * @param searchTerm Arama terimi
   * @returns Filtrelenmiş test listesi
   */
  public filterTests(status: string = 'all', searchTerm: string = ''): Test[] {
    return Object.values(this.state.tests).filter(test => {
      const matchesStatus = status === 'all' || test.status === status;
      const matchesSearch = !searchTerm ||
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.id.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }

  /**
   * Test verilerini simüle eder (test için)
   * @param testId Test ID
   * @param testName Test adı
   * @param steps Test adımları
   * @param logs Test logları
   * @returns Test ID
   */
  public simulateTestData(
    testId: string,
    testName: string,
    steps: any[],
    logs: string[]
  ): string {
    // Test başlat
    testHandlers.handleTestStarted({
      id: testId,
      name: testName,
      totalSteps: steps.length
    }, this.updateState.bind(this));

    // Test loglarını ekle
    logs.forEach((log) => {
      const level = log.includes('[ERROR]') ? 'ERROR' :
                   log.includes('[WARNING]') ? 'WARNING' : 'INFO';
      const message = log.replace(/\[\w+\]\s/, '');

      logHandlers.handleTestLog({
        testId,
        level,
        message
      }, this.updateState.bind(this));
    });

    // Mevcut adımı ayarla (son adım)
    const currentStepIndex = steps.findIndex(step => step.status === 'RUNNING');
    if (currentStepIndex !== -1) {
      stepHandlers.handleStepStarted({
        testId,
        stepNumber: currentStepIndex + 1,
        totalSteps: steps.length,
        description: steps[currentStepIndex].description
      }, this.updateState.bind(this));
    }

    return testId;
  }

  /**
   * Belirli bir testin loglarını temizler
   * @param testId Test ID
   */
  public clearTestLogs(testId: string): void {
    this.updateState((state) => {
      const newLogs = { ...state.logs };
      delete newLogs[testId];
      return {
        ...state,
        logs: newLogs
      };
    });
  }

  /**
   * Tüm logları temizler
   */
  public clearAllLogs(): void {
    this.updateState((state) => ({
      ...state,
      tests: {},
      logs: {},
      steps: {}
    }));
  }
}
