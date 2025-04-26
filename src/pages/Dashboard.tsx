import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// Mock data for tests
const testCategories = ['UI', 'API', 'Integration', 'Unit', 'Performance', 'Security', 'Accessibility'];
const testPriorities = ['Critical', 'High', 'Medium', 'Low'];
const testStatuses = ['Passed', 'Failed', 'Pending', 'Blocked'];
const testEnvironments = ['Development', 'Staging', 'Production', 'QA'];
const testExecutors = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'];
const testFeatures = ['Authentication', 'Search', 'Checkout', 'User Profile', 'Admin Panel', 'Reporting', 'Notifications'];

// Generate more realistic test cases
const mockTests = Array.from({ length: 50 }).map((_, index) => {
  const category = testCategories[Math.floor(Math.random() * testCategories.length)];
  const priority = testPriorities[Math.floor(Math.random() * testPriorities.length)];
  const status = testStatuses[Math.floor(Math.random() * testStatuses.length)];
  const feature = testFeatures[Math.floor(Math.random() * testFeatures.length)];
  const environment = testEnvironments[Math.floor(Math.random() * testEnvironments.length)];

  // Generate between 2-5 steps
  const stepCount = Math.floor(Math.random() * 4) + 2;
  const steps = Array.from({ length: stepCount }).map((_, stepIndex) => {
    return {
      step: `Step ${stepIndex + 1}: ${getStepDescription(feature, stepIndex)}`,
      expected: `Expected Result: ${getExpectedResult(feature, stepIndex)}`,
    };
  });

  // Generate between 2-5 history records
  const historyCount = Math.floor(Math.random() * 4) + 2;
  const history = Array.from({ length: historyCount }).map((_, histIndex) => {
    const daysAgo = Math.floor(Math.random() * 60) + (histIndex * 5); // Spread out the dates
    const result = testStatuses[Math.floor(Math.random() * testStatuses.length)];
    return {
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      result,
      duration: Math.floor(Math.random() * 300) + 60, // Between 1-6 minutes
      executor: testExecutors[Math.floor(Math.random() * testExecutors.length)],
      environment: testEnvironments[Math.floor(Math.random() * testEnvironments.length)],
      version: `v1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
    };
  });

  // Sort history by date (newest first)
  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Generate between 0-3 attachments
  const attachmentCount = Math.floor(Math.random() * 4);
  const attachmentTypes = ['screenshot', 'log', 'report', 'video'];
  const attachments = Array.from({ length: attachmentCount }).map((_, attIndex) => {
    const type = attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)];
    return `${type}_${index + 1}_${attIndex + 1}.${type === 'screenshot' ? 'png' : type === 'video' ? 'mp4' : 'txt'}`;
  });

  return {
    id: `TEST-${index + 1}`,
    name: `${feature} ${category} Test ${index + 1}`,
    status,
    lastRun: history.length > 0 ? history[0].date : null,
    duration: Math.floor(Math.random() * 300) + 30,
    category,
    priority,
    feature,
    description: `This test verifies the ${feature} functionality in the application. It ensures that users can ${getFeatureDescription(feature)} correctly and efficiently.`,
    steps,
    environment,
    prerequisites: `${getPrerequisites(feature)}`,
    attachments,
    history,
    tags: [category, priority, feature, environment].filter(Boolean),
    automated: Math.random() > 0.3, // 70% of tests are automated
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: testExecutors[Math.floor(Math.random() * testExecutors.length)],
  };
});

// Helper functions for generating realistic test data
function getFeatureDescription(feature: string): string {
  switch (feature) {
    case 'Authentication': return 'log in, register, and reset passwords';
    case 'Search': return 'find products, filter results, and sort listings';
    case 'Checkout': return 'add items to cart, enter payment details, and complete purchases';
    case 'User Profile': return 'view and edit personal information, manage preferences, and track orders';
    case 'Admin Panel': return 'manage users, view reports, and configure system settings';
    case 'Reporting': return 'generate reports, export data, and visualize metrics';
    case 'Notifications': return 'receive alerts, manage notification preferences, and view message history';
    default: return 'use core application features';
  }
}

function getStepDescription(feature: string, stepIndex: number): string {
  const steps: Record<string, string[]> = {
    'Authentication': [
      'Navigate to the login page',
      'Enter valid credentials',
      'Click the login button',
      'Verify user is redirected to dashboard',
      'Check that user-specific content is displayed'
    ],
    'Search': [
      'Navigate to the search page',
      'Enter search criteria',
      'Apply filters',
      'Sort results',
      'Verify correct items are displayed'
    ],
    'Checkout': [
      'Add items to cart',
      'Proceed to checkout',
      'Enter shipping information',
      'Enter payment details',
      'Complete purchase'
    ],
    'User Profile': [
      'Navigate to profile page',
      'Edit personal information',
      'Save changes',
      'Verify changes are persisted',
      'Log out and log back in to confirm'
    ],
    'Admin Panel': [
      'Log in as admin',
      'Navigate to user management',
      'Create a new user',
      'Edit user permissions',
      'Verify changes take effect'
    ],
    'Reporting': [
      'Navigate to reports section',
      'Select report parameters',
      'Generate report',
      'Export data',
      'Verify exported data matches displayed data'
    ],
    'Notifications': [
      'Trigger a notification event',
      'Verify notification appears',
      'Click on notification',
      'Verify redirection to correct page',
      'Mark notification as read'
    ]
  };

  const defaultSteps = [
    'Navigate to the feature',
    'Interact with the UI element',
    'Verify expected behavior',
    'Test edge cases',
    'Clean up test data'
  ];

  const featureSteps = steps[feature] || defaultSteps;
  return featureSteps[stepIndex % featureSteps.length];
}

function getExpectedResult(feature: string, stepIndex: number): string {
  const results: Record<string, string[]> = {
    'Authentication': [
      'Login page is displayed with username and password fields',
      'Credentials are accepted without errors',
      'System processes the login request',
      'Dashboard page is loaded with user-specific data',
      'User name appears in the header and personalized content is visible'
    ],
    'Search': [
      'Search interface is displayed with all filter options',
      'Search query is processed without errors',
      'Filter options are applied to the results',
      'Results are reordered according to sort criteria',
      'Only items matching search criteria are displayed'
    ],
    'Checkout': [
      'Items are added to cart with correct quantities and prices',
      'Checkout page displays with order summary',
      'Shipping form accepts and validates the information',
      'Payment form accepts and validates the information',
      'Order confirmation page is displayed with order number'
    ],
    'User Profile': [
      'Profile page loads with current user information',
      'Form accepts new information without validation errors',
      'System displays success message after saving',
      'Profile page shows updated information',
      'Updated information persists across sessions'
    ],
    'Admin Panel': [
      'Admin dashboard loads with all management options',
      'User management interface displays with list of users',
      'New user form accepts and validates information',
      'Permission editor saves changes successfully',
      'User can access features according to assigned permissions'
    ],
    'Reporting': [
      'Report interface loads with all parameter options',
      'Parameter form accepts valid inputs',
      'Report is generated and displayed correctly',
      'Data is exported in the selected format',
      'Exported data contains all displayed information'
    ],
    'Notifications': [
      'System creates the notification correctly',
      'Notification appears in the notification center',
      'System registers the click event',
      'Related content page is loaded',
      'Notification is marked as read and removed from unread list'
    ]
  };

  const defaultResults = [
    'Feature page loads correctly',
    'System responds to the interaction',
    'System state changes as expected',
    'System handles edge cases gracefully',
    'System returns to initial state'
  ];

  const featureResults = results[feature] || defaultResults;
  return featureResults[stepIndex % featureResults.length];
}

function getPrerequisites(feature: string): string {
  switch (feature) {
    case 'Authentication': return 'Valid user credentials must exist in the system';
    case 'Search': return 'Product catalog must be populated with searchable items';
    case 'Checkout': return 'User must be logged in with items in cart and valid payment method';
    case 'User Profile': return 'User account must exist with editable profile information';
    case 'Admin Panel': return 'Admin user with appropriate permissions must exist';
    case 'Reporting': return 'System must have data available for reporting period';
    case 'Notifications': return 'Notification system must be enabled and configured';
    default: return 'Application must be deployed and accessible';
  }
}

const Dashboard: React.FC = () => {
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState(0);

  // Filtering state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState<string>('all');

  // Sorting state
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>('lastRun');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryPanel, setShowCategoryPanel] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Simulate loading state on initial render
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Calculate metrics for dashboard
  const totalTests = mockTests.length;
  const passedTests = mockTests.filter(test => test.status === 'Passed').length;
  const failedTests = mockTests.filter(test => test.status === 'Failed').length;
  const pendingTests = mockTests.filter(test => test.status === 'Pending').length;
  const blockedTests = mockTests.filter(test => test.status === 'Blocked').length;
  const passRate = Math.round((passedTests / totalTests) * 100);

  // Calculate average duration
  const totalDuration = mockTests.reduce((sum, test) => sum + test.duration, 0);
  const avgDuration = Math.round(totalDuration / totalTests);

  // Get last 7 days for chart
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  // Generate execution time data for the last 7 days
  const executionTimeData = Array.from({ length: 7 }).map(() =>
    (Math.random() * 3 + 1).toFixed(1)
  ).map(Number);

  // Generate test counts by day
  const testCountsByDay = last7Days.map(() => ({
    passed: Math.floor(Math.random() * 15) + 5,
    failed: Math.floor(Math.random() * 8) + 1,
    pending: Math.floor(Math.random() * 6) + 1,
    blocked: Math.floor(Math.random() * 4) + 1,
  }));

  // Calculate test counts by category
  const testCountsByCategory = testCategories.reduce((acc, category) => {
    acc[category] = mockTests.filter(test => test.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Calculate test counts by priority
  const testCountsByPriority = testPriorities.reduce((acc, priority) => {
    acc[priority] = mockTests.filter(test => test.priority === priority).length;
    return acc;
  }, {} as Record<string, number>);

  // Calculate test counts by feature
  const testCountsByFeature = testFeatures.reduce((acc, feature) => {
    acc[feature] = mockTests.filter(test => test.feature === feature).length;
    return acc;
  }, {} as Record<string, number>);

  // Get recent test runs (last 10 completed tests)
  const recentTestRuns = mockTests
    .filter(test => test.lastRun)
    .sort((a, b) => new Date(b.lastRun!).getTime() - new Date(a.lastRun!).getTime())
    .slice(0, 10);

  // Performance metrics chart options
  const executionTimeChart: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: last7Days,
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Minutes',
        style: {
          fontSize: '12px',
        },
      },
      min: 0,
    },
    colors: ['#2196f3'],
    tooltip: {
      y: {
        formatter: (value) => `${value} minutes`,
      },
    },
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5,
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
  };

  const successRateChart: ApexOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    labels: ['Passed', 'Failed', 'Pending', 'Blocked'],
    colors: ['#4caf50', '#f44336', '#ff9800', '#9e9e9e'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} tests (${Math.round((value / totalTests) * 100)}%)`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Tests',
              formatter: () => totalTests.toString(),
            },
          },
        },
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Test details handlers
  const handleTestClick = (test: any) => {
    setSelectedTest(test);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setDetailsTab(0);
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
  };

  const handlePriorityFilterChange = (priority: string) => {
    setSelectedPriorityFilter(priority);
  };

  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategoryFilter(category);
  };

  const handleFeatureFilterChange = (feature: string) => {
    setSelectedFeatureFilter(feature);
  };

  const handleClearFilters = () => {
    setSelectedStatusFilter('all');
    setSelectedPriorityFilter('all');
    setSelectedCategoryFilter('all');
    setSelectedFeatureFilter('all');
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

  // Category panel handlers
  const handleToggleCategoryPanel = () => {
    setShowCategoryPanel(!showCategoryPanel);
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedCategoryFilter(category);
    }
  };

  // Action handlers
  const handleRunTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    // Simulate running a test
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Show success message or update test status
    }, 1500);
  };

  const handleEditTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    // Navigate to edit page or open edit modal
  };

  const handleDeleteTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    // Show confirmation dialog
  };

  // Filter and sort tests
  const filteredTests = mockTests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatusFilter === 'all' || test.status === selectedStatusFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || test.priority === selectedPriorityFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || test.category === selectedCategoryFilter;
    const matchesFeature = selectedFeatureFilter === 'all' || test.feature === selectedFeatureFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesFeature;
  });

  const sortedTests = [...filteredTests].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'status':
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      case 'priority':
        const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return sortDirection === 'asc'
          ? priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
          : priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'category':
        return sortDirection === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      case 'duration':
        return sortDirection === 'asc'
          ? a.duration - b.duration
          : b.duration - a.duration;
      case 'lastRun':
      default:
        // Handle null lastRun values
        if (!a.lastRun) return sortDirection === 'asc' ? -1 : 1;
        if (!b.lastRun) return sortDirection === 'asc' ? 1 : -1;
        return sortDirection === 'asc'
          ? new Date(a.lastRun).getTime() - new Date(b.lastRun).getTime()
          : new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime();
    }
  });

  const paginatedTests = sortedTests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Helper functions for UI
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      case 'blocked': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string): React.ReactElement | undefined => {
    switch (status.toLowerCase()) {
      case 'passed': return <CheckIcon />;
      case 'failed': return <CancelIcon />;
      case 'pending': return <ScheduleIcon />;
      case 'blocked': return <WarningIcon />;
      default: return undefined;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          Test Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayIcon />}
          >
            Run Tests
          </Button>
        </Box>
      </Box>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Tests
              </Typography>
              <Typography variant="h4">
                {mockTests.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pass Rate
              </Typography>
              <Typography variant="h4" color="success.main">
                {Math.round((passedTests / totalTests) * 100)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg. Duration
              </Typography>
              <Typography variant="h4">
                {formatDuration(Math.round(totalDuration / totalTests))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Failed Tests
              </Typography>
              <Typography variant="h4" color="error.main">
                {mockTests.filter(test => test.status === 'Failed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Execution Time Trend
              </Typography>
              <Chart
                options={executionTimeChart}
                series={[{ name: 'Duration', data: Array.from({ length: 7 }).map(() => (Math.random() * 3 + 1).toFixed(1)).map(Number) }]}
                type="line"
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Results Distribution
              </Typography>
              <Chart
                options={successRateChart}
                series={[
                  mockTests.filter(test => test.status === 'Passed').length,
                  mockTests.filter(test => test.status === 'Failed').length,
                  mockTests.filter(test => test.status === 'Pending').length,
                  mockTests.filter(test => test.status === 'Blocked').length
                ]}
                type="donut"
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Test Table */}
      <Card>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search tests..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            >
              Filter
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((test) => (
                    <TableRow
                      key={test.id}
                      hover
                      onClick={() => handleTestClick(test)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{test.id}</TableCell>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(test.status)}
                          label={test.status}
                          color={getStatusColor(test.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(test.lastRun)}</TableCell>
                      <TableCell>{formatDuration(test.duration)}</TableCell>
                      <TableCell>
                        <Chip label={test.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={test.priority}
                          size="small"
                          color={test.priority === 'High' ? 'error' : test.priority === 'Medium' ? 'warning' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                          <PlayIcon />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                          <DeleteIcon />
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
            count={filteredTests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Test Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedTest?.name}
            </Typography>
            <Chip
              label={selectedTest?.status}
              color={getStatusColor(selectedTest?.status || '')}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={detailsTab}
            onChange={(_, newValue) => setDetailsTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="Details" />
            <Tab label="Steps" />
            <Tab label="History" />
            <Tab label="Attachments" />
          </Tabs>

          {detailsTab === 0 && selectedTest && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2">
                  {selectedTest.description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Prerequisites
                </Typography>
                <Typography variant="body2">
                  {selectedTest.prerequisites}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Environment
                </Typography>
                <Typography variant="body2">
                  {selectedTest.environment}
                </Typography>
              </Grid>
            </Grid>
          )}

          {detailsTab === 1 && selectedTest && (
            <List>
              {selectedTest.steps.map((step: any, index: number) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Step ${index + 1}: ${step.step}`}
                      secondary={`Expected Result: ${step.expected}`}
                    />
                  </ListItem>
                  {index < selectedTest.steps.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}

          {detailsTab === 2 && selectedTest && (
            <List>
              {selectedTest.history.map((record: any, index: number) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={formatDate(record.date)}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Result: <Chip label={record.result} size="small" color={getStatusColor(record.result)} />
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Duration: {formatDuration(record.duration)}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Executed by: {record.executor}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < selectedTest.history.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}

          {detailsTab === 3 && selectedTest && (
            <List>
              {selectedTest.attachments.map((attachment: string, index: number) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText primary={attachment} />
                    <Button size="small">
                      Download
                    </Button>
                  </ListItem>
                  {index < selectedTest.attachments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button variant="contained" color="primary" startIcon={<PlayIcon />}>
            Run Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;