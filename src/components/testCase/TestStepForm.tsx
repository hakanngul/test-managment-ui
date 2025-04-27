import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FileCopy as FileCopyIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import {
  TestStep,
  TestStepActionType,
  TestStepTargetType,
  actionLabels,
  targetTypeLabels,
  createNewTestStep,
  actionRequiresTarget,
  actionRequiresValue,
  suggestTargetTypeForAction,
  getValuePlaceholderForAction,
  getTargetPlaceholderForAction
} from '../../models/TestStep';

interface TestStepFormProps {
  steps: TestStep[];
  onChange: (steps: TestStep[]) => void;
}

const TestStepForm: React.FC<TestStepFormProps> = ({ steps, onChange }) => {
  // Adım ekleme
  const handleAddStep = () => {
    const newStep = createNewTestStep(steps.length + 1);
    onChange([...steps, newStep]);
  };

  // Adım silme
  const handleDeleteStep = (stepId: string) => {
    const newSteps = steps.filter(step => step.id !== stepId);
    // Sıralamayı güncelle
    const updatedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    onChange(updatedSteps);
  };

  // Adım kopyalama
  const handleCopyStep = (stepId: string) => {
    const stepToCopy = steps.find(step => step.id === stepId);
    if (stepToCopy) {
      const newStep = {
        ...stepToCopy,
        id: `step-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        order: steps.length + 1
      };
      onChange([...steps, newStep]);
    }
  };

  // Adım taşıma (yukarı)
  const handleMoveStepUp = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex > 0) {
      const newSteps = [...steps];
      const temp = newSteps[stepIndex];
      newSteps[stepIndex] = newSteps[stepIndex - 1];
      newSteps[stepIndex - 1] = temp;
      
      // Sıralamayı güncelle
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        order: index + 1
      }));
      onChange(updatedSteps);
    }
  };

  // Adım taşıma (aşağı)
  const handleMoveStepDown = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex < steps.length - 1) {
      const newSteps = [...steps];
      const temp = newSteps[stepIndex];
      newSteps[stepIndex] = newSteps[stepIndex + 1];
      newSteps[stepIndex + 1] = temp;
      
      // Sıralamayı güncelle
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        order: index + 1
      }));
      onChange(updatedSteps);
    }
  };

  // Adım güncelleme
  const handleStepChange = (stepId: string, field: keyof TestStep, value: any) => {
    const updatedSteps = steps.map(step => {
      if (step.id === stepId) {
        const updatedStep = { ...step, [field]: value };
        
        // Action değiştiğinde, hedef türünü ve değer ipucunu güncelle
        if (field === 'action') {
          updatedStep.targetType = suggestTargetTypeForAction(value as TestStepActionType);
          
          // Eğer action hedef gerektirmiyorsa, hedefi temizle
          if (!actionRequiresTarget(value as TestStepActionType)) {
            updatedStep.target = '';
          }
          
          // Eğer action değer gerektirmiyorsa, değeri temizle
          if (!actionRequiresValue(value as TestStepActionType)) {
            updatedStep.value = '';
          }
        }
        
        return updatedStep;
      }
      return step;
    });
    
    onChange(updatedSteps);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Test Adımları
      </Typography>
      
      {steps.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Henüz test adımı eklenmemiş. Yeni bir adım eklemek için aşağıdaki butonu kullanın.
        </Typography>
      ) : (
        steps.map((step, index) => (
          <Paper 
            key={step.id} 
            elevation={1} 
            sx={{ 
              p: 2, 
              mb: 2, 
              position: 'relative',
              borderLeft: step.isManual ? '4px solid orange' : '4px solid #1976d2'
            }}
          >
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
              <Tooltip title="Yukarı Taşı">
                <span>
                  <IconButton 
                    size="small" 
                    onClick={() => handleMoveStepUp(step.id)}
                    disabled={index === 0}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Tooltip title="Aşağı Taşı">
                <span>
                  <IconButton 
                    size="small" 
                    onClick={() => handleMoveStepDown(step.id)}
                    disabled={index === steps.length - 1}
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Tooltip title="Kopyala">
                <IconButton size="small" onClick={() => handleCopyStep(step.id)}>
                  <FileCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Sil">
                <IconButton size="small" onClick={() => handleDeleteStep(step.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Adım {step.order}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={step.action}
                    label="Action"
                    onChange={(e) => handleStepChange(step.id, 'action', e.target.value)}
                  >
                    {Object.values(TestStepActionType).map((action) => (
                      <MenuItem key={action} value={action}>
                        {actionLabels[action]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {actionRequiresTarget(step.action) && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Hedef Türü</InputLabel>
                      <Select
                        value={step.targetType || TestStepTargetType.CSS_SELECTOR}
                        label="Hedef Türü"
                        onChange={(e) => handleStepChange(step.id, 'targetType', e.target.value)}
                      >
                        {Object.values(TestStepTargetType)
                          .filter(type => type !== TestStepTargetType.NONE || !actionRequiresTarget(step.action))
                          .map((type) => (
                            <MenuItem key={type} value={type}>
                              {targetTypeLabels[type]}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      fullWidth
                      label="Hedef"
                      value={step.target || ''}
                      onChange={(e) => handleStepChange(step.id, 'target', e.target.value)}
                      placeholder={getTargetPlaceholderForAction(step.action)}
                      helperText={
                        step.targetType === TestStepTargetType.CSS_SELECTOR ? 'Örn: #login-button, .form-input' :
                        step.targetType === TestStepTargetType.XPATH ? 'Örn: //button[@id="submit"]' :
                        step.targetType === TestStepTargetType.ID ? 'Örn: username' :
                        ''
                      }
                    />
                  </Grid>
                </>
              )}
              
              {actionRequiresValue(step.action) && (
                <Grid item xs={12} sm={6} md={actionRequiresTarget(step.action) ? 6 : 9}>
                  <TextField
                    fullWidth
                    label="Değer"
                    value={step.value || ''}
                    onChange={(e) => handleStepChange(step.id, 'value', e.target.value)}
                    placeholder={getValuePlaceholderForAction(step.action)}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adım Açıklaması"
                  value={step.description || ''}
                  onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                  placeholder="Bu adımda ne yapıldığını açıklayın"
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Beklenen Sonuç"
                  value={step.expectedResult || ''}
                  onChange={(e) => handleStepChange(step.id, 'expectedResult', e.target.value)}
                  placeholder="Bu adımın beklenen sonucunu açıklayın"
                  multiline
                  rows={2}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={step.screenshot || false}
                      onChange={(e) => handleStepChange(step.id, 'screenshot', e.target.checked)}
                    />
                  }
                  label="Ekran Görüntüsü Al"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={step.isManual || false}
                      onChange={(e) => handleStepChange(step.id, 'isManual', e.target.checked)}
                    />
                  }
                  label="Manuel Test Adımı"
                />
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
      
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddStep}
        sx={{ mt: 2 }}
      >
        Yeni Adım Ekle
      </Button>
    </Box>
  );
};

export default TestStepForm;
