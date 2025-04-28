import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Divider,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { TestCase } from '../../models/interfaces/ITestCase';
import { TestStepExecution, TestStepExecutionStatus } from '../../mock/testExecutionSimulatorMock';
import { ExecutionStatus } from '../../models/enums/TestEnums';

interface TestStepExecutorProps {
  testCase: TestCase | null;
  steps: TestStepExecution[];
  executionStatus: ExecutionStatus;
}

const TestStepExecutor: React.FC<TestStepExecutorProps> = ({
  testCase,
  steps,
  executionStatus
}) => {
  // Aktif adımı bul
  const activeStep = steps.findIndex(step =>
    step.status === TestStepExecutionStatus.RUNNING ||
    step.status === TestStepExecutionStatus.PENDING
  );

  // Adım durumuna göre ikon ve renk belirle
  const getStepIcon = (status: TestStepExecutionStatus) => {
    switch (status) {
      case TestStepExecutionStatus.PASSED:
        return <CheckCircleIcon fontSize="small" color="success" />;
      case TestStepExecutionStatus.FAILED:
        return <CancelIcon fontSize="small" color="error" />;
      case TestStepExecutionStatus.SKIPPED:
        return <WarningIcon fontSize="small" color="warning" />;
      case TestStepExecutionStatus.ERROR:
        return <CancelIcon fontSize="small" color="error" />;
      case TestStepExecutionStatus.RUNNING:
        return <CircularProgress size={16} />;
      default:
        return <InfoIcon fontSize="small" color="disabled" />;
    }
  };

  // Adım durumuna göre etiket rengi belirle
  const getStepLabelColor = (status: TestStepExecutionStatus) => {
    switch (status) {
      case TestStepExecutionStatus.PASSED:
        return 'success';
      case TestStepExecutionStatus.FAILED:
        return 'error';
      case TestStepExecutionStatus.SKIPPED:
        return 'warning';
      case TestStepExecutionStatus.ERROR:
        return 'error';
      case TestStepExecutionStatus.RUNNING:
        return 'primary';
      default:
        return 'default';
    }
  };

  // Adım durumuna göre metin belirle
  const getStepStatusText = (status: TestStepExecutionStatus) => {
    switch (status) {
      case TestStepExecutionStatus.PASSED:
        return 'Başarılı';
      case TestStepExecutionStatus.FAILED:
        return 'Başarısız';
      case TestStepExecutionStatus.SKIPPED:
        return 'Atlandı';
      case TestStepExecutionStatus.ERROR:
        return 'Hata';
      case TestStepExecutionStatus.RUNNING:
        return 'Çalışıyor';
      default:
        return 'Bekliyor';
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        mb: 2,
        minHeight: '400px'
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" fontWeight="medium">
          Test Adımları
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {testCase ? `"${testCase.name}" testi için adımlar` : 'Lütfen bir test seçin'}
        </Typography>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
        {testCase && steps.length > 0 ? (
          <Stepper
            activeStep={activeStep === -1 ? steps.length : activeStep}
            orientation="vertical"
            sx={{
              '& .MuiStepConnector-line': {
                minHeight: '20px'
              }
            }}
          >
            {steps.map((step, index) => (
              <Step
                key={step.id}
                completed={step.status === TestStepExecutionStatus.PASSED}
                sx={{ mb: 1 }}
              >
                <StepLabel
                  StepIconComponent={() => getStepIcon(step.status)}
                  sx={{
                    '& .MuiStepLabel-labelContainer': {
                      color: step.status === TestStepExecutionStatus.FAILED ? 'error.main' :
                             step.status === TestStepExecutionStatus.RUNNING ? 'primary.main' : 'text.primary'
                    }
                  }}
                  optional={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={getStepStatusText(step.status)}
                        size="small"
                        color={getStepLabelColor(step.status) as any}
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 'medium'
                        }}
                      />
                      {step.duration && (
                        <Typography variant="caption" color="text.secondary" fontWeight="medium">
                          {(step.duration / 1000).toFixed(2)}s
                        </Typography>
                      )}
                      {step.screenshot && (
                        <Tooltip title="Ekran Görüntüsü">
                          <IconButton size="small" color="primary">
                            <ImageIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  }
                >
                  <Typography
                    variant="body2"
                    fontWeight={step.status === TestStepExecutionStatus.RUNNING ? 'bold' : 'medium'}
                  >
                    {step.description}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box
                    sx={{
                      mb: 2,
                      p: 1.5,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Beklenen Sonuç:</strong> {step.expectedResult}
                    </Typography>
                    {step.actualResult && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Gerçek Sonuç:</strong> {step.actualResult}
                      </Typography>
                    )}
                    {step.error && (
                      <Typography variant="body2" color="error" gutterBottom>
                        <strong>Hata:</strong> {step.error}
                      </Typography>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              {testCase ? 'Bu test için adım bulunamadı' : 'Lütfen bir test seçin'}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TestStepExecutor;
