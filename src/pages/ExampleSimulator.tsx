import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Breadcrumbs,
  Link,
  Divider,
  Alert,
  Snackbar,
  Paper,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon, PlayArrow, Stop, Refresh, Send } from '@mui/icons-material';

import {
  ExampleTest,
  TestExecution,
  TestStepExecution,
  TestStepExecutionStatus
} from '../mock/exampleSimulatorMock';
import { ExecutionStatus } from '../models/enums/TestEnums';
import ExampleSimulatorService from '../services/ExampleSimulatorService';
import TestLogger from '../components/TestLogger';
import { useWebSocketData } from '../services/websocket';
import TestsSummary from '../components/TestsSummary';
import TestList from '../components/TestList';
import TestDetails from '../components/TestDetails';
import TestLogs from '../components/TestLogs';

// Test adımı bileşeni
const TestStep: React.FC<{ step: TestStepExecution }> = ({ step }) => {
  const getStatusColor = (status: TestStepExecutionStatus) => {
    switch (status) {
      case TestStepExecutionStatus.PASSED:
        return 'success.main';
      case TestStepExecutionStatus.FAILED:
        return 'error.main';
      case TestStepExecutionStatus.RUNNING:
        return 'info.main';
      case TestStepExecutionStatus.PENDING:
        return 'text.secondary';
      default:
        return 'text.primary';
    }
  };

  return (
    <ListItem
      sx={{
        borderLeft: 3,
        borderColor: getStatusColor(step.status),
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      <ListItemText
        primary={
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {step.order}. {step.description}
            </Typography>
            {step.status === TestStepExecutionStatus.RUNNING && (
              <CircularProgress size={16} sx={{ ml: 1 }} />
            )}
          </Box>
        }
        secondary={
          <Box mt={1}>
            <Typography variant="body2" component="div">
              <strong>Action:</strong> {step.action}
              {step.value && <>, <strong>Value:</strong> {step.value}</>}
              {step.target && <>, <strong>Target:</strong> {step.target}</>}
              {step.strategy && <>, <strong>Strategy:</strong> {step.strategy}</>}
            </Typography>
            {step.duration && (
              <Typography variant="body2" color="text.secondary">
                Duration: {step.duration}ms
              </Typography>
            )}
            {step.error && (
              <Typography variant="body2" color="error">
                Error: {step.error}
              </Typography>
            )}
          </Box>
        }
      />
      <Chip
        label={step.status}
        size="small"
        color={
          step.status === TestStepExecutionStatus.PASSED ? 'success' :
          step.status === TestStepExecutionStatus.FAILED ? 'error' :
          step.status === TestStepExecutionStatus.RUNNING ? 'info' : 'default'
        }
        sx={{ ml: 1 }}
      />
    </ListItem>
  );
};

// Test çalıştırma sonuçları bileşeni
const TestExecutionResults: React.FC<{ execution: TestExecution | null }> = ({ execution }) => {
  if (!execution || !execution.endTime) return null;

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Results
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Status:</strong> {execution.status}
            </Typography>
            <Typography variant="body2">
              <strong>Duration:</strong> {execution.duration ? `${(execution.duration / 1000).toFixed(2)}s` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Browser:</strong> {execution.browser}
            </Typography>
            <Typography variant="body2">
              <strong>Headless:</strong> {execution.headless ? 'Yes' : 'No'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Not: Eski TestExecutionLogs bileşeni kaldırıldı, yerine TestLogger bileşeni kullanılıyor

// Ana sayfa bileşeni
const ExampleSimulator: React.FC = () => {
  // WebSocket hook'unu kullan
  const {
    tests,
    testLogs,
    testSteps,
    simulateTestData,
    clearTestLogs,
    clearAllLogs
  } = useWebSocketData();

  // Seçili test ID'si
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  // Yeni test geldiğinde otomatik olarak seç
  useEffect(() => {
    if (!selectedTestId && Object.keys(tests).length > 0) {
      setSelectedTestId(Object.keys(tests)[0]);
    }
  }, [tests, selectedTestId]);

  const [test, setTest] = useState<ExampleTest>({
    name: "Example.com Test",
    description: "Navigate to Example.com and check elements",
    browserPreference: "chromium",
    headless: true,
    takeScreenshots: false,
    steps: [
      {
        action: "navigate",
        value: "https://example.com",
        description: "Navigate to Example.com"
      },
      {
        action: "wait",
        value: "1000",
        description: "Wait for page to load"
      },
      {
        action: "takeScreenshot",
        description: "Take screenshot of Example.com"
      },
      {
        action: "click",
        target: "a[href='https://www.iana.org/domains/example']",
        strategy: "css",
        description: "Click on More information link"
      },
      {
        action: "wait",
        value: "2000",
        description: "Wait for IANA page to load"
      },
      {
        action: "takeScreenshot",
        description: "Take screenshot of IANA page"
      },
      {
        action: "wait",
        value: "10000",
        description: "Wait for IANA page to load"
      }
    ]
  });
  const [isRunning, setIsRunning] = useState(false);
  // ExecutionStatus durumunu takip et (bildirim ve UI güncellemeleri için kullanılır)
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>(ExecutionStatus.QUEUED);
  // Test adımlarını başlangıçta göstermek için test adımlarını hazırla
  const initialSteps: TestStepExecution[] = test.steps.map((step, index) => ({
    id: `initial-${index}`,
    order: index + 1,
    action: step.action,
    value: step.value,
    target: step.target,
    strategy: step.strategy,
    description: step.description,
    status: TestStepExecutionStatus.PENDING,
    logs: []
  }));

  const [executionSteps, setExecutionSteps] = useState<TestStepExecution[]>(initialSteps);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<TestExecution | null>(null);
  const [executionError, setExecutionError] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Test çalıştırma
  const handleRunTest = async () => {
    try {
      setIsRunning(true);
      setExecutionStatus(ExecutionStatus.QUEUED);
      // Test adımlarını sıfırlamak yerine, mevcut adımları PENDING durumuna getir
      setExecutionSteps(initialSteps);
      setExecutionLogs([]);
      setExecutionResult(null);
      setExecutionError(undefined);

      // Test çalıştırma simülasyonu
      const result = await ExampleSimulatorService.simulateTestExecution(
        test,
        // Adım güncellemesi callback'i
        (step: TestStepExecution) => {
          setExecutionSteps(prevSteps => {
            const updatedSteps = [...prevSteps];
            const index = updatedSteps.findIndex(s => s.id === step.id);
            if (index !== -1) {
              updatedSteps[index] = step;
            } else {
              updatedSteps.push(step);
            }
            return updatedSteps;
          });
        },
        // Log güncellemesi callback'i
        (log: string) => {
          setExecutionLogs(prevLogs => [...prevLogs, log]);
        },
        // Durum güncellemesi callback'i
        (status: ExecutionStatus) => {
          setExecutionStatus(status);
        }
      );

      setExecutionResult(result);

      // Test sonucuna göre bildirim göster
      setNotification({
        open: true,
        message: result.status === ExecutionStatus.COMPLETED
          ? 'Test başarıyla tamamlandı!'
          : 'Test başarısız oldu.',
        severity: result.status === ExecutionStatus.COMPLETED ? 'success' : 'error'
      });
    } catch (error) {
      console.error('Test çalıştırma hatası:', error);
      setExecutionError(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu');
      setNotification({
        open: true,
        message: 'Test çalıştırılırken bir hata oluştu.',
        severity: 'error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Test durdurma
  const handleStopTest = () => {
    setIsRunning(false);
    setExecutionStatus(ExecutionStatus.ABORTED);
    setNotification({
      open: true,
      message: 'Test kullanıcı tarafından durduruldu.',
      severity: 'warning'
    });

    // Durdurma sonucunu kaydet
    if (executionResult) {
      setExecutionResult({
        ...executionResult,
        status: ExecutionStatus.ABORTED,
        endTime: new Date()
      });
    }
  };

  // Seçili testin loglarını temizle
  const handleClearSelectedTestLogs = () => {
    if (selectedTestId) {
      clearTestLogs(selectedTestId);
    }
  };

  // Yeni test oluştur
  const handleCreateTestExample = () => {
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
    setSelectedTestId(testId);
  };

  // Testi yeniden çalıştır
  const handleRerunTest = () => {
    handleRunTest();
  };

  // API'ye test gönder
  const handleSendToAPI = async () => {
    try {
      // Loglara bilgi ekle
      setExecutionLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} [INFO] Test API'ye gönderiliyor: ${test.name}`]);

      setNotification({
        open: true,
        message: 'Test API\'ye gönderiliyor...',
        severity: 'info'
      });

      // API'ye gönder
      const result = await ExampleSimulatorService.sendTestToAPI(test);

      // Loglara sonuç ekle
      setExecutionLogs(prev => [
        ...prev,
        `${new Date().toISOString().split('T')[1].split('.')[0]} [INFO] ${result.success ? 'Test API\'ye başarıyla gönderildi.' : 'Test API\'ye gönderilirken hata oluştu.'}`
      ]);

      // Bildirim göster
      setNotification({
        open: true,
        message: result.message,
        severity: result.success ? 'success' : 'error'
      });

      // Başarılı olursa kullanıcıya curl komutunu da göster
      if (result.success) {
        const curlCommand = `curl -X POST http://localhost:3000/run-test -H "Content-Type: application/json" -d '${JSON.stringify(test)}'`;
        console.log('Eşdeğer curl komutu:', curlCommand);

        setExecutionLogs(prev => [
          ...prev,
          `${new Date().toISOString().split('T')[1].split('.')[0]} [INFO] Eşdeğer curl komutu:`,
          `${new Date().toISOString().split('T')[1].split('.')[0]} [INFO] ${curlCommand}`
        ]);
      }
    } catch (error) {
      console.error('API\'ye gönderme hatası:', error);

      // Loglara hata ekle
      setExecutionLogs(prev => [
        ...prev,
        `${new Date().toISOString().split('T')[1].split('.')[0]} [ERROR] Test API'ye gönderilirken bir hata oluştu: ${error}`
      ]);

      // Bildirim göster
      setNotification({
        open: true,
        message: 'Test API\'ye gönderilirken bir hata oluştu.',
        severity: 'error'
      });
    }
  };

  // Test ayarlarını güncelle
  const handleUpdateTestSettings = (field: keyof ExampleTest, value: any) => {
    setTest(prev => {
      const updatedTest = {
        ...prev,
        [field]: value
      };

      // Test adımları değişirse, executionSteps'i de güncelle
      if (field === 'steps') {
        const newSteps: TestStepExecution[] = updatedTest.steps.map((step, index) => ({
          id: `initial-${index}`,
          order: index + 1,
          action: step.action,
          value: step.value,
          target: step.target,
          strategy: step.strategy,
          description: step.description,
          status: TestStepExecutionStatus.PENDING,
          logs: []
        }));
        setExecutionSteps(newSteps);
      }

      return updatedTest;
    });
  };

  // Bildirim kapatma
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl" sx={{ overflow: 'hidden' }}>
      <Box sx={{ py: 2 }}>
        {/* Başlık ve Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Example Test Simulator
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link component={RouterLink} to="/" color="inherit">
              Ana Sayfa
            </Link>
            <Typography color="text.primary">Example Test Simulator</Typography>
          </Breadcrumbs>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Test Özeti */}
        <Box sx={{ mb: 3 }}>
          <TestsSummary tests={tests} />
        </Box>

        {/* Ana İçerik */}
        <Grid container spacing={3}>
          {/* Sol Panel - Test Listesi ve Ayarlar */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              {/* Test Listesi */}
              <Grid item xs={12}>
                <TestList
                  tests={tests}
                  selectedTestId={selectedTestId}
                  onSelectTest={setSelectedTestId}
                />
              </Grid>

              {/* Test Ayarları */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Test Settings
                  </Typography>
                  <Box component="form" noValidate autoComplete="off">
                    <TextField
                      label="Test Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={test.name}
                      onChange={(e) => handleUpdateTestSettings('name', e.target.value)}
                      disabled={isRunning}
                    />
                    <TextField
                      label="Browser"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={test.browserPreference}
                      onChange={(e) => handleUpdateTestSettings('browserPreference', e.target.value)}
                      disabled={isRunning}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={test.headless}
                            onChange={(e) => handleUpdateTestSettings('headless', e.target.checked)}
                            disabled={isRunning}
                          />
                        }
                        label="Headless Mode"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={test.takeScreenshots}
                            onChange={(e) => handleUpdateTestSettings('takeScreenshots', e.target.checked)}
                            disabled={isRunning}
                          />
                        }
                        label="Take Screenshots"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayArrow />}
                      onClick={handleRunTest}
                      disabled={isRunning}
                      fullWidth
                    >
                      Run Test
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Stop />}
                      onClick={handleStopTest}
                      disabled={!isRunning}
                      fullWidth
                    >
                      Stop
                    </Button>
                  </Box>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Send />}
                      onClick={handleSendToAPI}
                      disabled={isRunning}
                      fullWidth
                    >
                      Send to API
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={handleCreateTestExample}
                      fullWidth
                    >
                      Create Example
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Sağ Panel - Test Detayları ve Loglar */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3} direction="column">
              {/* Test Detayları */}
              <Grid item xs={12}>
                {selectedTestId && tests[selectedTestId] ? (
                  <TestDetails
                    test={tests[selectedTestId]}
                    step={testSteps[selectedTestId]}
                  />
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Lütfen bir test seçin veya yeni bir test oluşturun
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateTestExample}
                      sx={{ mt: 2 }}
                    >
                      Örnek Test Oluştur
                    </Button>
                  </Paper>
                )}
              </Grid>

              {/* Test Logları */}
              <Grid item xs={12}>
                {selectedTestId && testLogs[selectedTestId] ? (
                  <TestLogs
                    logs={testLogs[selectedTestId] || []}
                    onClearLogs={handleClearSelectedTestLogs}
                  />
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Seçili test için log bulunamadı
                    </Typography>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Bildirimler */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ExampleSimulator;
