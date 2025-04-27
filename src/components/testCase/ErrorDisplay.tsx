import React from 'react';
import { Box, Typography } from '@mui/material';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
      <Typography color="error">{message}</Typography>
    </Box>
  );
};

export default ErrorDisplay;
