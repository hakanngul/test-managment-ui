import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid, Divider } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

interface HealthStatusCardProps {
  healthStatus?: {
    status?: 'healthy' | 'warning' | 'critical' | 'unknown' | 'maintenance';
    lastCheck?: Date | string;
    uptime?: number;
    message?: string;
    checks?: {
      name: string;
      status: 'pass' | 'warn' | 'fail';
      message?: string;
      timestamp: string | Date;
    }[];
    issues?: {
      component: string;
      status: 'healthy' | 'warning' | 'critical' | 'unknown';
      message: string;
      timestamp: Date | string;
    }[];
  };
}

const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ healthStatus }) => {
  // Durum ikonunu ve rengini belirle
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'critical':
        return <ErrorIcon color="error" />;
      default:
        return <HelpOutlineIcon color="disabled" />;
    }
  };

  // Durum rengini belirle
  const getStatusColor = (status?: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  // Durum metnini belirle
  const getStatusText = (status?: string): string => {
    switch (status) {
      case 'healthy':
        return 'Sağlıklı';
      case 'warning':
        return 'Uyarı';
      case 'critical':
        return 'Kritik';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sağlık Durumu
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 2 }}>
            {getStatusIcon(healthStatus?.status)}
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              Genel Durum: {getStatusText(healthStatus?.status)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Son Kontrol: {healthStatus?.lastCheck
                ? (typeof healthStatus.lastCheck === 'string'
                  ? new Date(healthStatus.lastCheck).toLocaleString('tr-TR')
                  : healthStatus.lastCheck.toLocaleString('tr-TR'))
                : 'Bilinmiyor'}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Chip
              label={getStatusText(healthStatus?.status)}
              color={getStatusColor(healthStatus?.status)}
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Bileşen Durumları
        </Typography>

        {(healthStatus?.issues && healthStatus.issues.length > 0) || (healthStatus?.checks && healthStatus.checks.length > 0) ? (
          <Grid container spacing={2}>
            {/* Issues */}
            {healthStatus.issues && healthStatus.issues.map((issue, index) => (
              <Grid item xs={12} key={`issue-${index}`}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: issue.status === 'critical'
                    ? 'error.light'
                    : issue.status === 'warning'
                      ? 'warning.light'
                      : 'divider'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ mr: 1 }}>
                      {getStatusIcon(issue.status)}
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {issue.component}
                    </Typography>
                    <Chip
                      label={getStatusText(issue.status)}
                      color={getStatusColor(issue.status)}
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {issue.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {typeof issue.timestamp === 'string'
                      ? new Date(issue.timestamp).toLocaleString('tr-TR')
                      : issue.timestamp.toLocaleString('tr-TR')}
                  </Typography>
                </Box>
              </Grid>
            ))}

            {/* Checks */}
            {healthStatus.checks && healthStatus.checks.map((check, index) => (
              <Grid item xs={12} key={`check-${index}`}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: check.status === 'fail'
                    ? 'error.light'
                    : check.status === 'warn'
                      ? 'warning.light'
                      : 'success.light'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ mr: 1 }}>
                      {check.status === 'pass'
                        ? <CheckCircleIcon color="success" />
                        : check.status === 'warn'
                          ? <WarningIcon color="warning" />
                          : <ErrorIcon color="error" />}
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {check.name}
                    </Typography>
                    <Chip
                      label={check.status === 'pass' ? 'Başarılı' : check.status === 'warn' ? 'Uyarı' : 'Başarısız'}
                      color={check.status === 'pass' ? 'success' : check.status === 'warn' ? 'warning' : 'error'}
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  {check.message && (
                    <Typography variant="body2">
                      {check.message}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {typeof check.timestamp === 'string'
                      ? new Date(check.timestamp).toLocaleString('tr-TR')
                      : check.timestamp.toLocaleString('tr-TR')}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.default',
            textAlign: 'center',
            border: 1,
            borderColor: 'divider'
          }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body1">
              Tüm sistemler normal çalışıyor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Herhangi bir sorun tespit edilmedi
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthStatusCard;
