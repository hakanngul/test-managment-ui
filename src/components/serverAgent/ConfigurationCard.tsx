import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Divider, Chip, Switch, FormControlLabel } from '@mui/material';
import {
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Schedule as ScheduleIcon,
  Storage as StorageIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface ConfigurationCardProps {
  config?: {
    maxAgents?: number;
    maxConcurrentTests?: number;
    maxQueueSize?: number;
    agentTimeout?: number; // saniye cinsinden
    testTimeout?: number; // saniye cinsinden
    logLevel?: 'none' | 'error' | 'warning' | 'info' | 'debug' | 'trace';
    autoScaling?: boolean;
    autoScalingConfig?: {
      minAgents?: number;
      maxAgents?: number;
      scaleUpThreshold?: number; // yüzde cinsinden
      scaleDownThreshold?: number; // yüzde cinsinden
      cooldownPeriod?: number; // saniye cinsinden
    };
  };
}

const ConfigurationCard: React.FC<ConfigurationCardProps> = ({ config }) => {
  // Log seviyesi rengini belirle
  const getLogLevelColor = (level?: string): 'success' | 'warning' | 'error' | 'default' | 'info' => {
    switch (level) {
      case 'none':
        return 'default';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'debug':
      case 'trace':
        return 'success';
      default:
        return 'default';
    }
  };

  // Saniyeyi okunabilir formata dönüştür
  const formatSeconds = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    
    if (seconds < 60) {
      return `${seconds} saniye`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} dakika`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} saat ${minutes > 0 ? `${minutes} dakika` : ''}`;
    }
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SettingsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Yapılandırma
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Genel Yapılandırma */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SpeedIcon fontSize="small" sx={{ mr: 0.5 }} />
              Kapasite Ayarları
            </Typography>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Maksimum Agent</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {config?.maxAgents || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Eşzamanlı Test</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {config?.maxConcurrentTests || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Maksimum Kuyruk</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {config?.maxQueueSize || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Log Seviyesi</Typography>
                  <Chip 
                    label={config?.logLevel || 'N/A'} 
                    size="small" 
                    color={getLogLevelColor(config?.logLevel)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Zaman Aşımı Ayarları */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
              Zaman Aşımı Ayarları
            </Typography>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Agent Zaman Aşımı</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatSeconds(config?.agentTimeout)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Test Zaman Aşımı</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatSeconds(config?.testTimeout)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Otomatik Ölçeklendirme */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                <StorageIcon fontSize="small" sx={{ mr: 0.5 }} />
                Otomatik Ölçeklendirme
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={config?.autoScaling || false} 
                    disabled 
                    color="primary"
                  />
                }
                label={config?.autoScaling ? 'Aktif' : 'Pasif'}
                labelPlacement="start"
              />
            </Box>
            
            {config?.autoScaling && config.autoScalingConfig ? (
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Minimum Agent</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {config.autoScalingConfig.minAgents || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Maksimum Agent</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {config.autoScalingConfig.maxAgents || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Ölçeklendirme Eşiği (Yukarı)</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {config.autoScalingConfig.scaleUpThreshold ? `%${config.autoScalingConfig.scaleUpThreshold}` : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Ölçeklendirme Eşiği (Aşağı)</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {config.autoScalingConfig.scaleDownThreshold ? `%${config.autoScalingConfig.scaleDownThreshold}` : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Bekleme Süresi</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatSeconds(config.autoScalingConfig.cooldownPeriod)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ) : config?.autoScaling ? (
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'warning.light', 
                color: 'warning.contrastText',
                display: 'flex',
                alignItems: 'center'
              }}>
                <WarningIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Otomatik ölçeklendirme aktif ancak yapılandırma bilgisi bulunamadı.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'background.default',
                textAlign: 'center',
                border: 1,
                borderColor: 'divider'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Otomatik ölçeklendirme devre dışı
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ConfigurationCard;
