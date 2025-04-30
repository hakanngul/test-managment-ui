import React from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { Test } from '../services/websocket/types';

interface TestsSummaryProps {
  tests: Record<string, Test>;
}

/**
 * Tüm testlerin genel durumunu gösteren özet panel
 */
const TestsSummary: React.FC<TestsSummaryProps> = ({ tests }) => {
  // Test durumlarını say
  const counts = Object.values(tests).reduce((acc, test) => {
    acc[test.status] = (acc[test.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Test Özeti
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Toplam
            </Typography>
            <Typography variant="h4">
              {Object.values(tests).length}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Çalışıyor
            </Typography>
            <Typography variant="h4" color="info.main">
              {counts.running || 0}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tamamlandı
            </Typography>
            <Typography variant="h4" color="success.main">
              {counts.completed || 0}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Başarısız
            </Typography>
            <Typography variant="h4" color="error.main">
              {counts.failed || 0}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* Aktif testlerin durumlarını gösteren chip'ler */}
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.values(tests).map(test => (
          <Chip
            key={test.id}
            label={`${test.name.substring(0, 15)}${test.name.length > 15 ? '...' : ''}`}
            color={
              test.status === 'running' ? 'info' :
              test.status === 'completed' ? 'success' :
              test.status === 'failed' ? 'error' :
              'default'
            }
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    </Paper>
  );
};

export default TestsSummary;
