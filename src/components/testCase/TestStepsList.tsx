import React from 'react';
import {
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { TestStep } from '../../types';

interface TestStepsListProps {
  steps: TestStep[];
  onRemoveStep: (stepId: string) => void;
}

const TestStepsList: React.FC<TestStepsListProps> = ({ steps, onRemoveStep }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ mb: 3, p: 0 }}>
      {steps.map((step, index) => (
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
                  onClick={() => onRemoveStep(step.id)}
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
          {index < steps.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Paper>
  );
};

export default TestStepsList;
