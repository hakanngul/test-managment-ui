import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  onCancel: () => void;
  onSave: (e: React.FormEvent) => void;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onCancel, onSave, actions }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" fontWeight="500">
        {title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {actions}
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={onSave}
        >
          Save Test Case
        </Button>
      </Box>
    </Box>
  );
};

export default PageHeader;
