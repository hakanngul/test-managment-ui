import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Paper, Box, LinearProgress, Divider, useTheme } from '@mui/material';
import {
  Cancel as CancelIcon
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import { ConnectionStatusChip } from '../common';

interface AgentStatusProps {
  total: number;
  available: number;
  busy: number;
  offline: number;
  error: number;
  maintenance: number;
  limit?: number;
  connected?: boolean; // WebSocket bağlantı durumu
}

const AgentStatusCard: React.FC<AgentStatusProps> = ({
  total,
  available,
  busy,
  offline,
  error,
  limit = 10,
  connected = false // Varsayılan olarak bağlantı yok
}) => {
  const theme = useTheme();
  const [socketConnected, setSocketConnected] = useState(connected);

  // WebSocket bağlantısını kur
  useEffect(() => {
    // Eğer connected prop'u verilmişse, onu kullan
    if (connected !== undefined) {
      setSocketConnected(connected);
      return;
    }

    // Aksi takdirde kendi WebSocket bağlantısını kur
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Bağlantı durumunu izle
    socketInstance.on('connect', () => {
      console.log('WebSocket sunucusuna bağlandı (AgentStatusCard)');
      setSocketConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket sunucusu ile bağlantı kesildi (AgentStatusCard)');
      setSocketConnected(false);
    });

    // Cleanup function
    return () => {
      socketInstance.disconnect();
    };
  }, [connected]);

  // Kullanım oranını hesapla
  const usagePercentage = total > 0 ? Math.min((busy / total) * 100, 100) : 0;

  // Kullanılabilirlik oranını hesapla
  const availabilityPercentage = total > 0 ? Math.min(((total - offline) / total) * 100, 100) : 0;

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            Agent Durumu
          </Typography>
          <ConnectionStatusChip connected={socketConnected} />
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Toplam Agent */}
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h4">{total}</Typography>
              <Typography variant="body2">Toplam Agent</Typography>
            </Paper>
          </Grid>

          {/* Müsait Agent */}
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant="h4">{available}</Typography>
              <Typography variant="body2">Müsait</Typography>
            </Paper>
          </Grid>

          {/* Meşgul Agent */}
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <Typography variant="h4">{busy}</Typography>
              <Typography variant="body2">Meşgul</Typography>
            </Paper>
          </Grid>

          {/* Çevrimdışı Agent */}
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
              <Typography variant="h4">{offline}</Typography>
              <Typography variant="body2">Çevrimdışı</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Kullanım Oranı */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Kullanım Oranı</Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              color={usagePercentage > 80 ? 'error.main' : usagePercentage > 50 ? 'warning.main' : 'success.main'}
            >
              {usagePercentage.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={usagePercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: usagePercentage > 80 ? theme.palette.error.main :
                        usagePercentage > 50 ? theme.palette.warning.main :
                        theme.palette.success.main
              }
            }}
          />
        </Box>

        {/* Kullanılabilirlik Oranı */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Kullanılabilirlik Oranı</Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              color={availabilityPercentage < 20 ? 'error.main' : availabilityPercentage < 50 ? 'warning.main' : 'success.main'}
            >
              {availabilityPercentage.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={availabilityPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: availabilityPercentage < 20 ? theme.palette.error.main :
                        availabilityPercentage < 50 ? theme.palette.warning.main :
                        theme.palette.success.main
              }
            }}
          />
        </Box>

        {/* Ek Durum Bilgileri */}
        <Grid container spacing={2}>
          {/* Hata Durumundaki Agent'lar */}
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CancelIcon sx={{ mr: 1, color: theme.palette.error.main }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Hata Durumunda</Typography>
                <Typography variant="body1" fontWeight="medium">{error}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Agent Limiti */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Agent Limiti</Typography>
              <Typography variant="body1" fontWeight="medium">{limit}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AgentStatusCard;
