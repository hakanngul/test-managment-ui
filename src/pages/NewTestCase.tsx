import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper,
  Divider,
  FormHelperText,
  Autocomplete,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { TestCase, TestStep } from '../types';
import api from '../services/api';

const NewTestCase: React.FC = () => {
  const navigate = useNavigate();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // API data state
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<TestCase>>({
    title: '',
    description: '',
    status: 'draft',
    priority: 'medium',
    steps: [],
    tags: [],
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step editing state
  const [currentStep, setCurrentStep] = useState<Partial<TestStep>>({
    order: 1,
    action: 'click',
    target: '',
    value: '',
    description: '',
    expectedResult: '',
    type: 'manual',
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tagsResponse, actionsResponse] = await Promise.all([
          api.getAvailableTags(),
          api.getAvailableActions()
        ]);

        setAvailableTags(tagsResponse);
        setAvailableActions(actionsResponse);
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

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
      setUnsavedChanges(true);

      // Clear error when field is updated
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: '',
        });
      }
    }
  };

  // Handle tag changes
  const handleTagsChange = (_event: React.SyntheticEvent, newValue: string[]) => {
    setFormData({
      ...formData,
      tags: newValue,
    });
    setUnsavedChanges(true);
  };

  // Handle step field changes
  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentStep({
        ...currentStep,
        [name]: value,
      });
    }
  };

  // Add a new step
  const handleAddStep = () => {
    if (!currentStep.target || !currentStep.expectedResult) {
      setErrors({
        ...errors,
        stepTarget: !currentStep.target ? 'Target is required' : '',
        stepExpectedResult: !currentStep.expectedResult ? 'Expected result is required' : '',
      });
      return;
    }

    const newStep: TestStep = {
      id: `step-${Date.now()}`,
      order: formData.steps?.length ? formData.steps.length + 1 : 1,
      action: currentStep.action as 'click' | 'type' | 'wait' | 'select' | 'assert' | 'navigate' | 'hover' | 'scroll' | 'drag' | 'upload' | 'custom',
      target: currentStep.target || '',
      value: currentStep.value || '',
      description: currentStep.description || '',
      expectedResult: currentStep.expectedResult || '',
      type: currentStep.type as 'manual' | 'automated',
    };

    setFormData({
      ...formData,
      steps: [...(formData.steps || []), newStep],
    });

    // Reset current step
    setCurrentStep({
      order: (formData.steps?.length || 0) + 2,
      action: 'click',
      target: '',
      value: '',
      description: '',
      expectedResult: '',
      type: 'manual',
    });

    // Clear step errors
    setErrors({
      ...errors,
      stepTarget: '',
      stepExpectedResult: '',
    });

    setUnsavedChanges(true);
  };

  // Remove a step
  const handleRemoveStep = (stepId: string) => {
    const updatedSteps = formData.steps?.filter(step => step.id !== stepId) || [];

    // Reorder remaining steps
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));

    setFormData({
      ...formData,
      steps: reorderedSteps,
    });

    setUnsavedChanges(true);
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (!formData.steps || formData.steps.length === 0) {
      newErrors.steps = 'At least one step is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real application, you would send the data to an API
    console.log('Submitting test case:', formData);

    // Mock successful submission
    setTimeout(() => {
      // Navigate back to test cases list
      navigate('/test-cases');
    }, 1000);
  };

  // Handle cancel
  const handleCancel = () => {
    if (unsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      navigate('/test-cases');
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    setShowDiscardDialog(false);
    navigate('/test-cases');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          Create New Test Case
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Save Test Case
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {apiError && (
        <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">{apiError}</Typography>
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
                      name="title"
                      label="Test Case Title"
                      fullWidth
                      required
                      value={formData.title}
                      onChange={handleChange}
                      error={!!errors.title}
                      helperText={errors.title}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Description"
                      fullWidth
                      required
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      error={!!errors.description}
                      helperText={errors.description}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="priority-label">Priority</InputLabel>
                      <Select
                        labelId="priority-label"
                        name="priority"
                        value={formData.priority || 'medium'}
                        label="Priority"
                        onChange={handleChange}
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        name="status"
                        value={formData.status || 'draft'}
                        label="Status"
                        onChange={handleChange}
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="tags"
                      options={availableTags}
                      value={formData.tags || []}
                      onChange={handleTagsChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                          placeholder="Add tags"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            size="small"
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      loading={loading}
                      loadingText="Loading tags..."
                      noOptionsText="No tags available"
                      freeSolo
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Test Steps */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Steps
                </Typography>

                {errors.steps && (
                  <FormHelperText error sx={{ mb: 2 }}>
                    {errors.steps}
                  </FormHelperText>
                )}

                {/* Existing Steps */}
                {formData.steps && formData.steps.length > 0 && (
                  <Paper variant="outlined" sx={{ mb: 3, p: 0 }}>
                    {formData.steps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <Box sx={{ p: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} display="flex" alignItems="center">
                              <DragIndicatorIcon sx={{ color: 'text.secondary', mr: 1 }} />
                              <Typography variant="subtitle1" fontWeight="medium">
                                Step {step.order}
                              </Typography>
                              <Box sx={{ flexGrow: 1 }} />
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveStep(step.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                Action:
                              </Typography>
                              <Chip
                                label={step.action.charAt(0).toUpperCase() + step.action.slice(1)}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                Target:
                              </Typography>
                              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                {step.target}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">
                                Value:
                              </Typography>
                              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                {step.value || '-'}
                              </Typography>
                            </Grid>
                            {step.description && (
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                  Description:
                                </Typography>
                                <Typography variant="body1" paragraph>
                                  {step.description}
                                </Typography>
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                Expected Result:
                              </Typography>
                              <Typography variant="body1">
                                {step.expectedResult}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Chip
                                label={step.type === 'manual' ? 'Manual' : 'Automated'}
                                size="small"
                                color={step.type === 'manual' ? 'default' : 'primary'}
                                variant="outlined"
                              />
                            </Grid>
                          </Grid>
                        </Box>
                        {index < (formData.steps?.length || 0) - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </Paper>
                )}

                {/* Add New Step */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Add New Step
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="step-action-label">Action</InputLabel>
                        <Select
                          labelId="step-action-label"
                          name="action"
                          value={currentStep.action || 'click'}
                          label="Action"
                          onChange={handleStepChange}
                        >
                          {availableActions.map((action) => (
                            <MenuItem key={action} value={action}>
                              {action.charAt(0).toUpperCase() + action.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="target"
                        label="Target"
                        fullWidth
                        required
                        value={currentStep.target}
                        onChange={handleStepChange}
                        error={!!errors.stepTarget}
                        helperText={errors.stepTarget}
                        placeholder="CSS Selector, XPath, or element ID"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="value"
                        label="Value"
                        fullWidth
                        value={currentStep.value}
                        onChange={handleStepChange}
                        placeholder="Value to use with the action (if needed)"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="step-type-label">Step Type</InputLabel>
                        <Select
                          labelId="step-type-label"
                          name="type"
                          value={currentStep.type || 'manual'}
                          label="Step Type"
                          onChange={handleStepChange}
                        >
                          <MenuItem value="manual">Manual</MenuItem>
                          <MenuItem value="automated">Automated</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="description"
                        label="Step Description"
                        fullWidth
                        multiline
                        rows={2}
                        value={currentStep.description}
                        onChange={handleStepChange}
                        placeholder="Additional details about this step (optional)"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="expectedResult"
                        label="Expected Result"
                        fullWidth
                        required
                        multiline
                        rows={2}
                        value={currentStep.expectedResult}
                        onChange={handleStepChange}
                        error={!!errors.stepExpectedResult}
                        helperText={errors.stepExpectedResult}
                        placeholder="Describe what should happen after the action is taken"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddStep}
                      >
                        Add Step
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<SaveIcon />}
              >
                Save Test Case
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
      )}

      {/* Discard Changes Dialog */}
      <Dialog
        open={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to discard them?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiscardDialog(false)}>Cancel</Button>
          <Button onClick={handleDiscardChanges} color="error">Discard</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewTestCase;
