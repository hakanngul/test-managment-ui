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
  Alert,
  IconButton,
  Collapse,
  Tooltip,
  Grid
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
import { BrowserType, EnvironmentType } from '../../models/enums/TestEnums';
import { TestExecutionSettings } from '../../mock/testExecutionSimulatorMock';

interface TestExecutionPanelProps {
  testCase: TestCase | null;
  isRunning: boolean;
  onRunTest: (settings: TestExecutionSettings) => void;
  onStopTest: () => void;
  executionError?: string;
}

const TestExecutionPanel: React.FC<TestExecutionPanelProps> = ({
  testCase,
  isRunning,
  onRunTest,
  onStopTest,
  executionError
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [browser, setBrowser] = useState<BrowserType>(BrowserType.CHROME);
  const [environment, setEnvironment] = useState<string>(EnvironmentType.TESTING);
  const [headless, setHeadless] = useState(true);
  const [takeScreenshots, setTakeScreenshots] = useState(true);
  const [recordVideo, setRecordVideo] = useState(false);
  const [retryOnFailure, setRetryOnFailure] = useState(false);
  const [maxRetries, setMaxRetries] = useState(1);

  // Ayarları göster/gizle
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Test çalıştırma işlemi
  const handleRunTest = () => {
    if (!testCase) return;

    const settings: TestExecutionSettings = {
      browser,
      environment,
      headless,
      takeScreenshots,
      recordVideo,
      retryOnFailure,
      maxRetries
    };

    onRunTest(settings);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        mb: 2
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="medium">
            Test Adımları
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {testCase ? `"${testCase.name}" testini çalıştırın` : 'Lütfen bir test seçin'}
          </Typography>
        </Box>
        <Tooltip title={showSettings ? "Ayarları Gizle" : "Ayarları Göster"}>
          <IconButton onClick={toggleSettings} color="primary" size="small">
            {showSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        {executionError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {}}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {executionError}
          </Alert>
        )}

        <Collapse in={showSettings}>
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Çalıştırma Ayarları
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Tarayıcı</InputLabel>
                  <Select
                    value={browser}
                    onChange={(e) => setBrowser(e.target.value as BrowserType)}
                    label="Tarayıcı"
                    disabled={isRunning}
                  >
                    <MenuItem value={BrowserType.CHROME}>Chrome</MenuItem>
                    <MenuItem value={BrowserType.FIREFOX}>Firefox</MenuItem>
                    <MenuItem value={BrowserType.EDGE}>Edge</MenuItem>
                    <MenuItem value={BrowserType.SAFARI}>Safari</MenuItem>
                    <MenuItem value={BrowserType.WEBKIT}>WebKit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Ortam</InputLabel>
                  <Select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    label="Ortam"
                    disabled={isRunning}
                  >
                    <MenuItem value={EnvironmentType.DEVELOPMENT}>Geliştirme</MenuItem>
                    <MenuItem value={EnvironmentType.TESTING}>Test</MenuItem>
                    <MenuItem value={EnvironmentType.STAGING}>Ön Yayın</MenuItem>
                    <MenuItem value={EnvironmentType.PRODUCTION}>Üretim</MenuItem>
                    <MenuItem value={EnvironmentType.QA}>QA</MenuItem>
                    <MenuItem value={EnvironmentType.UAT}>UAT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={headless}
                    onChange={(e) => setHeadless(e.target.checked)}
                    disabled={isRunning}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Headless Mod
                  </Typography>
                }
                sx={{ mr: 2, mb: 1, minWidth: '140px' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={takeScreenshots}
                    onChange={(e) => setTakeScreenshots(e.target.checked)}
                    disabled={isRunning}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Ekran Görüntüsü Al
                  </Typography>
                }
                sx={{ mr: 2, mb: 1, minWidth: '140px' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={recordVideo}
                    onChange={(e) => setRecordVideo(e.target.checked)}
                    disabled={isRunning}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Video Kaydet
                  </Typography>
                }
                sx={{ mr: 2, mb: 1, minWidth: '140px' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={retryOnFailure}
                    onChange={(e) => setRetryOnFailure(e.target.checked)}
                    disabled={isRunning}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Başarısızlıkta Yeniden Dene
                  </Typography>
                }
                sx={{ mb: 1, minWidth: '140px' }}
              />
            </Box>

            {retryOnFailure && (
              <TextField
                label="Maksimum Deneme Sayısı"
                type="number"
                size="small"
                value={maxRetries}
                onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                disabled={isRunning}
                InputProps={{ inputProps: { min: 1, max: 5 } }}
                sx={{ width: '200px', mt: 1 }}
              />
            )}
          </Box>
        </Collapse>

        <Box sx={{ mt: 1 }}>
          {isRunning ? (
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<StopIcon />}
              onClick={onStopTest}
              size="large"
              disabled={!testCase}
              sx={{ py: 1.5 }}
            >
              Testi Durdur
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={testCase ? <PlayArrowIcon /> : <SettingsIcon />}
              onClick={handleRunTest}
              size="large"
              disabled={!testCase}
              sx={{ py: 1.5 }}
            >
              {testCase ? 'Testi Çalıştır' : 'Test Seçin'}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default TestExecutionPanel;
