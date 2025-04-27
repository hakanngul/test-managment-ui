import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormHelperText,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { TestStep } from '../../types';
import TestStepsList from './TestStepsList';
import AddTestStepForm from './AddTestStepForm';
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
  const [tabValue, setTabValue] = useState(0);
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

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1 && modelSteps.length === 0) {
      // İlk kez model tabına geçildiğinde, mevcut adımları dönüştür
      setModelSteps(convertToModelSteps(steps));
    }
    setTabValue(newValue);
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

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Klasik Görünüm" />
            <Tab label="Gelişmiş Model Görünümü" />
          </Tabs>
        </Box>

        {tabValue === 0 ? (
          <>
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
          </>
        ) : (
          <TestStepForm
            steps={modelSteps}
            onChange={(newSteps) => {
              setModelSteps(newSteps);
              // Burada model adımlarını normal adımlara dönüştürme işlemi yapılabilir
              // ve onAddStep, onRemoveStep gibi fonksiyonlar çağrılabilir
              // Şimdilik sadece görüntüleme amaçlı
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TestStepsSection;
