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
  Snackbar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

import TestCaseSelector from '../components/test-execution-simulator/TestCaseSelector';
import TestExecutionPanel from '../components/test-execution-simulator/TestExecutionPanel';
import TestStepExecutor from '../components/test-execution-simulator/TestStepExecutor';
import TestExecutionResults from '../components/test-execution-simulator/TestExecutionResults';
import TestExecutionLogs from '../components/test-execution-simulator/TestExecutionLogs';

import { TestCase } from '../models/interfaces/ITestCase';
import {
  availableTestCases,
  TestExecution,
  TestStepExecution,
  TestExecutionSettings,
  defaultTestExecutionSettings
} from '../mock/testExecutionSimulatorMock';
import { ExecutionStatus } from '../models/enums/TestEnums';
import TestExecutionSimulatorService from '../services/TestExecutionSimulatorService';

const TestExecutionSimulator: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(availableTestCases);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>(ExecutionStatus.QUEUED);
  const [executionSteps, setExecutionSteps] = useState<TestStepExecution[]>([]);
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

  // Test case seçimi
  const handleSelectTestCase = (testCase: TestCase) => {
    setSelectedTestCase(testCase);
    // Yeni bir test seçildiğinde önceki çalıştırma sonuçlarını temizle
    if (!isRunning) {
      setExecutionSteps([]);
      setExecutionLogs([]);
      setExecutionResult(null);
      setExecutionError(undefined);
    }
  };

  // Test çalıştırma
  const handleRunTest = async (settings: TestExecutionSettings) => {
    if (!selectedTestCase) return;

    try {
      setIsRunning(true);
      setExecutionStatus(ExecutionStatus.QUEUED);
      setExecutionSteps([]);
      setExecutionLogs([]);
      setExecutionResult(null);
      setExecutionError(undefined);

      // Test çalıştırma simülasyonu
      const result = await TestExecutionSimulatorService.simulateTestExecution(
        selectedTestCase,
        settings,
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

  // Logları temizle
  const handleClearLogs = () => {
    setExecutionLogs([]);
  };

  // Testi yeniden çalıştır
  const handleRerunTest = () => {
    if (selectedTestCase) {
      handleRunTest(defaultTestExecutionSettings);
    }
  };

  // Bildirim kapatma
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 2 }}>
        {/* Başlık ve Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Test Execution Simulator
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link component={RouterLink} to="/" color="inherit">
              Ana Sayfa
            </Link>
            <Typography color="text.primary">Test Execution Simulator</Typography>
          </Breadcrumbs>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Ana İçerik */}
        <Grid container spacing={3}>
          {/* Sol Panel - Test Case Seçimi */}
          <Grid item xs={12} md={4} lg={3}>
            <TestCaseSelector
              testCases={testCases}
              selectedTestCase={selectedTestCase}
              onSelectTestCase={handleSelectTestCase}
              onRunTestCase={(testCase) => {
                setSelectedTestCase(testCase);
                handleRunTest(defaultTestExecutionSettings);
              }}
            />
          </Grid>

          {/* Orta Panel - Test Adımları ve Çalıştırma Kontrolleri */}
          <Grid item xs={12} md={8} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TestExecutionPanel
                  testCase={selectedTestCase}
                  isRunning={isRunning}
                  onRunTest={handleRunTest}
                  onStopTest={handleStopTest}
                  executionError={executionError}
                />
              </Grid>
              <Grid item xs={12}>
                <TestStepExecutor
                  testCase={selectedTestCase}
                  steps={executionSteps}
                  executionStatus={executionStatus}
                />
              </Grid>
              <Grid item xs={12}>
                <TestExecutionResults
                  execution={executionResult}
                  onRerunTest={handleRerunTest}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Sağ Panel - Loglar */}
          <Grid item xs={12} md={12} lg={3}>
            <TestExecutionLogs
              logs={executionLogs}
              onClearLogs={handleClearLogs}
            />
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

export default TestExecutionSimulator;
