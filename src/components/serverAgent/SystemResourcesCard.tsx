import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Grid, Divider, useTheme } from '@mui/material';
import {
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkCheckIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

interface SystemResourcesCardProps {
  lastUpdated: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage?: number;
  networkUsage?: number;
  loadAverage?: number[];
  processes?: number;
  uptime?: number;
  cpuDetails?: {
    model?: string;
    cores?: number;
    speed?: number;
    temperature?: number;
    usage?: {
      user?: number;
      system?: number;
      idle?: number;
    };
  };
}

const SystemResourcesCard: React.FC<SystemResourcesCardProps> = ({
  lastUpdated,
  cpuUsage,
  memoryUsage,
  diskUsage,
  networkUsage,
  loadAverage,
  processes,
  uptime,
  cpuDetails
}) => {
  const theme = useTheme();

  // Saniyeyi okunabilir formata dönüştür
  const formatUptime = (seconds?: number): string => {
    if (!seconds) return 'N/A';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}g ${hours}s ${minutes}d`;
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sistem Kaynakları
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Güncelleme: {lastUpdated}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {/* CPU Kullanımı */}
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
            value={cpuUsage || 0}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 2,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: cpuUsage > 80 ? theme.palette.error.main :
                        cpuUsage > 50 ? theme.palette.warning.main :
                        theme.palette.success.main
              }
            }}
          />

          {/* Bellek Kullanımı */}
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
            value={memoryUsage || 0}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 2,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: memoryUsage > 80 ? theme.palette.error.main :
                        memoryUsage > 50 ? theme.palette.warning.main :
                        theme.palette.success.main
              }
            }}
          />

          {/* Disk Kullanımı (varsa) */}
          {diskUsage !== undefined && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Disk Kullanımı</Typography>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color={diskUsage > 80 ? 'error.main' : diskUsage > 50 ? 'warning.main' : 'success.main'}
                >
                  {diskUsage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={diskUsage || 0}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 2,
                  bgcolor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: diskUsage > 80 ? theme.palette.error.main :
                            diskUsage > 50 ? theme.palette.warning.main :
                            theme.palette.success.main
                  }
                }}
              />
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Ek Sistem Bilgileri */}
          <Grid container spacing={2}>
            {/* Yük Ortalaması */}
            {loadAverage && loadAverage.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Yük Ortalaması
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2">
                    1 dk: <strong>{loadAverage[0]?.toFixed(2) || 'N/A'}</strong>
                  </Typography>
                  {loadAverage.length > 1 && (
                    <Typography variant="body2">
                      5 dk: <strong>{loadAverage[1]?.toFixed(2) || 'N/A'}</strong>
                    </Typography>
                  )}
                  {loadAverage.length > 2 && (
                    <Typography variant="body2">
                      15 dk: <strong>{loadAverage[2]?.toFixed(2) || 'N/A'}</strong>
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}

            {/* İşlemler */}
            {processes !== undefined && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MemoryIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">İşlemler</Typography>
                    <Typography variant="body1" fontWeight="medium">{processes}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Çalışma Süresi */}
            {uptime !== undefined && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimerIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Çalışma Süresi</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatUptime(uptime)}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Ağ Kullanımı */}
            {networkUsage !== undefined && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NetworkCheckIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Ağ Kullanımı</Typography>
                    <Typography variant="body1" fontWeight="medium">{networkUsage} MB</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* CPU Detayları */}
            {cpuDetails && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  CPU Detayları
                </Typography>
                <Grid container spacing={1}>
                  {cpuDetails.model && (
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        Model: <strong>{cpuDetails.model}</strong>
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Çekirdek: <strong>{cpuDetails.cores || 'N/A'}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Hız: <strong>{cpuDetails.speed ? `${cpuDetails.speed} MHz` : 'N/A'}</strong>
                    </Typography>
                  </Grid>
                  {cpuDetails.temperature && (
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Sıcaklık: <strong>{cpuDetails.temperature}°C</strong>
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemResourcesCard;
