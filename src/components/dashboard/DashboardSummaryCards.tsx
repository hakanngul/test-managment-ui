import React from 'react';
import { Grid, Paper, Box, Typography, Divider, Chip } from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  PlayArrow as PlayArrowIcon,
  AccessTime as AccessTimeIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { TestStatusSummary, TestRunSummary, AutomationCoverage, LastRunInfo } from '../../mock/dashboardMock';

interface DashboardSummaryCardsProps {
  testStatusSummary: TestStatusSummary;
  testRunSummary: TestRunSummary;
  automationCoverage: AutomationCoverage;
  lastRunInfo: LastRunInfo;
}

const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({
  testStatusSummary,
  testRunSummary,
  automationCoverage,
  lastRunInfo
}) => {
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

  // Süre formatı yardımcı fonksiyonu
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} saat ${minutes % 60} dk`;
    } else if (minutes > 0) {
      return `${minutes} dk ${seconds % 60} sn`;
    } else {
      return `${seconds} sn`;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Test Durumu Özeti */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            height: '100%',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Test Durumu
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {testStatusSummary.total}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Toplam Test
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlineIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Başarılı</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {testStatusSummary.passed}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ErrorOutlineIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Başarısız</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {testStatusSummary.failed}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PauseCircleOutlineIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Engellenen</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {testStatusSummary.blocked}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Chip
              label={`Başarı Oranı: %${testStatusSummary.passRate}`}
              color={testStatusSummary.passRate >= 80 ? 'success' : testStatusSummary.passRate >= 60 ? 'warning' : 'error'}
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Test Çalıştırma Özeti */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            height: '100%',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Test Çalıştırma
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {testRunSummary.totalRuns}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Toplam Çalıştırma
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PlayArrowIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Aktif</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {testRunSummary.activeRuns}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon color="info" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Kuyrukta</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {testRunSummary.queuedRuns}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ErrorOutlineIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Başarısız</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {testRunSummary.failedRuns}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Chip
              label={`Ort. Süre: ${formatDuration(testRunSummary.averageDuration)}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Otomasyon Kapsama Oranı */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            height: '100%',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Otomasyon Kapsama
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              %{automationCoverage.coverageRate}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Kapsama Oranı
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CodeIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Otomatize</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {automationCoverage.automatedTestCases}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Toplam</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {automationCoverage.totalTestCases}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Chip
              label={`Son Güncelleme: ${formatDate(automationCoverage.lastUpdated)}`}
              color="default"
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Son Çalıştırma Bilgisi */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            height: '100%',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Son Çalıştırma
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {lastRunInfo.totalRuns}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Test Çalıştırıldı
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon color="info" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Tarih</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {formatDate(lastRunInfo.date)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlineIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Başarı Oranı</Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                %{lastRunInfo.passRate}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Chip
              label={`Toplam Süre: ${formatDuration(lastRunInfo.duration)}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardSummaryCards;
