import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  lastUpdated: string;
  onRefresh: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, lastUpdated, onRefresh }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" fontWeight="500">
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Güncelleme: {lastUpdated}
        </Typography>
        <IconButton size="small" onClick={onRefresh}>
          <RefreshIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PageHeader;
