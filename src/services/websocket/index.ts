export * from './WebSocketManager';
export * from './WebSocketService';
export * from './types';
export * from './hooks';

// WebSocketService'i başlat
import { WebSocketService } from './WebSocketService';

// WebSocketService'i yapılandır ve başlat
const initializeWebSocketService = () => {
  const service = WebSocketService.getInstance();
  
  // WebSocketManager'ı başlat
  service.initialize({
    url: 'http://localhost:3001',
    options: {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true
    }
  });
  
  // WebSocket bağlantısını başlat
  service.connect();
  
  return service;
};

// WebSocketService'i başlat
export const webSocketService = initializeWebSocketService();
