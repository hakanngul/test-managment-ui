import { Socket } from 'socket.io-client';
import { LogLevel, TestStatus, WebSocketState } from '../types';

/**
 * Test olayları için işleyiciler
 */
export const testHandlers = {
  /**
   * Test başladığında çağrılır
   */
  handleTestStarted: (
    data: any,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('Test başladı:', data);
    
    const testId = data.id || data.testId;
    const testName = data.name || data.testName || `Test-${testId}`;
    
    if (!testId) {
      console.error('Test ID bulunamadı:', data);
      return;
    }
    
    // Test bilgilerini güncelle
    updateState((state) => ({
      ...state,
      tests: {
        ...state.tests,
        [testId]: {
          id: testId,
          name: testName,
          status: TestStatus.RUNNING,
          startTime: new Date().toISOString(),
          currentStep: 0,
          totalSteps: data.totalSteps || data.steps || 0
        }
      },
      // Test için log listesi oluştur
      logs: {
        ...state.logs,
        [testId]: [
          {
            level: LogLevel.INFO,
            message: `Test başladı: ${testName}`,
            timestamp: new Date().toISOString()
          }
        ]
      }
    }));
  },
  
  /**
   * Test tamamlandığında çağrılır
   */
  handleTestCompleted: (
    data: any,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('Test tamamlandı:', data);
    
    const testId = data.id || data.testId;
    
    if (!testId) {
      console.error('Test ID bulunamadı:', data);
      return;
    }
    
    // Test durumunu güncelle
    updateState((state) => {
      // Test yoksa güncelleme yapma
      if (!state.tests[testId]) return state;
      
      // Logları güncelle
      const updatedLogs = {
        ...state.logs,
        [testId]: [
          ...(state.logs[testId] || []),
          {
            level: LogLevel.INFO,
            message: 'Test başarıyla tamamlandı',
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      return {
        ...state,
        tests: {
          ...state.tests,
          [testId]: {
            ...state.tests[testId],
            status: TestStatus.COMPLETED,
            endTime: new Date().toISOString()
          }
        },
        logs: updatedLogs
      };
    });
  },
  
  /**
   * Test başarısız olduğunda çağrılır
   */
  handleTestFailed: (
    data: any,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('Test başarısız oldu:', data);
    
    const testId = data.id || data.testId;
    const errorMessage = data.error || 'Bilinmeyen hata';
    
    if (!testId) {
      console.error('Test ID bulunamadı:', data);
      return;
    }
    
    // Test durumunu güncelle
    updateState((state) => {
      // Test yoksa güncelleme yapma
      if (!state.tests[testId]) return state;
      
      // Logları güncelle
      const updatedLogs = {
        ...state.logs,
        [testId]: [
          ...(state.logs[testId] || []),
          {
            level: LogLevel.ERROR,
            message: `Test başarısız oldu: ${errorMessage}`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      return {
        ...state,
        tests: {
          ...state.tests,
          [testId]: {
            ...state.tests[testId],
            status: TestStatus.FAILED,
            endTime: new Date().toISOString(),
            error: errorMessage
          }
        },
        logs: updatedLogs
      };
    });
  }
};
