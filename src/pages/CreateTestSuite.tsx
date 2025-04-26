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

// Mock test cases data
const MOCK_TEST_CASES: TestCase[] = Array.from({ length: 20 }).map((_, index) => ({
  id: `tc-${index + 1}`,
  title: `Test Case ${index + 1}: ${[
    'User Login',
    'Product Search',
    'Checkout Process',
    'Account Creation',
    'Password Reset',
    'Order History',
    'Payment Processing',
    'Item Filtering',
    'Admin Dashboard',
    'User Profile',
  ][index % 10]}`,
  description: `Description for test case ${index + 1}. This test verifies ${[
    'user authentication functionality',
    'product search results accuracy',
    'the complete checkout process',
    'new account creation workflow',
    'the password reset functionality',
    'customer order history display',
    'credit card transaction processing',
    'product filtering and sorting',
    'admin dashboard functionality',
    'user profile update process',
  ][index % 10]}.`,
  status: ['active', 'draft', 'archived'][Math.floor(Math.random() * 3)] as 'active' | 'draft' | 'archived',
  priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
  createdBy: '1',
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  steps: Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, i) => ({
    id: `step-${index}-${i}`,
    order: i + 1,
    description: `Step ${i + 1} description`,
    expectedResult: `Expected result for step ${i + 1}`,
    type: Math.random() > 0.5 ? 'manual' : 'automated',
  })),
  tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
    (_, i) => ['regression', 'smoke', 'integration', 'api', 'ui', 'performance', 'security'][Math.floor(Math.random() * 7)]
  ),
  projectId: '1',
}));

// Mock team members
const TEAM_MEMBERS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' },
  { id: '5', name: 'Robert Brown' },
];

const CreateTestSuite: React.FC = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    assignee: '',
    environment: 'staging',
  });
  
  // Selected test cases
  const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);
  const [availableTestCases, setAvailableTestCases] = useState<TestCase[]>(MOCK_TEST_CASES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter available test cases based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = MOCK_TEST_CASES.filter(
        testCase => 
          testCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testCase.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testCase.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setAvailableTestCases(filtered);
    } else {
      setAvailableTestCases(MOCK_TEST_CASES);
    }
  }, [searchQuery]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
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
                        {TEAM_MEMBERS.map(member => (
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
    </Box>
  );
};

export default CreateTestSuite;
