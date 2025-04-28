import React from 'react';
import { Box, TextField, InputAdornment, Button, Card, Tooltip, Badge } from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TestCasesFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: (event: React.MouseEvent<HTMLElement>) => void;
  onSortClick: (event: React.MouseEvent<HTMLElement>) => void;
  sortBy: string;
}

const TestCasesFilter: React.FC<TestCasesFilterProps> = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onSortClick,
  sortBy
}) => {
  const navigate = useNavigate();
  const activeFiltersCount = 0; // Bu değer filtrelerin sayısına göre güncellenebilir

  return (
    <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search test cases..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title="Filter test cases">
          <Badge badgeContent={activeFiltersCount} color="primary" invisible={activeFiltersCount === 0}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={onFilterClick}
              size="small"
            >
              Filter
            </Button>
          </Badge>
        </Tooltip>

        <Tooltip title="Sort test cases">
          <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            onClick={onSortClick}
            size="small"
          >
            Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </Button>
        </Tooltip>

        <Tooltip title="Create new test case">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/test-cases/new')}
            size="small"
          >
            New Test Case
          </Button>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default TestCasesFilter;
