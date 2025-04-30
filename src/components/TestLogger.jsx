import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import './TestLogger.css'; // CSS dosyasını oluşturacağız
import { Box, Typography, Button } from '@mui/material';

const TestLogger = () => {
  const { connected, testLogs, testSteps, currentTests, clearTestLogs, clearAllLogs } = useWebSocket();
  const [selectedTest, setSelectedTest] = useState(null);
  const logContainerRef = useRef(null);

  // Log container'ı otomatik olarak aşağı kaydır
  useEffect(() => {
    if (logContainerRef.current && selectedTest) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [testLogs, selectedTest]);

  // Aktif testleri göster
  const renderActiveTests = () => {
    return Object.values(currentTests).map(test => (
      <div
        key={test.id}
        className={`test-item ${selectedTest === test.id ? 'selected' : ''} ${test.status}`}
        onClick={() => setSelectedTest(test.id)}
      >
        <div className="test-name">{test.name}</div>
        <div className="test-status">{getStatusText(test.status)}</div>
        {test.currentStep && test.totalSteps && (
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
  const getStatusText = (status) => {
    switch (status) {
      case 'running': return 'Çalışıyor';
      case 'completed': return 'Tamamlandı';
      case 'failed': return 'Başarısız';
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
    testsCount: Object.keys(currentTests).length,
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
            {Object.keys(currentTests).length > 0 ? renderActiveTests() : (
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
                  console.log('Tests:', currentTests);
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

                  // Test oluştur
                  setCurrentTests(prev => ({
                    ...prev,
                    [testId]: {
                      id: testId,
                      name: testName,
                      status: 'running',
                      startTime: new Date().toISOString(),
                      currentStep: 0,
                      totalSteps: 5
                    }
                  }));

                  // Test logları oluştur
                  setTestLogs(prev => ({
                    ...prev,
                    [testId]: [{
                      level: 'INFO',
                      message: `Test başladı: ${testName}`,
                      timestamp: new Date().toISOString()
                    }]
                  }));
                }}
              >
                Test Oluştur
              </Button>
            </Box>
          </Box>
        </div>

        <div className="logs-panel">
          {selectedTest && currentTests[selectedTest] && (
            <div className="selected-test-info">
              <h3>{currentTests[selectedTest].name}</h3>
              <div className="test-meta">
                <span>ID: {selectedTest.substring(0, 8)}</span>
                <span>Durum: {getStatusText(currentTests[selectedTest].status)}</span>
                {currentTests[selectedTest].startTime && (
                  <span>Başlangıç: {new Date(currentTests[selectedTest].startTime).toLocaleTimeString()}</span>
                )}
                {currentTests[selectedTest].endTime && (
                  <span>Bitiş: {new Date(currentTests[selectedTest].endTime).toLocaleTimeString()}</span>
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
