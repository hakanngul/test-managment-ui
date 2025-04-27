import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingState: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingState;
