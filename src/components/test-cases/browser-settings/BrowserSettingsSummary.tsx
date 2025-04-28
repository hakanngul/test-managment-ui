import React from 'react';
import {
  Box,
  Chip,
  Typography
} from '@mui/material';
import { BrowserSettings } from '../types';

interface BrowserSettingsSummaryProps {
  settings: BrowserSettings;
}

const BrowserSettingsSummary: React.FC<BrowserSettingsSummaryProps> = ({ settings }) => {
  return (
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
  );
};

export default BrowserSettingsSummary;
