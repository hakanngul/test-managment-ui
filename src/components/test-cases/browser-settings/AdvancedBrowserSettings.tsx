import React from 'react';
import {
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Divider
} from '@mui/material';
import { BrowserSettings } from '../types';

interface AdvancedBrowserSettingsProps {
  settings: BrowserSettings;
  onChange: (settings: BrowserSettings) => void;
}

const AdvancedBrowserSettings: React.FC<AdvancedBrowserSettingsProps> = ({ settings, onChange }) => {
  // User Agent'ı güncelle
  const handleUserAgentChange = (userAgent: string) => {
    onChange({ ...settings, userAgent });
  };

  // Yavaşlatma değerini güncelle
  const handleSlowMoChange = (slowMo: string) => {
    const numSlowMo = parseInt(slowMo, 10);
    if (!isNaN(numSlowMo) && numSlowMo >= 0) {
      onChange({ ...settings, slowMo: numSlowMo });
    }
  };

  // HTTPS hatalarını yok sayma ayarını değiştir
  const handleIgnoreHTTPSErrorsChange = (ignoreHTTPSErrors: boolean) => {
    onChange({ ...settings, ignoreHTTPSErrors });
  };

  // Video kaydetme ayarını değiştir
  const handleRecordVideoChange = (recordVideo: boolean) => {
    onChange({ ...settings, recordVideo });
  };

  // HAR kaydetme ayarını değiştir
  const handleRecordHARChange = (recordHAR: boolean) => {
    onChange({ ...settings, recordHAR });
  };

  // Mobil cihaz ayarını değiştir
  const handleIsMobileChange = (isMobile: boolean) => {
    onChange({ ...settings, isMobile });
  };

  // Dokunmatik ekran ayarını değiştir
  const handleHasTouchChange = (hasTouch: boolean) => {
    onChange({ ...settings, hasTouch });
  };

  return (
    <>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Gelişmiş Ayarlar
        </Typography>
        <Divider />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="User Agent"
          value={settings.userAgent || ''}
          onChange={(e) => handleUserAgentChange(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Yavaşlatma (ms)"
          type="number"
          value={settings.slowMo || ''}
          onChange={(e) => handleSlowMoChange(e.target.value)}
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.ignoreHTTPSErrors || false}
              onChange={(e) => handleIgnoreHTTPSErrorsChange(e.target.checked)}
              color="primary"
            />
          }
          label="HTTPS Hatalarını Yok Say"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.recordVideo || false}
              onChange={(e) => handleRecordVideoChange(e.target.checked)}
              color="primary"
            />
          }
          label="Video Kaydet"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.recordHAR || false}
              onChange={(e) => handleRecordHARChange(e.target.checked)}
              color="primary"
            />
          }
          label="HAR Kaydet"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.isMobile || false}
              onChange={(e) => handleIsMobileChange(e.target.checked)}
              color="primary"
            />
          }
          label="Mobil Cihaz Emülasyonu"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.hasTouch || false}
              onChange={(e) => handleHasTouchChange(e.target.checked)}
              color="primary"
            />
          }
          label="Dokunmatik Ekran"
        />
      </Grid>
    </>
  );
};

export default AdvancedBrowserSettings;
