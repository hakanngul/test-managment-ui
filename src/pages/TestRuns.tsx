import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  CircularProgress,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import TestRunsSummaryCards from '../components/test-runs/TestRunsSummaryCards';
import ActiveTestRunsTable from '../components/test-runs/ActiveTestRunsTable';
import RecentTestRunsTable from '../components/test-runs/RecentTestRunsTable';
import { 
  mockActiveTestRuns, 
  mockRecentTestRuns, 
  mockTestRunsSummary,
  TestRun
} from '../mock/testRunsMock';

const TestRuns: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestRuns, setActiveTestRuns] = useState<TestRun[]>([]);
  const [recentTestRuns, setRecentTestRuns] = useState<TestRun[]>([]);
  const [summary, setSummary] = useState(mockTestRunsSummary);
  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  useEffect(() => {
    // Verileri yükle
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Gerçek uygulamada burada API çağrıları yapılacak
        setTimeout(() => {
          setActiveTestRuns(mockActiveTestRuns);
          setRecentTestRuns(mockRecentTestRuns);
          setSummary(mockTestRunsSummary);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Verileri yenile
  const handleRefresh = () => {
    setIsLoading(true);
    // Gerçek uygulamada burada API çağrıları yapılacak
    setTimeout(() => {
      setActiveTestRuns(mockActiveTestRuns);
      setRecentTestRuns(mockRecentTestRuns);
      setSummary(mockTestRunsSummary);
      setIsLoading(false);
      
      setSnackbarMessage('Veriler yenilendi');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 1000);
  };

  // Test detaylarını görüntüle
  const handleViewDetails = (id: string) => {
    // Gerçek uygulamada burada test run detay sayfasına yönlendirme yapılacak
    console.log(`Test run ${id} detayları görüntüleniyor...`);
    // navigate(`/test-runs/${id}`);
    
    setSnackbarMessage(`Test run ${id} detayları görüntüleniyor...`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Testi durdur
  const handleStopRun = (id: string) => {
    setSelectedRunId(id);
    setStopDialogOpen(true);
  };

  // Durdurma işlemini onayla
  const handleConfirmStop = () => {
    if (!selectedRunId) return;
    
    // Gerçek uygulamada burada API çağrısı yapılacak
    console.log(`Test run ${selectedRunId} durduruluyor...`);
    
    // Mock veriyi güncelle
    const updatedActiveTestRuns = activeTestRuns.filter(run => run.id !== selectedRunId);
    setActiveTestRuns(updatedActiveTestRuns);
    
    setStopDialogOpen(false);
    setSelectedRunId(null);
    
    setSnackbarMessage('Test çalıştırması durduruldu');
    setSnackbarSeverity('warning');
    setSnackbarOpen(true);
  };

  // Testi yeniden çalıştır
  const handleRerun = (id: string) => {
    // Gerçek uygulamada burada API çağrısı yapılacak
    console.log(`Test run ${id} yeniden çalıştırılıyor...`);
    
    setSnackbarMessage('Test yeniden çalıştırılıyor...');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Snackbar'ı kapat
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            Ana Sayfa
          </Link>
          <Typography color="text.primary">Test Çalıştırmaları</Typography>
        </Breadcrumbs>

        {/* Başlık ve Butonlar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Test Çalıştırmaları
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Yenile
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={() => navigate('/test-cases')}
            >
              Yeni Test Çalıştır
            </Button>
          </Box>
        </Box>

        {/* Özet Kartları */}
        <TestRunsSummaryCards summary={summary} />
        
        <Divider sx={{ my: 4 }} />
        
        {/* Aktif Test Çalıştırmaları */}
        <Box sx={{ mb: 4 }}>
          <ActiveTestRunsTable 
            testRuns={activeTestRuns} 
            onViewDetails={handleViewDetails}
            onStopRun={handleStopRun}
          />
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Son Test Çalıştırmaları */}
        <Box>
          <RecentTestRunsTable 
            testRuns={recentTestRuns}
            onViewDetails={handleViewDetails}
            onRerun={handleRerun}
          />
        </Box>
      </Box>
      
      {/* Test Durdurma Onay Modalı */}
      <Dialog
        open={stopDialogOpen}
        onClose={() => setStopDialogOpen(false)}
      >
        <DialogTitle>
          Test Çalıştırmasını Durdur
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu test çalıştırmasını durdurmak istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStopDialogOpen(false)}>İptal</Button>
          <Button onClick={handleConfirmStop} color="error">
            Durdur
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TestRuns;
