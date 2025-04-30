import React from 'react';
import { Box, Paper, Typography, Chip, LinearProgress, Divider, Grid } from '@mui/material';
import { Test, TestStep } from '../services/websocket/types';

interface TestDetailsProps {
  test: Test;
  step?: { step: TestStep };
}

/**
 * Test detaylarını gösteren bileşen
 */
const TestDetails: React.FC<TestDetailsProps> = ({ test, step }) => {
  // Test durumu metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Çalışıyor';
      case 'completed': return 'Tamamlandı';
      case 'failed': return 'Başarısız';
      case 'aborted': return 'İptal Edildi';
      case 'pending': return 'Bekliyor';
      default: return status;
    }
  };
  
  // Test durumu rengi
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'aborted': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };
  
  // Test süresi hesapla
  const getDuration = () => {
    const startTime = new Date(test.startTime).getTime();
    const endTime = test.endTime ? new Date(test.endTime).getTime() : Date.now();
    const duration = endTime - startTime;
    
    // Saniye cinsinden
    if (duration < 60000) {
      return `${(duration / 1000).toFixed(1)} saniye`;
    }
    
    // Dakika cinsinden
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes} dakika ${seconds} saniye`;
  };
  
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            {test.name}
          </Typography>
          <Chip
            label={getStatusText(test.status)}
            color={getStatusColor(test.status) as any}
            size="small"
          />
        </Box>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Test ID
            </Typography>
            <Typography variant="body1">
              {test.id}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Durum
            </Typography>
            <Typography variant="body1">
              {getStatusText(test.status)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Başlangıç Zamanı
            </Typography>
            <Typography variant="body1">
              {new Date(test.startTime).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              {test.endTime ? 'Bitiş Zamanı' : 'Süre'}
            </Typography>
            <Typography variant="body1">
              {test.endTime ? new Date(test.endTime).toLocaleString() : getDuration()}
            </Typography>
          </Grid>
          {test.error && (
            <Grid item xs={12}>
              <Typography variant="body2" color="error">
                Hata: {test.error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      
      {/* Test adımı bilgileri */}
      {step && step.step && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Typography variant="subtitle1" gutterBottom>
            Mevcut Adım
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">
                {step.step.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.step.current}/{step.step.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(step.step.current / step.step.total) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>
      )}
      
      {/* Test ilerleme durumu */}
      {test.currentStep > 0 && test.totalSteps > 0 && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Typography variant="subtitle1" gutterBottom>
            Genel İlerleme
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">
                {test.currentStep}. adım çalıştırılıyor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {test.currentStep}/{test.totalSteps}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(test.currentStep / test.totalSteps) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {test.status === 'running' ? 'Test çalışıyor...' : 
             test.status === 'completed' ? 'Test başarıyla tamamlandı' :
             test.status === 'failed' ? 'Test başarısız oldu' : 'Test bekliyor'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TestDetails;
