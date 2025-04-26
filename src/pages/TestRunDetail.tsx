import React from 'react';
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

const TestRunDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the test run
  const testRun = {
    id,
    name: 'Regression Test Suite',
    status: 'running',
    progress: 65,
    startTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    environment: 'staging',
    browser: 'Chrome',
    device: 'Desktop',
    totalTests: 50,
    passed: 30,
    failed: 3,
    skipped: 2,
    running: 15,
    duration: '30:15',
    triggeredBy: 'John Doe',
    results: [
      {
        id: '1',
        name: 'User Login Test',
        status: 'passed',
        duration: '00:45',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
      },
      {
        id: '2',
        name: 'Product Search',
        status: 'failed',
        duration: '01:15',
        error: 'Expected element to be visible',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
      },
      {
        id: '3',
        name: 'Checkout Process',
        status: 'running',
        timestamp: new Date(Date.now() - 900000).toISOString(),
      },
    ],
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
            Started {formatDate(testRun.startTime)} by {testRun.triggeredBy}
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
                    {testRun.progress}% Complete
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Duration: {testRun.duration}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={testRun.progress} 
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
                {testRun.totalTests}
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
                {testRun.passed}
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
                {testRun.failed}
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
                {testRun.skipped}
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
                      <TableCell>Timestamp</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testRun.results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {result.name}
                          </Typography>
                          {result.error && (
                            <Typography variant="caption" color="error">
                              Error: {result.error}
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
                        <TableCell>{result.duration || '-'}</TableCell>
                        <TableCell>{formatDate(result.timestamp)}</TableCell>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestRunDetail;