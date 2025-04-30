import { io, Socket } from 'socket.io-client';
import {
  ConnectionStatus,
  WebSocketConfig,
  WebSocketListener,
  WebSocketState
} from './types';
import {
  connectionHandlers,
  testHandlers,
  logHandlers,
  stepHandlers
} from './handlers';

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
    steps: {}
  };
  private listeners: WebSocketListener[] = [];
  
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
      timeout: this.config.options?.timeout || 20000,
      autoConnect: this.config.options?.autoConnect !== false,
      query: this.config.options?.query
    });
    
    // Bağlantı olaylarını dinle
    this.socket.on('connect', () => {
      connectionHandlers.handleConnect(this.socket!, this.updateState.bind(this));
    });
    
    this.socket.on('disconnect', (reason) => {
      connectionHandlers.handleDisconnect(reason, this.updateState.bind(this));
    });
    
    this.socket.on('connect_error', (error) => {
      connectionHandlers.handleConnectError(error, this.updateState.bind(this));
    });
    
    // Tüm olayları konsola yazdır (debug için)
    this.socket.onAny((event, ...args) => {
      console.log(`WebSocket olayı alındı: ${event}`, args);
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
  }
  
  /**
   * WebSocket bağlantısını kapatır
   */
  public disconnect(): void {
    if (!this.socket) {
      console.warn('WebSocket bağlantısı zaten kapalı');
      return;
    }
    
    this.socket.disconnect();
    this.socket = null;
    
    this.updateState((state) => ({
      ...state,
      status: ConnectionStatus.DISCONNECTED
    }));
  }
  
  /**
   * WebSocket bağlantısını yeniden başlatır
   */
  public reconnect(): void {
    this.disconnect();
    this.connect();
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
