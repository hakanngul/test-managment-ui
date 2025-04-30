import { WebSocketManager } from './WebSocketManager';
import { ConnectionStatus, WebSocketConfig } from './types';

/**
 * WebSocket servisini yöneten singleton sınıf
 */
export class WebSocketService {
  private static instance: WebSocketService;
  private manager: WebSocketManager | null = null;
  
  /**
   * WebSocketService sınıfını oluşturur
   * @private Singleton pattern için private constructor
   */
  private constructor() {}
  
  /**
   * WebSocketService singleton örneğini döndürür
   * @returns WebSocketService örneği
   */
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
  
  /**
   * WebSocketManager'ı başlatır
   * @param config WebSocket yapılandırması
   */
  public initialize(config: WebSocketConfig): void {
    if (this.manager) {
      console.warn('WebSocketManager zaten başlatılmış');
      return;
    }
    
    this.manager = new WebSocketManager(config);
  }
  
  /**
   * WebSocketManager'ı döndürür
   * @returns WebSocketManager örneği
   * @throws WebSocketManager başlatılmamışsa hata fırlatır
   */
  public getManager(): WebSocketManager {
    if (!this.manager) {
      throw new Error('WebSocketManager henüz başlatılmadı. Önce initialize() metodunu çağırın.');
    }
    return this.manager;
  }
  
  /**
   * WebSocket bağlantısını başlatır
   * @throws WebSocketManager başlatılmamışsa hata fırlatır
   */
  public connect(): void {
    this.getManager().connect();
  }
  
  /**
   * WebSocket bağlantısını kapatır
   * @throws WebSocketManager başlatılmamışsa hata fırlatır
   */
  public disconnect(): void {
    this.getManager().disconnect();
  }
  
  /**
   * WebSocket bağlantısını yeniden başlatır
   * @throws WebSocketManager başlatılmamışsa hata fırlatır
   */
  public reconnect(): void {
    this.getManager().reconnect();
  }
  
  /**
   * WebSocket bağlantı durumunu döndürür
   * @returns Bağlantı durumu
   * @throws WebSocketManager başlatılmamışsa hata fırlatır
   */
  public getStatus(): ConnectionStatus {
    return this.getManager().getStatus();
  }
  
  /**
   * WebSocket bağlantısının kurulu olup olmadığını döndürür
   * @returns Bağlantı kurulu mu
   * @throws WebSocketManager başlatılmamışsa hata fırlatır
   */
  public isConnected(): boolean {
    return this.getManager().isConnected();
  }
}
