import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TestCasesHeaderProps {
  title: string;
}

const TestCasesHeader: React.FC<TestCasesHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" fontWeight="500">
        {title}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => navigate('/test-cases/new')}
      >
        New Test Case
      </Button>
    </Box>
  );
};

export default TestCasesHeader;
