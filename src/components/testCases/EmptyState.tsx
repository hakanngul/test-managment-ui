import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  hasSearchQuery?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasSearchQuery = false }) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        textAlign: 'center',
        my: 4,
        py: 6,
        px: 2,
        borderRadius: 2,
        borderStyle: 'dashed'
      }}
    >
      <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />

      <Typography variant="h6" color="text.secondary" gutterBottom>
        {hasSearchQuery ? 'No matching test cases found' : 'No test cases found'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 450, mx: 'auto' }}>
        {hasSearchQuery
          ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
          : 'Create your first test case to start building your test automation suite.'}
      </Typography>

      {!hasSearchQuery && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/test-cases/new')}
          size="large"
        >
          Create Test Case
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
