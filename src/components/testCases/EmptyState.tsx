import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', my: 4 }}>
      <Typography variant="h6" color="text.secondary">
        No test cases found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Create your first test case to get started
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => navigate('/test-cases/new')}
        sx={{ mt: 2 }}
      >
        New Test Case
      </Button>
    </Box>
  );
};

export default EmptyState;
