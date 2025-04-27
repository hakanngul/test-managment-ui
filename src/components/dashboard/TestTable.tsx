import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getStatusColor, getPriorityColor, formatDate, formatDuration } from '../../utils/testHelpers';

interface TestCase {
  id: string;
  title: string;
  name?: string;
  description: string;
  status: string;
  priority: string;
  category?: string;
  feature?: string;
  lastRun?: string | null;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface TestTableProps {
  testCases: TestCase[];
  testStatuses: string[];
  testPriorities: string[];
  isLoading: boolean;
  onTestClick: (test: TestCase) => void;
  onRunTest: (testId: string, event?: React.MouseEvent) => void;
  onEditTest: (testId: string, event?: React.MouseEvent) => void;
  onDeleteTest: (testId: string, event?: React.MouseEvent) => void;
}

const TestTable: React.FC<TestTableProps> = ({
  testCases,
  testStatuses,
  testPriorities,
  isLoading,
  onTestClick,
  onRunTest,
  onEditTest,
  onDeleteTest,
}) => {
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  // Filtering state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');

  // Sorting state
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>('lastRun');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // Filter handlers
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
    handleFilterClose();
  };

  const handlePriorityFilterChange = (priority: string) => {
    setSelectedPriorityFilter(priority);
    handleFilterClose();
  };

  const handleClearFilters = () => {
    setSelectedStatusFilter('all');
    setSelectedPriorityFilter('all');
    handleFilterClose();
  };

  // Sort handlers
  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
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

  // Handle run test with loading state
  const handleRunTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setRunningTestId(testId);
    onRunTest(testId, event);
    setTimeout(() => {
      setRunningTestId(null);
    }, 1500);
  };

  // Filter and sort tests
  const filteredTests = testCases.filter((test: TestCase) => {
    const matchesSearch =
      (test.name || test.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'all' || test.status === selectedStatusFilter;

    const matchesPriority =
      selectedPriorityFilter === 'all' || test.priority === selectedPriorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  const sortedTests = [...filteredTests].sort((a: TestCase, b: TestCase) => {
    let valueA: any;
    let valueB: any;

    switch (sortBy) {
      case 'name':
        valueA = a.name || a.title || '';
        valueB = b.name || b.title || '';
        break;
      case 'status':
        valueA = a.status || '';
        valueB = b.status || '';
        break;
      case 'priority':
        valueA = a.priority || '';
        valueB = b.priority || '';
        break;
      case 'category':
        valueA = a.category || '';
        valueB = b.category || '';
        break;
      case 'lastRun':
        valueA = a.lastRun ? new Date(a.lastRun).getTime() : 0;
        valueB = b.lastRun ? new Date(b.lastRun).getTime() : 0;
        break;
      case 'duration':
        valueA = a.duration || 0;
        valueB = b.duration || 0;
        break;
      default:
        valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    }

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const paginatedTests = sortedTests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Recent Tests</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Search tests..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            size="small"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            variant="outlined"
          >
            Filter
          </Button>
          <Button
            size="small"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            variant="outlined"
          >
            Sort
          </Button>
        </Box>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem>
          <Typography variant="subtitle2">Status</Typography>
        </MenuItem>
        <MenuItem
          selected={selectedStatusFilter === 'all'}
          onClick={() => handleStatusFilterChange('all')}
        >
          All
        </MenuItem>
        {testStatuses.map((status: string) => (
          <MenuItem
            key={status}
            selected={selectedStatusFilter === status}
            onClick={() => handleStatusFilterChange(status)}
          >
            {status}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem>
          <Typography variant="subtitle2">Priority</Typography>
        </MenuItem>
        <MenuItem
          selected={selectedPriorityFilter === 'all'}
          onClick={() => handlePriorityFilterChange('all')}
        >
          All
        </MenuItem>
        {testPriorities.map((priority: string) => (
          <MenuItem
            key={priority}
            selected={selectedPriorityFilter === priority}
            onClick={() => handlePriorityFilterChange(priority)}
          >
            {priority}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleClearFilters}>Clear Filters</MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem
          selected={sortBy === 'name'}
          onClick={() => handleSortChange('name')}
        >
          Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem
          selected={sortBy === 'status'}
          onClick={() => handleSortChange('status')}
        >
          Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem
          selected={sortBy === 'priority'}
          onClick={() => handleSortChange('priority')}
        >
          Priority {sortBy === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem
          selected={sortBy === 'category'}
          onClick={() => handleSortChange('category')}
        >
          Category {sortBy === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem
          selected={sortBy === 'lastRun'}
          onClick={() => handleSortChange('lastRun')}
        >
          Last Run {sortBy === 'lastRun' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem
          selected={sortBy === 'duration'}
          onClick={() => handleSortChange('duration')}
        >
          Duration {sortBy === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
      </Menu>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && filteredTests.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No tests found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Create your first test to get started'}
          </Typography>
        </Box>
      )}

      {/* Test Table */}
      {!isLoading && filteredTests.length > 0 && (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTests.map((test: TestCase) => (
                  <TableRow
                    key={test.id}
                    hover
                    onClick={() => onTestClick(test)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{test.name || test.title}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={test.status}
                        color={getStatusColor(test.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={test.priority}
                        color={getPriorityColor(test.priority) as any}
                      />
                    </TableCell>
                    <TableCell>{test.category || 'Uncategorized'}</TableCell>
                    <TableCell>{formatDate(test.lastRun || null)}</TableCell>
                    <TableCell>{formatDuration(test.duration || 0)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Run Test">
                          <IconButton
                            size="small"
                            onClick={(e) => handleRunTest(test.id, e)}
                            disabled={runningTestId === test.id}
                          >
                            {runningTestId === test.id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <PlayArrowIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Test">
                          <IconButton
                            size="small"
                            onClick={(e) => onEditTest(test.id, e)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Test">
                          <IconButton
                            size="small"
                            onClick={(e) => onDeleteTest(test.id, e)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredTests.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}
    </Box>
  );
};

export default TestTable;
