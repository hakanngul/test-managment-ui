import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TestStep } from '../../types';

interface AddTestStepFormProps {
  currentStep: Partial<TestStep>;
  availableActions: string[];
  errors: Record<string, string>;
  onStepChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => void;
  onAddStep: () => void;
}

const AddTestStepForm: React.FC<AddTestStepFormProps> = ({
  currentStep,
  availableActions,
  errors,
  onStepChange,
  onAddStep,
}) => {
  return (
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
              onChange={onStepChange}
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
            onChange={onStepChange}
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
            onChange={onStepChange}
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
              onChange={onStepChange}
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
            onChange={onStepChange}
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
            onChange={onStepChange}
            error={!!errors.stepExpectedResult}
            helperText={errors.stepExpectedResult}
            placeholder="Describe what should happen after the action is taken"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddStep}
          >
            Add Step
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddTestStepForm;
