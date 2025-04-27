import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, useTheme } from '@mui/material';

interface SystemResourcesCardProps {
  lastUpdated: string;
  cpuUsage: number;
  memoryUsage: number;
}

const SystemResourcesCard: React.FC<SystemResourcesCardProps> = ({ 
  lastUpdated, 
  cpuUsage, 
  memoryUsage 
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sistem Kaynakları
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Güncelleme: {lastUpdated}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">CPU Kullanımı</Typography>
            <Typography 
              variant="body2" 
              fontWeight="medium" 
              color={cpuUsage > 80 ? 'error.main' : cpuUsage > 50 ? 'warning.main' : 'success.main'}
            >
              {cpuUsage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={cpuUsage}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 3,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: cpuUsage > 80 ? theme.palette.error.main :
                        cpuUsage > 50 ? theme.palette.warning.main :
                        theme.palette.success.main
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Bellek Kullanımı</Typography>
            <Typography 
              variant="body2" 
              fontWeight="medium" 
              color={memoryUsage > 80 ? 'error.main' : memoryUsage > 50 ? 'warning.main' : 'success.main'}
            >
              {memoryUsage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={memoryUsage}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: memoryUsage > 80 ? theme.palette.error.main :
                        memoryUsage > 50 ? theme.palette.warning.main :
                        theme.palette.success.main
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemResourcesCard;
