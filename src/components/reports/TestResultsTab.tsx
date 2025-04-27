import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { ApexOptions } from 'apexcharts';
import ChartCard from './ChartCard';

interface TestStep {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: string;
  errorMessage?: string;
  screenshot?: string;
}

interface TestCase {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: string;
  steps: TestStep[];
}

interface DetailedTestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  startTime: string;
  endTime: string;
  environment: string;
  browser: string;
  testCases: TestCase[];
}

interface TestResultsTabProps {
  detailedResults: DetailedTestResult[];
  statusDistributionData: {
    options: ApexOptions;
    series: number[];
  };
  durationByStatusData: {
    options: ApexOptions;
    series: any[];
  };
}

const TestResultsTab: React.FC<TestResultsTabProps> = ({
  detailedResults,
  statusDistributionData,
  durationByStatusData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('7days');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTest, setSelectedTest] = useState<DetailedTestResult | null>(null);
  const [detailTabValue, setDetailTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleDateFilterChange = (event: SelectChangeEvent<string>) => {
    setDateFilter(event.target.value);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTestClick = (test: DetailedTestResult) => {
    setSelectedTest(test);
    setDetailTabValue(0);
    setDialogOpen(true);
  };

  const handleDetailTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setDetailTabValue(newValue);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'success';
      case 'failed':
        return 'error';
      case 'skipped':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'failed':
        return <ErrorIcon fontSize="small" color="error" />;
      case 'skipped':
        return <WarningIcon fontSize="small" color="warning" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  // Filter and sort results
  const filteredResults = detailedResults.filter((result) => {
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    // In a real app, you would filter by date based on the dateFilter value
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      {/* Filters and Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search"
                    value={searchTerm}
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
                  <FormControl fullWidth>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={statusFilter}
                      label="Status"
                      onChange={handleStatusFilterChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="passed">Passed</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                      <MenuItem value="skipped">Skipped</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="date-filter-label">Date Range</InputLabel>
                    <Select
                      labelId="date-filter-label"
                      value={dateFilter}
                      label="Date Range"
                      onChange={handleDateFilterChange}
                    >
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="yesterday">Yesterday</MenuItem>
                      <MenuItem value="7days">Last 7 Days</MenuItem>
                      <MenuItem value="30days">Last 30 Days</MenuItem>
                      <MenuItem value="custom">Custom Range</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Status Distribution"
            options={statusDistributionData.options}
            series={statusDistributionData.series}
            type="donut"
            height={250}
          />
        </Grid>
        <Grid item xs={12}>
          <ChartCard
            title="Duration by Status"
            options={durationByStatusData.options}
            series={durationByStatusData.series}
            type="bar"
            height={300}
          />
        </Grid>
      </Grid>

      {/* Results Table */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Passed</TableCell>
                  <TableCell align="right">Failed</TableCell>
                  <TableCell align="right">Skipped</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>Environment</TableCell>
                  <TableCell>Browser</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResults
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((result) => (
                    <TableRow 
                      key={result.id} 
                      hover 
                      onClick={() => handleTestClick(result)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{result.name}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(result.status)}
                          label={result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                          size="small"
                          color={getStatusColor(result.status) as "success" | "error" | "warning" | "default"}
                        />
                      </TableCell>
                      <TableCell align="right">{result.total}</TableCell>
                      <TableCell align="right">{result.passed}</TableCell>
                      <TableCell align="right">{result.failed}</TableCell>
                      <TableCell align="right">{result.skipped}</TableCell>
                      <TableCell>{result.duration}</TableCell>
                      <TableCell>{result.startTime}</TableCell>
                      <TableCell>{result.environment}</TableCell>
                      <TableCell>{result.browser}</TableCell>
                    </TableRow>
                  ))}
                {filteredResults.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No test results found matching your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredResults.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Test Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Test Details: {selectedTest?.name}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTest && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedTest.status)}
                    label={selectedTest.status.charAt(0).toUpperCase() + selectedTest.status.slice(1)}
                    color={getStatusColor(selectedTest.status) as "success" | "error" | "warning" | "default"}
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <ScheduleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {selectedTest.duration}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">Environment</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>{selectedTest.environment}</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">Browser</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>{selectedTest.browser}</Typography>
                </Grid>
              </Grid>

              <Tabs
                value={detailTabValue}
                onChange={handleDetailTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab label="Test Cases" />
                <Tab label="Summary" />
                <Tab label="Logs" />
              </Tabs>

              {detailTabValue === 0 && (
                <Box>
                  {selectedTest.testCases.map((testCase) => (
                    <Accordion key={testCase.id} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {getStatusIcon(testCase.status)}
                          <Typography sx={{ ml: 1 }}>{testCase.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            {testCase.duration}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Step</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Details</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {testCase.steps.map((step) => (
                                <TableRow key={step.id}>
                                  <TableCell>{step.name}</TableCell>
                                  <TableCell>
                                    <Chip
                                      icon={getStatusIcon(step.status)}
                                      label={step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                      size="small"
                                      color={getStatusColor(step.status) as "success" | "error" | "warning" | "default"}
                                    />
                                  </TableCell>
                                  <TableCell>{step.duration}</TableCell>
                                  <TableCell>
                                    {step.errorMessage && (
                                      <Typography variant="body2" color="error.main">
                                        {step.errorMessage}
                                      </Typography>
                                    )}
                                    {step.screenshot && (
                                      <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                                        View Screenshot
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {detailTabValue === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Test Results</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography>Total:</Typography>
                          <Typography fontWeight="bold">{selectedTest.total}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography>Passed:</Typography>
                          <Typography fontWeight="bold" color="success.main">{selectedTest.passed}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography>Failed:</Typography>
                          <Typography fontWeight="bold" color="error.main">{selectedTest.failed}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Skipped:</Typography>
                          <Typography fontWeight="bold" color="warning.main">{selectedTest.skipped}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Timing</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography>Start Time:</Typography>
                          <Typography fontWeight="bold">{selectedTest.startTime}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography>End Time:</Typography>
                          <Typography fontWeight="bold">{selectedTest.endTime}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Duration:</Typography>
                          <Typography fontWeight="bold">{selectedTest.duration}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Pass Rate</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ minWidth: 100 }}>
                            {Math.round((selectedTest.passed / selectedTest.total) * 100)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(selectedTest.passed / selectedTest.total) * 100}
                            color="success"
                            sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {detailTabValue === 2 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Test Logs</Typography>
                    <Box
                      sx={{
                        bgcolor: 'background.paper',
                        p: 2,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        maxHeight: 400,
                        overflow: 'auto'
                      }}
                    >
                      <pre>
                        {`[${selectedTest.startTime}] INFO: Starting test execution: ${selectedTest.name}
[${selectedTest.startTime}] INFO: Browser: ${selectedTest.browser}, Environment: ${selectedTest.environment}
[${selectedTest.startTime}] INFO: Running test case: ${selectedTest.testCases[0].name}
[${selectedTest.startTime}] INFO: Step: ${selectedTest.testCases[0].steps[0].name} - ${selectedTest.testCases[0].steps[0].status.toUpperCase()}
[${selectedTest.startTime}] INFO: Step: ${selectedTest.testCases[0].steps[1].name} - ${selectedTest.testCases[0].steps[1].status.toUpperCase()}
${selectedTest.testCases[0].steps.some(s => s.status === 'failed') ? 
`[${selectedTest.startTime}] ERROR: Step failed: ${selectedTest.testCases[0].steps.find(s => s.status === 'failed')?.name}
[${selectedTest.startTime}] ERROR: ${selectedTest.testCases[0].steps.find(s => s.status === 'failed')?.errorMessage}` : ''}
[${selectedTest.endTime}] INFO: Test execution completed: ${selectedTest.status.toUpperCase()}
[${selectedTest.endTime}] INFO: Total: ${selectedTest.total}, Passed: ${selectedTest.passed}, Failed: ${selectedTest.failed}, Skipped: ${selectedTest.skipped}
[${selectedTest.endTime}] INFO: Duration: ${selectedTest.duration}`}
                      </pre>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" color="primary">Download Report</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestResultsTab;
