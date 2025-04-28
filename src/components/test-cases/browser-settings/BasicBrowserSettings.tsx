import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { BrowserType } from '../../../models/enums/TestEnums';
import { BrowserSettings } from '../types';

interface BasicBrowserSettingsProps {
  settings: BrowserSettings;
  onChange: (settings: BrowserSettings) => void;
}

const BasicBrowserSettings: React.FC<BasicBrowserSettingsProps> = ({ settings, onChange }) => {
  // Tarayıcı türünü güncelle
  const handleBrowserChange = (browser: BrowserType) => {
    onChange({ ...settings, browser });
  };

  // Headless modunu değiştir
  const handleHeadlessChange = (headless: boolean) => {
    onChange({ ...settings, headless });
  };

  // Ekran görüntüsü alma ayarını değiştir
  const handleTakeScreenshotsChange = (takeScreenshots: boolean) => {
    onChange({ ...settings, takeScreenshots });
  };

  // Genişliği güncelle
  const handleWidthChange = (width: string) => {
    const numWidth = parseInt(width, 10);
    if (!isNaN(numWidth) && numWidth > 0) {
      onChange({ ...settings, width: numWidth });
    }
  };

  // Yüksekliği güncelle
  const handleHeightChange = (height: string) => {
    const numHeight = parseInt(height, 10);
    if (!isNaN(numHeight) && numHeight > 0) {
      onChange({ ...settings, height: numHeight });
    }
  };

  // Zaman aşımını güncelle
  const handleTimeoutChange = (timeout: string) => {
    const numTimeout = parseInt(timeout, 10);
    if (!isNaN(numTimeout) && numTimeout >= 0) {
      onChange({ ...settings, timeout: numTimeout });
    }
  };

  // Cihaz ölçek faktörünü güncelle
  const handleDeviceScaleFactorChange = (deviceScaleFactor: string) => {
    const numFactor = parseFloat(deviceScaleFactor);
    if (!isNaN(numFactor) && numFactor > 0) {
      onChange({ ...settings, deviceScaleFactor: numFactor });
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Temel Ayarlar
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Tarayıcı</InputLabel>
          <Select
            value={settings.browser}
            onChange={(e) => handleBrowserChange(e.target.value as BrowserType)}
            label="Tarayıcı"
          >
            <MenuItem value={BrowserType.CHROME}>Chrome</MenuItem>
            <MenuItem value={BrowserType.FIREFOX}>Firefox</MenuItem>
            <MenuItem value={BrowserType.SAFARI}>Safari</MenuItem>
            <MenuItem value={BrowserType.EDGE}>Edge</MenuItem>
            <MenuItem value={BrowserType.CHROMIUM}>Chromium</MenuItem>
            <MenuItem value={BrowserType.WEBKIT}>WebKit</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.headless}
                onChange={(e) => handleHeadlessChange(e.target.checked)}
                color="primary"
              />
            }
            label="Headless Mod"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.takeScreenshots || false}
                onChange={(e) => handleTakeScreenshotsChange(e.target.checked)}
                color="primary"
              />
            }
            label="Ekran Görüntüsü Al"
          />
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Zaman Aşımı (ms)"
          type="number"
          value={settings.timeout}
          onChange={(e) => handleTimeoutChange(e.target.value)}
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Genişlik (px)"
          type="number"
          value={settings.width}
          onChange={(e) => handleWidthChange(e.target.value)}
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Yükseklik (px)"
          type="number"
          value={settings.height}
          onChange={(e) => handleHeightChange(e.target.value)}
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Cihaz Ölçek Faktörü"
          type="number"
          value={settings.deviceScaleFactor || ''}
          onChange={(e) => handleDeviceScaleFactorChange(e.target.value)}
          InputProps={{ inputProps: { min: 0, step: 0.1 } }}
        />
      </Grid>
    </>
  );
};

export default BasicBrowserSettings;
