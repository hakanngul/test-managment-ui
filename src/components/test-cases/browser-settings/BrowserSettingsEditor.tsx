import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import { BrowserSettings } from '../types';
import BasicBrowserSettings from './BasicBrowserSettings';
import AdvancedBrowserSettings from './AdvancedBrowserSettings';
import ScreenshotSettings from './ScreenshotSettings';
import ProxySettings from './ProxySettings';
import BrowserSettingsSummary from './BrowserSettingsSummary';

interface BrowserSettingsEditorProps {
  settings: BrowserSettings;
  onChange: (settings: BrowserSettings) => void;
}

const BrowserSettingsEditor: React.FC<BrowserSettingsEditorProps> = ({ settings, onChange }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tarayıcı Ayarları
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Temel Ayarlar */}
        <BasicBrowserSettings settings={settings} onChange={onChange} />
        
        {/* Ekran Görüntüsü Ayarları */}
        <ScreenshotSettings settings={settings} onChange={onChange} />
        
        {/* Gelişmiş Ayarlar */}
        <AdvancedBrowserSettings settings={settings} onChange={onChange} />
        
        {/* Proxy Ayarları */}
        <ProxySettings settings={settings} onChange={onChange} />
        
        {/* Tarayıcı Bilgisi */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <BrowserSettingsSummary settings={settings} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BrowserSettingsEditor;
