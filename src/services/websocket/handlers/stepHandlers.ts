import { LogLevel, WebSocketState } from '../types';

/**
 * Test adımları için işleyiciler
 */
export const stepHandlers = {
  /**
   * Test adımı başladığında çağrılır
   */
  handleStepStarted: (
    data: any,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('Test adımı başladı:', data);
    
    const testId = data.id || data.testId;
    const stepNumber = data.stepNumber || data.step || 0;
    const totalSteps = data.totalSteps || data.total || 0;
    const description = data.description || `Adım ${stepNumber}`;
    
    if (!testId) {
      console.error('Test ID bulunamadı:', data);
      return;
    }
    
    // Test adımını güncelle
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
            message: `Adım ${stepNumber} başladı: ${description}`,
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
            currentStep: stepNumber,
            totalSteps: totalSteps || state.tests[testId].totalSteps
          }
        },
        steps: {
          ...state.steps,
          [testId]: {
            step: {
              current: stepNumber,
              total: totalSteps || state.tests[testId].totalSteps,
              description
            }
          }
        },
        logs: updatedLogs
      };
    });
  },
  
  /**
   * Test adımı tamamlandığında çağrılır
   */
  handleStepCompleted: (
    data: any,
    updateState: (updater: (state: WebSocketState) => WebSocketState) => void
  ) => {
    console.log('Test adımı tamamlandı:', data);
    
    const testId = data.id || data.testId;
    const stepNumber = data.stepNumber || data.step || 0;
    const duration = data.duration ? ` (${data.duration}ms)` : '';
    
    if (!testId) {
      console.error('Test ID bulunamadı:', data);
      return;
    }
    
    // Logları güncelle
    updateState((state) => {
      // Test yoksa güncelleme yapma
      if (!state.tests[testId]) return state;
      
      return {
        ...state,
        logs: {
          ...state.logs,
          [testId]: [
            ...(state.logs[testId] || []),
            {
              level: LogLevel.INFO,
              message: `Adım ${stepNumber} tamamlandı${duration}`,
              timestamp: new Date().toISOString()
            }
          ]
        }
      };
    });
  }
};
