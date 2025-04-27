import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  SelectChangeEvent,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import api from '../services/api';
import { TestCase, TestStep } from '../types';

const TestExecutionSimulator: React.FC = () => {
  // State for test case selection
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>('');
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>([]);

  // State for test execution simulator
  const [activeStep, setActiveStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<'pending' | 'passed' | 'failed'>>([]);
  const [progress, setProgress] = useState(0);

  // State for API calls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch test cases on component mount
  useEffect(() => {
    fetchTestCases();
  }, []);

  // Filter test cases when search query changes
  useEffect(() => {
    if (testCases.length > 0) {
      const filtered = testCases.filter(testCase =>
        testCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testCase.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTestCases(filtered);
    }
  }, [searchQuery, testCases]);

  // Update selected test case when selection changes
  useEffect(() => {
    if (selectedTestCaseId && testCases.length > 0) {
      const testCase = testCases.find(tc => tc.id === selectedTestCaseId) || null;
      setSelectedTestCase(testCase);

      // Reset simulator state when test case changes
      resetTest();
    }
  }, [selectedTestCaseId, testCases]);

  // Function to fetch test cases
  const fetchTestCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTestCases();
      setTestCases(data);
      setFilteredTestCases(data);

      // Select the first test case by default if available
      if (data.length > 0 && !selectedTestCaseId) {
        setSelectedTestCaseId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching test cases:', err);
      setError('Failed to load test cases. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle test case selection change
  const handleTestCaseChange = (event: SelectChangeEvent<string>) => {
    setSelectedTestCaseId(event.target.value);
  };

  // Function to handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Function to run test simulation
  const runTest = () => {
    if (!selectedTestCase) return;

    setIsRunning(true);
    setActiveStep(0);
    setTestResults(Array(selectedTestCase.steps.length).fill('pending'));
    setProgress(0);

    // Simulate test execution with delays
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < selectedTestCase!.steps.length) {
        setActiveStep(currentStep);
        setProgress(Math.round((currentStep + 1) / selectedTestCase!.steps.length * 100));

        // Determine step result
        let stepResult: 'passed' | 'failed';

        // Any step with "navigate" in the description always passes
        if (selectedTestCase.steps[currentStep].description.toLowerCase().includes('navigate')) {
          stepResult = 'passed';
        } else {
          // Other steps have 90% pass rate
          stepResult = Math.random() > 0.1 ? 'passed' : 'failed';
        }

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

  // Function to stop test simulation
  const stopTest = () => {
    setIsRunning(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Execution Simulator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Select a test case and run the simulation to see how test execution works.
      </Typography>

      {/* Test Case Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Test Case
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search test cases..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchTestCases}
              disabled={loading}
            >
              Refresh Test Cases
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel id="test-case-select-label">Test Case</InputLabel>
              <Select
                labelId="test-case-select-label"
                id="test-case-select"
                value={selectedTestCaseId}
                label="Test Case"
                onChange={handleTestCaseChange}
                disabled={filteredTestCases.length === 0}
              >
                {filteredTestCases.map((testCase) => (
                  <MenuItem key={testCase.id} value={testCase.id}>
                    {testCase.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedTestCase && (
              <Card variant="outlined" sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedTestCase.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedTestCase.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={selectedTestCase.status}
                      color={
                        selectedTestCase.status === 'active' ? 'success' :
                        selectedTestCase.status === 'draft' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                    <Chip
                      label={selectedTestCase.priority}
                      color={
                        selectedTestCase.priority === 'critical' ? 'error' :
                        selectedTestCase.priority === 'high' ? 'warning' :
                        selectedTestCase.priority === 'medium' ? 'info' : 'success'
                      }
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2">
                    Steps: {selectedTestCase.steps.length}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}
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
            disabled={isRunning || !selectedTestCase}
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
              onClick={stopTest}
            >
              Stop
            </Button>
          )}
        </Box>

        {!selectedTestCase && (
          <Alert severity="info">
            Please select a test case to run the simulation.
          </Alert>
        )}

        {selectedTestCase && activeStep !== -1 && (
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
              {selectedTestCase.steps.map((step, index) => (
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

            {!isRunning && activeStep === selectedTestCase.steps.length - 1 && (
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

      {/* Test Execution Details */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          How It Works
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" paragraph>
          This simulator demonstrates how test automation works by executing test steps in sequence.
          Each step has an action (like click, type, or navigate), a target (what element to interact with),
          and an expected result.
        </Typography>

        <Typography variant="body2" paragraph>
          In a real test automation system, these steps would be executed against a real application,
          and the actual results would be compared with the expected results to determine if the test passes or fails.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Simulator Features:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              Select from available test cases
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Run test execution simulation
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              View step-by-step progress
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              See pass/fail results for each step
            </Typography>
          </li>
        </ul>
      </Paper>
    </Box>
  );
};

export default TestExecutionSimulator;
