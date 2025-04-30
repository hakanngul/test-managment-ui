import { useEffect, useState } from 'react';
import { WebSocketService } from '../WebSocketService';
import {
  ConnectionStatus,
  Test,
  TestLog,
  TestStep,
  WebSocketListener
} from '../types';

/**
 * WebSocket verilerini kullanmak için hook
 * @returns WebSocket verileri ve fonksiyonları
 */
export const useWebSocketData = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [tests, setTests] = useState<Record<string, Test>>({});
  const [logs, setLogs] = useState<Record<string, TestLog[]>>({});
  const [steps, setSteps] = useState<Record<string, { step: TestStep }>>({});
  const [error, setError] = useState<Error | undefined>(undefined);
  
  useEffect(() => {
    // WebSocketService'i al
    const service = WebSocketService.getInstance();
    
    try {
      // WebSocketManager'ı al
      const manager = service.getManager();
      
      // Mevcut durumu al
      const state = manager.getState();
      setStatus(state.status);
      setTests(state.tests);
      setLogs(state.logs);
      setSteps(state.steps);
      setError(state.error);
      
      // Dinleyici oluştur
      const listener: WebSocketListener = {
        onStatusChange: (newStatus) => setStatus(newStatus),
        onTestsChange: (newTests) => setTests(newTests),
        onLogsChange: (newLogs) => setLogs(newLogs),
        onStepsChange: (newSteps) => setSteps(newSteps),
        onError: (newError) => setError(newError)
      };
      
      // Dinleyiciyi ekle
      const removeListener = manager.addListener(listener);
      
      // Temizleme fonksiyonu
      return () => {
        removeListener();
      };
    } catch (err) {
      console.error('WebSocketManager hatası:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return () => {};
    }
  }, []);
  
  /**
   * WebSocket bağlantısını yeniden başlatır
   */
  const reconnect = () => {
    try {
      const service = WebSocketService.getInstance();
      service.reconnect();
    } catch (err) {
      console.error('WebSocket yeniden bağlantı hatası:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  
  /**
   * Belirli bir testin loglarını temizler
   * @param testId Test ID
   */
  const clearTestLogs = (testId: string) => {
    try {
      const service = WebSocketService.getInstance();
      const manager = service.getManager();
      manager.clearTestLogs(testId);
    } catch (err) {
      console.error('Test loglarını temizleme hatası:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  
  /**
   * Tüm logları temizler
   */
  const clearAllLogs = () => {
    try {
      const service = WebSocketService.getInstance();
      const manager = service.getManager();
      manager.clearAllLogs();
    } catch (err) {
      console.error('Tüm logları temizleme hatası:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  
  /**
   * Test verilerini simüle eder (test için)
   * @param testId Test ID
   * @param testName Test adı
   * @param steps Test adımları
   * @param logs Test logları
   * @returns Test ID
   */
  const simulateTestData = (
    testId: string,
    testName: string,
    steps: any[],
    logs: string[]
  ): string => {
    try {
      const service = WebSocketService.getInstance();
      const manager = service.getManager();
      return manager.simulateTestData(testId, testName, steps, logs);
    } catch (err) {
      console.error('Test verilerini simüle etme hatası:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return testId;
    }
  };
  
  return {
    connected: status === ConnectionStatus.CONNECTED,
    connecting: status === ConnectionStatus.CONNECTING,
    status,
    tests,
    testLogs: logs,
    testSteps: steps,
    error,
    reconnect,
    clearTestLogs,
    clearAllLogs,
    simulateTestData
  };
};
