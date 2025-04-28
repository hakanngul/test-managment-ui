import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import { TestStep, TestStepActionType } from '../types';
import TestStepsList from './TestStepsList';
import TestStepDialog from './TestStepDialog';

interface TestStepsEditorProps {
  steps: TestStep[];
  onChange: (steps: TestStep[]) => void;
}

const TestStepsEditor: React.FC<TestStepsEditorProps> = ({ steps, onChange }) => {
  const [editingStep, setEditingStep] = useState<TestStep | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Yeni adım için varsayılan değerler
  const defaultStep: TestStep = {
    id: '',
    action: TestStepActionType.NAVIGATE,
    description: '',
    selector: '',
    value: '',
    order: 0
  };

  // Adım düzenleme modalını aç
  const handleOpenDialog = (step?: TestStep) => {
    if (step) {
      setEditingStep({ ...step });
    } else {
      const newStep = { 
        ...defaultStep, 
        id: `step-${Date.now()}`,
        order: steps.length > 0 ? Math.max(...steps.map(s => s.order)) + 1 : 1
      };
      setEditingStep(newStep);
    }
    setIsDialogOpen(true);
  };

  // Adım düzenleme modalını kapat
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStep(null);
  };

  // Adımı kaydet
  const handleSaveStep = (step: TestStep) => {
    const updatedSteps = step.id && steps.some(s => s.id === step.id)
      ? steps.map(s => s.id === step.id ? step : s)
      : [...steps, step];

    onChange(updatedSteps);
    handleCloseDialog();
  };

  // Adımı sil
  const handleDeleteStep = (id: string) => {
    onChange(steps.filter(step => step.id !== id));
  };

  // Adımı yukarı taşı
  const handleMoveStepUp = (index: number) => {
    if (index === 0) return;
    const updatedSteps = [...steps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index - 1];
    updatedSteps[index - 1] = temp;
    
    // Sıra numaralarını güncelle
    updatedSteps.forEach((step, i) => {
      step.order = i + 1;
    });
    
    onChange(updatedSteps);
  };

  // Adımı aşağı taşı
  const handleMoveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const updatedSteps = [...steps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index + 1];
    updatedSteps[index + 1] = temp;
    
    // Sıra numaralarını güncelle
    updatedSteps.forEach((step, i) => {
      step.order = i + 1;
    });
    
    onChange(updatedSteps);
  };

  // Adımı çoğalt
  const handleDuplicateStep = (step: TestStep) => {
    const newStep = {
      ...step,
      id: `step-${Date.now()}`,
      order: steps.length > 0 ? Math.max(...steps.map(s => s.order)) + 1 : 1,
      description: `${step.description} (Kopya)`
    };
    onChange([...steps, newStep]);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Test Adımları</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Adım Ekle
        </Button>
      </Box>

      <TestStepsList 
        steps={steps}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteStep}
        onDuplicate={handleDuplicateStep}
        onMoveUp={handleMoveStepUp}
        onMoveDown={handleMoveStepDown}
      />

      <TestStepDialog 
        open={isDialogOpen}
        step={editingStep}
        onClose={handleCloseDialog}
        onSave={handleSaveStep}
      />
    </Box>
  );
};

export { TestStepActionType };
export type { TestStep };
export default TestStepsEditor;
