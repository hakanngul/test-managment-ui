import { Socket } from 'socket.io-client';
import { ConnectionStatus, WebSocketState } from '../types';

/**
 * WebSocket bağlantı olayları için işleyiciler
 */
export const connectionHandlers = {
  /**
   * Bağlantı kurulduğunda çağrılır
   */
  handleConnect: (
    socket: Socket,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('WebSocket bağlantısı kuruldu, socket ID:', socket.id);
    
    updateState((state) => ({
      ...state,
      status: ConnectionStatus.CONNECTED,
      error: undefined
    }));
    
    // Bağlantı kurulduğunda sunucuya client bilgilerini gönder
    socket.emit('client_info', {
      clientType: 'web-ui',
      clientVersion: '1.0.0',
      platform: navigator.platform,
      userAgent: navigator.userAgent
    });
  },
  
  /**
   * Bağlantı kesildiğinde çağrılır
   */
  handleDisconnect: (
    reason: string,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('WebSocket bağlantısı kesildi, sebep:', reason);
    
    updateState((state) => ({
      ...state,
      status: ConnectionStatus.DISCONNECTED
    }));
  },
  
  /**
   * Bağlantı hatası oluştuğunda çağrılır
   */
  handleConnectError: (
    error: Error,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.error('WebSocket bağlantı hatası:', error.message);
    
    updateState((state) => ({
      ...state,
      status: ConnectionStatus.ERROR,
      error
    }));
  }
};
