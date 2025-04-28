import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Grid,
  CircularProgress,
  Divider,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import ReportsSummaryCards from '../components/reports/ReportsSummaryCards';
import TestResultDistributionChart from '../components/reports/TestResultDistributionChart';
import TestResultsOverTimeChart from '../components/reports/TestResultsOverTimeChart';
import TestDurationDistributionChart from '../components/reports/TestDurationDistributionChart';
import TestFailureReasonsChart from '../components/reports/TestFailureReasonsChart';
import TopFailingTestsTable from '../components/reports/TopFailingTestsTable';
import SlowestTestsTable from '../components/reports/SlowestTestsTable';
import BrowserEnvironmentDistributionChart from '../components/reports/BrowserEnvironmentDistributionChart';
import { mockReportingData } from '../mock/reportsMock';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reportingData, setReportingData] = useState(mockReportingData);
  const [timeRange, setTimeRange] = useState('last14days');
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
          setReportingData(mockReportingData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  // Verileri yenile
  const handleRefresh = () => {
    setIsLoading(true);
    // Gerçek uygulamada burada API çağrıları yapılacak
    setTimeout(() => {
      setReportingData(mockReportingData);
      setIsLoading(false);
      
      setSnackbarMessage('Veriler yenilendi');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 1000);
  };

  // Zaman aralığını değiştir
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // Raporu dışa aktar
  const handleExportReport = () => {
    // Gerçek uygulamada burada rapor dışa aktarma işlemi yapılacak
    console.log('Rapor dışa aktarılıyor...');
    
    setSnackbarMessage('Rapor dışa aktarılıyor...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Raporu yazdır
  const handlePrintReport = () => {
    // Gerçek uygulamada burada rapor yazdırma işlemi yapılacak
    console.log('Rapor yazdırılıyor...');
    
    setSnackbarMessage('Rapor yazdırılıyor...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Test detaylarını görüntüle
  const handleViewTestDetails = (id: string) => {
    // Gerçek uygulamada burada test detay sayfasına yönlendirme yapılacak
    console.log(`Test ${id} detayları görüntüleniyor...`);
    navigate(`/test-cases/${id}`);
  };

  // Testi yeniden çalıştır
  const handleRerunTest = (id: string) => {
    // Gerçek uygulamada burada test yeniden çalıştırma işlemi yapılacak
    console.log(`Test ${id} yeniden çalıştırılıyor...`);
    
    setSnackbarMessage(`Test ${id} yeniden çalıştırılıyor...`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Performans analizi
  const handleAnalyzePerformance = (id: string) => {
    // Gerçek uygulamada burada performans analizi sayfasına yönlendirme yapılacak
    console.log(`Test ${id} performans analizi yapılıyor...`);
    
    setSnackbarMessage(`Test ${id} performans analizi yapılıyor...`);
    setSnackbarSeverity('info');
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
          <Typography color="text.primary">Raporlar</Typography>
        </Breadcrumbs>

        {/* Başlık ve Butonlar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Test Raporları
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="time-range-label">Zaman Aralığı</InputLabel>
              <Select
                labelId="time-range-label"
                id="time-range"
                value={timeRange}
                label="Zaman Aralığı"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="last7days">Son 7 Gün</MenuItem>
                <MenuItem value="last14days">Son 14 Gün</MenuItem>
                <MenuItem value="last30days">Son 30 Gün</MenuItem>
                <MenuItem value="last90days">Son 90 Gün</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Yenile
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportReport}
            >
              Dışa Aktar
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrintReport}
            >
              Yazdır
            </Button>
          </Box>
        </Box>

        {/* Özet Kartları */}
        <ReportsSummaryCards 
          executionSummary={reportingData.testExecutionSummary}
          automationCoverage={reportingData.testAutomationCoverage}
        />
        
        <Divider sx={{ my: 4 }} />
        
        {/* Test Sonuçları Grafikleri */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TestResultDistributionChart data={reportingData.testResultDistribution} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TestResultsOverTimeChart data={reportingData.testResultsOverTime} />
          </Grid>
        </Grid>
        
        {/* Test Süresi ve Başarısızlık Nedenleri */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TestDurationDistributionChart data={reportingData.testDurationDistribution} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TestFailureReasonsChart data={reportingData.testFailureReasons} />
          </Grid>
        </Grid>
        
        {/* Tarayıcı ve Ortam Dağılımı */}
        <Box sx={{ mb: 4 }}>
          <BrowserEnvironmentDistributionChart 
            browserData={reportingData.browserDistribution}
            environmentData={reportingData.environmentDistribution}
          />
        </Box>
        
        {/* En Çok Başarısız Olan Testler */}
        <Box sx={{ mb: 4 }}>
          <TopFailingTestsTable 
            data={reportingData.topFailingTests}
            onViewDetails={handleViewTestDetails}
            onRerun={handleRerunTest}
          />
        </Box>
        
        {/* En Yavaş Testler */}
        <Box>
          <SlowestTestsTable 
            data={reportingData.slowestTests}
            onViewDetails={handleViewTestDetails}
            onAnalyzePerformance={handleAnalyzePerformance}
          />
        </Box>
      </Box>
      
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

export default Reports;
