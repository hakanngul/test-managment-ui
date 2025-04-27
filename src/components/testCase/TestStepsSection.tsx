import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormHelperText,
} from '@mui/material';
import { TestStep } from '../../types';
import TestStepForm from './TestStepForm';
import { TestStep as ModelTestStep } from '../../models/TestStep';

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
  const [modelSteps, setModelSteps] = useState<ModelTestStep[]>([]);

  // Convert TestStep[] to ModelTestStep[]
  const convertToModelSteps = (steps: TestStep[]): ModelTestStep[] => {
    return steps.map((step, index) => ({
      id: step.id,
      order: step.order,
      action: step.action as any,
      target: step.target,
      targetType: 'cssSelector' as any,
      value: step.value,
      description: step.description,
      expectedResult: step.expectedResult,
      isManual: step.type === 'manual',
      screenshot: false
    }));
  };

  // Convert ModelTestStep[] to TestStep[]
  const convertToTestSteps = (modelSteps: ModelTestStep[]): TestStep[] => {
    return modelSteps.map(step => ({
      id: step.id,
      order: step.order,
      action: step.action as any,
      target: step.target || '',
      value: step.value,
      description: step.description,
      expectedResult: step.expectedResult || '',
      type: step.isManual ? 'manual' : 'automated'
    }));
  };

  // Update modelSteps when steps change
  useEffect(() => {
    setModelSteps(convertToModelSteps(steps));
  }, [steps]);

  // Handle model steps change
  const handleModelStepsChange = (newModelSteps: ModelTestStep[]) => {
    setModelSteps(newModelSteps);

    // Convert model steps to regular steps
    const newSteps = convertToTestSteps(newModelSteps);

    // Doğrudan formData'yı güncellemek için bir event oluşturalım
    // Bu, NewTestCase.tsx'deki handleChange fonksiyonunu tetikleyecek
    if (onStepChange) {
      onStepChange({
        target: {
          name: 'steps',
          value: newSteps
        }
      } as any);
    }
  };

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

        <TestStepForm
          steps={modelSteps}
          onChange={handleModelStepsChange}
        />
      </CardContent>
    </Card>
  );
};

export default TestStepsSection;
