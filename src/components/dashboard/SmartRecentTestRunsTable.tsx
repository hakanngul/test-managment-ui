import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  MoreTime as MoreTimeIcon
} from '@mui/icons-material';
import { TestCaseResult } from '../../models/interfaces/ITestCase';
import { TestRunStatus } from '../../mock/testRunsMock';
import { useRecentTestRunsData } from '../../hooks/cardsHooks/useRecentTestRunsData';

const SmartRecentTestRunsTable: React.FC = () => {
  const navigate = useNavigate();
  const { recentRuns, isLoading, error, refresh } = useRecentTestRunsData();
  const [rerunningTests, setRerunningTests] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Test detaylarını görüntüleme
  const handleViewTestDetails = (testId: string) => {
    navigate(`/test-cases/${testId}`);
  };

  // Testi yeniden çalıştırma
  const handleRerunTest = (testId: string) => {
    // Zaten çalışıyorsa uyarı ver
    if (rerunningTests.includes(testId)) {
      setSnackbar({
        open: true,
        message: 'Bu test zaten yeniden çalıştırılıyor.',
        severity: 'warning'
      });
      return;
    }

    // Çalışan testler listesine ekle
    setRerunningTests(prev => [...prev, testId]);

    // Test çalıştırma işlemi burada yapılacak
    console.log(`Test yeniden çalıştırılıyor: ${testId}`);

    // API çağrısı simülasyonu
    setTimeout(() => {
      setRerunningTests(prev => prev.filter(id => id !== testId));
      setSnackbar({
        open: true,
        message: `Test başarıyla kuyruğa alındı.`,
        severity: 'success'
      });
      
      // Verileri yenile
      refresh();
    }, 2000);
  };

  // Snackbar'ı kapat
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Tarih formatı yardımcı fonksiyonu
  const formatDate = (date?: Date): string => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Süre formatı yardımcı fonksiyonu
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes} dk ${seconds % 60} sn`;
    } else {
      return `${seconds} sn`;
    }
  };

  // Durum rengi ve etiketi
  const getStatusChip = (status: TestRunStatus, result?: TestCaseResult) => {
    let color: 'success' | 'error' | 'warning' | 'info' | 'default' = 'default';
    let label = '';

    if (status === TestRunStatus.COMPLETED) {
      if (result === TestCaseResult.PASSED) {
        color = 'success';
        label = 'Başarılı';
      } else if (result === TestCaseResult.FAILED) {
        color = 'error';
        label = 'Başarısız';
      } else if (result === TestCaseResult.BLOCKED) {
        color = 'warning';
        label = 'Engellendi';
      } else if (result === TestCaseResult.SKIPPED) {
        color = 'info';
        label = 'Atlandı';
      }
    } else if (status === TestRunStatus.RUNNING) {
      color = 'info';
      label = 'Çalışıyor';
    } else if (status === TestRunStatus.QUEUED) {
      color = 'default';
      label = 'Kuyrukta';
    } else if (status === TestRunStatus.FAILED || status === TestRunStatus.ERROR) {
      color = 'error';
      label = 'Hata';
    } else if (status === TestRunStatus.CANCELLED) {
      color = 'warning';
      label = 'İptal Edildi';
    }

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        sx={{ minWidth: 80 }}
      />
    );
  };

  if (isLoading && recentRuns.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          p: 3,
          height: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography color="error" gutterBottom>
          Veri yüklenirken hata oluştu: {error}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={refresh}
        >
          Yeniden Dene
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Son Çalıştırılan Testler
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isLoading && (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            )}
            <Tooltip title="Yenile">
              <IconButton size="small" onClick={refresh}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <TableContainer sx={{ maxHeight: 350 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Test Adı</TableCell>
                <TableCell align="center">Durum</TableCell>
                <TableCell align="center">Başlangıç</TableCell>
                <TableCell align="center">Süre</TableCell>
                <TableCell align="center">Çalıştıran</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Henüz test çalıştırması bulunmuyor.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentRuns.map((run) => (
                  <TableRow key={run.id} hover>
                    <TableCell>{run.testCaseName}</TableCell>
                    <TableCell align="center">{getStatusChip(run.status, run.result)}</TableCell>
                    <TableCell align="center">{formatDate(run.startTime)}</TableCell>
                    <TableCell align="center">
                      {run.status === TestRunStatus.COMPLETED 
                        ? formatDuration(run.duration) 
                        : run.status === TestRunStatus.RUNNING 
                          ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <MoreTimeIcon fontSize="small" color="info" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                Devam ediyor
                              </Typography>
                            </Box>
                          : '-'
                      }
                    </TableCell>
                    <TableCell align="center">{run.executedBy}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Detayları Görüntüle">
                        <IconButton
                          size="small"
                          onClick={() => handleViewTestDetails(run.testCaseId)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={
                        rerunningTests.includes(run.testCaseId) 
                          ? "Yeniden çalıştırılıyor..." 
                          : run.status === TestRunStatus.RUNNING || run.status === TestRunStatus.QUEUED
                            ? "Test zaten çalışıyor veya kuyrukta"
                            : "Yeniden Çalıştır"
                      }>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleRerunTest(run.testCaseId)}
                            disabled={
                              rerunningTests.includes(run.testCaseId) || 
                              run.status === TestRunStatus.RUNNING || 
                              run.status === TestRunStatus.QUEUED
                            }
                          >
                            {rerunningTests.includes(run.testCaseId) ? (
                              <CircularProgress size={16} />
                            ) : (
                              <RefreshIcon fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bildirim Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SmartRecentTestRunsTable;