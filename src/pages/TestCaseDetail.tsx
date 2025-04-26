import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Grid,
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  DragIndicator as DragIcon,
  Add as AddIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { TestCase } from '../types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Mock test case data
const MOCK_TEST_CASES: Record<string, TestCase> = {};

// Generate some test cases
Array.from({ length: 50 }).forEach((_, index) => {
  const id = `tc-${index + 1}`;
  MOCK_TEST_CASES[id] = {
    id,
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
    description: `This test verifies ${[
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
    ][index % 10]}. It ensures that all components work as expected and validation logic is properly implemented.`,
    status: ['active', 'draft', 'archived'][Math.floor(Math.random() * 3)] as 'active' | 'draft' | 'archived',
    priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
    createdBy: '1',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    steps: Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map((_, i) => ({
      id: `step-${index}-${i}`,
      order: i + 1,
      description: [
        'Navigate to the login page',
        'Enter email and password',
        'Click the login button',
        'Verify successful login',
        'Navigate to user profile',
        'Update user information',
        'Save changes',
        'Verify updated information is displayed',
        'Attempt to submit form with invalid data',
        'Verify error messages are displayed correctly',
      ][i % 10],
      expectedResult: [
        'Login page is displayed correctly',
        'Input fields accept text correctly',
        'Form is submitted',
        'User is redirected to dashboard',
        'Profile page loads with correct user data',
        'Form accepts changes',
        'Success message is displayed',
        'Updated information appears in the profile',
        'Form submission is prevented',
        'Error messages indicate validation failures',
      ][i % 10],
      type: i % 3 === 0 ? 'automated' : 'manual',
      code: i % 3 === 0 ? 'await page.goto("/login");\nawait page.fill("#email", "test@example.com");\nawait page.fill("#password", "password");\nawait page.click("#login-button");' : undefined,
    })),
    tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
      (_, i) => ['regression', 'smoke', 'integration', 'api', 'ui', 'performance', 'security'][Math.floor(Math.random() * 7)]
    ),
    projectId: '1',
  };
});

const TestCaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState<TestCase | null>(id ? MOCK_TEST_CASES[id] : null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  if (!testCase) {
    return <Typography>Test case not found</Typography>;
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(testCase.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each step
    const updatedSteps = items.map((step, index) => ({
      ...step,
      order: index + 1,
    }));

    setTestCase({
      ...testCase,
      steps: updatedSteps,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="#" onClick={() => navigate('/test-cases')}>
          Test Cases
        </Link>
        <Typography color="text.primary">{testCase.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          {testCase.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CopyIcon />}
          >
            Duplicate
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            variant={editMode ? "contained" : "outlined"}
            color={editMode ? "primary" : "inherit"}
            startIcon={<EditIcon />}
            onClick={handleEditToggle}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayIcon />}
          >
            Run Test
          </Button>
        </Box>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Details" />
        <Tab label="Test Steps" />
        <Tab label="History" />
        <Tab label="Related Issues" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={testCase.description}
                    onChange={(e) => setTestCase({ ...testCase, description: e.target.value })}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {testCase.description}
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {testCase.tags.map((tag, index) => (
                    <Chip 
                      key={index}
                      label={tag}
                      onDelete={editMode ? () => {} : undefined}
                    />
                  ))}
                  {editMode && (
                    <Chip 
                      icon={<AddIcon />}
                      label="Add Tag"
                      variant="outlined"
                      onClick={() => {}}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preconditions
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter preconditions for this test case"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    User must be logged out of the system. Test data must be loaded into the database. The system should be in a clean state with no previous test data.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                {editMode ? (
                  <TextField
                    select
                    fullWidth
                    value={testCase.status}
                    onChange={(e) => setTestCase({ ...testCase, status: e.target.value as any })}
                    variant="outlined"
                    size="small"
                  >
                    {['active', 'draft', 'archived'].map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </TextField>
                ) : (
                  <Chip 
                    label={testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
                    color={getStatusColor(testCase.status)}
                  />
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Priority
                </Typography>
                {editMode ? (
                  <TextField
                    select
                    fullWidth
                    value={testCase.priority}
                    onChange={(e) => setTestCase({ ...testCase, priority: e.target.value as any })}
                    variant="outlined"
                    size="small"
                  >
                    {['low', 'medium', 'high', 'critical'].map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </TextField>
                ) : (
                  <Chip 
                    label={testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
                    color={getPriorityColor(testCase.priority)}
                  />
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created By
                </Typography>
                <Typography variant="body2">
                  John Doe
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body2">
                  {formatDate(testCase.createdAt)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {formatDate(testCase.updatedAt)}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Test Runs
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Total Executions</Typography>
                  <Typography variant="body2" fontWeight="medium">12</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Pass Rate</Typography>
                  <Typography variant="body2" fontWeight="medium" color="success.main">83%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Last Execution</Typography>
                  <Typography variant="body2" fontWeight="medium">2 days ago</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="small" 
                  sx={{ mt: 1 }}
                  onClick={() => navigate('/test-runs')}
                >
                  View Test Runs
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Test Steps
              </Typography>
              {editMode && (
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  size="small"
                >
                  Add Step
                </Button>
              )}
            </Box>
            
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="steps">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {testCase.steps.map((step, index) => (
                      <Draggable
                        key={step.id}
                        draggableId={step.id}
                        index={index}
                        isDragDisabled={!editMode}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <Paper 
                              elevation={1} 
                              sx={{ 
                                mb: 2, 
                                p: 2, 
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <Grid container spacing={2}>
                                {editMode && (
                                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div {...provided.dragHandleProps}>
                                      <DragIcon color="action" />
                                    </div>
                                  </Grid>
                                )}
                                
                                <Grid item xs={editMode ? 11 : 12}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="subtitle1" fontWeight="medium">
                                        Step {step.order}
                                      </Typography>
                                      <Chip
                                        label={step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                                        size="small"
                                        color={step.type === 'automated' ? 'primary' : 'default'}
                                        sx={{ ml: 2 }}
                                      />
                                    </Box>
                                    {editMode && (
                                      <Box>
                                        <IconButton size="small">
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    )}
                                  </Box>
                                  
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Description
                                      </Typography>
                                      {editMode ? (
                                        <TextField
                                          fullWidth
                                          multiline
                                          rows={2}
                                          value={step.description}
                                          placeholder="What to do in this step"
                                          variant="outlined"
                                          size="small"
                                        />
                                      ) : (
                                        <Typography variant="body2">
                                          {step.description}
                                        </Typography>
                                      )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Expected Result
                                      </Typography>
                                      {editMode ? (
                                        <TextField
                                          fullWidth
                                          multiline
                                          rows={2}
                                          value={step.expectedResult}
                                          placeholder="What should happen as a result"
                                          variant="outlined"
                                          size="small"
                                        />
                                      ) : (
                                        <Typography variant="body2">
                                          {step.expectedResult}
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                  
                                  {step.type === 'automated' && (
                                    <Box sx={{ mt: 2 }}>
                                      <Accordion elevation={0} sx={{ bgcolor: 'grey.50' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CodeIcon fontSize="small" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle2">
                                              Automation Code
                                            </Typography>
                                          </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          {editMode ? (
                                            <TextField
                                              fullWidth
                                              multiline
                                              rows={4}
                                              value={step.code}
                                              variant="outlined"
                                              size="small"
                                              sx={{ fontFamily: 'monospace' }}
                                            />
                                          ) : (
                                            <Box 
                                              sx={{ 
                                                bgcolor: 'grey.900', 
                                                color: 'grey.100',
                                                p: 2,
                                                borderRadius: 1,
                                                fontFamily: 'monospace',
                                                fontSize: '0.875rem',
                                                whiteSpace: 'pre-wrap',
                                                overflowX: 'auto',
                                              }}
                                            >
                                              {step.code}
                                            </Box>
                                          )}
                                        </AccordionDetails>
                                      </Accordion>
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                            </Paper>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Case History
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2,
              }}
            >
              <Typography variant="subtitle2">
                Created on {formatDate(testCase.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Test case created by John Doe
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2,
              }}
            >
              <Typography variant="subtitle2">
                Updated on {formatDate(testCase.updatedAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description updated by Jane Smith
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2">
                Updated on {new Date(new Date(testCase.updatedAt).getTime() - 3600000).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Test steps reordered by John Doe
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}

      {tabValue === 3 && (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Related Issues
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                size="small"
              >
                Link Issue
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No issues are linked to this test case.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Link an Issue
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TestCaseDetail;