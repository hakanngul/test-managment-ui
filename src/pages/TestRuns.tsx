import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';

// Mock test suites data based on the image
const MOCK_TEST_SUITES = [
  {
    id: '1',
    name: 'Sprint 23 - Regression',
    dateRange: 'Apr 22, 2023 - Apr 25, 2023',
    status: 'in_progress',
    progress: 65,
    assignee: 'John Doe',
    results: {
      passed: 32,
      failed: 8,
      blocked: 3,
      pending: 9
    }
  },
  {
    id: '2',
    name: 'Sprint 22 - Smoke Test',
    dateRange: 'Apr 15, 2023 - Apr 18, 2023',
    status: 'passed',
    progress: 100,
    assignee: 'Jane Smith',
    results: {
      passed: 45,
      failed: 0,
      blocked: 0,
      pending: 0
    }
  },
  {
    id: '3',
    name: 'Payment Gateway Integration',
    dateRange: 'Apr 10, 2023 - Apr 15, 2023',
    status: 'failed',
    progress: 100,
    assignee: 'Mike Johnson',
    results: {
      passed: 18,
      failed: 12,
      blocked: 5,
      pending: 0
    }
  },
  {
    id: '4',
    name: 'User Profile Features',
    dateRange: 'Apr 5, 2023 - Apr 9, 2023',
    status: 'passed',
    progress: 100,
    assignee: 'Sarah Williams',
    results: {
      passed: 37,
      failed: 2,
      blocked: 1,
      pending: 0
    }
  },
  {
    id: '5',
    name: 'Mobile Compatibility',
    dateRange: 'Apr 26, 2023 - Apr 30, 2023',
    status: 'pending',
    progress: 0,
    assignee: 'Robert Brown',
    results: {
      passed: 0,
      failed: 0,
      blocked: 0,
      pending: 28
    }
  }
];

const TestRuns: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [newRunDialogOpen, setNewRunDialogOpen] = useState(false);
  const [newRunData, setNewRunData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    assignee: '',
  });

  // Filter test suites based on search query
  const filteredTestSuites = MOCK_TEST_SUITES.filter(suite =>
    suite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suite.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle new test run dialog
  const handleOpenNewRunDialog = () => {
    navigate('/test-runs/create');
  };

  const handleCloseNewRunDialog = () => {
    setNewRunDialogOpen(false);
  };

  const handleNewRunChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewRunData({
        ...newRunData,
        [name]: value,
      });
    }
  };

  const handleCreateNewRun = () => {
    console.log('Creating new test run:', newRunData);
    handleCloseNewRunDialog();
  };

  // Helper functions
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'passed':
        return <Chip label="Passed" color="success" size="small" sx={{ fontWeight: 500 }} />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" sx={{ fontWeight: 500 }} />;
      case 'in_progress':
        return <Chip label="In Progress" color="primary" size="small" sx={{ fontWeight: 500 }} />;
      case 'pending':
        return <Chip label="Pending" color="default" size="small" sx={{ fontWeight: 500 }} />;
      default:
        return null;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'passed': return 'success.main';
      case 'failed': return 'error.main';
      case 'blocked': return 'warning.main';
      case 'pending': return 'text.secondary';
      default: return 'text.primary';
    }
  };

  return (
    <Box>
      {/* Header with search and new button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search test suites..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewRunDialog}
          sx={{
            bgcolor: '#0f172a',
            '&:hover': { bgcolor: '#1e293b' },
            borderRadius: '4px',
          }}
        >
          New Test Run
        </Button>
      </Box>

      {/* Test Suite Cards */}
      <Stack spacing={2}>
        {filteredTestSuites.map((suite) => (
          <Card
            key={suite.id}
            sx={{
              borderRadius: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              '&:hover': { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/test-runs/${suite.id}`)}
          >
            <Box sx={{ p: 2 }}>
              {/* Title and expand icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <KeyboardArrowRightIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" fontWeight="500">
                  {suite.name}
                </Typography>
              </Box>

              {/* Date range */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 4 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {suite.dateRange}
                </Typography>
              </Box>

              {/* Status chip */}
              <Box sx={{ ml: 4, mb: 2 }}>
                {getStatusChip(suite.status)}
              </Box>

              {/* Progress section */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Progress
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {suite.progress}%
                </Typography>
              </Box>

              {/* Progress bar */}
              <Box sx={{ mx: 4, mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={suite.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: suite.status === 'failed' ? 'error.main' :
                              suite.status === 'passed' ? 'success.main' : 'primary.main'
                    }
                  }}
                />
              </Box>

              {/* Assignee */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Assignee:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {suite.assignee}
                  </Typography>
                </Box>
              </Box>

              {/* Results grid */}
              <Grid container spacing={2} sx={{ ml: 2 }}>
                <Grid item xs={3}>
                  <Typography variant="h6" color="success.main" align="center">
                    {suite.results.passed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Passed
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" color="error.main" align="center">
                    {suite.results.failed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Failed
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" color="warning.main" align="center">
                    {suite.results.blocked}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Blocked
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" color="text.secondary" align="center">
                    {suite.results.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Pending
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Card>
        ))}
      </Stack>

      {/* New Test Run Dialog */}
      <Dialog
        open={newRunDialogOpen}
        onClose={handleCloseNewRunDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Test Run</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Stack spacing={3}>
              <TextField
                name="name"
                label="Test Run Name"
                fullWidth
                required
                value={newRunData.name}
                onChange={handleNewRunChange}
              />

              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                required
                value={newRunData.startDate}
                onChange={handleNewRunChange}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name="endDate"
                label="End Date"
                type="date"
                fullWidth
                required
                value={newRunData.endDate}
                onChange={handleNewRunChange}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name="assignee"
                label="Assignee"
                fullWidth
                required
                value={newRunData.assignee}
                onChange={handleNewRunChange}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewRunDialog}>Cancel</Button>
          <Button
            onClick={handleCreateNewRun}
            variant="contained"
            color="primary"
            disabled={!newRunData.name || !newRunData.startDate || !newRunData.endDate || !newRunData.assignee}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestRuns;
