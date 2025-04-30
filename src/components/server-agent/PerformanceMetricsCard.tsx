import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, LinearProgress, Divider, useTheme } from '@mui/material';
import {
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkCheckIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatusChip } from '../common';

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

const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({ performanceMetrics: initialMetrics }) => {
  const theme = useTheme();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Varsayılan değerler
  const defaultMetrics = {
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkUsage: 0,
    activeProcesses: 0,
    uptime: 0,
    requestsPerMinute: 0,
    averageResponseTime: 0,
    successRate: 0,
    errorRate: 0,
    concurrentTests: { current: 0, max: 0 },
    queueLength: 0,
    resourceUtilization: {
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0
    },
    testExecutionTime: {
      average: 0,
      min: 0,
      max: 0,
      p95: 0
    }
  };

  // Başlangıç değerlerini ayarla (initialMetrics varsa kullan, yoksa defaultMetrics kullan)
  const [performanceMetrics, setPerformanceMetrics] = useState({...defaultMetrics, ...initialMetrics});

  // Görüntülenecek metrikleri belirle (bağlantı yoksa ve değerler 0 ise N/A göster)
  const displayMetrics = React.useMemo(() => {
    if (!connected) {
      // Bağlantı yoksa ve initialMetrics varsa, initialMetrics'i kullan
      // Yoksa mevcut değerleri kullan
      return performanceMetrics;
    }
    return performanceMetrics;
  }, [connected, performanceMetrics]);
  // WebSocket bağlantısını kur
  useEffect(() => {
    // WebSocket sunucusuna bağlan (3001 portu)
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Bağlantı durumunu izle
    socketInstance.on('connect', () => {
      console.log('WebSocket sunucusuna bağlandı (PerformanceMetricsCard)');
      setConnected(true);

      // Bağlantı kurulduğunda, mevcut performans metriklerini kullan
      setPerformanceMetrics(prevMetrics => ({
        ...prevMetrics
      }));
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket sunucusu ile bağlantı kesildi (PerformanceMetricsCard)');
      setConnected(false);

      // Bağlantı kesildiğinde, mevcut değerleri koru
      // Sadece bağlantı durumunu güncelle
      // Not: Eğer varsayılan değerlere dönmek istenirse, aşağıdaki satırı aktif edebilirsiniz
      // setPerformanceMetrics({...defaultMetrics});
    });

    // Performans metriklerini dinle
    socketInstance.on('performanceMetrics', (data) => {
      console.log('Performans metrikleri alındı (PerformanceMetricsCard):', data);

      // Gelen veri formatına göre performans metriklerini güncelle
      setPerformanceMetrics(prevMetrics => ({
        ...prevMetrics,
        requestsPerMinute: data.requestsPerMinute || prevMetrics.requestsPerMinute,
        averageResponseTime: data.averageResponseTime || prevMetrics.averageResponseTime,
        successRate: data.successRate || prevMetrics.successRate,
        errorRate: data.errorRate || prevMetrics.errorRate,
        testExecutionTime: {
          ...prevMetrics.testExecutionTime,
          average: data.testExecutionTime?.average || prevMetrics.testExecutionTime?.average,
          min: data.testExecutionTime?.min || prevMetrics.testExecutionTime?.min,
          max: data.testExecutionTime?.max || prevMetrics.testExecutionTime?.max,
          p95: data.testExecutionTime?.p95 || prevMetrics.testExecutionTime?.p95
        },
        resourceUtilization: {
          ...prevMetrics.resourceUtilization,
          cpu: data.resourceUtilization?.cpu || data.cpu || prevMetrics.resourceUtilization?.cpu,
          memory: data.resourceUtilization?.memory || data.memory || prevMetrics.resourceUtilization?.memory,
          disk: data.resourceUtilization?.disk || data.disk || prevMetrics.resourceUtilization?.disk,
          network: data.resourceUtilization?.network || data.network || prevMetrics.resourceUtilization?.network
        },
        concurrentTests: data.concurrentTests || prevMetrics.concurrentTests,
        cpuUsage: data.cpuUsage || prevMetrics.cpuUsage,
        memoryUsage: data.memoryUsage || prevMetrics.memoryUsage,
        diskUsage: data.diskUsage || prevMetrics.diskUsage,
        networkUsage: data.networkUsage || prevMetrics.networkUsage,
        activeProcesses: data.activeProcesses || prevMetrics.activeProcesses,
        uptime: data.uptime || prevMetrics.uptime,
        queueLength: data.queueLength || prevMetrics.queueLength
      }));
    });

    // Sistem kaynaklarını dinle
    socketInstance.on('systemResources', (data) => {
      console.log('Sistem kaynakları alındı (PerformanceMetricsCard):', data);

      setPerformanceMetrics(prevMetrics => ({
        ...prevMetrics,
        cpuUsage: data.cpuUsage || prevMetrics.cpuUsage,
        memoryUsage: data.memoryUsage || prevMetrics.memoryUsage,
        diskUsage: data.diskUsage || prevMetrics.diskUsage,
        networkUsage: data.networkUsage || prevMetrics.networkUsage,
        activeProcesses: data.processes || prevMetrics.activeProcesses,
        uptime: data.uptime || prevMetrics.uptime,
        loadAverage: data.loadAverage || prevMetrics.loadAverage
      }));
    });

    // Agent performans metriklerini dinle
    socketInstance.on('agentPerformance', (data) => {
      console.log('Agent performans metrikleri alındı (PerformanceMetricsCard):', data);

      // Agent performans metriklerini güncelle
      if (data && (data.cpu !== undefined || data.memory !== undefined || data.disk !== undefined || data.network !== undefined)) {
        setPerformanceMetrics(prevMetrics => ({
          ...prevMetrics,
          resourceUtilization: {
            ...prevMetrics.resourceUtilization,
            cpu: data.cpu !== undefined ? data.cpu : prevMetrics.resourceUtilization?.cpu,
            memory: data.memory !== undefined ? data.memory : prevMetrics.resourceUtilization?.memory,
            disk: data.disk !== undefined ? data.disk : prevMetrics.resourceUtilization?.disk,
            network: data.network !== undefined ? data.network : prevMetrics.resourceUtilization?.network
          }
        }));
      }
    });

    setSocket(socketInstance);

    // Cleanup function
    return () => {
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
        socketInstance.off('performanceMetrics');
        socketInstance.off('systemResources');
        socketInstance.off('agentPerformance');
        socketInstance.disconnect();
      }
    };
  }, []);

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
  const formatResponseTime = (ms?: number): string => {
    if (!ms) return 'N/A';

    if (ms < 1000) {
      return `${ms.toFixed(0)} ms`;
    } else {
      return `${(ms / 1000).toFixed(2)} sn`;
    }
  };

  // Başarı oranı rengi
  const getSuccessRateColor = (rate?: number): string => {
    if (!rate) return theme.palette.info.main;

    if (rate >= 90) return theme.palette.success.main;
    if (rate >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };


  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            Performans Metrikleri
          </Typography>
          <ConnectionStatusChip connected={connected} />
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* CPU ve Bellek Kullanımı */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SpeedIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">CPU Kullanımı</Typography>
              <Typography variant="body2" fontWeight="medium" sx={{ ml: 'auto' }}>
                {displayMetrics?.resourceUtilization?.cpu ? `${displayMetrics.resourceUtilization.cpu.toFixed(1)}%` :
                 displayMetrics?.cpuUsage ? `${displayMetrics.cpuUsage.toFixed(1)}%` : 'N/A'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={displayMetrics?.resourceUtilization?.cpu || displayMetrics?.cpuUsage || 0}
              sx={{
                height: 8,
                borderRadius: 4,
                mb: 2,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: (displayMetrics?.resourceUtilization?.cpu || displayMetrics?.cpuUsage || 0) > 80 ? theme.palette.error.main :
                          (displayMetrics?.resourceUtilization?.cpu || displayMetrics?.cpuUsage || 0) > 50 ? theme.palette.warning.main :
                          theme.palette.success.main
                }
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MemoryIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">Bellek Kullanımı</Typography>
              <Typography variant="body2" fontWeight="medium" sx={{ ml: 'auto' }}>
                {displayMetrics?.resourceUtilization?.memory ? `${displayMetrics.resourceUtilization.memory.toFixed(0)} MB` :
                 displayMetrics?.memoryUsage ? `${displayMetrics.memoryUsage.toFixed(0)} MB` : 'N/A'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(displayMetrics?.resourceUtilization?.memory || displayMetrics?.memoryUsage || 0) / 100}
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
              Test Performans Metrikleri
            </Typography>

            <Grid container spacing={2}>
              {/* Başarı Oranı */}
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: getSuccessRateColor(displayMetrics?.successRate) }} />
                  <Typography variant="body2">Başarı Oranı</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium" sx={{ color: getSuccessRateColor(displayMetrics?.successRate) }}>
                  {displayMetrics?.successRate ? `${displayMetrics.successRate.toFixed(1)}%` : 'N/A'}
                </Typography>
              </Grid>

              {/* Hata Oranı */}
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ErrorIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
                  <Typography variant="body2">Hata Oranı</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {displayMetrics?.errorRate ? `${displayMetrics.errorRate.toFixed(1)}%` : 'N/A'}
                </Typography>
              </Grid>

              {/* Ortalama Yanıt Süresi */}
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Ortalama Yanıt Süresi</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {displayMetrics?.averageResponseTime ? formatResponseTime(displayMetrics.averageResponseTime) : 'N/A'}
                </Typography>
              </Grid>

              {/* İstek/Dakika */}
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">İstek/Dakika</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {displayMetrics?.requestsPerMinute ? `${displayMetrics.requestsPerMinute.toFixed(1)}` : 'N/A'}
                </Typography>
              </Grid>

              {/* Eşzamanlı Testler */}
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Eşzamanlı Testler</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {typeof displayMetrics?.concurrentTests === 'object'
                    ? `${displayMetrics.concurrentTests.current}/${displayMetrics.concurrentTests.max}`
                    : displayMetrics?.concurrentTests || 'N/A'}
                </Typography>
              </Grid>

              {/* Test Yürütme Süresi */}
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Ort. Test Süresi</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {displayMetrics?.testExecutionTime?.average ? formatResponseTime(displayMetrics.testExecutionTime.average) : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Sistem Metrikleri */}
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
                  {displayMetrics?.resourceUtilization?.disk ? `${displayMetrics.resourceUtilization.disk.toFixed(0)} MB` :
                   displayMetrics?.diskUsage ? `${displayMetrics.diskUsage.toFixed(0)} MB` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <NetworkCheckIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2">Ağ Kullanımı</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {displayMetrics?.resourceUtilization?.network ? `${displayMetrics.resourceUtilization.network.toFixed(1)} MB` :
                   displayMetrics?.networkUsage ? `${displayMetrics.networkUsage.toFixed(1)} MB` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimerIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2">Çalışma Süresi</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {formatUptime(displayMetrics?.uptime)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Aktif İşlemler</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {displayMetrics?.activeProcesses || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">Kuyruk Uzunluğu</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {displayMetrics?.queueLength || 'N/A'}
                </Typography>
              </Grid>

              {/* Throughput */}
              {displayMetrics?.throughput !== undefined && (
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">Throughput</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {typeof displayMetrics.throughput === 'object'
                      ? `${displayMetrics.throughput.total || 0} req/min`
                      : `${displayMetrics.throughput} req/min`}
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
