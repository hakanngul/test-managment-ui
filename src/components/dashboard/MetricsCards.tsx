import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { formatDuration } from '../../utils/testHelpers';

interface MetricsCardsProps {
  totalTests: number;
  passRate: number;
  avgDuration: number;
  failedTests: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
  totalTests,
  passRate,
  avgDuration,
  failedTests,
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Total Tests
            </Typography>
            <Typography variant="h4">
              {totalTests}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Pass Rate
            </Typography>
            <Typography variant="h4" color="success.main">
              {passRate}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Avg. Duration
            </Typography>
            <Typography variant="h4">
              {formatDuration(avgDuration)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Failed Tests
            </Typography>
            <Typography variant="h4" color="error.main">
              {failedTests}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MetricsCards;
