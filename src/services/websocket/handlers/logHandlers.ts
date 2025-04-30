import { LogLevel, TestStatus, WebSocketState } from '../types';

/**
 * Log olayları için işleyiciler
 */
export const logHandlers = {
  /**
   * Test logu alındığında çağrılır
   */
  handleTestLog: (
    data: any,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('Test log:', data);
    
    const testId = data.id || data.testId;
    const level = (data.level || 'INFO').toUpperCase() as LogLevel;
    const message = data.message || data.text || '';
    
    if (!testId) {
      console.error('Test ID bulunamadı:', data);
      return;
    }
    
    // Logları güncelle
    updateState((state) => {
      // Test yoksa ve bu bir test başlangıç logu değilse, güncelleme yapma
      const isStartLog = message.includes('Test başlatılıyor');
      if (!state.tests[testId] && !isStartLog) return state;
      
      // Eğer bu bir test başlangıç logu ise ve test henüz oluşturulmamışsa, testi oluştur
      if (isStartLog && !state.tests[testId]) {
        const testNameMatch = message.match(/Test başlatılıyor: (.+)/);
        const testName = testNameMatch ? testNameMatch[1] : `Test-${testId}`;
        
        return {
          ...state,
          tests: {
            ...state.tests,
            [testId]: {
              id: testId,
              name: testName,
              status: TestStatus.RUNNING,
              startTime: new Date().toISOString(),
              currentStep: 0,
              totalSteps: 0
            }
          },
          logs: {
            ...state.logs,
            [testId]: [
              {
                level,
                message,
                timestamp: new Date().toISOString()
              }
            ]
          }
        };
      }
      
      // Eğer bu bir adım başlangıç logu ise, adım bilgilerini güncelle
      const stepMatch = message.match(/Test adımı çalıştırılıyor \((\d+)\/(\d+)\): (.+)/);
      if (stepMatch) {
        const stepNumber = parseInt(stepMatch[1], 10);
        const totalSteps = parseInt(stepMatch[2], 10);
        const description = stepMatch[3];
        
        return {
          ...state,
          tests: {
            ...state.tests,
            [testId]: {
              ...state.tests[testId],
              currentStep: stepNumber,
              totalSteps: totalSteps
            }
          },
          steps: {
            ...state.steps,
            [testId]: {
              step: {
                current: stepNumber,
                total: totalSteps,
                description: description
              }
            }
          },
          logs: {
            ...state.logs,
            [testId]: [
              ...(state.logs[testId] || []),
              {
                level,
                message,
                timestamp: new Date().toISOString()
              }
            ]
          }
        };
      }
      
      // Eğer bu bir test tamamlandı logu ise, test durumunu güncelle
      if (message.includes('Test başarıyla tamamlandı')) {
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
          logs: {
            ...state.logs,
            [testId]: [
              ...(state.logs[testId] || []),
              {
                level,
                message,
                timestamp: new Date().toISOString()
              }
            ]
          }
        };
      }
      
      // Eğer bu bir test başarısız oldu logu ise, test durumunu güncelle
      if (message.includes('Test başarısız oldu')) {
        return {
          ...state,
          tests: {
            ...state.tests,
            [testId]: {
              ...state.tests[testId],
              status: TestStatus.FAILED,
              endTime: new Date().toISOString(),
              error: message.replace('Test başarısız oldu: ', '')
            }
          },
          logs: {
            ...state.logs,
            [testId]: [
              ...(state.logs[testId] || []),
              {
                level,
                message,
                timestamp: new Date().toISOString()
              }
            ]
          }
        };
      }
      
      // Normal log güncelleme
      return {
        ...state,
        logs: {
          ...state.logs,
          [testId]: [
            ...(state.logs[testId] || []),
            {
              level,
              message,
              timestamp: new Date().toISOString()
            }
          ]
        }
      };
    });
  },
  
  /**
   * Agent logu alındığında çağrılır
   */
  handleAgentLog: (
    data: any,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('Agent log:', data);
    
    // Eğer bu bir test logu ise
    if (data.testId) {
      // Test log işleyicisini çağır
      logHandlers.handleTestLog(data, updateState);
    }
  }
};
