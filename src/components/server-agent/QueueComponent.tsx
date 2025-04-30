import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Chip, Paper } from '@mui/material';
import { useServerAgentData } from './ServerAgentDataProvider';
import { ConnectionStatusChip } from '../common';

/**
 * Kuyruk durumunu gösteren bileşen
 * WebSocket üzerinden gelen kuyruk bilgilerini gösterir
 */
const QueueComponent: React.FC = () => {
  const { queuedRequests, serverAgent, connected } = useServerAgentData();

  // Kuyruk durumu bilgileri
  const queueLength = queuedRequests.length;
  const maxQueueSize = serverAgent?.queueStatus?.maxSize || 100;
  const estimatedWaitTime = serverAgent?.queueStatus?.estimatedWaitTime || 0;

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
    <Card sx={{ height: '100%', borderRadius: 2, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            Test Kuyruğu
          </Typography>
          <ConnectionStatusChip connected={connected} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Paper sx={{ p: 2, flex: 1, mr: 1, bgcolor: 'primary.light', color: 'primary.contrastText', textAlign: 'center' }}>
            <Typography variant="h5">{queueLength}</Typography>
            <Typography variant="body2">Kuyruktaki Test Sayısı</Typography>
          </Paper>

          <Paper sx={{ p: 2, flex: 1, ml: 1, bgcolor: 'info.light', color: 'info.contrastText', textAlign: 'center' }}>
            <Typography variant="h5">{maxQueueSize}</Typography>
            <Typography variant="body2">Maksimum Kuyruk Boyutu</Typography>
          </Paper>
        </Box>

        <Box sx={{ p: 2, mb: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Tahmini Bekleme Süresi
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {formatWaitTime(estimatedWaitTime)}
          </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Kuyruktaki Testler
        </Typography>

        <Box sx={{ maxHeight: 280, overflow: 'auto', bgcolor: 'background.default', borderRadius: 1 }}>
          {queuedRequests.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Kuyruğa alınmış test bulunmuyor
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {queuedRequests.map((test, index) => (
                <React.Fragment key={test.id}>
                  {index > 0 && <Divider />}
                  <ListItem sx={{ py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            label={`Sıra: ${index + 1}`}
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body1">
                            {test.testName || `Test-${test.id}`}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" component="span" color="text.secondary">
                            ID: {test.id} |
                          </Typography>
                          <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
                            Öncelik: {test.priority === 'high' ? 'Yüksek' : test.priority === 'medium' ? 'Orta' : 'Düşük'} |
                          </Typography>
                          <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
                            Eklenme: {new Date(test.timing.queuedAt).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QueueComponent;
