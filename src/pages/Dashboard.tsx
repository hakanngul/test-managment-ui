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
import SmartTestStatusCard from '../components/cards/smarts/SmartTestStatusCard';
import { SmartAutomationCoverageCard, SmartLastRunCard, SmartTestRunCard } from '../components/cards/smarts';
import SmartTestStatusDistributionChart from '../components/dashboard/SmartTestStatusDistributionChart';
import SmartTestResultsOverTimeChart from '../components/dashboard/SmartTestResultsOverTimeChart';
import SmartRecentTestRunsTable from '../components/dashboard/SmartRecentTestRunsTable';
import SmartFailedTestsTable from '../components/dashboard/SmartFailedTestsTable';
import SmartBrowserEnvironmentDistributionChart from '../components/dashboard/SmartBrowserEnvironmentDistributionChart';
import SmartRecentActivitiesCard from '../components/dashboard/SmartRecentActivitiesCard';
import SmartSlowestTestsCard from '../components/dashboard/SmartSlowestTestsCard';
import SmartTestCategoryDistributionChart from '../components/dashboard/SmartTestCategoryDistributionChart';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dialog durumları
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [selectedErrorMessage, setSelectedErrorMessage] = useState('');

  // Verileri yenileme fonksiyonu
  const handleRefreshData = () => {
    // API'den verileri yeniden çekme işlemi burada yapılacak
    console.log('Veriler yenileniyor...');
  };

  // Test detaylarını görüntüleme

  // Testi yeniden çalıştırma

  // Hata mesajını görüntüleme

  // Aktivite detaylarını görüntüleme



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


      {/* Özet Kartları */}

      <Grid container spacing={3}>
        <SmartTestStatusCard />
        <SmartTestRunCard />
        <SmartAutomationCoverageCard />
        <SmartLastRunCard />
      </Grid>


      <Divider sx={{ my: 4 }} />

      {/* Test Sonuçları Grafikleri */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
        <SmartTestStatusDistributionChart />
        </Grid>
      
        <Grid item xs={12} md={8}>
          <SmartTestResultsOverTimeChart/>
        </Grid>
      </Grid>

      {/* Son Çalıştırılan Testler ve Başarısız Testler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <SmartRecentTestRunsTable />
        </Grid>
        <Grid item xs={12} lg={5}>
          <SmartTestCategoryDistributionChart />
        </Grid>
      </Grid>

      {/* Test Kategorisi Dağılımı ve Tarayıcı/Ortam Dağılımı */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={12}>
         <SmartFailedTestsTable />
        </Grid>
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={12}>
          <SmartBrowserEnvironmentDistributionChart />
        </Grid>
    
      </Grid>

      {/* Son Aktiviteler ve En Yavaş Testler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <SmartRecentActivitiesCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <SmartSlowestTestsCard />
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
