import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { TestStep, TestStepActionType, getRequiredFields, getActionDescription, getValueLabel } from '../types';

interface TestStepDialogProps {
  open: boolean;
  step: TestStep | null;
  onClose: () => void;
  onSave: (step: TestStep) => void;
}

const TestStepDialog: React.FC<TestStepDialogProps> = ({ open, step, onClose, onSave }) => {
  const [localStep, setLocalStep] = useState<TestStep | null>(null);

  useEffect(() => {
    if (step) {
      setLocalStep({ ...step });
    }
  }, [step]);

  if (!localStep) return null;

  const isNewStep = !localStep.id || !localStep.id.trim() || localStep.id.startsWith('step-');
  const requiredFields = getRequiredFields(localStep.action);

  const isValid =
    localStep.description.trim() !== '' &&
    (!requiredFields.selector || (localStep.selector && localStep.selector.trim() !== '')) &&
    (!requiredFields.value || (localStep.value && localStep.value.trim() !== ''));

  const handleActionChange = (action: TestStepActionType) => {
    setLocalStep(prev => prev ? { ...prev, action } : null);
  };

  const handleDescriptionChange = (description: string) => {
    setLocalStep(prev => prev ? { ...prev, description } : null);
  };

  const handleSelectorChange = (selector: string) => {
    setLocalStep(prev => prev ? { ...prev, selector } : null);
  };

  const handleValueChange = (value: string) => {
    setLocalStep(prev => prev ? { ...prev, value } : null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isNewStep ? 'Yeni Test Adımı Ekle' : 'Test Adımını Düzenle'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>İşlem Türü</InputLabel>
              <Select
                value={localStep.action}
                label="İşlem Türü"
                onChange={(e) => handleActionChange(e.target.value as TestStepActionType)}
              >
                {Object.values(TestStepActionType).map((action) => (
                  <MenuItem key={action} value={action}>
                    {action}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
              {getActionDescription(localStep.action)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Açıklama"
              value={localStep.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              required
            />
          </Grid>

          {requiredFields.selector && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Seçici (CSS veya XPath)"
                value={localStep.selector || ''}
                onChange={(e) => handleSelectorChange(e.target.value)}
                required
              />
            </Grid>
          )}

          {requiredFields.value && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={getValueLabel(localStep.action)}
                value={localStep.value || ''}
                onChange={(e) => handleValueChange(e.target.value)}
                required
                multiline={localStep.action === TestStepActionType.EXECUTE_JS}
                rows={localStep.action === TestStepActionType.EXECUTE_JS ? 4 : 1}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          onClick={() => onSave(localStep)}
          variant="contained"
          color="primary"
          disabled={!isValid}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestStepDialog;
