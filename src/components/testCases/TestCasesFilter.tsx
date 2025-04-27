import React from 'react';
import { Box, TextField, InputAdornment, Button, Card } from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  ArrowDropDown as ArrowDropDownIcon 
} from '@mui/icons-material';

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
  return (
    <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
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

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={onFilterClick}
          size="small"
        >
          Filter
        </Button>

        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          onClick={onSortClick}
          size="small"
        >
          Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
        </Button>
      </Box>
    </Card>
  );
};

export default TestCasesFilter;
