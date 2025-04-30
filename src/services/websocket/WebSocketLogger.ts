import { Socket } from 'socket.io-client';

/**
 * WebSocket olayı
 */
export interface WebSocketLogEvent {
  id: number;
  event: string;
  data: any;
  timestamp: string;
  category: string;
}

/**
 * WebSocket logger yapılandırması
 */
export interface WebSocketLoggerConfig {
  maxEvents?: number;
  logToConsole?: boolean;
  saveToLocalStorage?: boolean;
  localStorageKey?: string;
  categories?: string[];
}

/**
 * WebSocket olaylarını kaydetmek ve filtrelemek için kullanılan sınıf
 */
export class WebSocketLogger {
  private events: WebSocketLogEvent[] = [];
  private socket: Socket | null = null;
  private config: WebSocketLoggerConfig;
  private isRecording: boolean = false;
  private onEventCallback: ((event: WebSocketLogEvent) => void) | null = null;

  /**
   * WebSocketLogger sınıfını oluşturur
   * @param config Logger yapılandırması
   */
  constructor(config: WebSocketLoggerConfig = {}) {
    this.config = {
      maxEvents: config.maxEvents || 1000,
      logToConsole: config.logToConsole !== false,
      saveToLocalStorage: config.saveToLocalStorage || false,
      localStorageKey: config.localStorageKey || 'websocket_logs',
      categories: config.categories || ['connection', 'test', 'agent', 'queue', 'other']
    };

    // LocalStorage'dan olayları yükle
    if (this.config.saveToLocalStorage) {
      this.loadEventsFromLocalStorage();
    }
  }

  /**
   * Socket.IO instance'ını ayarlar
   * @param socket Socket.IO instance'ı
   */
  public setSocket(socket: Socket): void {
    if (this.socket) {
      this.detachFromSocket();
    }

    this.socket = socket;
    
    if (this.isRecording) {
      this.attachToSocket();
    }
  }

  /**
   * Kayıt işlemini başlatır
   */
  public startRecording(): void {
    if (this.isRecording) return;
    
    this.isRecording = true;
    
    if (this.socket) {
      this.attachToSocket();
    }
  }

  /**
   * Kayıt işlemini durdurur
   */
  public stopRecording(): void {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    
    if (this.socket) {
      this.detachFromSocket();
    }
  }

  /**
   * Kayıt durumunu döndürür
   * @returns Kayıt durumu
   */
  public isRecordingActive(): boolean {
    return this.isRecording;
  }

  /**
   * Socket.IO instance'ına bağlanır ve olayları dinlemeye başlar
   */
  private attachToSocket(): void {
    if (!this.socket) return;

    // Tüm olayları dinle
    this.socket.onAny((event, ...args) => {
      this.logEvent(event, args);
    });
  }

  /**
   * Socket.IO instance'ından ayrılır ve olayları dinlemeyi durdurur
   */
  private detachFromSocket(): void {
    if (!this.socket) return;

    // Tüm olay dinleyicilerini kaldır
    this.socket.offAny();
  }

  /**
   * Olayı kategorilere ayırır
   * @param eventName Olay adı
   * @returns Olay kategorisi
   */
  private categorizeEvent(eventName: string): string {
    if (eventName.startsWith('connect') || eventName === 'disconnect' || eventName === 'reconnect') {
      return 'connection';
    } else if (eventName.startsWith('test') || eventName.includes('test_')) {
      return 'test';
    } else if (eventName.startsWith('agent') || eventName.includes('agent_')) {
      return 'agent';
    } else if (eventName === 'queueStatus' || eventName.includes('queue')) {
      return 'queue';
    } else {
      return 'other';
    }
  }

  /**
   * Olayı kaydeder
   * @param event Olay adı
   * @param data Olay verisi
   */
  public logEvent(event: string, data: any): void {
    const newEvent: WebSocketLogEvent = {
      id: Date.now(),
      event,
      data,
      timestamp: new Date().toISOString(),
      category: this.categorizeEvent(event)
    };

    // Olayı kaydet
    this.events.unshift(newEvent);

    // Maksimum olay sayısını kontrol et
    if (this.events.length > this.config.maxEvents!) {
      this.events = this.events.slice(0, this.config.maxEvents);
    }

    // Konsola yazdır
    if (this.config.logToConsole) {
      console.log(`[WebSocket] ${event}:`, data);
    }

    // LocalStorage'a kaydet
    if (this.config.saveToLocalStorage) {
      this.saveEventsToLocalStorage();
    }

    // Callback'i çağır
    if (this.onEventCallback) {
      this.onEventCallback(newEvent);
    }
  }

  /**
   * Olayları LocalStorage'a kaydeder
   */
  private saveEventsToLocalStorage(): void {
    try {
      localStorage.setItem(
        this.config.localStorageKey!,
        JSON.stringify(this.events.slice(0, 100)) // Sadece son 100 olayı kaydet
      );
    } catch (error) {
      console.error('LocalStorage\'a kaydetme hatası:', error);
    }
  }

  /**
   * Olayları LocalStorage'dan yükler
   */
  private loadEventsFromLocalStorage(): void {
    try {
      const savedEvents = localStorage.getItem(this.config.localStorageKey!);
      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      }
    } catch (error) {
      console.error('LocalStorage\'dan yükleme hatası:', error);
    }
  }

  /**
   * Tüm olayları döndürür
   * @returns Olaylar listesi
   */
  public getEvents(): WebSocketLogEvent[] {
    return [...this.events];
  }

  /**
   * Olayları filtreler
   * @param filter Filtre fonksiyonu
   * @returns Filtrelenmiş olaylar listesi
   */
  public filterEvents(filter: (event: WebSocketLogEvent) => boolean): WebSocketLogEvent[] {
    return this.events.filter(filter);
  }

  /**
   * Olayları kategoriye göre filtreler
   * @param category Kategori
   * @returns Filtrelenmiş olaylar listesi
   */
  public getEventsByCategory(category: string): WebSocketLogEvent[] {
    return this.events.filter(event => event.category === category);
  }

  /**
   * Olayları arama terimine göre filtreler
   * @param searchTerm Arama terimi
   * @returns Filtrelenmiş olaylar listesi
   */
  public searchEvents(searchTerm: string): WebSocketLogEvent[] {
    if (!searchTerm) return this.events;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return this.events.filter(event => 
      event.event.toLowerCase().includes(lowerSearchTerm) || 
      JSON.stringify(event.data).toLowerCase().includes(lowerSearchTerm)
    );
  }

  /**
   * Tüm olayları temizler
   */
  public clearEvents(): void {
    this.events = [];
    
    if (this.config.saveToLocalStorage) {
      localStorage.removeItem(this.config.localStorageKey!);
    }
  }

  /**
   * Olayları dosyaya kaydeder
   * @returns Dosya URL'si
   */
  public exportEventsToFile(): string {
    const eventsJson = JSON.stringify(this.events, null, 2);
    const blob = new Blob([eventsJson], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }

  /**
   * Yeni olay eklendiğinde çağrılacak callback'i ayarlar
   * @param callback Callback fonksiyonu
   */
  public onEvent(callback: (event: WebSocketLogEvent) => void): void {
    this.onEventCallback = callback;
  }
}

export default WebSocketLogger;
