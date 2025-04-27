import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIcon,
  Add as AddIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { TestCase } from '../types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../services_old/api';

const TestCaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Fetch test case data from API
  useEffect(() => {
    const fetchTestCase = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch test case by ID directly from API
        const testCaseData = await api.getTestCaseById(id).catch(error => {
          console.error('Error fetching test case by ID:', error);
          return null;
        });

        if (testCaseData) {
          setTestCase(testCaseData);
          setError(null);
        } else {
          setError(`Test case with ID ${id} not found.`);
          setTestCase(null);
        }
      } catch (err) {
        console.error('Error fetching test case:', err);
        setError('Failed to load test case. Please try again later.');
        setTestCase(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCase();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!testCase) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="warning">Test case not found</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/test-cases')}
        >
          Back to Test Cases
        </Button>
      </Box>
    );
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditToggle = async () => {
    if (editMode && testCase) {
      try {
        // Save changes to the API
        await api.updateTestCase(testCase.id, testCase);

        // Fetch the updated test case
        const updatedTestCase = await api.getTestCaseById(testCase.id);
        setTestCase(updatedTestCase);

        console.log('Test case updated successfully:', updatedTestCase);
      } catch (error) {
        console.error('Error updating test case:', error);
        setError('Failed to update test case. Please try again later.');
      }
    }
    setEditMode(!editMode);
  };

  // Handle delete test case
  const handleDeleteTestCase = async () => {
    if (!testCase) return;

    if (window.confirm(`Are you sure you want to delete the test case "${testCase.title}"?`)) {
      try {
        const response = await api.deleteTestCase(testCase.id);
        console.log('Test case deleted successfully:', response);

        // Başarılı silme işleminden sonra test-cases sayfasına yönlendir
        if (response && response.success) {
          navigate('/test-cases');
        } else {
          // Yanıt başarılı değilse hata göster
          setError('Failed to delete test case. Unexpected response from server.');
        }
      } catch (error) {
        console.error('Error deleting test case:', error);
        setError('Failed to delete test case. Please try again later.');
      }
    }
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
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteTestCase}
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
                Test case created by {testCase.createdBy || 'Admin'}
              </Typography>
            </Paper>
            {testCase.updatedAt && testCase.updatedAt !== testCase.createdAt && (
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
                  Test case updated by {testCase.updatedBy || 'Admin'}
                </Typography>
              </Paper>
            )}
            {testCase.steps && testCase.steps.length > 0 && (
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
                  Test Steps
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {testCase.steps.length} steps defined
                </Typography>
              </Paper>
            )}
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