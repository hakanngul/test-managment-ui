import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Divider,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Speed as SpeedIcon,
  BugReport as BugReportIcon,
  AutoFixHigh as AutoFixHighIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { TestExecutionSummary, TestAutomationCoverage } from '../../mock/reportsMock';

interface ReportsSummaryCardsProps {
  executionSummary: TestExecutionSummary;
  automationCoverage: TestAutomationCoverage;
}

const ReportsSummaryCards: React.FC<ReportsSummaryCardsProps> = ({ 
  executionSummary, 
  automationCoverage 
}) => {
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

  // Tarihi formatla
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Grid container spacing={3}>
      {/* Başarı Oranı Kartı */}
      <Grid item xs={12} sm={6} md={4}>
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
                %{executionSummary.passRate.toFixed(1)}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={executionSummary.passRate} 
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Toplam Çalıştırma: {executionSummary.totalRuns.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Test: {executionSummary.totalTests.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Otomasyon Kapsamı Kartı */}
      <Grid item xs={12} sm={6} md={4}>
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
              <AutoFixHighIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Otomasyon Kapsamı
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                %{automationCoverage.coverage.toFixed(1)}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={automationCoverage.coverage} 
                color="primary"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Otomatize
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {automationCoverage.automated.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Manuel
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    {automationCoverage.manual.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Performans Kartı */}
      <Grid item xs={12} sm={6} md={4}>
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
                Performans Metrikleri
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ortalama Süre
                  </Typography>
                  <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {formatDuration(executionSummary.averageDuration)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip title="Kararsız testlerin oranı">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Kararsızlık
                      </Typography>
                      <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                        %{executionSummary.flakiness.toFixed(1)}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Son Çalıştırma: {formatDate(executionSummary.lastRun)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReportsSummaryCards;
