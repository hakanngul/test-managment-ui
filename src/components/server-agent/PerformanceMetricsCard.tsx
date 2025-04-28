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

    concurrentTests?: number | { current: number; max: number };
    queueLength?: number;

    // Server agent şemasından gelen alanlar
    requestsPerMinute?: number;
    averageResponseTime?: number;
    successRate?: number;
    errorRate?: number;
    testExecutionTime?: {
      average?: number;
      min?: number;
      max?: number;
      p95?: number;
    };
    resourceUtilization?: {
      cpu?: number;
      memory?: number;
      disk?: number;
      network?: number;
    };
    throughput?: number | {
      total?: number;
      running?: number;
      blocked?: number;
    };
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
                  {typeof performanceMetrics?.concurrentTests === 'object'
                    ? `${performanceMetrics.concurrentTests.current}/${performanceMetrics.concurrentTests.max}`
                    : performanceMetrics?.concurrentTests || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Kuyruk Uzunluğu</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {performanceMetrics?.queueLength || 'N/A'}
                </Typography>
              </Grid>

              {/* Throughput */}
              {performanceMetrics?.throughput !== undefined && (
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">Throughput</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {typeof performanceMetrics.throughput === 'object'
                      ? `${performanceMetrics.throughput.total || 0} req/min`
                      : `${performanceMetrics.throughput} req/min`}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsCard;
