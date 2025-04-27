import React from 'react';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';

interface AgentStatusProps {
  total: number;
  available: number;
  busy: number;
  limit: number;
}

const AgentStatusCard: React.FC<AgentStatusProps> = ({ 
  total, 
  available, 
  busy, 
  limit 
}) => {
  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Agent Durumu
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h4">{total}</Typography>
              <Typography variant="body2">Toplam Agent</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant="h4">{available}</Typography>
              <Typography variant="body2">Müsait</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <Typography variant="h4">{busy}</Typography>
              <Typography variant="body2">Meşgul</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
              <Typography variant="h4">{limit}</Typography>
              <Typography variant="body2">Agent Limiti</Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AgentStatusCard;
