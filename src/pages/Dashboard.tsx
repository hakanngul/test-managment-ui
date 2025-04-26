import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
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
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
  Badge,
  Stack,
  Avatar,
  LinearProgress,
  Skeleton,
  Collapse,
  Alert,
  AlertTitle,
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
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// Mock data for tests
const mockTests = Array.from({ length: 50 }).map((_, index) => ({
  id: `TEST-${index + 1}`,
  name: `Test Case ${index + 1}`,
  status: ['Passed', 'Failed', 'Pending', 'Blocked'][Math.floor(Math.random() * 4)],
  lastRun: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  duration: Math.floor(Math.random() * 300),
  category: ['UI', 'API', 'Integration', 'Unit'][Math.floor(Math.random() * 4)],
  priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
  description: `Detailed description for test case ${index + 1}`,
  steps: [
    { step: 'Navigate to login page', expected: 'Login page is displayed' },
    { step: 'Enter credentials', expected: 'Credentials are accepted' },
    { step: 'Click login button', expected: 'User is logged in successfully' },
  ],
  environment: 'Production',
  prerequisites: 'User account must exist',
  attachments: ['screenshot1.png', 'error.log'],
  history: [
    {
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      result: 'Passed',
      duration: 245,
      executor: 'John Doe',
    },
    {
      date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      result: 'Failed',
      duration: 189,
      executor: 'Jane Smith',
    },
  ],
}));

const Dashboard: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState(0);

  // Performance metrics chart options
  const executionTimeChart: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    colors: ['#2196f3'],
  };

  const successRateChart: ApexOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
    },
    labels: ['Passed', 'Failed', 'Pending', 'Blocked'],
    colors: ['#4caf50', '#f44336', '#ff9800', '#9e9e9e'],
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTestClick = (test: any) => {
    setSelectedTest(test);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setDetailsTab(0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      case 'blocked': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed': return <CheckIcon />;
      case 'failed': return <CancelIcon />;
      case 'pending': return <ScheduleIcon />;
      case 'blocked': return <WarningIcon />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
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
                78%
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
                2:45
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
                12
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
                series={[{ name: 'Duration', data: [2.5, 3.1, 2.8, 3.4, 2.9, 3.2, 2.7] }]}
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
                series={[45, 15, 25, 15]}
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
                {mockTests
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
            count={mockTests.length}
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
            onChange={(e, newValue) => setDetailsTab(newValue)}
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