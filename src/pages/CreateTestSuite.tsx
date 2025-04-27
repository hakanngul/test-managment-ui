import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Stack,
  Grid,
  Divider,
  Alert,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { TestCase } from '../types';
import api from '../services_old/api';

const CreateTestSuite: React.FC = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    assignee: '',
    environment: 'staging',
  });

  // API data
  const [teamMembers, setTeamMembers] = useState<Array<{id: string, name: string}>>([]);

  // Selected test cases
  const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);
  const [availableTestCases, setAvailableTestCases] = useState<TestCase[]>([]);
  const [allTestCases, setAllTestCases] = useState<TestCase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [testCasesResponse, teamMembersResponse] = await Promise.all([
          api.getMockTestCases(),
          api.getTeamMembers()
        ]);

        setAllTestCases(testCasesResponse);
        setAvailableTestCases(testCasesResponse);
        setTeamMembers(teamMembersResponse);
        setApiError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter available test cases based on search query
  useEffect(() => {
    if (searchQuery && allTestCases.length > 0) {
      const filtered = allTestCases.filter(
        (testCase: TestCase) =>
          testCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testCase.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testCase.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setAvailableTestCases(filtered);
    } else {
      setAvailableTestCases(allTestCases);
    }
  }, [searchQuery, allTestCases]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle date changes
  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  // Handle test case selection
  const handleTestCaseSelect = (testCase: TestCase) => {
    if (!selectedTestCases.some(tc => tc.id === testCase.id)) {
      setSelectedTestCases([...selectedTestCases, testCase]);
    }
  };

  // Handle test case removal
  const handleTestCaseRemove = (testCaseId: string) => {
    setSelectedTestCases(selectedTestCases.filter(tc => tc.id !== testCaseId));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.name) {
      setFormError('Test Suite name is required');
      return false;
    }

    if (!formData.startDate || !formData.endDate) {
      setFormError('Start and end dates are required');
      return false;
    }

    if (formData.startDate > formData.endDate) {
      setFormError('End date must be after start date');
      return false;
    }

    if (!formData.assignee) {
      setFormError('Assignee is required');
      return false;
    }

    if (selectedTestCases.length === 0) {
      setFormError('At least one test case must be selected');
      return false;
    }

    setFormError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create test suite object
    const testSuite = {
      ...formData,
      testCases: selectedTestCases.map(tc => tc.id),
      createdAt: new Date().toISOString(),
      status: 'pending',
      progress: 0,
    };

    console.log('Creating test suite:', testSuite);

    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true);
      // Navigate to test runs page after 2 seconds
      setTimeout(() => {
        navigate('/test-runs');
      }, 2000);
    }, 1000);
  };

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  if (formSubmitted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Test Suite created successfully!
        </Alert>
        <Typography variant="body1">
          Redirecting to Test Runs page...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          Create Test Suite
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/test-runs')}
        >
          Back to Test Runs
        </Button>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formError}
        </Alert>
      )}

      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {apiError}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && !apiError && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Test Suite Name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Sprint 24 - Regression"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the purpose of this test suite"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Start Date"
                      value={formData.startDate}
                      onChange={(date) => handleDateChange('startDate', date)}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="End Date"
                      value={formData.endDate}
                      onChange={(date) => handleDateChange('endDate', date)}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="assignee-label">Assignee</InputLabel>
                      <Select
                        labelId="assignee-label"
                        name="assignee"
                        value={formData.assignee}
                        label="Assignee"
                        onChange={handleChange}
                      >
                        {teamMembers.map((member) => (
                          <MenuItem key={member.id} value={member.id}>
                            {member.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="environment-label">Environment</InputLabel>
                      <Select
                        labelId="environment-label"
                        name="environment"
                        value={formData.environment}
                        label="Environment"
                        onChange={handleChange}
                      >
                        <MenuItem value="development">Development</MenuItem>
                        <MenuItem value="staging">Staging</MenuItem>
                        <MenuItem value="production">Production</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Test Cases */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Cases
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Test Cases ({selectedTestCases.length})
                  </Typography>
                  {selectedTestCases.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Test Case</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedTestCases.map((testCase) => (
                            <TableRow key={testCase.id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {testCase.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
                                  size="small"
                                  color={getPriorityColor(testCase.priority)}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
                                  size="small"
                                  color={getStatusColor(testCase.status)}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleTestCaseRemove(testCase.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">
                      No test cases selected. Please select test cases from the list below.
                    </Alert>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Available Test Cases
                  </Typography>

                  <TextField
                    placeholder="Search test cases..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />

                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox"></TableCell>
                          <TableCell>Test Case</TableCell>
                          <TableCell>Priority</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Tags</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {availableTestCases.map((testCase) => (
                          <TableRow
                            key={testCase.id}
                            hover
                            onClick={() => handleTestCaseSelect(testCase)}
                            sx={{
                              cursor: 'pointer',
                              bgcolor: selectedTestCases.some(tc => tc.id === testCase.id) ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedTestCases.some(tc => tc.id === testCase.id)}
                                onChange={() => {}}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {testCase.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {testCase.description.substring(0, 100)}
                                {testCase.description.length > 100 ? '...' : ''}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
                                size="small"
                                color={getPriorityColor(testCase.priority)}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
                                size="small"
                                color={getStatusColor(testCase.status)}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {testCase.tags.slice(0, 2).map((tag, index) => (
                                  <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.75rem' }}
                                  />
                                ))}
                                {testCase.tags.length > 2 && (
                                  <Chip
                                    label={`+${testCase.tags.length - 2}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.75rem' }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                startIcon={<SaveIcon />}
              >
                Create Test Suite
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      )}
    </Box>
  );
};

export default CreateTestSuite;
