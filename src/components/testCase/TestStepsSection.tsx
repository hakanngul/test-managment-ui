import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormHelperText,
} from '@mui/material';
import { TestStep } from '../../types';
import TestStepsList from './TestStepsList';
import AddTestStepForm from './AddTestStepForm';

interface TestStepsSectionProps {
  steps: TestStep[];
  currentStep: Partial<TestStep>;
  availableActions: string[];
  errors: Record<string, string>;
  onStepChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  onAddStep: () => void;
  onRemoveStep: (stepId: string) => void;
}

const TestStepsSection: React.FC<TestStepsSectionProps> = ({
  steps,
  currentStep,
  availableActions,
  errors,
  onStepChange,
  onAddStep,
  onRemoveStep,
}) => {
  return (
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
        <TestStepsList steps={steps} onRemoveStep={onRemoveStep} />

        {/* Add New Step */}
        <AddTestStepForm
          currentStep={currentStep}
          availableActions={availableActions}
          errors={errors}
          onStepChange={onStepChange}
          onAddStep={onAddStep}
        />
      </CardContent>
    </Card>
  );
};

export default TestStepsSection;
