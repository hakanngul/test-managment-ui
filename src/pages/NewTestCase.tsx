import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Stack, Button, SelectChangeEvent } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { TestCase, TestStep } from '../types';
import api from '../services/api';
import {
  PageHeader,
  BasicInformationForm,
  TestStepsSection,
  DiscardChangesDialog,
  LoadingIndicator,
  ErrorDisplay,
} from '../components/testCase';

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
      // Eğer steps alanı doğrudan güncelleniyorsa (TestStepForm'dan)
      if (name === 'steps') {
        setFormData({
          ...formData,
          steps: value as TestStep[]
        });
        setUnsavedChanges(true);
      } else {
        // Normal adım alanı güncellemesi
        setCurrentStep({
          ...currentStep,
          [name]: value,
        });
      }
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const testCaseData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin', // Varsayılan kullanıcı
        status: formData.status || 'draft',
        priority: formData.priority || 'medium',
        tags: formData.tags || [],
        steps: formData.steps || []
      };

      // Send data to API
      const response = await api.createTestCase(testCaseData);
      console.log('Test case created successfully:', response);

      // Navigate back to test cases list
      navigate('/test-cases');
    } catch (error) {
      console.error('Error creating test case:', error);
      setApiError('Test case oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
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
      <PageHeader
        title="Create New Test Case"
        onCancel={handleCancel}
        onSave={handleSubmit}
      />

      {loading && <LoadingIndicator />}

      {apiError && <ErrorDisplay message={apiError} />}

      {!loading && !apiError && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <BasicInformationForm
                formData={formData}
                errors={errors}
                availableTags={availableTags}
                loading={loading}
                onChange={handleChange}
                onTagsChange={handleTagsChange}
              />
            </Grid>

            {/* Test Steps */}
            <Grid item xs={12}>
              <TestStepsSection
                steps={formData.steps || []}
                currentStep={currentStep}
                availableActions={availableActions}
                errors={errors}
                onStepChange={handleStepChange}
                onAddStep={handleAddStep}
                onRemoveStep={handleRemoveStep}
              />
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

      <DiscardChangesDialog
        open={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        onDiscard={handleDiscardChanges}
      />
    </Box>
  );
};

export default NewTestCase;
