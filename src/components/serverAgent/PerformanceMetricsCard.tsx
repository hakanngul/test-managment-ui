import React from 'react';
import { Card, CardContent, Typography, Box, Grid, LinearProgress, Divider, useTheme } from '@mui/material';
import { 
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkCheckIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

interface PerformanceMetricsCardProps {
  performanceMetrics?: {
    cpuUsage?: number; // yüzde cinsinden
    memoryUsage?: number; // MB cinsinden
    diskUsage?: number; // MB cinsinden
    networkUsage?: number; // MB cinsinden
    activeProcesses?: number;
    uptime?: number; // saniye cinsinden
    loadAverage?: number[];
    testExecutionTime?: {
      avg?: number; // ms cinsinden
      min?: number; // ms cinsinden
      max?: number; // ms cinsinden
      p95?: number; // ms cinsinden
    };
    concurrentTests?: number;
    queueLength?: number;
  };
}

const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({ performanceMetrics }) => {
  const theme = useTheme();

  // Saniyeyi okunabilir formata dönüştür
  const formatUptime = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${days}g ${hours}s ${minutes}d ${remainingSeconds}sn`;
  };

  // Milisaniyeyi okunabilir formata dönüştür
  const formatMs = (ms?: number): string => {
    if (!ms) return 'N/A';
    
    if (ms < 1000) {
      return `${ms.toFixed(0)} ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)} sn`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(0);
      return `${minutes}d ${seconds}sn`;
    }
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performans Metrikleri
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* CPU ve Bellek Kullanımı */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SpeedIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">CPU Kullanımı</Typography>
              <Typography variant="body2" fontWeight="medium" sx={{ ml: 'auto' }}>
                {performanceMetrics?.cpuUsage ? `${performanceMetrics.cpuUsage.toFixed(1)}%` : 'N/A'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={performanceMetrics?.cpuUsage || 0}
              sx={{
                height: 8,
                borderRadius: 4,
                mb: 2,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: (performanceMetrics?.cpuUsage || 0) > 80 ? theme.palette.error.main :
                          (performanceMetrics?.cpuUsage || 0) > 50 ? theme.palette.warning.main :
                          theme.palette.success.main
                }
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MemoryIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">Bellek Kullanımı</Typography>
              <Typography variant="body2" fontWeight="medium" sx={{ ml: 'auto' }}>
                {performanceMetrics?.memoryUsage ? `${performanceMetrics.memoryUsage.toFixed(0)} MB` : 'N/A'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={performanceMetrics?.memoryUsage ? Math.min(performanceMetrics.memoryUsage / 100, 100) : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                mb: 2,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: theme.palette.info.main
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Test Performans Metrikleri */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Test Performansı
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Ortalama Çalıştırma Süresi</Typography>
                  <Typography variant="h6">
                    {formatMs(performanceMetrics?.testExecutionTime?.avg)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Maksimum Çalıştırma Süresi</Typography>
                  <Typography variant="h6">
                    {formatMs(performanceMetrics?.testExecutionTime?.max)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Minimum Çalıştırma Süresi</Typography>
                  <Typography variant="h6">
                    {formatMs(performanceMetrics?.testExecutionTime?.min)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">95. Yüzdelik Çalıştırma Süresi</Typography>
                  <Typography variant="h6">
                    {formatMs(performanceMetrics?.testExecutionTime?.p95)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Diğer Metrikler */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Sistem Metrikleri
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StorageIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2">Disk Kullanımı</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {performanceMetrics?.diskUsage ? `${performanceMetrics.diskUsage.toFixed(0)} MB` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <NetworkCheckIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2">Ağ Kullanımı</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {performanceMetrics?.networkUsage ? `${performanceMetrics.networkUsage.toFixed(1)} MB` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimerIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2">Çalışma Süresi</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {formatUptime(performanceMetrics?.uptime)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Aktif İşlemler</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {performanceMetrics?.activeProcesses || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Eşzamanlı Testler</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {performanceMetrics?.concurrentTests || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Kuyruk Uzunluğu</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {performanceMetrics?.queueLength || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsCard;
