import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ContentCopy as DuplicateIcon
} from '@mui/icons-material';

// Test adımı türleri
export enum TestStepActionType {
  NAVIGATE = 'navigate',
  CLICK = 'click',
  TYPE = 'type',
  WAIT = 'wait',
  TAKE_SCREENSHOT = 'takeScreenshot',
  ASSERT_TEXT = 'assertText',
  ASSERT_ELEMENT = 'assertElement',
  ASSERT_URL = 'assertUrl',
  HOVER = 'hover',
  SELECT = 'select',
  CHECK = 'check',
  UNCHECK = 'uncheck',
  PRESS_KEY = 'pressKey',
  SCROLL = 'scroll',
  EXECUTE_JS = 'executeJs',
  CLEAR = 'clear',
  FOCUS = 'focus',
  BLUR = 'blur',
  DRAG_AND_DROP = 'dragAndDrop',
  UPLOAD_FILE = 'uploadFile',
  REFRESH = 'refresh',
  BACK = 'back',
  FORWARD = 'forward'
}

// Test adımı arayüzü
export interface TestStep {
  id: string;
  action: TestStepActionType;
  description: string;
  selector?: string;
  value?: string;
  order: number;
}

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
  const handleSaveStep = () => {
    if (!editingStep) return;

    const updatedSteps = editingStep.id && steps.some(s => s.id === editingStep.id)
      ? steps.map(s => s.id === editingStep.id ? editingStep : s)
      : [...steps, editingStep];

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

  // Adım türüne göre gerekli alanları belirle
  const getRequiredFields = (action: TestStepActionType): { selector: boolean; value: boolean } => {
    switch (action) {
      case TestStepActionType.NAVIGATE:
        return { selector: false, value: true };
      case TestStepActionType.CLICK:
      case TestStepActionType.HOVER:
      case TestStepActionType.ASSERT_ELEMENT:
      case TestStepActionType.FOCUS:
      case TestStepActionType.BLUR:
      case TestStepActionType.CHECK:
      case TestStepActionType.UNCHECK:
        return { selector: true, value: false };
      case TestStepActionType.TYPE:
      case TestStepActionType.ASSERT_TEXT:
      case TestStepActionType.SELECT:
        return { selector: true, value: true };
      case TestStepActionType.WAIT:
      case TestStepActionType.PRESS_KEY:
      case TestStepActionType.EXECUTE_JS:
        return { selector: false, value: true };
      case TestStepActionType.TAKE_SCREENSHOT:
        return { selector: false, value: true };
      case TestStepActionType.ASSERT_URL:
        return { selector: false, value: true };
      case TestStepActionType.DRAG_AND_DROP:
        return { selector: true, value: true }; // value alanı hedef seçici olarak kullanılır
      case TestStepActionType.UPLOAD_FILE:
        return { selector: true, value: true }; // value alanı dosya yolu olarak kullanılır
      case TestStepActionType.SCROLL:
        return { selector: true, value: true }; // value alanı kaydırma miktarı olarak kullanılır
      case TestStepActionType.REFRESH:
      case TestStepActionType.BACK:
      case TestStepActionType.FORWARD:
      case TestStepActionType.CLEAR:
        return { selector: false, value: false };
      default:
        return { selector: false, value: false };
    }
  };

  // Adım türüne göre açıklama metni
  const getActionDescription = (action: TestStepActionType): string => {
    switch (action) {
      case TestStepActionType.NAVIGATE: return 'Belirtilen URL\'ye git';
      case TestStepActionType.CLICK: return 'Belirtilen elemana tıkla';
      case TestStepActionType.TYPE: return 'Belirtilen elemana metin yaz';
      case TestStepActionType.WAIT: return 'Belirtilen süre kadar bekle (ms)';
      case TestStepActionType.TAKE_SCREENSHOT: return 'Ekran görüntüsü al';
      case TestStepActionType.ASSERT_TEXT: return 'Belirtilen elemanda metin olduğunu doğrula';
      case TestStepActionType.ASSERT_ELEMENT: return 'Belirtilen elemanın varlığını doğrula';
      case TestStepActionType.ASSERT_URL: return 'Mevcut URL\'yi doğrula';
      case TestStepActionType.HOVER: return 'Belirtilen elemanın üzerine gel';
      case TestStepActionType.SELECT: return 'Belirtilen select elemanından değer seç';
      case TestStepActionType.CHECK: return 'Belirtilen checkbox\'ı işaretle';
      case TestStepActionType.UNCHECK: return 'Belirtilen checkbox\'ın işaretini kaldır';
      case TestStepActionType.PRESS_KEY: return 'Belirtilen tuşa bas';
      case TestStepActionType.SCROLL: return 'Sayfayı veya elemanı kaydır';
      case TestStepActionType.EXECUTE_JS: return 'JavaScript kodu çalıştır';
      case TestStepActionType.CLEAR: return 'Belirtilen elemanın içeriğini temizle';
      case TestStepActionType.FOCUS: return 'Belirtilen elemana odaklan';
      case TestStepActionType.BLUR: return 'Belirtilen elemandan odağı kaldır';
      case TestStepActionType.DRAG_AND_DROP: return 'Belirtilen elemanı sürükle ve bırak';
      case TestStepActionType.UPLOAD_FILE: return 'Belirtilen elemana dosya yükle';
      case TestStepActionType.REFRESH: return 'Sayfayı yenile';
      case TestStepActionType.BACK: return 'Tarayıcıda geri git';
      case TestStepActionType.FORWARD: return 'Tarayıcıda ileri git';
      default: return '';
    }
  };

  // Adım türüne göre değer alanı etiketi
  const getValueLabel = (action: TestStepActionType): string => {
    switch (action) {
      case TestStepActionType.NAVIGATE: return 'URL';
      case TestStepActionType.TYPE: return 'Metin';
      case TestStepActionType.WAIT: return 'Süre (ms)';
      case TestStepActionType.TAKE_SCREENSHOT: return 'Dosya Adı';
      case TestStepActionType.ASSERT_TEXT: return 'Beklenen Metin';
      case TestStepActionType.ASSERT_URL: return 'Beklenen URL';
      case TestStepActionType.SELECT: return 'Seçilecek Değer';
      case TestStepActionType.PRESS_KEY: return 'Tuş';
      case TestStepActionType.EXECUTE_JS: return 'JavaScript Kodu';
      case TestStepActionType.DRAG_AND_DROP: return 'Hedef Seçici';
      case TestStepActionType.UPLOAD_FILE: return 'Dosya Yolu';
      case TestStepActionType.SCROLL: return 'Kaydırma Miktarı';
      default: return 'Değer';
    }
  };

  // Adımları sırala
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%">Sıra</TableCell>
              <TableCell width="15%">İşlem</TableCell>
              <TableCell width="40%">Açıklama</TableCell>
              <TableCell width="15%">Seçici</TableCell>
              <TableCell width="15%">Değer</TableCell>
              <TableCell width="10%" align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSteps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                    Henüz test adımı eklenmemiş. "Adım Ekle" butonuna tıklayarak test adımları ekleyebilirsiniz.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedSteps.map((step, index) => (
                <TableRow key={step.id}>
                  <TableCell>{step.order}</TableCell>
                  <TableCell>{step.action}</TableCell>
                  <TableCell>{step.description}</TableCell>
                  <TableCell>{step.selector || '-'}</TableCell>
                  <TableCell>{step.value || '-'}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title="Düzenle">
                        <IconButton size="small" onClick={() => handleOpenDialog(step)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Çoğalt">
                        <IconButton size="small" onClick={() => handleDuplicateStep(step)}>
                          <DuplicateIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Yukarı Taşı">
                        <span>
                          <IconButton 
                            size="small" 
                            onClick={() => handleMoveStepUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUpIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Aşağı Taşı">
                        <span>
                          <IconButton 
                            size="small" 
                            onClick={() => handleMoveStepDown(index)}
                            disabled={index === sortedSteps.length - 1}
                          >
                            <ArrowDownIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton size="small" onClick={() => handleDeleteStep(step.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Adım Düzenleme Modalı */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingStep && editingStep.id && steps.some(s => s.id === editingStep.id) 
            ? 'Test Adımını Düzenle' 
            : 'Yeni Test Adımı Ekle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>İşlem Türü</InputLabel>
                <Select
                  value={editingStep?.action || ''}
                  onChange={(e) => setEditingStep(prev => 
                    prev ? { ...prev, action: e.target.value as TestStepActionType } : null
                  )}
                  label="İşlem Türü"
                >
                  {Object.values(TestStepActionType).map((action) => (
                    <MenuItem key={action} value={action}>
                      {action}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                {editingStep ? getActionDescription(editingStep.action) : ''}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Açıklama"
                value={editingStep?.description || ''}
                onChange={(e) => setEditingStep(prev => 
                  prev ? { ...prev, description: e.target.value } : null
                )}
              />
            </Grid>
            
            {editingStep && getRequiredFields(editingStep.action).selector && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Seçici (CSS veya XPath)"
                  value={editingStep?.selector || ''}
                  onChange={(e) => setEditingStep(prev => 
                    prev ? { ...prev, selector: e.target.value } : null
                  )}
                  required
                />
              </Grid>
            )}
            
            {editingStep && getRequiredFields(editingStep.action).value && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={getValueLabel(editingStep.action)}
                  value={editingStep?.value || ''}
                  onChange={(e) => setEditingStep(prev => 
                    prev ? { ...prev, value: e.target.value } : null
                  )}
                  required
                  multiline={editingStep.action === TestStepActionType.EXECUTE_JS}
                  rows={editingStep.action === TestStepActionType.EXECUTE_JS ? 4 : 1}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button 
            onClick={handleSaveStep} 
            variant="contained" 
            color="primary"
            disabled={!editingStep || 
              (getRequiredFields(editingStep.action).selector && !editingStep.selector) ||
              (getRequiredFields(editingStep.action).value && !editingStep.value) ||
              !editingStep.description
            }
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestStepsEditor;
