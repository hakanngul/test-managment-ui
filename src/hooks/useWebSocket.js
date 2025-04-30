import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [testLogs, setTestLogs] = useState({});
  const [testSteps, setTestSteps] = useState({});
  const [currentTests, setCurrentTests] = useState({});

  useEffect(() => {
    // WebSocket bağlantısını kur
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Bağlantı durumunu izle
    socket.on('connect', () => {
      console.log('WebSocket sunucusuna bağlandı');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket sunucusu ile bağlantı kesildi');
      setConnected(false);
    });

    // Tüm olayları dinle ve konsola yazdır (debug için)
    socket.onAny((event, ...args) => {
      console.log(`WebSocket olayı alındı: ${event}`, args);
    });

    // Test olaylarını dinle - Standart olaylar
    socket.on('testStarted', (data) => {
      console.log('Test başladı:', data);

      // Yeni test ekle
      setCurrentTests(prev => ({
        ...prev,
        [data.id]: {
          id: data.id,
          name: data.name || `Test-${data.id}`,
          status: 'running',
          startTime: new Date().toISOString(),
          currentStep: 0,
          totalSteps: data.totalSteps || 0
        }
      }));

      // Test için log listesi oluştur
      setTestLogs(prev => ({
        ...prev,
        [data.id]: [{
          level: 'INFO',
          message: `Test başladı: ${data.name}`,
          timestamp: new Date().toISOString()
        }]
      }));
    });

    // Alternatif olay adı
    socket.on('test_started', (data) => {
      console.log('Test başladı (alternatif):', data);

      const testId = data.id || data.testId;
      const testName = data.name || data.testName || `Test-${testId}`;

      // Yeni test ekle
      setCurrentTests(prev => ({
        ...prev,
        [testId]: {
          id: testId,
          name: testName,
          status: 'running',
          startTime: new Date().toISOString(),
          currentStep: 0,
          totalSteps: data.totalSteps || data.steps || 0
        }
      }));

      // Test için log listesi oluştur
      setTestLogs(prev => ({
        ...prev,
        [testId]: [{
          level: 'INFO',
          message: `Test başladı: ${testName}`,
          timestamp: new Date().toISOString()
        }]
      }));
    });

    socket.on('testCompleted', (data) => {
      console.log('Test tamamlandı:', data);

      const testId = data.id || data.testId;

      // Test durumunu güncelle
      setCurrentTests(prev => {
        if (!prev[testId]) return prev;

        return {
          ...prev,
          [testId]: {
            ...prev[testId],
            status: 'completed',
            endTime: new Date().toISOString()
          }
        };
      });

      // Test loglarına tamamlandı mesajı ekle
      addLogToTest(testId, 'INFO', 'Test başarıyla tamamlandı');
    });

    // Alternatif olay adı
    socket.on('test_completed', (data) => {
      console.log('Test tamamlandı (alternatif):', data);

      const testId = data.id || data.testId;

      // Test durumunu güncelle
      setCurrentTests(prev => {
        if (!prev[testId]) return prev;

        return {
          ...prev,
          [testId]: {
            ...prev[testId],
            status: 'completed',
            endTime: new Date().toISOString()
          }
        };
      });

      // Test loglarına tamamlandı mesajı ekle
      addLogToTest(testId, 'INFO', 'Test başarıyla tamamlandı');
    });

    socket.on('testFailed', (data) => {
      console.log('Test başarısız oldu:', data);

      const testId = data.id || data.testId;

      // Test durumunu güncelle
      setCurrentTests(prev => {
        if (!prev[testId]) return prev;

        return {
          ...prev,
          [testId]: {
            ...prev[testId],
            status: 'failed',
            endTime: new Date().toISOString(),
            error: data.error
          }
        };
      });

      // Test loglarına hata mesajı ekle
      addLogToTest(testId, 'ERROR', `Test başarısız oldu: ${data.error || 'Bilinmeyen hata'}`);
    });

    // Alternatif olay adı
    socket.on('test_failed', (data) => {
      console.log('Test başarısız oldu (alternatif):', data);

      const testId = data.id || data.testId;

      // Test durumunu güncelle
      setCurrentTests(prev => {
        if (!prev[testId]) return prev;

        return {
          ...prev,
          [testId]: {
            ...prev[testId],
            status: 'failed',
            endTime: new Date().toISOString(),
            error: data.error
          }
        };
      });

      // Test loglarına hata mesajı ekle
      addLogToTest(testId, 'ERROR', `Test başarısız oldu: ${data.error || 'Bilinmeyen hata'}`);
    });

    // Log olayları
    socket.on('testLog', (data) => {
      console.log('Test log:', data);

      const testId = data.id || data.testId;
      const level = data.level || 'INFO';
      const message = data.message || data.text || '';

      // Test loglarına yeni log ekle
      addLogToTest(testId, level, message);
    });

    // Alternatif log olayları
    socket.on('test_log', (data) => {
      console.log('Test log (alternatif):', data);

      const testId = data.id || data.testId;
      const level = data.level || 'INFO';
      const message = data.message || data.text || '';

      // Test loglarına yeni log ekle
      addLogToTest(testId, level, message);
    });

    // Sunucunun gönderdiği log formatına uygun olay
    socket.on('agent_log', (data) => {
      console.log('Agent log:', data);

      // Eğer bu bir test log'u ise
      if (data.testId) {
        const testId = data.testId;
        const level = data.level || 'INFO';
        const message = data.message || data.text || '';

        // Test loglarına yeni log ekle
        addLogToTest(testId, level, message);

        // Eğer bu bir test başlangıcı ise ve henüz test oluşturulmamışsa
        if (message.includes('Test başlatılıyor') && !currentTests[testId]) {
          // Test adını çıkar
          const testNameMatch = message.match(/Test başlatılıyor: (.+)/);
          const testName = testNameMatch ? testNameMatch[1] : `Test-${testId}`;

          // Yeni test ekle
          setCurrentTests(prev => ({
            ...prev,
            [testId]: {
              id: testId,
              name: testName,
              status: 'running',
              startTime: new Date().toISOString(),
              currentStep: 0,
              totalSteps: 0
            }
          }));
        }

        // Eğer bu bir adım başlangıcı ise
        const stepMatch = message.match(/Test adımı çalıştırılıyor \((\d+)\/(\d+)\): (.+)/);
        if (stepMatch) {
          const stepNumber = parseInt(stepMatch[1], 10);
          const totalSteps = parseInt(stepMatch[2], 10);
          const description = stepMatch[3];

          // Test adımını güncelle
          setTestSteps(prev => ({
            ...prev,
            [testId]: {
              step: {
                current: stepNumber,
                total: totalSteps,
                description: description
              }
            }
          }));

          // Test durumunu güncelle
          setCurrentTests(prev => {
            if (!prev[testId]) return prev;

            return {
              ...prev,
              [testId]: {
                ...prev[testId],
                currentStep: stepNumber,
                totalSteps: totalSteps
              }
            };
          });
        }

        // Eğer test tamamlandıysa
        if (message.includes('Test başarıyla tamamlandı')) {
          // Test durumunu güncelle
          setCurrentTests(prev => {
            if (!prev[testId]) return prev;

            return {
              ...prev,
              [testId]: {
                ...prev[testId],
                status: 'completed',
                endTime: new Date().toISOString()
              }
            };
          });
        }
      }
    });

    // Test adımı olayları
    socket.on('testStepStarted', (data) => {
      console.log('Test adımı başladı:', data);

      const testId = data.id || data.testId;

      // Test adımını güncelle
      setTestSteps(prev => ({
        ...prev,
        [testId]: {
          step: {
            current: data.stepNumber,
            total: data.totalSteps,
            description: data.description || `Adım ${data.stepNumber}`
          }
        }
      }));

      // Test durumunu güncelle
      setCurrentTests(prev => {
        if (!prev[testId]) return prev;

        return {
          ...prev,
          [testId]: {
            ...prev[testId],
            currentStep: data.stepNumber,
            totalSteps: data.totalSteps
          }
        };
      });

      // Test loglarına adım başladı mesajı ekle
      addLogToTest(testId, 'INFO', `Adım ${data.stepNumber} başladı: ${data.description || ''}`);
    });

    // Alternatif adım olayı
    socket.on('test_step_started', (data) => {
      console.log('Test adımı başladı (alternatif):', data);

      const testId = data.id || data.testId;

      // Test adımını güncelle
      setTestSteps(prev => ({
        ...prev,
        [testId]: {
          step: {
            current: data.stepNumber || data.step,
            total: data.totalSteps || data.totalSteps,
            description: data.description || `Adım ${data.stepNumber || data.step}`
          }
        }
      }));

      // Test durumunu güncelle
      setCurrentTests(prev => {
        if (!prev[testId]) return prev;

        return {
          ...prev,
          [testId]: {
            ...prev[testId],
            currentStep: data.stepNumber || data.step,
            totalSteps: data.totalSteps || data.totalSteps
          }
        };
      });

      // Test loglarına adım başladı mesajı ekle
      addLogToTest(testId, 'INFO', `Adım ${data.stepNumber || data.step} başladı: ${data.description || ''}`);
    });

    socket.on('testStepCompleted', (data) => {
      console.log('Test adımı tamamlandı:', data);

      const testId = data.id || data.testId;

      // Test loglarına adım tamamlandı mesajı ekle
      addLogToTest(
        testId,
        'INFO',
        `Adım ${data.stepNumber || data.step} tamamlandı${data.duration ? ` (${data.duration}ms)` : ''}`
      );
    });

    // Alternatif adım tamamlandı olayı
    socket.on('test_step_completed', (data) => {
      console.log('Test adımı tamamlandı (alternatif):', data);

      const testId = data.id || data.testId;

      // Test loglarına adım tamamlandı mesajı ekle
      addLogToTest(
        testId,
        'INFO',
        `Adım ${data.stepNumber || data.step} tamamlandı${data.duration ? ` (${data.duration}ms)` : ''}`
      );
    });

    // Temizleme fonksiyonu
    return () => {
      socket.disconnect();
    };
  }, []);

  // Test loglarına yeni log ekle
  const addLogToTest = useCallback((testId, level, message) => {
    setTestLogs(prev => {
      if (!prev[testId]) {
        return {
          ...prev,
          [testId]: [{
            level,
            message,
            timestamp: new Date().toISOString()
          }]
        };
      }

      return {
        ...prev,
        [testId]: [
          ...prev[testId],
          {
            level,
            message,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  }, []);

  // Belirli bir testin loglarını temizle
  const clearTestLogs = useCallback((testId) => {
    setTestLogs(prev => {
      const newLogs = { ...prev };
      delete newLogs[testId];
      return newLogs;
    });
  }, []);

  // Tüm logları temizle
  const clearAllLogs = useCallback(() => {
    setTestLogs({});
    setTestSteps({});
    setCurrentTests({});
  }, []);

  // ExampleSimulator sayfasından gelen test verilerini simüle etmek için
  // Bu fonksiyon, ExampleSimulator'dan gelen test verilerini WebSocket verilerine dönüştürür
  const simulateTestData = useCallback((testId, testName, steps, logs) => {
    // Test başlat
    setCurrentTests(prev => ({
      ...prev,
      [testId]: {
        id: testId,
        name: testName,
        status: 'running',
        startTime: new Date().toISOString(),
        currentStep: 0,
        totalSteps: steps.length
      }
    }));

    // Test loglarını ekle
    setTestLogs(prev => ({
      ...prev,
      [testId]: logs.map(log => ({
        level: log.includes('[ERROR]') ? 'ERROR' :
               log.includes('[WARNING]') ? 'WARNING' : 'INFO',
        message: log.replace(/\[\w+\]\s/, ''),
        timestamp: new Date().toISOString()
      }))
    }));

    // Mevcut adımı ayarla (son adım)
    const currentStepIndex = steps.findIndex(step => step.status === 'RUNNING');
    const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : steps.length;

    setTestSteps(prev => ({
      ...prev,
      [testId]: {
        step: {
          current: currentStep,
          total: steps.length,
          description: currentStepIndex !== -1 ? steps[currentStepIndex].description : ''
        }
      }
    }));

    // Test durumunu güncelle
    setCurrentTests(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        currentStep,
        totalSteps: steps.length,
        status: currentStep === steps.length ? 'completed' : 'running'
      }
    }));

    return testId;
  }, []);

  return {
    connected,
    testLogs,
    testSteps,
    currentTests,
    clearTestLogs,
    clearAllLogs,
    simulateTestData
  };
};
