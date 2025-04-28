import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import { BrowserType } from '../../models/enums/TestEnums';

export interface BrowserSettings {
  browser: BrowserType;
  headless: boolean;
  width: number;
  height: number;
  timeout: number;
  takeScreenshots?: boolean; // Ekran görüntüsü alma özelliği
  screenshotOnFailure?: boolean; // Sadece hata durumunda ekran görüntüsü al
  screenshotPath?: string; // Ekran görüntülerinin kaydedileceği yol
  userAgent?: string;
  args?: string[];
  ignoreHTTPSErrors?: boolean;
  slowMo?: number;
  recordVideo?: boolean;
  recordHAR?: boolean;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
  proxy?: {
    server: string;
    username?: string;
    password?: string;
  };
}

interface BrowserSettingsEditorProps {
  settings: BrowserSettings;
  onChange: (settings: BrowserSettings) => void;
}

const BrowserSettingsEditor: React.FC<BrowserSettingsEditorProps> = ({ settings, onChange }) => {
  // Tarayıcı türünü güncelle
  const handleBrowserChange = (browser: BrowserType) => {
    onChange({ ...settings, browser });
  };

  // Headless modunu değiştir
  const handleHeadlessChange = (headless: boolean) => {
    onChange({ ...settings, headless });
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

  // Ekran görüntüsü alma ayarını değiştir
  const handleTakeScreenshotsChange = (takeScreenshots: boolean) => {
    onChange({ ...settings, takeScreenshots });
  };

  // Sadece hata durumunda ekran görüntüsü alma ayarını değiştir
  const handleScreenshotOnFailureChange = (screenshotOnFailure: boolean) => {
    onChange({ ...settings, screenshotOnFailure });
  };

  // Ekran görüntüsü kaydetme yolunu güncelle
  const handleScreenshotPathChange = (screenshotPath: string) => {
    onChange({ ...settings, screenshotPath });
  };

  // Cihaz ölçek faktörünü güncelle
  const handleDeviceScaleFactorChange = (deviceScaleFactor: string) => {
    const numFactor = parseFloat(deviceScaleFactor);
    if (!isNaN(numFactor) && numFactor > 0) {
      onChange({ ...settings, deviceScaleFactor: numFactor });
    }
  };

  // Mobil cihaz ayarını değiştir
  const handleIsMobileChange = (isMobile: boolean) => {
    onChange({ ...settings, isMobile });
  };

  // Dokunmatik ekran ayarını değiştir
  const handleHasTouchChange = (hasTouch: boolean) => {
    onChange({ ...settings, hasTouch });
  };

  // Proxy sunucusunu güncelle
  const handleProxyServerChange = (server: string) => {
    // Eğer proxy tanımlı değilse, yeni bir proxy objesi oluştur
    const proxy = settings.proxy
      ? { ...settings.proxy, server }
      : { server };
    onChange({ ...settings, proxy });
  };

  // Proxy kullanıcı adını güncelle
  const handleProxyUsernameChange = (username: string) => {
    // Eğer proxy tanımlı değilse, server için boş bir değer ata
    const proxy = settings.proxy
      ? { ...settings.proxy, username }
      : { server: '', username };
    onChange({ ...settings, proxy });
  };

  // Proxy şifresini güncelle
  const handleProxyPasswordChange = (password: string) => {
    // Eğer proxy tanımlı değilse, server için boş bir değer ata
    const proxy = settings.proxy
      ? { ...settings.proxy, password }
      : { server: '', password };
    onChange({ ...settings, proxy });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tarayıcı Ayarları
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Temel Ayarlar */}
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

        {/* Boyut Ayarları */}
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

        {/* Gelişmiş Ayarlar */}
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

        {settings.takeScreenshots && (
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
        )}

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

        {/* Proxy Ayarları */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Proxy Ayarları
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Proxy Sunucusu"
            value={settings.proxy?.server || ''}
            onChange={(e) => handleProxyServerChange(e.target.value)}
            placeholder="http://proxy.example.com:8080"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Proxy Kullanıcı Adı"
            value={settings.proxy?.username || ''}
            onChange={(e) => handleProxyUsernameChange(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Proxy Şifresi"
            type="password"
            value={settings.proxy?.password || ''}
            onChange={(e) => handleProxyPasswordChange(e.target.value)}
          />
        </Grid>

        {/* Tarayıcı Bilgisi */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Seçilen Tarayıcı Özellikleri
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              <Chip label={`Tarayıcı: ${settings.browser}`} color="primary" variant="outlined" />
              <Chip label={`Headless: ${settings.headless ? 'Evet' : 'Hayır'}`} color="primary" variant="outlined" />
              <Chip label={`Boyut: ${settings.width}x${settings.height}`} color="primary" variant="outlined" />
              <Chip label={`Zaman Aşımı: ${settings.timeout}ms`} color="primary" variant="outlined" />
              {settings.userAgent && (
                <Chip label="Özel User Agent" color="secondary" variant="outlined" />
              )}
              {settings.slowMo && (
                <Chip label={`Yavaşlatma: ${settings.slowMo}ms`} color="secondary" variant="outlined" />
              )}
              {settings.recordVideo && (
                <Chip label="Video Kaydı" color="secondary" variant="outlined" />
              )}
              {settings.takeScreenshots && (
                <Chip label="Ekran Görüntüsü Alma" color="secondary" variant="outlined" />
              )}
              {settings.takeScreenshots && settings.screenshotOnFailure && (
                <Chip label="Hata Durumunda Ekran Görüntüsü" color="secondary" variant="outlined" />
              )}
              {settings.isMobile && (
                <Chip label="Mobil Emülasyon" color="secondary" variant="outlined" />
              )}
              {settings.proxy?.server && (
                <Chip label="Proxy Yapılandırıldı" color="secondary" variant="outlined" />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BrowserSettingsEditor;
