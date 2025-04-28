import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  Divider
} from '@mui/material';
import { BrowserSettings } from '../types';

interface ProxySettingsProps {
  settings: BrowserSettings;
  onChange: (settings: BrowserSettings) => void;
}

const ProxySettings: React.FC<ProxySettingsProps> = ({ settings, onChange }) => {
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
    <>
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
    </>
  );
};

export default ProxySettings;
