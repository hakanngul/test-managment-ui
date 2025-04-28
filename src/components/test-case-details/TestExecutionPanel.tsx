import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  TextField,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { TestCase } from '../../models/interfaces/ITestCase';

interface TestExecutionPanelProps {
  testCase: TestCase;
}

const TestExecutionPanel: React.FC<TestExecutionPanelProps> = ({ testCase }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [browser, setBrowser] = useState(testCase.browser || 'Chrome');
  const [environment, setEnvironment] = useState(testCase.environment || 'Production');
  const [headless, setHeadless] = useState(true);
  const [takeScreenshots, setTakeScreenshots] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  // Test çalıştırma adımları
  const steps = [
    'Hazırlanıyor',
    'Test Ortamı Kuruluyor',
    'Test Çalıştırılıyor',
    'Sonuçlar Toplanıyor',
    'Tamamlandı'
  ];

  // Test çalıştırma işlemi
  const handleRunTest = () => {
    setIsRunning(true);
    setActiveStep(0);
    setShowAlert(false);
    
    // Test çalıştırma simülasyonu
    const runTest = async () => {
      try {
        // Adım 1: Hazırlanıyor
        await new Promise(resolve => setTimeout(resolve, 1000));
        setActiveStep(1);
        
        // Adım 2: Test Ortamı Kuruluyor
        await new Promise(resolve => setTimeout(resolve, 2000));
        setActiveStep(2);
        
        // Adım 3: Test Çalıştırılıyor
        await new Promise(resolve => setTimeout(resolve, 3000));
        setActiveStep(3);
        
        // Adım 4: Sonuçlar Toplanıyor
        await new Promise(resolve => setTimeout(resolve, 1000));
        setActiveStep(4);
        
        // Tamamlandı
        setAlertSeverity('success');
        setAlertMessage('Test başarıyla tamamlandı!');
        setShowAlert(true);
      } catch (error) {
        console.error('Test çalıştırma hatası:', error);
        setAlertSeverity('error');
        setAlertMessage('Test çalıştırılırken bir hata oluştu.');
        setShowAlert(true);
      } finally {
        setIsRunning(false);
      }
    };
    
    runTest();
  };

  // Test çalıştırmayı durdur
  const handleStopTest = () => {
    setIsRunning(false);
    setAlertSeverity('warning');
    setAlertMessage('Test kullanıcı tarafından durduruldu.');
    setShowAlert(true);
  };

  // Ayarları göster/gizle
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Başlık */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6">
          Test Çalıştırma
        </Typography>
      </Box>
      
      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Uyarı Mesajı */}
        {showAlert && (
          <Alert 
            severity={alertSeverity}
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessage}
          </Alert>
        )}
        
        {/* Test Çalıştırma Durumu */}
        {isRunning && (
          <Box sx={{ width: '100%', mb: 3 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    {label}
                    {activeStep === index && (
                      <CircularProgress size={16} sx={{ ml: 1 }} />
                    )}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
        
        {/* Ayarlar Butonu */}
        <Button
          variant="text"
          color="primary"
          startIcon={showSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={toggleSettings}
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        >
          Çalıştırma Ayarları
        </Button>
        
        {/* Ayarlar */}
        <Collapse in={showSettings}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Tarayıcı Ayarları
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tarayıcı</InputLabel>
              <Select
                value={browser}
                onChange={(e) => setBrowser(e.target.value)}
                label="Tarayıcı"
                disabled={isRunning}
              >
                <MenuItem value="Chrome">Chrome</MenuItem>
                <MenuItem value="Firefox">Firefox</MenuItem>
                <MenuItem value="Safari">Safari</MenuItem>
                <MenuItem value="Edge">Edge</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Ortam</InputLabel>
              <Select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                label="Ortam"
                disabled={isRunning}
              >
                <MenuItem value="Development">Geliştirme</MenuItem>
                <MenuItem value="Testing">Test</MenuItem>
                <MenuItem value="Staging">Ön Yayın</MenuItem>
                <MenuItem value="Production">Üretim</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={headless}
                  onChange={(e) => setHeadless(e.target.checked)}
                  disabled={isRunning}
                />
              }
              label="Headless Mod"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={takeScreenshots}
                  onChange={(e) => setTakeScreenshots(e.target.checked)}
                  disabled={isRunning}
                />
              }
              label="Ekran Görüntüsü Al"
            />
          </Box>
        </Collapse>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Çalıştırma Butonu */}
        <Box sx={{ mt: 2 }}>
          {isRunning ? (
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<StopIcon />}
              onClick={handleStopTest}
              size="large"
            >
              Testi Durdur
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<PlayArrowIcon />}
              onClick={handleRunTest}
              size="large"
            >
              Testi Çalıştır
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default TestExecutionPanel;
