import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Grid, Divider, useTheme } from '@mui/material';
import {
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkCheckIcon,
  Timer as TimerIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatusChip } from '../common';

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
  connected?: boolean; // WebSocket bağlantı durumu
}

const SystemResourcesCard: React.FC<SystemResourcesCardProps> = ({
  lastUpdated,
  cpuUsage: initialCpuUsage,
  memoryUsage: initialMemoryUsage,
  diskUsage: initialDiskUsage,
  networkUsage: initialNetworkUsage,
  loadAverage: initialLoadAverage,
  processes: initialProcesses,
  uptime: initialUptime,
  cpuDetails: initialCpuDetails,
  connected: initialConnected = false
}) => {
  const theme = useTheme();

  // WebSocket bağlantı durumu
  const [connected, setConnected] = useState(initialConnected);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Sistem metrikleri state'leri
  const [cpuUsage, setCpuUsage] = useState(initialCpuUsage);
  const [memoryUsage, setMemoryUsage] = useState(initialMemoryUsage);
  const [diskUsage, setDiskUsage] = useState(initialDiskUsage);
  const [networkUsage, setNetworkUsage] = useState(initialNetworkUsage);
  const [loadAverage, setLoadAverage] = useState(initialLoadAverage);
  const [processes, setProcesses] = useState(initialProcesses);
  const [uptime, setUptime] = useState(initialUptime);
  const [cpuDetails, setCpuDetails] = useState(initialCpuDetails);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(lastUpdated);

  // WebSocket bağlantısı
  useEffect(() => {
    // Eğer connected prop'u verilmişse, onu kullan
    if (initialConnected !== undefined) {
      setConnected(initialConnected);
      return;
    }

    // WebSocket sunucusuna bağlan (3001 portu)
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Bağlantı durumunu izle
    socketInstance.on('connect', () => {
      console.log('WebSocket sunucusuna bağlandı (SystemResourcesCard)');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket sunucusu ile bağlantı kesildi (SystemResourcesCard)');
      setConnected(false);
    });

    // Sistem kaynaklarını dinle
    socketInstance.on('systemResources', (data) => {
      console.log('Sistem kaynakları alındı (SystemResourcesCard):', data);

      // Gelen verileri güncelle
      if (data.cpuUsage !== undefined) setCpuUsage(data.cpuUsage);
      if (data.memoryUsage !== undefined) setMemoryUsage(data.memoryUsage);
      if (data.diskUsage !== undefined) setDiskUsage(data.diskUsage);
      if (data.networkUsage !== undefined) setNetworkUsage(data.networkUsage);
      if (data.loadAverage !== undefined) setLoadAverage(data.loadAverage);
      if (data.processes !== undefined) setProcesses(data.processes);
      if (data.uptime !== undefined) setUptime(data.uptime);
      if (data.cpuDetails !== undefined) setCpuDetails(data.cpuDetails);

      // Son güncelleme zamanını güncelle
      setLastUpdatedTime(new Date().toLocaleString('tr-TR'));
    });

    // Agent performans metriklerini dinle
    socketInstance.on('agentPerformance', (data) => {
      console.log('Agent performans metrikleri alındı (SystemResourcesCard):', data);

      // Gelen verileri güncelle
      if (data.metrics) {
        if (data.metrics.cpuUsage !== undefined) setCpuUsage(data.metrics.cpuUsage);
        if (data.metrics.memoryUsage !== undefined) setMemoryUsage(data.metrics.memoryUsage);
        if (data.metrics.diskUsage !== undefined) setDiskUsage(data.metrics.diskUsage);
        if (data.metrics.networkUsage !== undefined) setNetworkUsage(data.metrics.networkUsage);
        if (data.metrics.loadAverage !== undefined) setLoadAverage([
          data.metrics.loadAverage.oneMin,
          data.metrics.loadAverage.fiveMin,
          data.metrics.loadAverage.fifteenMin
        ]);
        if (data.metrics.processes !== undefined) setProcesses(data.metrics.processes);
        if (data.metrics.uptime !== undefined) setUptime(data.metrics.uptime);
        if (data.metrics.cpuDetails !== undefined) setCpuDetails(data.metrics.cpuDetails);
      } else {
        // Doğrudan veri gönderilmişse
        if (data.cpuUsage !== undefined) setCpuUsage(data.cpuUsage);
        if (data.memoryUsage !== undefined) setMemoryUsage(data.memoryUsage);
        if (data.diskUsage !== undefined) setDiskUsage(data.diskUsage);
        if (data.networkUsage !== undefined) setNetworkUsage(data.networkUsage);
      }

      // Son güncelleme zamanını güncelle
      setLastUpdatedTime(new Date().toLocaleString('tr-TR'));
    });

    setSocket(socketInstance);

    // Cleanup function
    return () => {
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
        socketInstance.off('systemResources');
        socketInstance.off('agentPerformance');
        socketInstance.disconnect();
      }
    };
  }, [initialConnected]);

  // Saniyeyi okunabilir formata dönüştür
  const formatUptime = (seconds?: number): string => {
    if (!seconds) return 'N/A';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}g ${hours}s ${minutes}d`;
  };

  // Veri tiplerini kontrol et ve sayıya dönüştür
  const safeCpuUsage = typeof cpuUsage === 'number' ? cpuUsage : 0;
  const safeMemoryUsage = typeof memoryUsage === 'number' ? memoryUsage : 0;
  const safeDiskUsage = typeof diskUsage === 'number' ? diskUsage : undefined;
  const safeNetworkUsage = typeof networkUsage === 'number' ? networkUsage : undefined;
  const safeLoadAverage = Array.isArray(loadAverage) ? loadAverage : undefined;
  const safeProcesses = typeof processes === 'number' ? processes : undefined;
  const safeUptime = typeof uptime === 'number' ? uptime : undefined;

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            Sistem Kaynakları
          </Typography>
          <ConnectionStatusChip connected={connected} />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Güncelleme: {lastUpdatedTime}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {/* CPU Kullanımı */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">CPU Kullanımı</Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              color={safeCpuUsage > 80 ? 'error.main' : safeCpuUsage > 50 ? 'warning.main' : 'success.main'}
            >
              {safeCpuUsage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={safeCpuUsage}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 2,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: safeCpuUsage > 80 ? theme.palette.error.main :
                        safeCpuUsage > 50 ? theme.palette.warning.main :
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
              color={safeMemoryUsage > 80 ? 'error.main' : safeMemoryUsage > 50 ? 'warning.main' : 'success.main'}
            >
              {safeMemoryUsage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={safeMemoryUsage}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 2,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: safeMemoryUsage > 80 ? theme.palette.error.main :
                        safeMemoryUsage > 50 ? theme.palette.warning.main :
                        theme.palette.success.main
              }
            }}
          />

          {/* Disk Kullanımı (varsa) */}
          {safeDiskUsage !== undefined && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Disk Kullanımı</Typography>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color={safeDiskUsage > 80 ? 'error.main' : safeDiskUsage > 50 ? 'warning.main' : 'success.main'}
                >
                  {safeDiskUsage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={safeDiskUsage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 2,
                  bgcolor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: safeDiskUsage > 80 ? theme.palette.error.main :
                            safeDiskUsage > 50 ? theme.palette.warning.main :
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
            {safeLoadAverage && safeLoadAverage.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Yük Ortalaması
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2">
                    1 dk: <strong>{safeLoadAverage[0]?.toFixed(2) || 'N/A'}</strong>
                  </Typography>
                  {safeLoadAverage.length > 1 && (
                    <Typography variant="body2">
                      5 dk: <strong>{safeLoadAverage[1]?.toFixed(2) || 'N/A'}</strong>
                    </Typography>
                  )}
                  {safeLoadAverage.length > 2 && (
                    <Typography variant="body2">
                      15 dk: <strong>{safeLoadAverage[2]?.toFixed(2) || 'N/A'}</strong>
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}

            {/* İşlemler */}
            {safeProcesses !== undefined && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MemoryIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">İşlemler</Typography>
                    <Typography variant="body1" fontWeight="medium">{safeProcesses}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Çalışma Süresi */}
            {safeUptime !== undefined && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimerIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Çalışma Süresi</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatUptime(safeUptime)}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Ağ Kullanımı */}
            {safeNetworkUsage !== undefined && (
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NetworkCheckIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Ağ Kullanımı</Typography>
                    <Typography variant="body1" fontWeight="medium">{safeNetworkUsage} MB</Typography>
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
