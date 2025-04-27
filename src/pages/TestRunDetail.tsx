import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Breadcrumbs,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TablePagination,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  BugReport as BugIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import api from '../services/api';

interface TestResult {
  id: string;
  testCaseId: string;
  status: string;
  duration: number;
  errorMessage?: string;
}

interface TestRun {
  id: string;
  name: string;
  status: string;
  startTime: string;
  endTime: string | null;
  environment: string;
  browser: string;
  device: string;
  testCaseIds: string[];
  results: TestResult[];
  createdBy: string;
  createdAt: string;
  // Calculated fields
  progress?: number;
  totalTests?: number;
  passed?: number;
  failed?: number;
  skipped?: number;
  running?: number;
  duration?: string;
  triggeredBy?: string;
}

const TestRunDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testRun, setTestRun] = useState<TestRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Add pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch test run data from API
  useEffect(() => {
    const fetchTestRun = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // First try to get from testSuites
        try {
          const data = await api.getTestSuiteById(id);

          // Convert testSuite format to testRun format
          const testRunData = {
            id: data.id,
            name: data.name,
            status: data.status,
            startTime: data.createdAt,
            endTime: null,
            environment: data.environment || 'staging',
            browser: 'chrome',
            device: 'desktop',
            testCaseIds: data.testCases || [],
            results: [],
            createdBy: '1', // Default to first user
            createdAt: data.createdAt,
          };

          // Add mock results based on the results summary
          if (data.results) {
            // Create mock results based on the summary data
            const mockResults: TestResult[] = [];

            // Add passed results
            for (let i = 0; i < data.results.passed; i++) {
              mockResults.push({
                id: `result-${data.id}-passed-${i}`,
                testCaseId: data.testCases && data.testCases[i % data.testCases.length] || `tc-${i+1}`,
                status: 'passed',
                duration: 30000 + Math.floor(Math.random() * 30000)
              });
            }

            // Add failed results
            for (let i = 0; i < data.results.failed; i++) {
              mockResults.push({
                id: `result-${data.id}-failed-${i}`,
                testCaseId: data.testCases && data.testCases[(i + data.results.passed) % data.testCases.length] || `tc-${i+data.results.passed+1}`,
                status: 'failed',
                duration: 40000 + Math.floor(Math.random() * 50000),
                errorMessage: 'Test assertion failed'
              });
            }

            (testRunData as TestRun).results = mockResults;
          }

          // Calculate additional fields
          const enhancedData = {
            ...testRunData,
            progress: data.progress || calculateProgress(testRunData),
            totalTests: data.testCases ? data.testCases.length : 0,
            passed: data.results ? data.results.passed : 0,
            failed: data.results ? data.results.failed : 0,
            skipped: data.results ? data.results.pending : 0,
            running: 0,
            duration: calculateDuration(testRunData),
            triggeredBy: await getUserName('1'),
          };

          setTestRun(enhancedData);
          setError(null);
          setLoading(false);
          return;
        } catch (suiteErr) {
          console.error('Error fetching test suite, trying test run:', suiteErr);
        }

        // If testSuite not found, try to get from testRuns
        const data = await api.getTestRunById(id);

        // Calculate additional fields
        const enhancedData = {
          ...data,
          progress: calculateProgress(data),
          totalTests: data.testCaseIds.length,
          passed: data.results.filter((r: TestResult) => r.status === 'passed').length,
          failed: data.results.filter((r: TestResult) => r.status === 'failed').length,
          skipped: 0, // Assuming no skipped tests in the API data
          running: data.status === 'running' ?
            data.testCaseIds.length - data.results.length : 0,
          duration: calculateDuration(data),
          triggeredBy: await getUserName(data.createdBy),
        };

        setTestRun(enhancedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching test run:', err);
        setError('Failed to load test run. Please try again later.');
        setTestRun(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTestRun();
  }, [id]);

  // Helper function to calculate progress
  const calculateProgress = (data: TestRun): number => {
    if (data.status === 'completed') return 100;
    if (data.status === 'failed') return 100;
    if (data.testCaseIds.length === 0) return 0;
    return Math.round((data.results.length / data.testCaseIds.length) * 100);
  };

  // Helper function to calculate duration
  const calculateDuration = (data: TestRun): string => {
    if (!data.startTime) return '00:00';

    const start = new Date(data.startTime).getTime();
    const end = data.endTime ? new Date(data.endTime).getTime() : Date.now();
    const durationMs = end - start;

    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper function to get user name
  const getUserName = async (userId: string): Promise<string> => {
    try {
      const user = await api.getUserById(userId);
      return user.name;
    } catch (err) {
      console.error('Error fetching user:', err);
      return 'Unknown User';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'running': return 'info';
      case 'skipped': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckIcon fontSize="small" />;
      case 'failed': return <CancelIcon fontSize="small" />;
      case 'running': return <RefreshIcon fontSize="small" />;
      case 'skipped': return <WarningIcon fontSize="small" />;
      default: return <BugIcon fontSize="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Handle no test run found
  if (!testRun) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="warning">Test run not found</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/test-runs')}
        >
          Back to Test Runs
        </Button>
      </Box>
    );
  }

  // Get test case names for results
  const getTestCaseName = (testCaseId: string): string => {
    // In a real application, you would fetch the test case name from the API
    // For now, we'll just use the ID
    return `Test Case ${testCaseId.replace('tc-', '')}`;
  };

  // Format milliseconds to minutes:seconds
  const formatDurationFromMs = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="#" onClick={() => navigate('/test-runs')}>
          Test Runs
        </Link>
        <Typography color="text.primary">{testRun.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="500">
            {testRun.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Started {formatDate(testRun.startTime)} by {testRun.triggeredBy || 'Unknown User'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Download Report
          </Button>
          {testRun.status === 'running' ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<StopIcon />}
            >
              Stop Run
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayIcon />}
            >
              Re-run Tests
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Progress and Status */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    label={testRun.status.toUpperCase()}
                    color={getStatusColor(testRun.status)}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {testRun.progress || 0}% Complete
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Duration: {testRun.duration || '00:00'}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={testRun.progress || 0}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                Total Tests
              </Typography>
              <Typography variant="h4" component="div">
                {testRun.totalTests || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                Passed
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {testRun.passed || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                Failed
              </Typography>
              <Typography variant="h4" component="div" color="error.main">
                {testRun.failed || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                Skipped
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {testRun.skipped || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Environment Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Environment Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Environment"
                    secondary={testRun.environment}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Browser"
                    secondary={testRun.browser}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Device"
                    secondary={testRun.device}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Results */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Results
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Test Case</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testRun.results
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            <Typography variant="body2">
                              {getTestCaseName(result.testCaseId)}
                            </Typography>
                            {result.errorMessage && (
                              <Typography variant="caption" color="error">
                                Error: {result.errorMessage}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(result.status)}
                              label={result.status.toUpperCase()}
                              size="small"
                              color={getStatusColor(result.status)}
                            />
                          </TableCell>
                          <TableCell>{formatDurationFromMs(result.duration)}</TableCell>
                          <TableCell align="right">
                            <IconButton size="small">
                              <BugIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={testRun.results.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestRunDetail;
