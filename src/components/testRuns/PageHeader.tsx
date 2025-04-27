import React from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

interface PageHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewTestRunClick: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onNewTestRunClick,
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <TextField
        placeholder="Search test suites..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={onSearchChange}
        sx={{ width: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onNewTestRunClick}
        sx={{
          bgcolor: '#0f172a',
          '&:hover': { bgcolor: '#1e293b' },
          borderRadius: '4px',
        }}
      >
        New Test Run
      </Button>
    </Box>
  );
};

export default PageHeader;
