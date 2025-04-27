import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Typography,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  BugReport as JiraIcon,
  Code as GitlabIcon,
  Storage as JenkinsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import SettingsSection from './SettingsSection';
import SettingsCard from './SettingsCard';

interface IntegrationConfig {
  enabled: boolean;
  url: string;
  apiKey: string;
  username?: string;
  project?: string;
  repository?: string;
}

interface IntegrationSettingsProps {
  initialSettings?: {
    jira: IntegrationConfig;
    github: IntegrationConfig;
    gitlab: IntegrationConfig;
    jenkins: IntegrationConfig;
  };
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  initialSettings = {
    jira: {
      enabled: false,
      url: '',
      apiKey: '',
      username: '',
      project: ''
    },
    github: {
      enabled: false,
      url: '',
      apiKey: '',
      repository: ''
    },
    gitlab: {
      enabled: false,
      url: '',
      apiKey: '',
      repository: ''
    },
    jenkins: {
      enabled: false,
      url: '',
      apiKey: '',
      username: ''
    }
  }
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleToggle = (integration: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [integration]: {
        ...settings[integration],
        enabled: e.target.checked
      }
    });
  };

  const handleChange = (integration: keyof typeof settings, field: keyof IntegrationConfig) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings({
      ...settings,
      [integration]: {
        ...settings[integration],
        [field]: e.target.value
      }
    });
  };

  const handleSave = () => {
    // Here you would save the settings to your backend
    console.log('Saving integration settings:', settings);
    setSnackbarMessage('Integration settings saved successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleTest = (integration: keyof typeof settings) => () => {
    // Here you would test the integration
    const config = settings[integration];
    if (!config.url || !config.apiKey) {
      setSnackbarMessage(`Please provide URL and API Key for ${integration}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    console.log(`Testing ${integration} integration:`, config);
    setSnackbarMessage(`${integration} integration test successful!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  return (
    <SettingsSection
      title="Integrations"
      description="Connect your test automation with other tools and services."
    >
      <Grid container spacing={3}>
        {/* JIRA Integration */}
        <Grid item xs={12} md={6}>
          <SettingsCard
            title="JIRA Integration"
            icon={<JiraIcon />}
            enabled={settings.jira.enabled}
            onToggle={handleToggle('jira')}
          >
            {settings.jira.enabled && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="JIRA URL"
                  value={settings.jira.url}
                  onChange={handleChange('jira', 'url')}
                  margin="normal"
                  placeholder="https://your-domain.atlassian.net"
                />
                <TextField
                  fullWidth
                  label="API Token"
                  value={settings.jira.apiKey}
                  onChange={handleChange('jira', 'apiKey')}
                  margin="normal"
                  type="password"
                />
                <TextField
                  fullWidth
                  label="Username"
                  value={settings.jira.username}
                  onChange={handleChange('jira', 'username')}
                  margin="normal"
                  placeholder="your-email@example.com"
                />
                <TextField
                  fullWidth
                  label="Project Key"
                  value={settings.jira.project}
                  onChange={handleChange('jira', 'project')}
                  margin="normal"
                  placeholder="e.g. TEST"
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleTest('jira')}
                    disabled={!settings.jira.url || !settings.jira.apiKey}
                  >
                    Test Connection
                  </Button>
                </Box>
              </Box>
            )}
          </SettingsCard>
        </Grid>

        {/* GitHub Integration */}
        <Grid item xs={12} md={6}>
          <SettingsCard
            title="GitHub Integration"
            icon={<GitHubIcon />}
            enabled={settings.github.enabled}
            onToggle={handleToggle('github')}
          >
            {settings.github.enabled && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="GitHub URL"
                  value={settings.github.url}
                  onChange={handleChange('github', 'url')}
                  margin="normal"
                  placeholder="https://api.github.com"
                />
                <TextField
                  fullWidth
                  label="Personal Access Token"
                  value={settings.github.apiKey}
                  onChange={handleChange('github', 'apiKey')}
                  margin="normal"
                  type="password"
                />
                <TextField
                  fullWidth
                  label="Repository"
                  value={settings.github.repository}
                  onChange={handleChange('github', 'repository')}
                  margin="normal"
                  placeholder="username/repository"
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleTest('github')}
                    disabled={!settings.github.url || !settings.github.apiKey}
                  >
                    Test Connection
                  </Button>
                </Box>
              </Box>
            )}
          </SettingsCard>
        </Grid>

        {/* GitLab Integration */}
        <Grid item xs={12} md={6}>
          <SettingsCard
            title="GitLab Integration"
            icon={<GitlabIcon />}
            enabled={settings.gitlab.enabled}
            onToggle={handleToggle('gitlab')}
          >
            {settings.gitlab.enabled && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="GitLab URL"
                  value={settings.gitlab.url}
                  onChange={handleChange('gitlab', 'url')}
                  margin="normal"
                  placeholder="https://gitlab.com"
                />
                <TextField
                  fullWidth
                  label="Personal Access Token"
                  value={settings.gitlab.apiKey}
                  onChange={handleChange('gitlab', 'apiKey')}
                  margin="normal"
                  type="password"
                />
                <TextField
                  fullWidth
                  label="Repository"
                  value={settings.gitlab.repository}
                  onChange={handleChange('gitlab', 'repository')}
                  margin="normal"
                  placeholder="group/project"
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleTest('gitlab')}
                    disabled={!settings.gitlab.url || !settings.gitlab.apiKey}
                  >
                    Test Connection
                  </Button>
                </Box>
              </Box>
            )}
          </SettingsCard>
        </Grid>

        {/* Jenkins Integration */}
        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Jenkins Integration"
            icon={<JenkinsIcon />}
            enabled={settings.jenkins.enabled}
            onToggle={handleToggle('jenkins')}
          >
            {settings.jenkins.enabled && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Jenkins URL"
                  value={settings.jenkins.url}
                  onChange={handleChange('jenkins', 'url')}
                  margin="normal"
                  placeholder="https://jenkins.example.com"
                />
                <TextField
                  fullWidth
                  label="API Token"
                  value={settings.jenkins.apiKey}
                  onChange={handleChange('jenkins', 'apiKey')}
                  margin="normal"
                  type="password"
                />
                <TextField
                  fullWidth
                  label="Username"
                  value={settings.jenkins.username}
                  onChange={handleChange('jenkins', 'username')}
                  margin="normal"
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleTest('jenkins')}
                    disabled={!settings.jenkins.url || !settings.jenkins.apiKey}
                  >
                    Test Connection
                  </Button>
                </Box>
              </Box>
            )}
          </SettingsCard>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Integration Settings
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
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SettingsSection>
  );
};

export default IntegrationSettings;
