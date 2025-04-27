import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const LoadingState: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
      <CircularProgress size={24} sx={{ mr: 2 }} />
      <Typography>Loading test suites...</Typography>
    </Box>
  );
};

export default LoadingState;
