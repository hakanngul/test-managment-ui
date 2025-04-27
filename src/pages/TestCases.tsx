import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import { TestCase } from '../types';
import api from '../services/api';
import {
  TestCasesHeader,
  TestCasesFilter,
  TestCasesTable,
  FilterMenu,
  SortMenu,
  EmptyState,
  LoadingState
} from '../components/testCases';

const TestCases: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch test cases from API
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setLoading(true);
        // Changed from getMockTestCases to getTestCases to fetch from json-server
        const data = await api.getTestCases();
        setTestCases(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching test cases:', err);
        setError('Failed to load test cases. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, []);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleViewTestCase = (id: string) => {
    navigate(`/test-cases/${id}`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
    handleFilterClose();
  };

  const handlePriorityFilterChange = (priority: string) => {
    setSelectedPriorityFilter(priority);
    handleFilterClose();
  };

  const handleSortChange = (sortField: string) => {
    if (sortBy === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortField);
      setSortDirection('desc');
    }
    handleSortClose();
  };

  // Filter and sort test cases
  const filteredTestCases = testCases
    .filter((testCase) => {
      const matchesSearch = testCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          testCase.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatusFilter === 'all' || testCase.status === selectedStatusFilter;
      const matchesPriority = selectedPriorityFilter === 'all' || testCase.priority === selectedPriorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return sortDirection === 'asc'
          ? priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
          : priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      } else if (sortBy === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortBy === 'updatedAt') {
        return sortDirection === 'asc'
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <TestCasesHeader title="Test Cases" />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && <LoadingState />}

      {!loading && testCases.length === 0 && !error && <EmptyState />}

      {!loading && testCases.length > 0 && (
        <>
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

          <TestCasesTable
            testCases={filteredTestCases}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onRowClick={handleViewTestCase}
            formatDate={formatDate}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
        </>
      )}
    </Box>
  );
};

export default TestCases;