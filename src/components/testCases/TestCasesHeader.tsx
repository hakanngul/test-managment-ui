import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link, Tooltip } from '@mui/material';
import {
  Add as AddIcon,
  Home as HomeIcon,
  ImportExport as ImportExportIcon
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

interface TestCasesHeaderProps {
  title: string;
}

const TestCasesHeader: React.FC<TestCasesHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          {title}
        </Typography>
      </Breadcrumbs>

      {/* Header with title and buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          {title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Import test cases">
            <Button
              variant="outlined"
              startIcon={<ImportExportIcon />}
              onClick={() => console.log('Import/Export clicked')}
            >
              Import/Export
            </Button>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/test-cases/new')}
          >
            New Test Case
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TestCasesHeader;
