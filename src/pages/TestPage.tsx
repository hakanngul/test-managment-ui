import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const TestPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Page
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" paragraph>
          This is a test page to check if the application is working correctly.
        </Typography>
        <Button variant="contained" color="primary">
          Test Button
        </Button>
      </Paper>
    </Box>
  );
};

export default TestPage;
