import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  Chip,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon
} from '@mui/icons-material';
import {
  TestCase,
  TestCaseStatus,
  TestCasePriority,
  TestCaseCategory
} from '../models/interfaces/ITestCase';
import {
  TestStepsEditor,
  BrowserSettingsEditor,
  TestStep,
  TestStepActionType,
  BrowserSettings
} from '../components/test-cases';
import { testRunnerService, TestRunRequest } from '../services/TestRunnerService';
import { BrowserType } from '../models/enums/TestEnums';
import { mockTestCases } from '../mock/testCasesMock';

const NewTestCase: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Adım yönetimi
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Temel Bilgiler', 'Test Adımları', 'Tarayıcı Ayarları', 'Gözden Geçir'];

  // Temel bilgiler
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TestCaseStatus>(TestCaseStatus.DRAFT);
  const [priority, setPriority] = useState<TestCasePriority>(TestCasePriority.MEDIUM);
  const [category, setCategory] = useState<TestCaseCategory>(TestCaseCategory.FUNCTIONAL);
  const [tags, setTags] = useState<string[]>([]);
  const [environment, setEnvironment] = useState('Development');
  const [automated, setAutomated] = useState(true);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);

  // Test adımları
  const [testSteps, setTestSteps] = useState<TestStep[]>([]);

  // Tarayıcı ayarları
  const [browserSettings, setBrowserSettings] = useState<BrowserSettings>({
    browser: BrowserType.CHROME,
    headless: true,
    width: 1366,
    height: 768,
    timeout: 30000,
    recordVideo: true,
    ignoreHTTPSErrors: false,
    takeScreenshots: true,
    screenshotOnFailure: false,
    screenshotPath: 'screenshots/'
  });

  // Test çalıştırma
  const [isRunning, setIsRunning] = useState(false);
  const [testRunId, setTestRunId] = useState<string | null>(null);
  const [testRunStatus, setTestRunStatus] = useState<string | null>(null);

  // UI durumu
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    steps?: string[];
    browserSettings?: string[];
  }>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Adım kontrolü
  const handleNext = () => {
    if (activeStep === 0) {
      // Temel bilgileri doğrula
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
    } else if (activeStep === 1) {
      // Test adımlarını doğrula
      const validation = testRunnerService.validateTestSteps(testSteps);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, steps: validation.errors }));
        setSnackbarMessage('Lütfen test adımlarını düzeltin');
        setShowSnackbar(true);
        return;
      }
    } else if (activeStep === 2) {
      // Tarayıcı ayarlarını doğrula
      const validation = testRunnerService.validateBrowserSettings(browserSettings);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, browserSettings: validation.errors }));
        setSnackbarMessage('Lütfen tarayıcı ayarlarını düzeltin');
        setShowSnackbar(true);
        return;
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Form gönderme işlemi
  const handleSubmit = async () => {
    // Tüm formu doğrula
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Test case adı gereklidir';
    }

    if (!description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    }

    const stepsValidation = testRunnerService.validateTestSteps(testSteps);
    if (!stepsValidation.isValid) {
      newErrors.steps = stepsValidation.errors;
    }

    const browserValidation = testRunnerService.validateBrowserSettings(browserSettings);
    if (!browserValidation.isValid) {
      newErrors.browserSettings = browserValidation.errors;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSnackbarMessage('Lütfen formdaki hataları düzeltin');
      setShowSnackbar(true);
      return;
    }

    if (isEditMode) {
      // Test case'i güncelle
      const updatedTestCase: TestCase = {
        id: id!, // id parametresi kesinlikle var (isEditMode true olduğu için)
        name,
        description,
        status,
        priority,
        category,
        tags,
        createdBy: 'Hakan Gül',
        createdAt: new Date(),
        updatedAt: new Date(),
        browser: browserSettings.browser,
        environment,
        automated,
        prerequisites,
        projectId: 'proj-001',
        steps: testSteps.map(step => ({
          id: step.id,
          description: step.description,
          action: step.action,
          selector: step.selector,
          value: step.value,
          order: step.order,
          expectedResult: step.description || ''
        }))
      };

      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Test case güncelleniyor:', updatedTestCase);

      // Başarı mesajını göster
      setSnackbarMessage('Test case başarıyla güncellendi!');
      setShowSnackbar(true);
      setShowSuccessAlert(true);

      // 2 saniye sonra test case detay sayfasına yönlendir
      setTimeout(() => {
        navigate(`/test-cases/${id}`);
      }, 2000);
    } else {
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
        browser: browserSettings.browser,
        environment,
        automated,
        prerequisites,
        projectId: 'proj-001', // Gerçek uygulamada seçilen projeden alınacak
        steps: testSteps.map(step => ({
          id: step.id,
          description: step.description,
          action: step.action,
          selector: step.selector,
          value: step.value,
          order: step.order,
          expectedResult: step.description || '' // Adding the required expectedResult property
        }))
      };

      // Gerçek uygulamada burada API çağrısı yapılacak
      console.log('Yeni test case oluşturuluyor:', newTestCase);

      // Başarı mesajını göster
      setSnackbarMessage('Test case başarıyla oluşturuldu!');
      setShowSnackbar(true);
      setShowSuccessAlert(true);

      // 2 saniye sonra test cases sayfasına yönlendir
      setTimeout(() => {
        navigate('/test-cases');
      }, 2000);
    }
  };

  // Test çalıştırma işlemi
  const handleRunTest = async () => {
    try {
      setIsRunning(true);

      // Test çalıştırma isteği oluştur
      const testRunRequest: TestRunRequest = {
        id: `run-${Date.now()}`,
        name,
        description,
        browserSettings,
        steps: testSteps,
        testCaseId: undefined, // Henüz kaydedilmediği için ID yok
        projectId: 'proj-001',
        priority: priority,
        tags,
        createdBy: 'Hakan Gül'
      };

      // İsteği doğrula
      const validation = testRunnerService.validateTestRunRequest(testRunRequest);
      if (!validation.isValid) {
        setSnackbarMessage('Test çalıştırma isteği geçersiz: ' + validation.errors.join(', '));
        setShowSnackbar(true);
        setIsRunning(false);
        return;
      }

      // Test çalıştırma isteği gönder
      const response = await testRunnerService.runTest(testRunRequest);

      setTestRunId(response.id);
      setTestRunStatus(response.status);

      // Test durumunu periyodik olarak kontrol et
      const statusCheckInterval = setInterval(async () => {
        try {
          const statusResponse = await testRunnerService.checkTestStatus(response.id);
          setTestRunStatus(statusResponse.status);

          // Test tamamlandıysa interval'i temizle
          if (['completed', 'failed', 'error'].includes(statusResponse.status)) {
            clearInterval(statusCheckInterval);
            setIsRunning(false);

            if (statusResponse.status === 'completed') {
              setSnackbarMessage('Test başarıyla tamamlandı!');
            } else {
              setSnackbarMessage(`Test ${statusResponse.status} durumunda tamamlandı.`);
            }
            setShowSnackbar(true);
          }
        } catch (error) {
          console.error('Test durumu kontrol hatası:', error);
          clearInterval(statusCheckInterval);
          setIsRunning(false);
          setSnackbarMessage('Test durumu kontrol edilirken hata oluştu');
          setShowSnackbar(true);
        }
      }, 5000); // 5 saniyede bir kontrol et

      setSnackbarMessage('Test çalıştırma isteği gönderildi. Test kuyruğa alındı.');
      setShowSnackbar(true);
    } catch (error) {
      console.error('Test çalıştırma hatası:', error);
      setIsRunning(false);
      setSnackbarMessage('Test çalıştırılırken hata oluştu');
      setShowSnackbar(true);
    }
  };

  // İptal işlemi
  const handleCancel = () => {
    navigate('/test-cases');
  };

  // Snackbar kapatma
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Mevcut test case verilerini yükle
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      setIsLoading(true);

      // Gerçek uygulamada burada API çağrısı yapılacak
      setTimeout(() => {
        const testCase = mockTestCases.find(tc => tc.id === id);

        if (testCase) {
          // Temel bilgileri doldur
          setName(testCase.name);
          setDescription(testCase.description);
          setStatus(testCase.status);
          setPriority(testCase.priority);
          setCategory(testCase.category);
          setTags(testCase.tags || []);
          setEnvironment(testCase.environment || 'Development');
          setAutomated(testCase.automated);
          setPrerequisites(testCase.prerequisites || []);

          // Test adımlarını doldur
          if (testCase.steps && testCase.steps.length > 0) {
            // Test adımlarını TestStep formatına dönüştür
            const formattedSteps: TestStep[] = testCase.steps.map((step, index) => ({
              id: step.id || `step-${index}`,
              action: step.action as TestStepActionType || TestStepActionType.NAVIGATE,
              description: step.description,
              selector: step.selector,
              value: step.value,
              order: step.order || index + 1
            }));

            setTestSteps(formattedSteps);
          }

          // Tarayıcı ayarlarını doldur
          if (testCase.browser) {
            setBrowserSettings(prev => ({
              ...prev,
              browser: testCase.browser as BrowserType
            }));
          }
        }

        setIsLoading(false);
      }, 500);
    }
  }, [id]);

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

  // Adım içeriğini render et
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Temel Bilgiler
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

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

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Ek Bilgiler
              </Typography>
              <Divider sx={{ mb: 2 }} />
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
        );
      case 1:
        return (
          <TestStepsEditor
            steps={testSteps}
            onChange={setTestSteps}
          />
        );
      case 2:
        return (
          <BrowserSettingsEditor
            settings={browserSettings}
            onChange={setBrowserSettings}
          />
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Özet
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Temel Bilgiler
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Ad:</strong> {name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Açıklama:</strong> {description}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Durum:</strong> {formatStatus(status)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Öncelik:</strong> {formatPriority(priority)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Kategori:</strong> {formatCategory(category)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Ortam:</strong> {environment}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Otomatize:</strong> {automated ? 'Evet' : 'Hayır'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Etiketler:</strong> {tags.length > 0 ? tags.join(', ') : 'Yok'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Ön Koşullar:</strong> {prerequisites.length > 0 ? prerequisites.join(', ') : 'Yok'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tarayıcı Ayarları
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Tarayıcı:</strong> {browserSettings.browser}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Headless:</strong> {browserSettings.headless ? 'Evet' : 'Hayır'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Boyut:</strong> {browserSettings.width}x{browserSettings.height}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Zaman Aşımı:</strong> {browserSettings.timeout}ms
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Video Kaydı:</strong> {browserSettings.recordVideo ? 'Evet' : 'Hayır'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Ekran Görüntüsü Al:</strong> {browserSettings.takeScreenshots ? 'Evet' : 'Hayır'}
                    </Typography>
                    {browserSettings.takeScreenshots && (
                      <>
                        <Typography variant="body1" gutterBottom>
                          <strong>Sadece Hata Durumunda:</strong> {browserSettings.screenshotOnFailure ? 'Evet' : 'Hayır'}
                        </Typography>
                        {browserSettings.screenshotPath && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Kaydetme Yolu:</strong> {browserSettings.screenshotPath}
                          </Typography>
                        )}
                      </>
                    )}
                    <Typography variant="body1" gutterBottom>
                      <strong>HTTPS Hatalarını Yok Say:</strong> {browserSettings.ignoreHTTPSErrors ? 'Evet' : 'Hayır'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Test Adımları ({testSteps.length})
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {testSteps.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Henüz test adımı eklenmemiş.
                      </Typography>
                    ) : (
                      <Box component="ul" sx={{ pl: 2 }}>
                        {testSteps.map((step, index) => (
                          <Box component="li" key={step.id} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              <strong>{index + 1}. {step.action}:</strong> {step.description}
                              {step.selector && <span> (Seçici: {step.selector})</span>}
                              {step.value && <span> (Değer: {step.value})</span>}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Test Çalıştırma Durumu */}
            {testRunId && (
              <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Test Çalıştırma Durumu
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {isRunning && <CircularProgress size={24} />}
                  <Typography variant="body1">
                    Test ID: {testRunId}
                  </Typography>
                  <Chip
                    label={testRunStatus || 'Bilinmiyor'}
                    color={
                      testRunStatus === 'completed' ? 'success' :
                      testRunStatus === 'failed' || testRunStatus === 'error' ? 'error' :
                      testRunStatus === 'running' ? 'primary' :
                      'default'
                    }
                  />
                </Box>
              </Paper>
            )}
          </Box>
        );
      default:
        return 'Bilinmeyen adım';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Başlık ve Butonlar */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Geri Dön">
              <IconButton
                onClick={handleCancel}
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              {isEditMode ? 'Test Case Düzenle' : 'Yeni Test Case Oluştur'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              İptal
            </Button>
            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleRunTest}
                  disabled={isRunning}
                >
                  {isRunning ? 'Çalıştırılıyor...' : 'Testi Çalıştır'}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                >
                  Kaydet
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                İleri
              </Button>
            )}
          </Box>
        </Box>

        {/* Başarı Mesajı */}
        {showSuccessAlert && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setShowSuccessAlert(false)}
          >
            {isEditMode
              ? 'Test case başarıyla güncellendi! Test Case detay sayfasına yönlendiriliyorsunuz...'
              : 'Test case başarıyla oluşturuldu! Test Cases sayfasına yönlendiriliyorsunuz...'}
          </Alert>
        )}

        {/* Adım Göstergesi */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
          }}
        >
          {getStepContent(activeStep)}
        </Paper>

        {/* Alt Butonlar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<BackIcon />}
          >
            Geri
          </Button>

          <Box>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
              sx={{ mr: 2 }}
            >
              İptal
            </Button>

            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleRunTest}
                  disabled={isRunning}
                  sx={{ mr: 2 }}
                >
                  {isRunning ? 'Çalıştırılıyor...' : 'Testi Çalıştır'}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                >
                  Kaydet
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<NextIcon />}
              >
                İleri
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default NewTestCase;
