import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  BarChart as ChartIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  onExport?: () => void;
  onShare?: () => void;
  onGenerateReport?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onExport,
  onShare,
  onGenerateReport
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" fontWeight="500">
        {title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onExport}
        >
          Export
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={onShare}
        >
          Share
        </Button>
        <Button
          variant="contained"
          startIcon={<ChartIcon />}
          onClick={onGenerateReport}
        >
          Generate Report
        </Button>
      </Box>
    </Box>
  );
};

export default PageHeader;
