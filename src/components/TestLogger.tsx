import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Chip, Grid, Divider } from '@mui/material';
import { useWebSocketData } from '../services/websocket';
import './TestLogger.css';

/**
 * Test loglarını gösteren bileşen
 */
const TestLogger: React.FC = () => {
  const {
    connected,
    tests,
    testLogs,
    testSteps,
    clearTestLogs,
    clearAllLogs,
    simulateTestData
  } = useWebSocketData();
  
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Log container'ı otomatik olarak aşağı kaydır
  useEffect(() => {
    if (logContainerRef.current && selectedTest) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [testLogs, selectedTest]);
  
  // Aktif testleri göster
  const renderActiveTests = () => {
    return Object.values(tests).map(test => (
      <div 
        key={test.id} 
        className={`test-item ${selectedTest === test.id ? 'selected' : ''} ${test.status}`}
        onClick={() => setSelectedTest(test.id)}
      >
        <div className="test-name">{test.name}</div>
        <div className="test-status">{getStatusText(test.status)}</div>
        {test.currentStep > 0 && test.totalSteps > 0 && (
          <div className="test-progress">
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${(test.currentStep / test.totalSteps) * 100}%` }}
              />
            </div>
            <div className="step-info">
              {test.currentStep}/{test.totalSteps}
            </div>
          </div>
        )}
        <button 
          className="clear-logs-btn" 
          onClick={(e) => {
            e.stopPropagation();
            clearTestLogs(test.id);
            if (selectedTest === test.id) {
              setSelectedTest(null);
            }
          }}
        >
          Temizle
        </button>
      </div>
    ));
  };
  
  // Test durumu metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Çalışıyor';
      case 'completed': return 'Tamamlandı';
      case 'failed': return 'Başarısız';
      case 'aborted': return 'İptal Edildi';
      case 'pending': return 'Bekliyor';
      default: return status;
    }
  };
  
  // Seçili testin loglarını göster
  const renderTestLogs = () => {
    if (!selectedTest || !testLogs[selectedTest]) {
      return <div className="no-logs">Test seçin veya henüz log yok</div>;
    }
    
    return (
      <div className="logs-container" ref={logContainerRef}>
        {testLogs[selectedTest].map((log, index) => (
          <div key={index} className={`log-entry log-${log.level.toLowerCase()}`}>
            <span className="log-time">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className="log-level">[{log.level}]</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Seçili testin adım bilgilerini göster
  const renderTestStepInfo = () => {
    if (!selectedTest || !testSteps[selectedTest] || !testSteps[selectedTest].step) {
      return null;
    }
    
    const { step } = testSteps[selectedTest];
    
    return (
      <div className="step-details">
        <h3>Mevcut Adım</h3>
        <div className="step-progress">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(step.current / step.total) * 100}%` }}
            />
          </div>
          <div className="step-info">
            <span>Adım {step.current}/{step.total}</span>
            <span className="step-description">{step.description}</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Debug bilgisi
  const debugInfo = {
    connected,
    testsCount: Object.keys(tests).length,
    logsCount: Object.values(testLogs).reduce((acc, logs) => acc + logs.length, 0),
    stepsCount: Object.keys(testSteps).length
  };
  
  return (
    <div className="test-logger">
      <div className="logger-header">
        <h2>Test Logları</h2>
        <div className="connection-status">
          WebSocket: <span className={connected ? 'connected' : 'disconnected'}>
            {connected ? 'Bağlı' : 'Bağlantı Kesildi'}
          </span>
        </div>
        <button className="clear-all-btn" onClick={clearAllLogs}>
          Tüm Logları Temizle
        </button>
      </div>
      
      <div className="logger-content">
        <div className="tests-sidebar">
          <h3>Aktif Testler</h3>
          <div className="tests-list">
            {Object.keys(tests).length > 0 ? renderActiveTests() : (
              <div className="no-tests">Aktif test yok</div>
            )}
          </div>
          
          {/* Debug bilgisi */}
          <Box sx={{ mt: 2, p: 1, borderTop: '1px solid #ddd' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Debug Bilgisi</Typography>
            <Typography variant="body2">Bağlantı: {connected ? 'Açık' : 'Kapalı'}</Typography>
            <Typography variant="body2">Test Sayısı: {debugInfo.testsCount}</Typography>
            <Typography variant="body2">Log Sayısı: {debugInfo.logsCount}</Typography>
            <Typography variant="body2">Adım Sayısı: {debugInfo.stepsCount}</Typography>
            
            {/* Test ve log bilgilerini göster */}
            <Box sx={{ mt: 1 }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => {
                  console.log('Tests:', tests);
                  console.log('Logs:', testLogs);
                  console.log('Steps:', testSteps);
                }}
                sx={{ mr: 1 }}
              >
                Konsola Yaz
              </Button>
              
              {/* Test oluştur butonu (test için) */}
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => {
                  const testId = `test-${Date.now()}`;
                  const testName = `Test ${testId.substring(0, 8)}`;
                  
                  // Test adımları
                  const steps = [
                    { order: 1, description: 'Tarayıcı başlatılıyor', status: 'COMPLETED' },
                    { order: 2, description: 'URL açılıyor', status: 'COMPLETED' },
                    { order: 3, description: 'Element bulunuyor', status: 'RUNNING' },
                    { order: 4, description: 'Tıklama yapılıyor', status: 'PENDING' },
                    { order: 5, description: 'Doğrulama yapılıyor', status: 'PENDING' }
                  ];
                  
                  // Test logları
                  const logs = [
                    '[INFO] Test başlatılıyor: ' + testName,
                    '[INFO] Tarayıcı: Chrome, Headless: Evet',
                    '[INFO] Tarayıcı başlatıldı',
                    '[INFO] URL açılıyor: https://example.com',
                    '[INFO] Sayfa yüklendi',
                    '[INFO] Element aranıyor: #button'
                  ];
                  
                  // Test verilerini simüle et
                  simulateTestData(testId, testName, steps, logs);
                }}
              >
                Test Oluştur
              </Button>
            </Box>
          </Box>
        </div>
        
        <div className="logs-panel">
          {selectedTest && tests[selectedTest] && (
            <div className="selected-test-info">
              <h3>{tests[selectedTest].name}</h3>
              <div className="test-meta">
                <span>ID: {selectedTest.substring(0, 8)}</span>
                <span>Durum: {getStatusText(tests[selectedTest].status)}</span>
                {tests[selectedTest].startTime && (
                  <span>Başlangıç: {new Date(tests[selectedTest].startTime).toLocaleTimeString()}</span>
                )}
                {tests[selectedTest].endTime && (
                  <span>Bitiş: {new Date(tests[selectedTest].endTime).toLocaleTimeString()}</span>
                )}
              </div>
              {renderTestStepInfo()}
            </div>
          )}
          
          {renderTestLogs()}
        </div>
      </div>
    </div>
  );
};

export default TestLogger;
