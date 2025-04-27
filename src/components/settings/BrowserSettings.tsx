import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  Typography,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import {
  SettingsBrightness as BrightnessIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';
import SettingsSection from './SettingsSection';
import SettingsCard from './SettingsCard';

interface BrowserConfig {
  name: string;
  enabled: boolean;
  headless: boolean;
  windowSize: string;
  userAgent: string;
  arguments: string;
  extensions: boolean;
  proxy: string;
}

const defaultBrowsers: BrowserConfig[] = [
  {
    name: 'chrome',
    enabled: true,
    headless: false,
    windowSize: '1920x1080',
    userAgent: '',
    arguments: '--no-sandbox --disable-dev-shm-usage',
    extensions: false,
    proxy: ''
  },
  {
    name: 'firefox',
    enabled: true,
    headless: false,
    windowSize: '1920x1080',
    userAgent: '',
    arguments: '',
    extensions: false,
    proxy: ''
  },
  {
    name: 'edge',
    enabled: false,
    headless: false,
    windowSize: '1920x1080',
    userAgent: '',
    arguments: '',
    extensions: false,
    proxy: ''
  },
  {
    name: 'safari',
    enabled: false,
    headless: false,
    windowSize: '1920x1080',
    userAgent: '',
    arguments: '',
    extensions: false,
    proxy: ''
  }
];

const BrowserSettings: React.FC = () => {
  const [browsers, setBrowsers] = useState<BrowserConfig[]>(defaultBrowsers);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [defaultBrowser, setDefaultBrowser] = useState('chrome');
  const [parallelExecution, setParallelExecution] = useState(true);
  const [maxInstances, setMaxInstances] = useState(5);

  const handleBrowserToggle = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBrowsers = [...browsers];
    newBrowsers[index].enabled = event.target.checked;
    setBrowsers(newBrowsers);
  };

  const handleHeadlessToggle = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBrowsers = [...browsers];
    newBrowsers[index].headless = event.target.checked;
    setBrowsers(newBrowsers);
  };

  const handleExtensionsToggle = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBrowsers = [...browsers];
    newBrowsers[index].extensions = event.target.checked;
    setBrowsers(newBrowsers);
  };

  const handleBrowserChange = (index: number, field: keyof BrowserConfig) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newBrowsers = [...browsers];
    newBrowsers[index][field] = event.target.value;
    setBrowsers(newBrowsers);
  };

  const handleDefaultBrowserChange = (event: SelectChangeEvent<string>) => {
    setDefaultBrowser(event.target.value);
  };

  const handleParallelExecutionToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParallelExecution(event.target.checked);
  };

  const handleMaxInstancesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInstances(parseInt(event.target.value, 10) || 1);
  };

  const handleSave = () => {
    // Here you would save the settings to your backend
    console.log('Saving browser settings:', {
      browsers,
      defaultBrowser,
      parallelExecution,
      maxInstances
    });
    setSnackbarOpen(true);
  };

  return (
    <SettingsSection
      title="Browser Settings"
      description="Configure browsers for test execution."
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Execution Settings"
            icon={<DevicesIcon />}
            description="Configure how browsers are executed during tests"
          >
            <FormControl fullWidth margin="normal">
              <InputLabel id="default-browser-label">Default Browser</InputLabel>
              <Select
                labelId="default-browser-label"
                value={defaultBrowser}
                label="Default Browser"
                onChange={handleDefaultBrowserChange}
              >
                {browsers.map((browser) => (
                  <MenuItem 
                    key={browser.name} 
                    value={browser.name}
                    disabled={!browser.enabled}
                  >
                    {browser.name.charAt(0).toUpperCase() + browser.name.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={parallelExecution}
                  onChange={handleParallelExecutionToggle}
                />
              }
              label="Enable Parallel Execution"
              sx={{ my: 2, display: 'block' }}
            />

            <TextField
              fullWidth
              label="Max Browser Instances"
              type="number"
              value={maxInstances}
              onChange={handleMaxInstancesChange}
              disabled={!parallelExecution}
              inputProps={{ min: 1, max: 10 }}
              helperText="Maximum number of browser instances to run in parallel"
            />
          </SettingsCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Browser Capabilities"
            icon={<BrightnessIcon />}
            description="Configure browser capabilities and options"
          >
            {browsers.map((browser, index) => (
              <Box key={browser.name} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    {browser.name}
                  </Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={browser.enabled}
                          onChange={handleBrowserToggle(index)}
                        />
                      }
                      label={browser.enabled ? "Enabled" : "Disabled"}
                      labelPlacement="start"
                    />
                  </Box>
                </Box>

                {browser.enabled && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={browser.headless}
                            onChange={handleHeadlessToggle(index)}
                          />
                        }
                        label="Headless Mode"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={browser.extensions}
                            onChange={handleExtensionsToggle(index)}
                          />
                        }
                        label="Allow Extensions"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Window Size"
                        value={browser.windowSize}
                        onChange={handleBrowserChange(index, 'windowSize')}
                        placeholder="e.g. 1920x1080"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="User Agent"
                        value={browser.userAgent}
                        onChange={handleBrowserChange(index, 'userAgent')}
                        placeholder="Custom user agent (optional)"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Browser Arguments"
                        value={browser.arguments}
                        onChange={handleBrowserChange(index, 'arguments')}
                        placeholder="e.g. --no-sandbox --disable-gpu"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Proxy"
                        value={browser.proxy}
                        onChange={handleBrowserChange(index, 'proxy')}
                        placeholder="e.g. http://proxy.example.com:8080"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                )}
                {index < browsers.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </SettingsCard>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Browser Settings
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Browser settings saved successfully!
        </Alert>
      </Snackbar>
    </SettingsSection>
  );
};

export default BrowserSettings;
