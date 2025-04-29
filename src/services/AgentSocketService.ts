import { io, Socket } from 'socket.io-client';
import { Agent, QueuedRequest, SystemResource } from '../models/database/schemas';
import pako from 'pako'; // Sıkıştırma için

// Socket.IO event types
type AgentSocketEvents = {
  initial_data: (data: {
    agents: Agent[];
    queuedRequests: QueuedRequest[];
    systemResources: SystemResource;
    agentLauncher: any;
    timestamp?: number;
    error?: string;
  }) => void;
  initial_data_compressed: (compressedData: string) => void;
  agents_update: (agents: Agent[]) => void;
  agents_update_compressed: (compressedData: string) => void;
  agent_update_all: (agents: Agent[]) => void; // Alternatif event ismi
  agent_update_all_compressed: (compressedData: string) => void;
  agent_update: (agent: Agent) => void;
  agent_created: (agent: Agent) => void;
  agent_deleted: (data: { id: string }) => void;
  queue_update_all: (requests: QueuedRequest[]) => void;
  queue_update_all_compressed: (compressedData: string) => void;
  queue_update: (request: QueuedRequest) => void;
  queue_created: (request: QueuedRequest) => void;
  queue_deleted: (data: { id: string }) => void;
  system_resources_update: (resources: SystemResource) => void;
  system_resources_update_compressed: (compressedData: string) => void;
  launcher_update: (launcher: any) => void;
  launcher_update_compressed: (compressedData: string) => void;
  pong: (data: { time: number; status: string }) => void;
};

class AgentSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private connected = false;
  private reconnectTimer: number | null = null;
  private readonly RECONNECT_INTERVAL = 5000; // 5 seconds
  private readonly COMPRESSION_ENABLED = true; // Sıkıştırma desteği
  private readonly PING_INTERVAL = 30000; // 30 saniyede bir ping gönder
  private pingTimer: number | null = null;
  private lastPingTime = 0;
  private pingResponseTime = 0;

  private connectionAttempts = 0;
  private readonly MAX_CONNECTION_ATTEMPTS = 10;
  private readonly MAX_RECONNECT_INTERVAL = 30000; // 30 seconds

  // Bağlantı durumu değişikliği için custom event
  private dispatchConnectionChangeEvent(connected: boolean): void {
    const event = new CustomEvent('agent-socket-connection-change', {
      detail: { connected }
    });
    window.dispatchEvent(event);
  }

  // Sıkıştırılmış veriyi çöz
  private decompressData(compressedData: string): any {
    try {
      // Base64 string'i buffer'a dönüştür
      const binaryString = atob(compressedData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Sıkıştırılmış veriyi çöz
      const decompressed = pako.inflate(bytes);

      // Uint8Array'i string'e dönüştür
      const decompressedStr = new TextDecoder().decode(decompressed);

      // JSON parse
      return JSON.parse(decompressedStr);
    } catch (error) {
      console.error('Error decompressing data:', error);
      return null;
    }
  }

  constructor(private readonly serverUrl: string = 'http://localhost:3001') {}

  /**
   * Connect to the agent service WebSocket server
   */
  connect(): void {
    if (this.socket) {
      return;
    }

    try {
      // Bağlantı denemesi sayısını artır
      this.connectionAttempts++;

      // Maksimum deneme sayısını aştıysak, daha fazla deneme yapma
      if (this.connectionAttempts > this.MAX_CONNECTION_ATTEMPTS) {
        console.warn(`Maximum connection attempts (${this.MAX_CONNECTION_ATTEMPTS}) reached. Stopping reconnect attempts.`);
        this.clearReconnectTimer();
        return;
      }

      console.log(`Connecting to agent service (attempt ${this.connectionAttempts}/${this.MAX_CONNECTION_ATTEMPTS})...`);

      // Performans optimizasyonları
      this.socket = io(this.serverUrl, {
        reconnectionAttempts: 10,        // Daha fazla yeniden bağlanma denemesi
        reconnectionDelay: 1000,         // İlk deneme için 1 saniye bekle
        reconnectionDelayMax: 10000,     // Maksimum 10 saniye bekleme
        timeout: 20000,                  // Bağlantı zaman aşımını artır
        autoConnect: true,
        forceNew: true,
        transports: ['websocket'],       // Polling yerine sadece WebSocket kullan (daha hızlı)
        upgrade: false,                  // Polling'den WebSocket'e yükseltmeyi devre dışı bırak
        pingInterval: 25000,             // Ping aralığını artır (varsayılan 25000)
        pingTimeout: 20000,              // Ping zaman aşımını artır (varsayılan 20000)
        query: {                         // Bağlantı parametreleri
          clientId: `web-client-${Date.now()}`,
          clientType: 'web-ui'
        }
      });

      this.socket.on('connect', () => {
        console.log('Connected to agent service');
        this.connected = true;
        this.connectionAttempts = 0; // Bağlantı başarılı olduğunda sayacı sıfırla
        this.clearReconnectTimer();

        // Bağlantı durumu değişikliği event'ini tetikle
        this.dispatchConnectionChangeEvent(true);

        // Client özelliklerini gönder
        this.socket?.emit('client_capabilities', {
          compression: this.COMPRESSION_ENABLED,
          clientType: 'web-ui',
          clientVersion: '1.0.0',
          platform: navigator.platform,
          userAgent: navigator.userAgent
        });

        // Subscribe to channels
        this.socket?.emit('subscribe', ['agents', 'queue', 'system', 'launcher']);

        // Ping timer'ı başlat
        this.startPingTimer();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from agent service');
        this.connected = false;

        // Bağlantı durumu değişikliği event'ini tetikle
        this.dispatchConnectionChangeEvent(false);

        this.startReconnectTimer();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.connected = false;

        // Bağlantı durumu değişikliği event'ini tetikle
        this.dispatchConnectionChangeEvent(false);

        this.startReconnectTimer();
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.connected = false;

        // Bağlantı durumu değişikliği event'ini tetikle
        this.dispatchConnectionChangeEvent(false);

        // Hata durumunda bağlantıyı yeniden kurmayı dene
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }

        this.startReconnectTimer();
      });

      // Setup event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
      this.connected = false;

      // Bağlantı durumu değişikliği event'ini tetikle
      this.dispatchConnectionChangeEvent(false);

      this.startReconnectTimer();
    }
  }

  /**
   * Disconnect from the agent service WebSocket server
   */
  disconnect(): void {
    if (!this.socket) {
      return;
    }

    this.socket.disconnect();
    this.socket = null;
    this.connected = false;

    // Bağlantı durumu değişikliği event'ini tetikle
    this.dispatchConnectionChangeEvent(false);

    this.clearReconnectTimer();
    this.clearPingTimer();
  }

  /**
   * Check if connected to the agent service
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Add event listener
   * @param event Event name
   * @param callback Callback function
   */
  on<E extends keyof AgentSocketEvents>(
    event: E,
    callback: AgentSocketEvents[E]
  ): void {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set());
    }

    this.listeners.get(event as string)?.add(callback as Function);

    // If already connected, add listener to socket
    if (this.socket) {
      this.socket.on(event as string, callback as any);
    }
  }

  /**
   * Remove event listener
   * @param event Event name
   * @param callback Callback function
   */
  off<E extends keyof AgentSocketEvents>(
    event: E,
    callback: AgentSocketEvents[E]
  ): void {
    const eventListeners = this.listeners.get(event as string);
    if (eventListeners) {
      eventListeners.delete(callback as Function);
    }

    // If connected, remove listener from socket
    if (this.socket) {
      this.socket.off(event as string, callback as any);
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) {
      return;
    }

    // Add all registered listeners to socket
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback as any);
      });
    });

    // Sıkıştırılmış veri event'lerini dinle
    if (this.COMPRESSION_ENABLED) {
      // Initial data
      this.socket.on('initial_data_compressed', (compressedData: string) => {
        const data = this.decompressData(compressedData);
        if (data) {
          this.emitToListeners('initial_data', data);
        }
      });

      // Agents update
      this.socket.on('agents_update_compressed', (compressedData: string) => {
        const data = this.decompressData(compressedData);
        if (data) {
          this.emitToListeners('agents_update', data);
        }
      });

      // Agent update all
      this.socket.on('agent_update_all_compressed', (compressedData: string) => {
        const data = this.decompressData(compressedData);
        if (data) {
          this.emitToListeners('agent_update_all', data);
        }
      });

      // Queue update
      this.socket.on('queue_update_all_compressed', (compressedData: string) => {
        const data = this.decompressData(compressedData);
        if (data) {
          this.emitToListeners('queue_update_all', data);
        }
      });

      // System resources update
      this.socket.on('system_resources_update_compressed', (compressedData: string) => {
        const data = this.decompressData(compressedData);
        if (data) {
          this.emitToListeners('system_resources_update', data);
        }
      });

      // Launcher update
      this.socket.on('launcher_update_compressed', (compressedData: string) => {
        const data = this.decompressData(compressedData);
        if (data) {
          this.emitToListeners('launcher_update', data);
        }
      });
    }

    // Ping-pong
    this.socket.on('pong', (data: { time: number, status: string }) => {
      if (data.time && this.lastPingTime) {
        this.pingResponseTime = Date.now() - this.lastPingTime;
        console.log(`Ping response time: ${this.pingResponseTime}ms`);
      }
    });
  }

  /**
   * Emit event to registered listeners
   */
  private emitToListeners(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for event ${event}:`, error);
        }
      });
    }
  }

  /**
   * Start reconnect timer
   */
  private startReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      return;
    }

    // Bağlantı denemesi sayısına göre artan bir bekleme süresi hesapla
    // Her deneme için bekleme süresini artır, ancak maksimum değeri aşma
    const interval = Math.min(
      this.RECONNECT_INTERVAL * Math.pow(1.5, this.connectionAttempts - 1),
      this.MAX_RECONNECT_INTERVAL
    );

    console.log(`Setting reconnect timer for ${interval}ms (attempt ${this.connectionAttempts})`);

    this.reconnectTimer = window.setInterval(() => {
      console.log('Attempting to reconnect to agent service...');

      // Mevcut soketi temizle
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }

      this.connect();
    }, interval);
  }

  /**
   * Clear reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Start ping timer
   */
  private startPingTimer(): void {
    if (this.pingTimer !== null) {
      return;
    }

    this.pingTimer = window.setInterval(() => {
      if (!this.socket || !this.connected) {
        this.clearPingTimer();
        return;
      }

      this.lastPingTime = Date.now();
      this.socket.emit('ping', (response: any) => {
        if (response && response.time) {
          this.pingResponseTime = Date.now() - this.lastPingTime;
          console.log(`Ping response time: ${this.pingResponseTime}ms`);
        }
      });
    }, this.PING_INTERVAL);
  }

  /**
   * Clear ping timer
   */
  private clearPingTimer(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  /**
   * Get ping response time
   */
  public getPingTime(): number {
    return this.pingResponseTime;
  }

  /**
   * Manually reset connection state and attempt to reconnect
   * This can be called from UI when user wants to force a reconnection
   */
  public resetConnection(): void {
    console.log('Manually resetting connection...');

    // Mevcut bağlantıyı kapat
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Bağlantı durumunu sıfırla
    this.connected = false;
    this.connectionAttempts = 0;

    // Bağlantı durumu değişikliği event'ini tetikle
    this.dispatchConnectionChangeEvent(false);

    // Yeniden bağlanma zamanlayıcısını temizle
    this.clearReconnectTimer();

    // Ping timer'ı temizle
    this.clearPingTimer();

    // Yeniden bağlanmayı dene
    this.connect();
  }
}

// Create singleton instance
const agentSocketService = new AgentSocketService();

export default agentSocketService;
