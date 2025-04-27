import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import SettingsSection from './SettingsSection';
import SettingsCard from './SettingsCard';

interface GeneralSettingsProps {
  initialSettings?: {
    appName: string;
    defaultTimeout: number;
    defaultRetries: number;
    reportFormat: string;
    screenshotOnFailure: boolean;
    videoRecording: boolean;
    logLevel: string;
  };
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  initialSettings = {
    appName: 'Test Automation Manager',
    defaultTimeout: 30,
    defaultRetries: 2,
    reportFormat: 'html',
    screenshotOnFailure: true,
    videoRecording: false,
    logLevel: 'info'
  }
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name as string]: value
    });
  };

  const handleToggle = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [name]: e.target.checked
    });
  };

  const handleSave = () => {
    // Here you would save the settings to your backend
    console.log('Saving settings:', settings);
    setSnackbarOpen(true);
  };

  return (
    <SettingsSection
      title="General Settings"
      description="Configure basic application settings and default test execution parameters."
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Application Settings"
            icon={<SettingsIcon />}
            description="Basic application configuration"
          >
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Application Name"
                name="appName"
                value={settings.appName}
                onChange={handleChange}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="log-level-label">Log Level</InputLabel>
                <Select
                  labelId="log-level-label"
                  name="logLevel"
                  value={settings.logLevel}
                  label="Log Level"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="debug">Debug</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warn">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
                <FormHelperText>
                  Controls the verbosity of application logs
                </FormHelperText>
              </FormControl>
            </Box>
          </SettingsCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Test Execution Defaults"
            description="Default settings for test execution"
            icon={<SettingsIcon />}
          >
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Default Timeout (seconds)"
                name="defaultTimeout"
                type="number"
                value={settings.defaultTimeout}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                label="Default Retries"
                name="defaultRetries"
                type="number"
                value={settings.defaultRetries}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 0, max: 5 }}
                helperText="Number of times to retry a failed test (0-5)"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="report-format-label">Report Format</InputLabel>
                <Select
                  labelId="report-format-label"
                  name="reportFormat"
                  value={settings.reportFormat}
                  label="Report Format"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="html">HTML</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="json">JSON</MenuItem>
                  <MenuItem value="xml">XML</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </SettingsCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Screenshot on Failure"
            description="Automatically capture screenshots when tests fail"
            enabled={settings.screenshotOnFailure}
            onToggle={handleToggle('screenshotOnFailure')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Video Recording"
            description="Record video of test execution (may impact performance)"
            enabled={settings.videoRecording}
            onToggle={handleToggle('videoRecording')}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Settings
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
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </SettingsSection>
  );
};

export default GeneralSettings;
