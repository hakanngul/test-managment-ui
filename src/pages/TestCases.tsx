import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  Menu,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { TestCase } from '../types';

// Mock test case data
const MOCK_TEST_CASES: TestCase[] = Array.from({ length: 50 }).map((_, index) => ({
  id: `tc-${index + 1}`,
  title: `Test Case ${index + 1}: ${[
    'User Login',
    'Product Search',
    'Checkout Process',
    'Account Creation',
    'Password Reset',
    'Order History',
    'Payment Processing',
    'Item Filtering',
    'Admin Dashboard',
    'User Profile',
  ][index % 10]}`,
  description: `Description for test case ${index + 1}. This test verifies ${[
    'user authentication functionality',
    'product search results accuracy',
    'the complete checkout process',
    'new account creation workflow',
    'the password reset functionality',
    'customer order history display',
    'credit card transaction processing',
    'product filtering and sorting',
    'admin dashboard functionality',
    'user profile update process',
  ][index % 10]}.`,
  status: ['active', 'draft', 'archived'][Math.floor(Math.random() * 3)] as 'active' | 'draft' | 'archived',
  priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
  createdBy: '1',
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  steps: Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, i) => ({
    id: `step-${index}-${i}`,
    order: i + 1,
    description: `Step ${i + 1} description`,
    expectedResult: `Expected result for step ${i + 1}`,
    type: Math.random() > 0.5 ? 'manual' : 'automated',
  })),
  tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
    (_, i) => ['regression', 'smoke', 'integration', 'api', 'ui', 'performance', 'security'][Math.floor(Math.random() * 7)]
  ),
  projectId: '1',
}));

const TestCases: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [testCases, setTestCases] = useState<TestCase[]>(MOCK_TEST_CASES);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  const handleChangePage = (event: unknown, newPage: number) => {
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
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
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

  const paginatedTestCases = filteredTestCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          Test Cases
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/test-cases/new')}
        >
          New Test Case
        </Button>
      </Box>

      <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search test cases..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            onClick={handleFilterClick}
            size="small"
          >
            Filter
          </Button>
          
          <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            onClick={handleSortClick}
            size="small"
          >
            Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </Button>
        </Box>
      </Card>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Status
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['all', 'active', 'draft', 'archived'].map((status) => (
              <Chip 
                key={status}
                label={status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                onClick={() => handleStatusFilterChange(status)}
                variant={selectedStatusFilter === status ? 'filled' : 'outlined'}
                color={selectedStatusFilter === status ? (status === 'all' ? 'primary' : getStatusColor(status)) : 'default'}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            Priority
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['all', 'critical', 'high', 'medium', 'low'].map((priority) => (
              <Chip 
                key={priority}
                label={priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                onClick={() => handlePriorityFilterChange(priority)}
                variant={selectedPriorityFilter === priority ? 'filled' : 'outlined'}
                color={selectedPriorityFilter === priority ? (priority === 'all' ? 'primary' : getPriorityColor(priority)) : 'default'}
              />
            ))}
          </Box>
        </Box>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => handleSortChange('title')}>
          Title {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('priority')}>
          Priority {sortBy === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('status')}>
          Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('updatedAt')}>
          Last Updated {sortBy === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
        </MenuItem>
      </Menu>

      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Test Case</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTestCases.map((testCase) => (
                <TableRow 
                  key={testCase.id}
                  hover
                  onClick={() => handleViewTestCase(testCase.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {testCase.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {testCase.description.substring(0, 100)}
                      {testCase.description.length > 100 ? '...' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
                      size="small"
                      color={getPriorityColor(testCase.priority)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
                      size="small"
                      color={getStatusColor(testCase.status)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(testCase.updatedAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {testCase.tags.slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      ))}
                      {testCase.tags.length > 2 && (
                        <Chip
                          label={`+${testCase.tags.length - 2}`}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle menu open
                      }}
                    >
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTestCases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default TestCases;