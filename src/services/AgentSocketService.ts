import { io, Socket } from 'socket.io-client';
import { Agent, QueuedRequest, SystemResource } from '../models/database/schemas';

// Socket.IO event types
type AgentSocketEvents = {
  initial_data: (data: {
    agents: Agent[];
    queuedRequests: QueuedRequest[];
    systemResources: SystemResource;
    agentLauncher: any;
  }) => void;
  agents_update: (agents: Agent[]) => void;
  agent_update_all: (agents: Agent[]) => void; // Alternatif event ismi
  agent_update: (agent: Agent) => void;
  agent_created: (agent: Agent) => void;
  agent_deleted: (data: { id: string }) => void;
  queue_update_all: (requests: QueuedRequest[]) => void;
  queue_update: (request: QueuedRequest) => void;
  queue_created: (request: QueuedRequest) => void;
  queue_deleted: (data: { id: string }) => void;
  system_resources_update: (resources: SystemResource) => void;
  launcher_update: (launcher: any) => void;
};

class AgentSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private connected = false;
  private reconnectTimer: number | null = null;
  private readonly RECONNECT_INTERVAL = 5000; // 5 seconds

  private connectionAttempts = 0;
  private readonly MAX_CONNECTION_ATTEMPTS = 10;
  private readonly MAX_RECONNECT_INTERVAL = 30000; // 30 seconds

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

      this.socket = io(this.serverUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        autoConnect: true,
        forceNew: true
      });

      this.socket.on('connect', () => {
        console.log('Connected to agent service');
        this.connected = true;
        this.connectionAttempts = 0; // Bağlantı başarılı olduğunda sayacı sıfırla
        this.clearReconnectTimer();

        // Subscribe to channels
        this.socket?.emit('subscribe', ['agents', 'queue', 'system', 'launcher']);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from agent service');
        this.connected = false;
        this.startReconnectTimer();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.connected = false;
        this.startReconnectTimer();
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.connected = false;

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
    this.clearReconnectTimer();
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

    // Yeniden bağlanma zamanlayıcısını temizle
    this.clearReconnectTimer();

    // Yeniden bağlanmayı dene
    this.connect();
  }
}

// Create singleton instance
const agentSocketService = new AgentSocketService();

export default agentSocketService;
