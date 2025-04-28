import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
  Computer as ComputerIcon,
  Public as PublicIcon,
  Image as ImageIcon,
  Videocam as VideocamIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { TestExecution, TestStepExecutionStatus } from '../../mock/testExecutionSimulatorMock';
import { ExecutionStatus } from '../../models/enums/TestEnums';
import { TestCaseResult } from '../../models/interfaces/ITestCase';

interface TestExecutionResultsProps {
  execution: TestExecution | null;
  onRerunTest: () => void;
}

const TestExecutionResults: React.FC<TestExecutionResultsProps> = ({
  execution,
  onRerunTest
}) => {
  if (!execution) {
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
          minHeight: '200px'
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
            Test Sonuçları
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Henüz test çalıştırılmadı
          </Typography>
        </Box>

        <Box sx={{
          p: 4,
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'grey.50'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <PlayArrowIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="body1" color="text.secondary" fontWeight="medium">
              Test çalıştırıldığında sonuçlar burada görüntülenecek
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Test durumuna göre renk ve ikon belirle
  const getStatusColor = (status: ExecutionStatus) => {
    switch (status) {
      case ExecutionStatus.COMPLETED:
        return 'success';
      case ExecutionStatus.FAILED:
        return 'error';
      case ExecutionStatus.RUNNING:
        return 'primary';
      case ExecutionStatus.QUEUED:
        return 'info';
      case ExecutionStatus.ABORTED:
        return 'warning';
      default:
        return 'default';
    }
  };

  // Test durumuna göre metin belirle
  const getStatusText = (status: ExecutionStatus) => {
    switch (status) {
      case ExecutionStatus.COMPLETED:
        return 'Tamamlandı';
      case ExecutionStatus.FAILED:
        return 'Başarısız';
      case ExecutionStatus.RUNNING:
        return 'Çalışıyor';
      case ExecutionStatus.QUEUED:
        return 'Kuyrukta';
      case ExecutionStatus.ABORTED:
        return 'İptal Edildi';
      case ExecutionStatus.TIMEOUT:
        return 'Zaman Aşımı';
      case ExecutionStatus.ERROR:
        return 'Hata';
      default:
        return 'Bilinmiyor';
    }
  };

  // Test sonucuna göre renk ve ikon belirle
  const getResultColor = (result?: TestCaseResult) => {
    switch (result) {
      case TestCaseResult.PASSED:
        return 'success';
      case TestCaseResult.FAILED:
        return 'error';
      case TestCaseResult.BLOCKED:
        return 'warning';
      case TestCaseResult.SKIPPED:
        return 'info';
      default:
        return 'default';
    }
  };

  // Test adımlarının durumunu hesapla
  const stepStats = execution.steps.reduce(
    (acc, step) => {
      switch (step.status) {
        case TestStepExecutionStatus.PASSED:
          acc.passed += 1;
          break;
        case TestStepExecutionStatus.FAILED:
          acc.failed += 1;
          break;
        case TestStepExecutionStatus.SKIPPED:
          acc.skipped += 1;
          break;
        case TestStepExecutionStatus.ERROR:
          acc.error += 1;
          break;
        default:
          acc.pending += 1;
      }
      return acc;
    },
    { passed: 0, failed: 0, skipped: 0, error: 0, pending: 0 }
  );

  // İlerleme yüzdesini hesapla
  const progress = execution.steps.length > 0
    ? ((stepStats.passed + stepStats.failed + stepStats.skipped + stepStats.error) / execution.steps.length) * 100
    : 0;

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{
        p: 2,
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box>
          <Typography variant="h6" fontWeight="medium">
            Test Sonuçları
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {execution.testCaseName}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Testi Yeniden Çalıştır">
            <IconButton
              onClick={onRerunTest}
              color="primary"
              disabled={execution.status === ExecutionStatus.RUNNING}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
        {/* Durum ve İlerleme */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: execution.status === ExecutionStatus.COMPLETED ? 'success.lighter' :
                     execution.status === ExecutionStatus.FAILED ? 'error.lighter' :
                     execution.status === ExecutionStatus.RUNNING ? 'primary.lighter' : 'grey.100',
            borderRadius: 2,
            border: '1px solid',
            borderColor: execution.status === ExecutionStatus.COMPLETED ? 'success.light' :
                         execution.status === ExecutionStatus.FAILED ? 'error.light' :
                         execution.status === ExecutionStatus.RUNNING ? 'primary.light' : 'grey.300',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip
              label={getStatusText(execution.status)}
              color={getStatusColor(execution.status) as any}
              sx={{ mr: 1, fontWeight: 'bold' }}
            />
            {execution.result && (
              <Chip
                label={execution.result}
                color={getResultColor(execution.result) as any}
                sx={{ fontWeight: 'bold' }}
              />
            )}
            <Box sx={{ flexGrow: 1 }} />
            {execution.duration && (
              <Typography variant="body2" fontWeight="medium">
                Süre: {(execution.duration / 1000).toFixed(2)}s
              </Typography>
            )}
          </Box>

          {execution.status === ExecutionStatus.RUNNING && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', fontWeight: 'medium' }}>
                İlerleme: %{Math.round(progress)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Test Bilgileri */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Test Ortamı
                </Typography>
                <List dense disablePadding>
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ComputerIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Tarayıcı: ${execution.browser}`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    />
                  </ListItem>
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PublicIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Ortam: ${execution.environment}`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    />
                  </ListItem>
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <TimerIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Başlangıç: ${execution.startTime?.toLocaleTimeString()}`}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    />
                  </ListItem>
                  {execution.endTime && (
                    <ListItem disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TimerIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Bitiş: ${execution.endTime.toLocaleTimeString()}`}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Adım Sonuçları
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="medium">
                        Başarılı: {stepStats.passed}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CancelIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="medium">
                        Başarısız: {stepStats.failed}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon color="warning" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="medium">
                        Atlandı: {stepStats.skipped}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="medium">
                        Hata: {stepStats.error}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Ekran Görüntüleri */}
        {execution.screenshots && execution.screenshots.length > 0 && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Ekran Görüntüleri
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {execution.screenshots.map((screenshot, index) => (
                <Chip
                  key={index}
                  icon={<ImageIcon color="primary" />}
                  label={screenshot}
                  variant="outlined"
                  onClick={() => {}}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Video Kaydı */}
        {execution.video && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Video Kaydı
            </Typography>
            <Chip
              icon={<VideocamIcon color="primary" />}
              label={execution.video}
              variant="outlined"
              onClick={() => {}}
            />
          </Box>
        )}

        {/* Hata Mesajı */}
        {execution.error && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'error.lighter',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'error.light'
            }}
          >
            <Typography variant="subtitle2" color="error" gutterBottom fontWeight="bold">
              Hata
            </Typography>
            <Typography variant="body2" color="error">
              {execution.error}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TestExecutionResults;
