import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Grid,
  IconButton,
  TextField,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { TestCase, TestStep } from '../../types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface TestCaseStepsTabProps {
  testCase: TestCase;
  editMode: boolean;
  onTestCaseChange: (updatedTestCase: TestCase) => void;
}

const TestCaseStepsTab: React.FC<TestCaseStepsTabProps> = ({
  testCase,
  editMode,
  onTestCaseChange
}) => {
  // Debug: Log test case steps
  console.log('Test case steps:', testCase.steps);
  // Handle drag and drop
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(testCase.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each step
    const updatedSteps = items.map((step, index) => ({
      ...step,
      order: index + 1,
    }));

    onTestCaseChange({
      ...testCase,
      steps: updatedSteps,
    });
  };

  // Add new step
  const handleAddStep = () => {
    const newStep: TestStep = {
      id: `step-${Date.now()}`,
      order: testCase.steps.length + 1,
      action: 'click',
      target: '',
      value: '',
      description: 'Click on element',
      expectedResult: 'Element is clicked',
      type: 'automated'
    };

    onTestCaseChange({
      ...testCase,
      steps: [...testCase.steps, newStep]
    });
  };

  // Delete step
  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = testCase.steps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({
        ...step,
        order: index + 1
      }));

    onTestCaseChange({
      ...testCase,
      steps: updatedSteps
    });
  };

  // Update step
  const handleUpdateStep = (stepId: string, field: string, value: any) => {
    const updatedSteps = testCase.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          [field]: value
        };
      }
      return step;
    });

    onTestCaseChange({
      ...testCase,
      steps: updatedSteps
    });
  };

  // Get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case 'click': return 'primary';
      case 'type': return 'secondary';
      case 'wait': return 'default';
      case 'assert': return 'success';
      case 'navigate': return 'info';
      default: return 'default';
    }
  };

  return (
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
              onClick={handleAddStep}
            >
              Add Step
            </Button>
          )}
        </Box>

        {testCase.steps.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No test steps defined yet.
            </Typography>
            {editMode && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                onClick={handleAddStep}
              >
                Add First Step
              </Button>
            )}
          </Box>
        ) : (
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

                              <Grid item xs={editMode ? 10 : 11}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mr: 1 }}>
                                    Step {step.order}:
                                  </Typography>
                                  {editMode ? (
                                    <TextField
                                      size="small"
                                      value={step.description}
                                      onChange={(e) => handleUpdateStep(step.id, 'description', e.target.value)}
                                      fullWidth
                                      placeholder="Step description"
                                    />
                                  ) : (
                                    <>
                                      <Typography variant="body1">
                                        {step.description || `Perform action: ${step.action || 'undefined'}`}
                                      </Typography>
                                      {step.action && (
                                        <Chip
                                          label={step.action}
                                          size="small"
                                          color={getActionColor(step.action)}
                                          sx={{ ml: 1 }}
                                        />
                                      )}
                                      {!step.action && (
                                        <Chip
                                          label="No action defined"
                                          size="small"
                                          color="default"
                                          sx={{ ml: 1 }}
                                        />
                                      )}
                                    </>
                                  )}
                                </Box>

                                {editMode ? (
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        select
                                        label="Action"
                                        size="small"
                                        fullWidth
                                        value={step.action}
                                        onChange={(e) => handleUpdateStep(step.id, 'action', e.target.value)}
                                        SelectProps={{
                                          native: true,
                                        }}
                                      >
                                        {['click', 'type', 'wait', 'assert', 'navigate', 'hover', 'scroll', 'drag', 'upload', 'custom'].map((option) => (
                                          <option key={option} value={option}>
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                          </option>
                                        ))}
                                      </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        label="Target"
                                        size="small"
                                        fullWidth
                                        value={step.target}
                                        onChange={(e) => handleUpdateStep(step.id, 'target', e.target.value)}
                                        placeholder="CSS Selector, XPath, etc."
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        label="Value"
                                        size="small"
                                        fullWidth
                                        value={step.value || ''}
                                        onChange={(e) => handleUpdateStep(step.id, 'value', e.target.value)}
                                        placeholder="Input value, if needed"
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <TextField
                                        label="Expected Result"
                                        size="small"
                                        fullWidth
                                        value={step.expectedResult || ''}
                                        onChange={(e) => handleUpdateStep(step.id, 'expectedResult', e.target.value)}
                                        placeholder="What should happen after this step"
                                      />
                                    </Grid>
                                  </Grid>
                                ) : (
                                  <>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                                        Target:
                                      </Typography>
                                      <Typography variant="body2">
                                        {step.target || 'N/A'}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                                        Value:
                                      </Typography>
                                      <Typography variant="body2">
                                        {step.value || 'N/A'}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex' }}>
                                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                                        Expected:
                                      </Typography>
                                      <Typography variant="body2">
                                        {step.expectedResult || 'N/A'}
                                      </Typography>
                                    </Box>
                                  </>
                                )}
                              </Grid>

                              {editMode && (
                                <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteStep(step.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                              )}
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
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseStepsTab;
