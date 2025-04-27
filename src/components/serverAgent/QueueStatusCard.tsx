import React from 'react';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';

interface QueueStatusProps {
  queued: number;
  processing: number;
  total: number;
}

const QueueStatusCard: React.FC<QueueStatusProps> = ({ 
  queued, 
  processing, 
  total 
}) => {
  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Kuyruk Durumu
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <Typography variant="h4">{queued}</Typography>
              <Typography variant="body2">Kuyrukta</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
              <Typography variant="h4">{processing}</Typography>
              <Typography variant="body2">İşleniyor</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h4">{total}</Typography>
              <Typography variant="body2">Toplam</Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QueueStatusCard;
