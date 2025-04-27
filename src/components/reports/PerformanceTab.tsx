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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { ApexOptions } from 'apexcharts';
import ChartCard from './ChartCard';
import SummaryCard from './SummaryCard';

interface PerformanceMetric {
  id: string;
  testName: string;
  loadTime: number;
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  networkRequests: number;
  errors: number;
  warnings: number;
  browser: string;
  device: string;
  timestamp: string;
  status: 'good' | 'warning' | 'critical';
}

interface PerformanceTabProps {
  performanceMetrics: PerformanceMetric[];
  loadTimeData: {
    options: ApexOptions;
    series: any[];
  };
  responseTimeData: {
    options: ApexOptions;
    series: any[];
  };
  resourceUsageData: {
    options: ApexOptions;
    series: any[];
  };
  browserComparisonData: {
    options: ApexOptions;
    series: any[];
  };
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({
  performanceMetrics,
  loadTimeData,
  responseTimeData,
  resourceUsageData,
  browserComparisonData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [browserFilter, setBrowserFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailTabValue, setDetailTabValue] = useState(0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleBrowserFilterChange = (event: SelectChangeEvent<string>) => {
    setBrowserFilter(event.target.value);
    setPage(0);
  };

  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMetricClick = (metric: PerformanceMetric) => {
    setSelectedMetric(metric);
    setDetailTabValue(0);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDetailTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setDetailTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'warning':
        return <WarningIcon fontSize="small" color="warning" />;
      case 'critical':
        return <WarningIcon fontSize="small" color="error" />;
      default:
        return <InfoIcon fontSize="small" color="success" />;
    }
  };

  // Calculate averages for summary cards
  const avgLoadTime = performanceMetrics.reduce((sum, metric) => sum + metric.loadTime, 0) / performanceMetrics.length;
  const avgResponseTime = performanceMetrics.reduce((sum, metric) => sum + metric.responseTime, 0) / performanceMetrics.length;
  const avgCpuUsage = performanceMetrics.reduce((sum, metric) => sum + metric.cpuUsage, 0) / performanceMetrics.length;
  const avgMemoryUsage = performanceMetrics.reduce((sum, metric) => sum + metric.memoryUsage, 0) / performanceMetrics.length;

  // Filter and sort metrics
  const filteredMetrics = performanceMetrics.filter((metric) => {
    const matchesSearch = metric.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || metric.status === statusFilter;
    const matchesBrowser = browserFilter === 'all' || metric.browser === browserFilter;
    
    return matchesSearch && matchesStatus && matchesBrowser;
  });

  // Sort metrics
  const sortedMetrics = [...filteredMetrics].sort((a, b) => {
    if (sortBy === 'testName') return a.testName.localeCompare(b.testName);
    if (sortBy === 'loadTime') return b.loadTime - a.loadTime;
    if (sortBy === 'responseTime') return b.responseTime - a.responseTime;
    if (sortBy === 'cpuUsage') return b.cpuUsage - a.cpuUsage;
    if (sortBy === 'memoryUsage') return b.memoryUsage - a.memoryUsage;
    if (sortBy === 'timestamp') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    return 0;
  });

  // Get unique browsers for filter
  const browsers = [...new Set(performanceMetrics.map(metric => metric.browser))];

  // Mock waterfall data for the dialog
  const mockWaterfallData = [
    { name: 'DNS Lookup', startTime: 0, duration: 15 },
    { name: 'TCP Connection', startTime: 15, duration: 20 },
    { name: 'TLS Negotiation', startTime: 35, duration: 30 },
    { name: 'TTFB', startTime: 65, duration: 120 },
    { name: 'Download', startTime: 185, duration: 80 },
    { name: 'DOM Processing', startTime: 265, duration: 150 },
    { name: 'Render', startTime: 415, duration: 85 },
  ];

  // Mock network requests for the dialog
  const mockNetworkRequests = [
    { url: 'https://example.com/api/data', type: 'XHR', size: '15.4 KB', time: '120 ms', status: 200 },
    { url: 'https://example.com/styles/main.css', type: 'CSS', size: '32.1 KB', time: '45 ms', status: 200 },
    { url: 'https://example.com/scripts/app.js', type: 'JS', size: '156.7 KB', time: '85 ms', status: 200 },
    { url: 'https://example.com/images/logo.png', type: 'Image', size: '24.3 KB', time: '35 ms', status: 200 },
    { url: 'https://example.com/api/user', type: 'XHR', size: '3.2 KB', time: '95 ms', status: 200 },
    { url: 'https://example.com/fonts/roboto.woff2', type: 'Font', size: '78.5 KB', time: '65 ms', status: 200 },
    { url: 'https://example.com/api/metrics', type: 'XHR', size: '1.8 KB', time: '110 ms', status: 404 },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Avg. Load Time"
            value={`${avgLoadTime.toFixed(2)} ms`}
            subtitle="Page load time"
            color={avgLoadTime > 1000 ? 'error.main' : avgLoadTime > 500 ? 'warning.main' : 'success.main'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Avg. Response Time"
            value={`${avgResponseTime.toFixed(2)} ms`}
            subtitle="API response time"
            color={avgResponseTime > 300 ? 'error.main' : avgResponseTime > 100 ? 'warning.main' : 'success.main'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Avg. CPU Usage"
            value={`${avgCpuUsage.toFixed(2)}%`}
            subtitle="During test execution"
            color={avgCpuUsage > 80 ? 'error.main' : avgCpuUsage > 50 ? 'warning.main' : 'success.main'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Avg. Memory Usage"
            value={`${avgMemoryUsage.toFixed(2)} MB`}
            subtitle="During test execution"
            color={avgMemoryUsage > 500 ? 'error.main' : avgMemoryUsage > 300 ? 'warning.main' : 'success.main'}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Load Time Trend"
            options={loadTimeData.options}
            series={loadTimeData.series}
            type="line"
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Response Time Trend"
            options={responseTimeData.options}
            series={responseTimeData.series}
            type="line"
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Resource Usage"
            options={resourceUsageData.options}
            series={resourceUsageData.series}
            type="area"
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Browser Comparison"
            options={browserComparisonData.options}
            series={browserComparisonData.series}
            type="bar"
            height={300}
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Tests"
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="browser-filter-label">Browser</InputLabel>
                <Select
                  labelId="browser-filter-label"
                  value={browserFilter}
                  label="Browser"
                  onChange={handleBrowserFilterChange}
                >
                  <MenuItem value="all">All Browsers</MenuItem>
                  {browsers.map(browser => (
                    <MenuItem key={browser} value={browser}>{browser}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortByChange}
                >
                  <MenuItem value="timestamp">Date (Newest First)</MenuItem>
                  <MenuItem value="testName">Test Name</MenuItem>
                  <MenuItem value="loadTime">Load Time (Highest First)</MenuItem>
                  <MenuItem value="responseTime">Response Time (Highest First)</MenuItem>
                  <MenuItem value="cpuUsage">CPU Usage (Highest First)</MenuItem>
                  <MenuItem value="memoryUsage">Memory Usage (Highest First)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Metrics Table */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Metrics
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Load Time</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>CPU Usage</TableCell>
                  <TableCell>Memory Usage</TableCell>
                  <TableCell>Network Requests</TableCell>
                  <TableCell>Browser</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedMetrics
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((metric) => (
                    <TableRow 
                      key={metric.id} 
                      hover 
                      onClick={() => handleMetricClick(metric)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{metric.testName}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(metric.status)}
                          label={metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                          size="small"
                          color={getStatusColor(metric.status) as "success" | "error" | "warning" | "default"}
                        />
                      </TableCell>
                      <TableCell>{metric.loadTime} ms</TableCell>
                      <TableCell>{metric.responseTime} ms</TableCell>
                      <TableCell>{metric.cpuUsage}%</TableCell>
                      <TableCell>{metric.memoryUsage} MB</TableCell>
                      <TableCell>{metric.networkRequests}</TableCell>
                      <TableCell>{metric.browser}</TableCell>
                      <TableCell>{metric.device}</TableCell>
                      <TableCell>{metric.timestamp}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMetricClick(metric);
                          }}
                        >
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredMetrics.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No performance metrics found matching your filters.
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
            count={filteredMetrics.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Metric Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Performance Details: {selectedMetric?.testName}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMetric && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <SpeedIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Load Time</Typography>
                      <Typography variant="h5" color={
                        selectedMetric.loadTime > 1000 ? 'error.main' : 
                        selectedMetric.loadTime > 500 ? 'warning.main' : 
                        'success.main'
                      }>
                        {selectedMetric.loadTime} ms
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <MemoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">CPU Usage</Typography>
                      <Typography variant="h5" color={
                        selectedMetric.cpuUsage > 80 ? 'error.main' : 
                        selectedMetric.cpuUsage > 50 ? 'warning.main' : 
                        'success.main'
                      }>
                        {selectedMetric.cpuUsage}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <StorageIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Memory Usage</Typography>
                      <Typography variant="h5" color={
                        selectedMetric.memoryUsage > 500 ? 'error.main' : 
                        selectedMetric.memoryUsage > 300 ? 'warning.main' : 
                        'success.main'
                      }>
                        {selectedMetric.memoryUsage} MB
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Tabs
                value={detailTabValue}
                onChange={handleDetailTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab label="Waterfall" />
                <Tab label="Network" />
                <Tab label="Resources" />
              </Tabs>

              {detailTabValue === 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Page Load Waterfall</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Phase</TableCell>
                          <TableCell>Time (ms)</TableCell>
                          <TableCell>Timeline</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockWaterfallData.map((phase) => (
                          <TableRow key={phase.name}>
                            <TableCell>{phase.name}</TableCell>
                            <TableCell>{phase.duration} ms</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Box sx={{ 
                                  width: `${phase.startTime / 5}%`, 
                                  height: 20, 
                                  bgcolor: 'transparent' 
                                }} />
                                <Tooltip title={`${phase.duration} ms`}>
                                  <Box sx={{ 
                                    width: `${phase.duration / 5}%`, 
                                    height: 20, 
                                    bgcolor: 'primary.main',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.75rem'
                                  }}>
                                    {phase.duration > 30 ? `${phase.duration} ms` : ''}
                                  </Box>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} align="right">
                            <Typography variant="subtitle2">Total:</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {mockWaterfallData.reduce((sum, phase) => sum + phase.duration, 0)} ms
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {detailTabValue === 1 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Network Requests</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>URL</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockNetworkRequests.map((request, index) => (
                          <TableRow key={index}>
                            <TableCell>{request.url}</TableCell>
                            <TableCell>{request.type}</TableCell>
                            <TableCell>{request.size}</TableCell>
                            <TableCell>{request.time}</TableCell>
                            <TableCell>
                              <Chip
                                label={request.status}
                                size="small"
                                color={request.status >= 400 ? 'error' : 'success'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Summary:</Typography>
                    <Typography variant="body2">
                      Total Requests: {mockNetworkRequests.length} |
                      Total Size: {mockNetworkRequests.reduce((sum, req) => sum + parseFloat(req.size.split(' ')[0]), 0).toFixed(1)} KB |
                      Errors: {mockNetworkRequests.filter(req => req.status >= 400).length}
                    </Typography>
                  </Box>
                </Box>
              )}

              {detailTabValue === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>CPU Usage Over Time</Typography>
                        <Box sx={{ height: 200 }}>
                          {/* Placeholder for CPU chart */}
                          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 8 }}>
                            CPU usage chart would be displayed here
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Memory Usage Over Time</Typography>
                        <Box sx={{ height: 200 }}>
                          {/* Placeholder for Memory chart */}
                          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 8 }}>
                            Memory usage chart would be displayed here
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Resource Breakdown</Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Resource Type</TableCell>
                                <TableCell>Count</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Load Time</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>HTML</TableCell>
                                <TableCell>1</TableCell>
                                <TableCell>25.4 KB</TableCell>
                                <TableCell>120 ms</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>CSS</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell>78.2 KB</TableCell>
                                <TableCell>85 ms</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>JavaScript</TableCell>
                                <TableCell>8</TableCell>
                                <TableCell>456.7 KB</TableCell>
                                <TableCell>230 ms</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Images</TableCell>
                                <TableCell>12</TableCell>
                                <TableCell>345.1 KB</TableCell>
                                <TableCell>180 ms</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Fonts</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>78.5 KB</TableCell>
                                <TableCell>65 ms</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>XHR/Fetch</TableCell>
                                <TableCell>5</TableCell>
                                <TableCell>32.8 KB</TableCell>
                                <TableCell>150 ms</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
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

export default PerformanceTab;
