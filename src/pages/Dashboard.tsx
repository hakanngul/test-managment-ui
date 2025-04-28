import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import DashboardSummaryCards from '../components/dashboard/DashboardSummaryCards';
import TestStatusDistributionChart from '../components/dashboard/TestStatusDistributionChart';
import TestResultsOverTimeChart from '../components/dashboard/TestResultsOverTimeChart';
import TestCategoryDistributionChart from '../components/dashboard/TestCategoryDistributionChart';
import RecentTestRunsTable from '../components/dashboard/RecentTestRunsTable';
import FailedTestsTable from '../components/dashboard/FailedTestsTable';
import BrowserEnvironmentDistributionChart from '../components/dashboard/BrowserEnvironmentDistributionChart';
import RecentActivitiesCard from '../components/dashboard/RecentActivitiesCard';
import ProjectTestStatusCard from '../components/dashboard/ProjectTestStatusCard';
import SlowestTestsCard from '../components/dashboard/SlowestTestsCard';
import { mockDashboardData } from '../mock/dashboardMock';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useApp();

  // Dialog durumları
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [selectedErrorMessage, setSelectedErrorMessage] = useState('');

  // Verileri yenileme fonksiyonu
  const handleRefreshData = () => {
    // API'den verileri yeniden çekme işlemi burada yapılacak
    console.log('Veriler yenileniyor...');
  };

  // Test detaylarını görüntüleme
  const handleViewTestDetails = (testId: string) => {
    navigate(`/test-cases/${testId}`);
  };

  // Testi yeniden çalıştırma
  const handleRerunTest = (testId: string) => {
    // Test çalıştırma işlemi burada yapılacak
    console.log(`Test yeniden çalıştırılıyor: ${testId}`);
  };

  // Hata mesajını görüntüleme
  const handleViewError = (testId: string, errorMessage: string) => {
    setSelectedErrorMessage(errorMessage);
    setErrorDialogOpen(true);
  };

  // Aktivite detaylarını görüntüleme
  const handleViewActivity = (relatedId: string, type: string) => {
    if (type.startsWith('test_')) {
      navigate(`/test-cases/${relatedId}`);
    }
  };

  // Proje seçme
  const handleSelectProject = (projectId: string) => {
    // Proje seçme işlemi burada yapılacak
    console.log(`Proje seçildi: ${projectId}`);
  };

  return (
    <Box>
      {/* Başlık ve Kontroller */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Ana Sayfa
            </Link>
            <Typography color="text.primary">Dashboard</Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DateRangeIcon />}
            sx={{ mr: 1 }}
          >
            Son 7 Gün
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshData}
          >
            Yenile
          </Button>
        </Box>
      </Box>

      {/* Proje Bilgisi */}
      {currentProject && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            bgcolor: 'primary.lighter'
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Aktif Proje: {currentProject.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentProject.description}
          </Typography>
        </Paper>
      )}

      {/* Özet Kartları */}
      <DashboardSummaryCards
        testStatusSummary={mockDashboardData.testStatusSummary}
        testRunSummary={mockDashboardData.testRunSummary}
        automationCoverage={mockDashboardData.automationCoverage}
        lastRunInfo={mockDashboardData.lastRunInfo}
      />

      <Divider sx={{ my: 4 }} />

      {/* Test Sonuçları Grafikleri */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TestStatusDistributionChart data={mockDashboardData.testStatusDistribution} />
        </Grid>
        <Grid item xs={12} md={8}>
          <TestResultsOverTimeChart data={mockDashboardData.testResultsOverTime} />
        </Grid>
      </Grid>

      {/* Son Çalıştırılan Testler ve Başarısız Testler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <RecentTestRunsTable
            data={mockDashboardData.recentTestRuns}
            onViewDetails={handleViewTestDetails}
            onRerun={handleRerunTest}
          />
        </Grid>
        <Grid item xs={12} lg={5}>
          <FailedTestsTable
            data={mockDashboardData.failedTests}
            onViewDetails={handleViewTestDetails}
            onRerun={handleRerunTest}
            onViewError={handleViewError}
          />
        </Grid>
      </Grid>

      {/* Test Kategorisi Dağılımı ve Tarayıcı/Ortam Dağılımı */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <TestCategoryDistributionChart data={mockDashboardData.testCategoryDistribution} />
        </Grid>
        <Grid item xs={12} md={7}>
          <BrowserEnvironmentDistributionChart
            browserData={mockDashboardData.browserDistribution}
            environmentData={mockDashboardData.environmentDistribution}
          />
        </Grid>
      </Grid>

      {/* Proje Durumu, Son Aktiviteler ve En Yavaş Testler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <ProjectTestStatusCard
            data={mockDashboardData.projectTestStatus}
            onSelectProject={handleSelectProject}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentActivitiesCard
            data={mockDashboardData.recentActivities}
            onViewActivity={handleViewActivity}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SlowestTestsCard
            data={mockDashboardData.slowestTests}
            onViewTest={handleViewTestDetails}
          />
        </Grid>
      </Grid>

      {/* Hata Mesajı Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">
          Hata Mesajı
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {selectedErrorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} autoFocus>
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
