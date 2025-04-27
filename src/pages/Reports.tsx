import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart as ChartIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import api from '../services/api';

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API data state
  const [testExecutionData, setTestExecutionData] = useState<any>({
    options: {} as ApexOptions,
    series: []
  });

  const [testDurationData, setTestDurationData] = useState<any>({
    options: {} as ApexOptions,
    series: []
  });

  const [testResults, setTestResults] = useState<any[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [executionData, durationData, results] = await Promise.all([
          api.getTestExecutionData(),
          api.getTestDurationData(),
          api.getTestResults()
        ]);

        setTestExecutionData(executionData);
        setTestDurationData(durationData);
        setTestResults(results);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError('Failed to load reports data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
          <Button
            variant="contained"
            startIcon={<ChartIcon />}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Overview" />
        <Tab label="Test Results" />
        <Tab label="Coverage" />
        <Tab label="Performance" />
      </Tabs>

      {!loading && tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Total Tests
                </Typography>
                <Typography variant="h4" component="div">
                  1,234
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Last 7 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Pass Rate
                </Typography>
                <Typography variant="h4" component="div" color="success.main">
                  85%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  +5% from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Average Duration
                </Typography>
                <Typography variant="h4" component="div">
                  45m
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Per test suite
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Failed Tests
                </Typography>
                <Typography variant="h4" component="div" color="error.main">
                  23
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Requires attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Execution Trend
                </Typography>
                <Chart
                  options={testExecutionData.options}
                  series={testExecutionData.series}
                  type="bar"
                  height={350}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Duration Trend
                </Typography>
                <Chart
                  options={testDurationData.options}
                  series={testDurationData.series}
                  type="line"
                  height={350}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Test Results Table */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Test Results
                  </Typography>
                  <Button color="primary" size="small">
                    View All
                  </Button>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Test Suite</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Passed</TableCell>
                        <TableCell align="right">Failed</TableCell>
                        <TableCell align="right">Skipped</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Last Run</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.name}</TableCell>
                          <TableCell align="right">{result.total}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={result.passed}
                              size="small"
                              color="success"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={result.failed}
                              size="small"
                              color="error"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={result.skipped}
                              size="small"
                              color="warning"
                            />
                          </TableCell>
                          <TableCell>{result.duration}</TableCell>
                          <TableCell>{result.lastRun}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={handleMenuClick}
                            >
                              <MoreIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download Report</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
      </Menu>
    </Box>
  );
};

export default Reports;