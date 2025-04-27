import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Public as EnvironmentIcon,
  Devices as BrowserIcon,
  Notifications as NotificationsIcon,
  Link as IntegrationIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import {
  GeneralSettings,
  TestEnvironmentSettings,
  BrowserSettings,
  NotificationSettings,
  IntegrationSettings,
  SecuritySettings
} from '../components/settings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configure your test automation platform settings.
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="settings tabs"
        >
          <Tab icon={<SettingsIcon />} label="General" iconPosition="start" />
          <Tab icon={<EnvironmentIcon />} label="Environments" iconPosition="start" />
          <Tab icon={<BrowserIcon />} label="Browsers" iconPosition="start" />
          <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
          <Tab icon={<IntegrationIcon />} label="Integrations" iconPosition="start" />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <GeneralSettings />}
          {tabValue === 1 && <TestEnvironmentSettings />}
          {tabValue === 2 && <BrowserSettings />}
          {tabValue === 3 && <NotificationSettings />}
          {tabValue === 4 && <IntegrationSettings />}
          {tabValue === 5 && <SecuritySettings />}
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;
