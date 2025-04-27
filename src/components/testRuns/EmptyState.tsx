import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  onCreateClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasSearchQuery, onCreateClick }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
      <Typography variant="h6" gutterBottom>No test suites found</Typography>
      <Typography color="text.secondary" align="center">
        {hasSearchQuery ? 'Try adjusting your search query' : 'Create a new test suite to get started'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={onCreateClick}
      >
        Create Test Suite
      </Button>
    </Box>
  );
};

export default EmptyState;
