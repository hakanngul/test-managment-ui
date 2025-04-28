import React from 'react';
import { Card, CardContent, Typography, Grid, Paper, Box, Divider, Chip, useTheme } from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

interface QueueStatusProps {
  queued: number;
  processing: number;
  total: number;
  highPriority?: number;
  mediumPriority?: number;
  lowPriority?: number;
  estimatedWaitTime?: number;
}

const QueueStatusCard: React.FC<QueueStatusProps> = ({
  queued,
  processing,
  total,
  highPriority = 0,
  mediumPriority = 0,
  lowPriority = 0,
  estimatedWaitTime = 0
}) => {
  const theme = useTheme();

  // Tahmini bekleme süresini formatla
  const formatWaitTime = (ms: number): string => {
    if (ms === 0) return 'Bekleme yok';

    const seconds = Math.floor(ms / 1000);
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
        <Typography variant="h6" gutterBottom>
          Kuyruk Durumu
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Kuyrukta */}
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <Typography variant="h4">{queued}</Typography>
              <Typography variant="body2">Kuyrukta</Typography>
            </Paper>
          </Grid>

          {/* İşleniyor */}
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
              <Typography variant="h4">{processing}</Typography>
              <Typography variant="body2">İşleniyor</Typography>
            </Paper>
          </Grid>

          {/* Toplam */}
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h4">{total}</Typography>
              <Typography variant="body2">Toplam</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Öncelik Dağılımı */}
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FlagIcon fontSize="small" sx={{ mr: 0.5 }} />
          Öncelik Dağılımı
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Yüksek Öncelik */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label="Yüksek"
                color="error"
                size="small"
                sx={{ mb: 1, width: '100%' }}
              />
              <Typography variant="h5" fontWeight="medium">{highPriority}</Typography>
            </Box>
          </Grid>

          {/* Orta Öncelik */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label="Orta"
                color="warning"
                size="small"
                sx={{ mb: 1, width: '100%' }}
              />
              <Typography variant="h5" fontWeight="medium">{mediumPriority}</Typography>
            </Box>
          </Grid>

          {/* Düşük Öncelik */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label="Düşük"
                color="info"
                size="small"
                sx={{ mb: 1, width: '100%' }}
              />
              <Typography variant="h5" fontWeight="medium">{lowPriority}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Tahmini Bekleme Süresi */}
        <Box sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center'
        }}>
          <AccessTimeIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Tahmini Bekleme Süresi
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatWaitTime(estimatedWaitTime)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QueueStatusCard;
