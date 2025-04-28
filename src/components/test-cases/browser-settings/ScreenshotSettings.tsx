import React from 'react';
import {
  Grid,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import { BrowserSettings } from '../types';

interface ScreenshotSettingsProps {
  settings: BrowserSettings;
  onChange: (settings: BrowserSettings) => void;
}

const ScreenshotSettings: React.FC<ScreenshotSettingsProps> = ({ settings, onChange }) => {
  // Sadece hata durumunda ekran görüntüsü alma ayarını değiştir
  const handleScreenshotOnFailureChange = (screenshotOnFailure: boolean) => {
    onChange({ ...settings, screenshotOnFailure });
  };

  // Ekran görüntüsü kaydetme yolunu güncelle
  const handleScreenshotPathChange = (screenshotPath: string) => {
    onChange({ ...settings, screenshotPath });
  };

  // Ekran görüntüsü alma özelliği etkin değilse, bileşeni gösterme
  if (!settings.takeScreenshots) {
    return null;
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.screenshotOnFailure || false}
              onChange={(e) => handleScreenshotOnFailureChange(e.target.checked)}
              color="primary"
            />
          }
          label="Sadece Hata Durumunda Ekran Görüntüsü Al"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Ekran Görüntüsü Kaydetme Yolu"
          value={settings.screenshotPath || ''}
          onChange={(e) => handleScreenshotPathChange(e.target.value)}
          placeholder="screenshots/"
          helperText="Boş bırakılırsa varsayılan konum kullanılır"
        />
      </Grid>
    </>
  );
};

export default ScreenshotSettings;
