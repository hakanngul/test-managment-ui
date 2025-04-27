import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon // Slack yerine Chat ikonunu kullanıyoruz
} from '@mui/icons-material';
// Alternatif olarak lucide-react'tan Slack ikonunu kullanabilirsiniz
// import { Slack } from 'lucide-react';
import SettingsSection from './SettingsSection';
import SettingsCard from './SettingsCard';

interface NotificationSettingsProps {
  initialSettings?: {
    emailEnabled: boolean;
    emailRecipients: string;
    emailOnSuccess: boolean;
    emailOnFailure: boolean;
    slackEnabled: boolean;
    slackWebhook: string;
    slackChannel: string;
    slackOnSuccess: boolean;
    slackOnFailure: boolean;
    notifyOnStart: boolean;
    notifyOnComplete: boolean;
    notificationLevel: string;
  };
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  initialSettings = {
    emailEnabled: false,
    emailRecipients: '',
    emailOnSuccess: false,
    emailOnFailure: true,
    slackEnabled: false,
    slackWebhook: '',
    slackChannel: '#test-automation',
    slackOnSuccess: false,
    slackOnFailure: true,
    notifyOnStart: false,
    notifyOnComplete: true,
    notificationLevel: 'suite'
  }
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [testSlackSent, setTestSlackSent] = useState(false);

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
    console.log('Saving notification settings:', settings);
    setSnackbarOpen(true);
  };

  const handleTestEmail = () => {
    // Here you would send a test email
    console.log('Sending test email to:', settings.emailRecipients);
    setTestEmailSent(true);
    setTimeout(() => setTestEmailSent(false), 5000);
  };

  const handleTestSlack = () => {
    // Here you would send a test Slack message
    console.log('Sending test Slack message to:', settings.slackChannel);
    setTestSlackSent(true);
    setTimeout(() => setTestSlackSent(false), 5000);
  };

  return (
    <SettingsSection
      title="Notification Settings"
      description="Configure how and when you receive notifications about test runs."
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Email Notifications"
            icon={<EmailIcon />}
            enabled={settings.emailEnabled}
            onToggle={handleToggle('emailEnabled')}
          >
            {settings.emailEnabled && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Email Recipients"
                  name="emailRecipients"
                  value={settings.emailRecipients}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="email1@example.com, email2@example.com"
                  helperText="Separate multiple email addresses with commas"
                />

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Notification Triggers
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailOnSuccess}
                      onChange={handleToggle('emailOnSuccess')}
                    />
                  }
                  label="Send on Test Success"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailOnFailure}
                      onChange={handleToggle('emailOnFailure')}
                    />
                  }
                  label="Send on Test Failure"
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleTestEmail}
                    disabled={!settings.emailRecipients}
                  >
                    {testEmailSent ? 'Test Email Sent!' : 'Send Test Email'}
                  </Button>
                </Box>
              </Box>
            )}
          </SettingsCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SettingsCard
            title="Slack Notifications"
            icon={<ChatIcon />}
            enabled={settings.slackEnabled}
            onToggle={handleToggle('slackEnabled')}
          >
            {settings.slackEnabled && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Slack Webhook URL"
                  name="slackWebhook"
                  value={settings.slackWebhook}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="https://hooks.slack.com/services/..."
                />

                <TextField
                  fullWidth
                  label="Slack Channel"
                  name="slackChannel"
                  value={settings.slackChannel}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="#channel-name"
                />

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Notification Triggers
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.slackOnSuccess}
                      onChange={handleToggle('slackOnSuccess')}
                    />
                  }
                  label="Send on Test Success"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.slackOnFailure}
                      onChange={handleToggle('slackOnFailure')}
                    />
                  }
                  label="Send on Test Failure"
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleTestSlack}
                    disabled={!settings.slackWebhook}
                  >
                    {testSlackSent ? 'Test Message Sent!' : 'Send Test Message'}
                  </Button>
                </Box>
              </Box>
            )}
          </SettingsCard>
        </Grid>

        <Grid item xs={12}>
          <SettingsCard
            title="General Notification Settings"
            icon={<NotificationsIcon />}
            description="Configure when and how detailed notifications should be"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Notification Timing
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifyOnStart}
                      onChange={handleToggle('notifyOnStart')}
                    />
                  }
                  label="Notify when test run starts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifyOnComplete}
                      onChange={handleToggle('notifyOnComplete')}
                    />
                  }
                  label="Notify when test run completes"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="notification-level-label">Notification Detail Level</InputLabel>
                  <Select
                    labelId="notification-level-label"
                    name="notificationLevel"
                    value={settings.notificationLevel}
                    label="Notification Detail Level"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="suite">Test Suite Level</MenuItem>
                    <MenuItem value="test">Individual Test Level</MenuItem>
                    <MenuItem value="step">Test Step Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </SettingsCard>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Notification Settings
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
          Notification settings saved successfully!
        </Alert>
      </Snackbar>
    </SettingsSection>
  );
};

export default NotificationSettings;
