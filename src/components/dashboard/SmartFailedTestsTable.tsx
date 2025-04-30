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
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import { TestCaseCategory, TestCasePriority } from '../../models/interfaces/ITestCase';
import { useFailedTestsData } from '../../hooks/cardsHooks/useFailedTestsData';
import { useErrorDialog } from '../../context/ErrorDialogContext';

interface SmartFailedTestsTableProps {
  onViewError?: (errorMessage: string) => void;
}

const SmartFailedTestsTable: React.FC<SmartFailedTestsTableProps> = ({ onViewError }) => {
  const navigate = useNavigate();
  const { failedTests, isLoading, error, refresh, rerunTest, rerunningTests } = useFailedTestsData();
  const { showError } = useErrorDialog();
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Tarih formatı yardımcı fonksiyonu
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Kategori adları
  const CATEGORY_NAMES = {
    [TestCaseCategory.FUNCTIONAL]: 'Fonksiyonel',
    [TestCaseCategory.REGRESSION]: 'Regresyon',
    [TestCaseCategory.INTEGRATION]: 'Entegrasyon',
    [TestCaseCategory.PERFORMANCE]: 'Performans',
    [TestCaseCategory.SECURITY]: 'Güvenlik',
    [TestCaseCategory.USABILITY]: 'Kullanılabilirlik',
    [TestCaseCategory.ACCEPTANCE]: 'Kabul',
    [TestCaseCategory.SMOKE]: 'Smoke',
    [TestCaseCategory.EXPLORATORY]: 'Keşif'
  };

  // Öncelik adları ve renkleri
  const PRIORITY_CONFIG = {
    [TestCasePriority.CRITICAL]: { label: 'Kritik', color: 'error' },
    [TestCasePriority.HIGH]: { label: 'Yüksek', color: 'warning' },
    [TestCasePriority.MEDIUM]: { label: 'Orta', color: 'info' },
    [TestCasePriority.LOW]: { label: 'Düşük', color: 'success' }
  };

  // Öncelik etiketi
  const getPriorityChip = (priority: TestCasePriority) => {
    const config = PRIORITY_CONFIG[priority];
    return (
      <Chip
        label={config.label}
        color={config.color as 'error' | 'warning' | 'info' | 'success'}
        size="small"
        sx={{ minWidth: 70 }}
      />
    );
  };

  // Test detaylarını görüntüleme
  const handleViewDetails = (id: string) => {
    navigate(`/test-cases/${id}`);
  };

  // Testi yeniden çalıştırma
  const handleRerun = async (id: string) => {
    try {
      await rerunTest(id);
      setSnackbar({
        open: true,
        message: 'Test başarıyla yeniden çalıştırıldı',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Test yeniden çalıştırılırken hata oluştu',
        severity: 'error'
      });
    }
  };

  // Hata mesajını görüntüleme
  const handleViewError = (_id: string, errorMessage: string) => {
    if (onViewError) {
      // Prop olarak gelen fonksiyonu kullan
      onViewError(errorMessage);
    } else {
      // Global error dialog'u kullan
      showError(errorMessage, 'Hata Detayları');
    }
    
    // Eski dialog kodunu kaldıralım veya yorum satırına alalım
    // setErrorDialog({
    //   open: true,
    //   testId: id,
    //   errorMessage
    // });
  };

  // Snackbar'ı kapatma
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (isLoading && failedTests.length === 0) {
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
            Başarısız Testler
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
                <TableCell align="center">Öncelik</TableCell>
                <TableCell align="center">Kategori</TableCell>
                <TableCell align="center">Son Çalıştırma</TableCell>
                <TableCell align="center">Başarısızlık Sayısı</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {failedTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Başarısız test bulunmuyor.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                failedTests.map((test) => (
                  <TableRow key={test.id} hover>
                    <TableCell>{test.name}</TableCell>
                    <TableCell align="center">{getPriorityChip(test.priority)}</TableCell>
                    <TableCell align="center">{CATEGORY_NAMES[test.category]}</TableCell>
                    <TableCell align="center">{formatDate(test.lastRun)}</TableCell>
                    <TableCell align="center">{test.failureCount}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Detayları Görüntüle">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(test.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={rerunningTests.includes(test.id) ? "Yeniden çalıştırılıyor..." : "Yeniden Çalıştır"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleRerun(test.id)}
                            disabled={rerunningTests.includes(test.id)}
                          >
                            {rerunningTests.includes(test.id) ? (
                              <CircularProgress size={16} />
                            ) : (
                              <RefreshIcon fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Hata Mesajını Görüntüle">
                        <IconButton
                          size="small"
                          onClick={() => handleViewError(test.id, test.errorMessage)}
                        >
                          <ErrorOutlineIcon fontSize="small" />
                        </IconButton>
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

export default SmartFailedTestsTable;
