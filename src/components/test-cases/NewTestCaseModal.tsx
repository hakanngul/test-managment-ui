import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  Chip,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  TestCase, 
  TestCaseStatus, 
  TestCasePriority, 
  TestCaseCategory 
} from '../../models/interfaces/ITestCase';

interface NewTestCaseModalProps {
  open: boolean;
  onClose: () => void;
  onCreateTestCase: (testCase: Omit<TestCase, 'id'>) => void;
}

const NewTestCaseModal: React.FC<NewTestCaseModalProps> = ({
  open,
  onClose,
  onCreateTestCase
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TestCaseStatus>(TestCaseStatus.DRAFT);
  const [priority, setPriority] = useState<TestCasePriority>(TestCasePriority.MEDIUM);
  const [category, setCategory] = useState<TestCaseCategory>(TestCaseCategory.FUNCTIONAL);
  const [tags, setTags] = useState<string[]>([]);
  const [browser, setBrowser] = useState('Chrome');
  const [environment, setEnvironment] = useState('Development');
  const [automated, setAutomated] = useState(false);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  // Form gönderme işlemi
  const handleSubmit = () => {
    // Form doğrulama
    const newErrors: typeof errors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Test case adı gereklidir';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Yeni test case oluştur
    const newTestCase: Omit<TestCase, 'id'> = {
      name,
      description,
      status,
      priority,
      category,
      tags,
      createdBy: 'Hakan Gül', // Gerçek uygulamada oturum açmış kullanıcıdan alınacak
      createdAt: new Date(),
      updatedAt: new Date(),
      browser,
      environment,
      automated,
      prerequisites,
      projectId: 'proj-001', // Gerçek uygulamada seçilen projeden alınacak
      steps: []
    };
    
    onCreateTestCase(newTestCase);
    resetForm();
  };

  // Formu sıfırla
  const resetForm = () => {
    setName('');
    setDescription('');
    setStatus(TestCaseStatus.DRAFT);
    setPriority(TestCasePriority.MEDIUM);
    setCategory(TestCaseCategory.FUNCTIONAL);
    setTags([]);
    setBrowser('Chrome');
    setEnvironment('Development');
    setAutomated(false);
    setPrerequisites([]);
    setErrors({});
  };

  // Modal kapatma işlemi
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Öncelik adını formatla
  const formatPriority = (priority: TestCasePriority): string => {
    switch (priority) {
      case TestCasePriority.LOW: return 'Düşük';
      case TestCasePriority.MEDIUM: return 'Orta';
      case TestCasePriority.HIGH: return 'Yüksek';
      case TestCasePriority.CRITICAL: return 'Kritik';
      default: return priority;
    }
  };

  // Durum adını formatla
  const formatStatus = (status: TestCaseStatus): string => {
    switch (status) {
      case TestCaseStatus.ACTIVE: return 'Aktif';
      case TestCaseStatus.DRAFT: return 'Taslak';
      case TestCaseStatus.DEPRECATED: return 'Kullanım Dışı';
      case TestCaseStatus.ARCHIVED: return 'Arşivlenmiş';
      default: return status;
    }
  };

  // Kategori adını formatla
  const formatCategory = (category: TestCaseCategory): string => {
    switch (category) {
      case TestCaseCategory.FUNCTIONAL: return 'Fonksiyonel';
      case TestCaseCategory.REGRESSION: return 'Regresyon';
      case TestCaseCategory.INTEGRATION: return 'Entegrasyon';
      case TestCaseCategory.PERFORMANCE: return 'Performans';
      case TestCaseCategory.SECURITY: return 'Güvenlik';
      case TestCaseCategory.USABILITY: return 'Kullanılabilirlik';
      case TestCaseCategory.ACCEPTANCE: return 'Kabul';
      case TestCaseCategory.SMOKE: return 'Smoke';
      case TestCaseCategory.EXPLORATORY: return 'Keşif';
      default: return category;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Yeni Test Case Oluştur</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Test Case Adı"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Açıklama"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as TestCaseStatus)}
                label="Durum"
              >
                {Object.values(TestCaseStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {formatStatus(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Öncelik</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TestCasePriority)}
                label="Öncelik"
              >
                {Object.values(TestCasePriority).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {formatPriority(priority)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as TestCaseCategory)}
                label="Kategori"
              >
                {Object.values(TestCaseCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {formatCategory(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={tags}
              onChange={(_, newValue) => setTags(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Etiketler"
                  placeholder="Etiket ekle"
                  helperText="Enter tuşuna basarak etiket ekleyebilirsiniz"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={prerequisites}
              onChange={(_, newValue) => setPrerequisites(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ön Koşullar"
                  placeholder="Ön koşul ekle"
                  helperText="Enter tuşuna basarak ön koşul ekleyebilirsiniz"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tarayıcı</InputLabel>
              <Select
                value={browser}
                onChange={(e) => setBrowser(e.target.value)}
                label="Tarayıcı"
              >
                <MenuItem value="Chrome">Chrome</MenuItem>
                <MenuItem value="Firefox">Firefox</MenuItem>
                <MenuItem value="Safari">Safari</MenuItem>
                <MenuItem value="Edge">Edge</MenuItem>
                <MenuItem value="Opera">Opera</MenuItem>
                <MenuItem value="N/A">Uygulanabilir Değil</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Ortam</InputLabel>
              <Select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                label="Ortam"
              >
                <MenuItem value="Development">Geliştirme</MenuItem>
                <MenuItem value="Testing">Test</MenuItem>
                <MenuItem value="Staging">Ön Yayın</MenuItem>
                <MenuItem value="Production">Üretim</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={automated}
                    onChange={(e) => setAutomated(e.target.checked)}
                    color="primary"
                  />
                }
                label="Otomatize"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>İptal</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Oluştur
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTestCaseModal;
