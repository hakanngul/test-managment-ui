import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Hoş geldiniz! Dashboard sayfası yapım aşamasındadır.
      </Typography>
    </Box>
  );
};

export default Dashboard;
