import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { TestRunsSummary } from '../../mock/testRunsMock';

interface TestRunsSummaryCardsProps {
  summary: TestRunsSummary;
}

const TestRunsSummaryCards: React.FC<TestRunsSummaryCardsProps> = ({ summary }) => {
  // Süreyi formatla
  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds} saniye`;
    }
    
    return `${minutes} dakika ${remainingSeconds} saniye`;
  };

  return (
    <Grid container spacing={3}>
      {/* Aktif ve Sıradaki Testler Kartı */}
      <Grid item xs={12} md={4}>
        <Card 
          variant="outlined" 
          sx={{ 
            height: '100%',
            borderTop: '4px solid',
            borderColor: 'primary.main'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PlayArrowIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Aktif Testler
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Çalışan Testler
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    {summary.activeRuns}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Sıradaki Testler
                  </Typography>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                    {summary.queuedRuns}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Son 24 Saat: {summary.lastDayRuns} test çalıştırıldı
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Son 7 Gün: {summary.lastWeekRuns} test çalıştırıldı
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Başarı Oranı Kartı */}
      <Grid item xs={12} md={4}>
        <Card 
          variant="outlined" 
          sx={{ 
            height: '100%',
            borderTop: '4px solid',
            borderColor: 'success.main'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Başarı Oranı
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                %{summary.passRate}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={summary.passRate} 
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Başarılı Testler
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {summary.completedRuns - summary.failedRuns}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Başarısız Testler
                  </Typography>
                  <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                    {summary.failedRuns}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Performans Kartı */}
      <Grid item xs={12} md={4}>
        <Card 
          variant="outlined" 
          sx={{ 
            height: '100%',
            borderTop: '4px solid',
            borderColor: 'warning.main'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SpeedIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Performans
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ortalama Çalışma Süresi
              </Typography>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {formatDuration(summary.averageDuration)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Test
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {summary.totalRuns}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tamamlanan
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {summary.completedRuns}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TestRunsSummaryCards;
