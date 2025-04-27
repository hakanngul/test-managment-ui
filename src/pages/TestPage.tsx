import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  CircularProgress,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugIcon,
  Visibility as VisibilityIcon,
  Pause as PauseIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import api from '../services_old/api';
import { TestCase, TestStep } from '../types';

// Sample test steps for demonstration
const sampleTestSteps: TestStep[] = [
  {
    id: 'step-1',
    order: 1,
    action: 'navigate',
    target: '/login',
    value: '',
    description: 'Navigate to login page',
    expectedResult: 'Login page is displayed with username and password fields',
    type: 'automated'
  },
  {
    id: 'step-2',
    order: 2,
    action: 'type',
    target: '#username',
    value: 'testuser',
    description: 'Enter username',
    expectedResult: 'Username is entered in the field',
    type: 'automated'
  },
  {
    id: 'step-3',
    order: 3,
    action: 'type',
    target: '#password',
    value: 'password123',
    description: 'Enter password',
    expectedResult: 'Password is entered in the field',
    type: 'automated'
  },
  {
    id: 'step-4',
    order: 4,
    action: 'click',
    target: '#login-button',
    value: '',
    description: 'Click login button',
    expectedResult: 'User is redirected to dashboard',
    type: 'automated'
  }
];

// Interface for TabPanel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const TestPage: React.FC = () => {
  // State for test execution simulator
  const [activeStep, setActiveStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<'pending' | 'passed' | 'failed'>>([]);
  const [progress, setProgress] = useState(0);

  // State for API testing demo
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // Fetch test cases for API demo
  useEffect(() => {
    if (tabValue === 2) { // Only fetch when API Testing tab is active
      fetchTestCases();
    }
  }, [tabValue]);

  // Function to fetch test cases
  const fetchTestCases = async () => {
    try {
      setLoading(true);
      const data = await api.getTestCases();
      setTestCases(data.slice(0, 3)); // Just get first 3 for demo
      setError(null);
    } catch (err) {
      console.error('Error fetching test cases:', err);
      setError('Failed to load test cases. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to run test simulation
  const runTest = () => {
    setIsRunning(true);
    setActiveStep(0);
    setTestResults(Array(sampleTestSteps.length).fill('pending'));
    setProgress(0);

    // Simulate test execution with delays
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < sampleTestSteps.length) {
        setActiveStep(currentStep);
        setProgress(Math.round((currentStep + 1) / sampleTestSteps.length * 100));

        // Randomly determine if step passes or fails (90% pass rate)
        const stepResult = Math.random() > 0.1 ? 'passed' : 'failed';
        setTestResults(prev => {
          const newResults = [...prev];
          newResults[currentStep] = stepResult;
          return newResults;
        });

        currentStep++;
      } else {
        clearInterval(stepInterval);
        setIsRunning(false);
      }
    }, 1500); // 1.5 seconds per step

    return () => clearInterval(stepInterval);
  };

  // Function to reset test simulation
  const resetTest = () => {
    setActiveStep(-1);
    setTestResults([]);
    setProgress(0);
    setIsRunning(false);
  };

  // Function to handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // We'll use this function in a future enhancement
  // const getActionIcon = (action: string) => {
  //   switch (action) {
  //     case 'click': return <MouseIcon />;
  //     case 'type': return <KeyboardIcon />;
  //     case 'wait': return <TimerIcon />;
  //     case 'navigate': return <SearchIcon />;
  //     default: return <CodeIcon />;
  //   }
  // };

  // Chart options for test metrics
  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    labels: ['Passed', 'Failed', 'Skipped'],
    colors: ['#4caf50', '#f44336', '#ff9800'],
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Automation Platform Demo
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="test page tabs">
          <Tab label="Test Execution" />
          <Tab label="Test Metrics" />
          <Tab label="API Testing" />
          <Tab label="Component Showcase" />
        </Tabs>
      </Box>

      {/* Test Execution Simulator */}
      <TabPanel value={tabValue} index={0}>
        {/* Active Running Tests Table */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Active Running Tests
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              placeholder="Search tests..."
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                sx={{ mr: 1 }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<StopIcon />}
              >
                Stop All
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>Est. Completion</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    id: '1',
                    name: 'Login Test Suite',
                    status: 'running',
                    progress: 45,
                    startTime: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(), // 5 minutes ago
                    estCompletion: new Date(Date.now() + 1000 * 60 * 6).toLocaleTimeString(), // 6 minutes from now
                  },
                  {
                    id: '2',
                    name: 'Payment Processing Tests',
                    status: 'running',
                    progress: 78,
                    startTime: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(), // 12 minutes ago
                    estCompletion: new Date(Date.now() + 1000 * 60 * 3).toLocaleTimeString(), // 3 minutes from now
                  },
                  {
                    id: '3',
                    name: 'User Registration Flow',
                    status: 'queued',
                    progress: 0,
                    startTime: 'Pending',
                    estCompletion: 'Unknown',
                  },
                  {
                    id: '4',
                    name: 'Product Search Tests',
                    status: 'running',
                    progress: 12,
                    startTime: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString(), // 2 minutes ago
                    estCompletion: new Date(Date.now() + 1000 * 60 * 15).toLocaleTimeString(), // 15 minutes from now
                  },
                  {
                    id: '5',
                    name: 'Checkout Process Validation',
                    status: 'paused',
                    progress: 65,
                    startTime: new Date(Date.now() - 1000 * 60 * 25).toLocaleTimeString(), // 25 minutes ago
                    estCompletion: 'Paused',
                  }
                ].map((test) => (
                  <TableRow key={test.id} hover>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        color={
                          test.status === 'running' ? 'primary' :
                          test.status === 'queued' ? 'default' :
                          test.status === 'paused' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={test.progress}
                          sx={{ width: 100 }}
                        />
                        <Typography variant="body2">{test.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{test.startTime}</TableCell>
                    <TableCell>{test.estCompletion}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        disabled={test.status === 'queued'}
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      {test.status === 'running' && (
                        <IconButton size="small" color="warning" sx={{ mr: 1 }}>
                          <PauseIcon fontSize="small" />
                        </IconButton>
                      )}
                      {test.status === 'paused' && (
                        <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                          <PlayIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        disabled={test.status === 'queued'}
                      >
                        <StopIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing 5 active tests. Last updated: {new Date().toLocaleTimeString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Socket.io connection: <Chip label="Disconnected" color="error" size="small" />
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Socket.io Integration (Coming Soon)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This table will be updated in real-time using Socket.io to show active running tests.
              The implementation will include:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Real-time updates of test progress and status" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Live notifications for test completion or failures" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ability to control test execution remotely" />
              </ListItem>
            </List>
          </Box>
        </Paper>

        {/* Test Execution Simulator */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Execution Simulator
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayIcon />}
              onClick={runTest}
              disabled={isRunning}
            >
              Run Test
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={resetTest}
              disabled={isRunning || activeStep === -1}
            >
              Reset
            </Button>
            {isRunning && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<StopIcon />}
                onClick={() => setIsRunning(false)}
              >
                Stop
              </Button>
            )}
          </Box>

          {activeStep !== -1 && (
            <>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">
                  Progress: {progress}%
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              </Box>

              <Stepper activeStep={activeStep} orientation="vertical">
                {sampleTestSteps.map((step, index) => (
                  <Step key={step.id}>
                    <StepLabel
                      optional={
                        testResults[index] ? (
                          <Chip
                            label={testResults[index]}
                            color={testResults[index] === 'passed' ? 'success' : 'error'}
                            size="small"
                            icon={testResults[index] === 'passed' ? <CheckIcon /> : <ErrorIcon />}
                          />
                        ) : null
                      }
                    >
                      {step.description}
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Action: <Chip label={step.action} size="small" />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Target: {step.target}
                        </Typography>
                        {step.value && (
                          <Typography variant="body2" color="text.secondary">
                            Value: {step.value}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Expected Result: {step.expectedResult}
                        </Typography>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {!isRunning && activeStep === sampleTestSteps.length - 1 && (
                <Alert
                  severity={testResults.includes('failed') ? 'error' : 'success'}
                  sx={{ mt: 2 }}
                >
                  {testResults.includes('failed')
                    ? 'Test execution completed with failures.'
                    : 'Test execution completed successfully.'}
                </Alert>
              )}
            </>
          )}
        </Paper>
      </TabPanel>

      {/* Test Metrics Dashboard */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Metrics Dashboard
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Total Tests
                  </Typography>
                  <Typography variant="h4">
                    125
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Pass Rate
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    87%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Avg. Duration
                  </Typography>
                  <Typography variant="h4">
                    2.8s
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Failed Tests
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    16
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Test Status Distribution
                  </Typography>
                  <Chart
                    options={chartOptions}
                    series={[109, 16, 0]}
                    type="donut"
                    height={300}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Test Runs
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Login Test Suite"
                        secondary="Completed 2 hours ago • 15 tests • 13 passed, 2 failed"
                      />
                      <Chip label="87%" color="success" size="small" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ErrorIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Payment Processing"
                        secondary="Completed 5 hours ago • 25 tests • 22 passed, 3 failed"
                      />
                      <Chip label="88%" color="success" size="small" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="User Management"
                        secondary="Completed 1 day ago • 18 tests • 18 passed"
                      />
                      <Chip label="100%" color="success" size="small" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      {/* API Testing Demo */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            API Testing Demo
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={fetchTestCases}
              disabled={loading}
            >
              Fetch Test Cases
            </Button>
            {loading && <CircularProgress size={24} />}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!loading && testCases.length > 0 && (
            <Grid container spacing={3}>
              {testCases.map((testCase) => (
                <Grid item xs={12} md={4} key={testCase.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {testCase.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {testCase.description.substring(0, 100)}
                        {testCase.description.length > 100 ? '...' : ''}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={testCase.status}
                          color={
                            testCase.status === 'active' ? 'success' :
                            testCase.status === 'draft' ? 'warning' : 'default'
                          }
                          size="small"
                        />
                        <Chip
                          label={testCase.priority}
                          color={
                            testCase.priority === 'critical' ? 'error' :
                            testCase.priority === 'high' ? 'warning' :
                            testCase.priority === 'medium' ? 'info' : 'success'
                          }
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Steps: {testCase.steps.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated: {new Date(testCase.updatedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {!loading && testCases.length === 0 && !error && (
            <Alert severity="info">
              No test cases found. Click "Fetch Test Cases" to load data.
            </Alert>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              API Code Example
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
{`// Fetch test cases from API
const fetchTestCases = async () => {
  try {
    setLoading(true);
    const data = await api.getTestCases();
    setTestCases(data);
    setError(null);
  } catch (err) {
    console.error('Error fetching test cases:', err);
    setError('Failed to load test cases.');
  } finally {
    setLoading(false);
  }
};`}
              </pre>
            </Paper>
          </Box>
        </Paper>
      </TabPanel>

      {/* Component Showcase */}
      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Component Showcase
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Status Chips
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="Passed" color="success" />
                    <Chip label="Failed" color="error" />
                    <Chip label="Pending" color="warning" />
                    <Chip label="Blocked" color="default" />
                    <Chip label="Draft" variant="outlined" />
                    <Chip label="Active" color="success" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Progress Indicators
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Linear Progress
                    </Typography>
                    <LinearProgress variant="determinate" value={75} sx={{ mb: 1 }} />
                    <LinearProgress />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CircularProgress value={75} variant="determinate" />
                    <CircularProgress />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Alert States
                  </Typography>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Test execution completed successfully.
                  </Alert>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Test execution failed. See error details.
                  </Alert>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Some tests were skipped during execution.
                  </Alert>
                  <Alert severity="info">
                    Test execution is in progress.
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Action Buttons
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" color="primary" startIcon={<PlayIcon />}>
                      Run Test
                    </Button>
                    <Button variant="contained" color="error" startIcon={<StopIcon />}>
                      Stop
                    </Button>
                    <Button variant="outlined" startIcon={<RefreshIcon />}>
                      Reset
                    </Button>
                    <Button variant="outlined" color="success" startIcon={<BugIcon />}>
                      Debug
                    </Button>
                    <IconButton color="primary">
                      <PlayIcon />
                    </IconButton>
                    <IconButton color="error">
                      <StopIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default TestPage;
