import React, { useState } from 'react';
import { Box } from '@mui/material';
import TestCasesFilter from './TestCasesFilter';
import FilterMenu from './FilterMenu';
import SortMenu from './SortMenu';

interface TestCasesFilterSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;
  selectedPriorityFilter: string;
  setSelectedPriorityFilter: (priority: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  getStatusColor: (status: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  getPriorityColor: (priority: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

const TestCasesFilterSection: React.FC<TestCasesFilterSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatusFilter,
  setSelectedStatusFilter,
  selectedPriorityFilter,
  setSelectedPriorityFilter,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  getStatusColor,
  getPriorityColor
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  // Handle filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
  };

  const handlePriorityFilterChange = (priority: string) => {
    setSelectedPriorityFilter(priority);
  };

  // Handle sort menu
  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortChange = (sortBy: string, direction: 'asc' | 'desc') => {
    setSortBy(sortBy);
    setSortDirection(direction);
    handleSortClose();
  };

  return (
    <Box>
      <TestCasesFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={handleFilterClick}
        onSortClick={handleSortClick}
        sortBy={sortBy}
      />

      <FilterMenu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        selectedStatusFilter={selectedStatusFilter}
        selectedPriorityFilter={selectedPriorityFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onPriorityFilterChange={handlePriorityFilterChange}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
      />

      <SortMenu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </Box>
  );
};

export default TestCasesFilterSection;
