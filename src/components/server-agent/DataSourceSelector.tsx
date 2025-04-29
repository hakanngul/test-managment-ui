import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormControlLabel, Switch, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../../services/api';

/**
 * DataSourceSelector bileşeni
 * 
 * Bu bileşen, veri kaynağını (mock veya gerçek API) seçmek için kullanılır.
 */
const DataSourceSelector: React.FC = () => {
  const [useMockData, setUseMockData] = useState(true);
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:3001/api');
  const [currentDataSource, setCurrentDataSource] = useState<{ useMockData: boolean }>({ useMockData: true });

  // Mevcut veri kaynağını al
  useEffect(() => {
    const dataSourceInfo = api.getDataSourceInfo();
    setCurrentDataSource(dataSourceInfo);
    setUseMockData(dataSourceInfo.useMockData);
  }, []);

  // Veri kaynağını değiştir
  const handleChangeDataSource = () => {
    api.setDataSource(useMockData, apiBaseUrl);
    setCurrentDataSource(api.getDataSourceInfo());
    
    // Sayfayı yenile
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Veri Kaynağı Ayarları
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
            />
          }
          label={useMockData ? "Mock Veri Kullanılıyor" : "Gerçek API Kullanılıyor"}
        />
        
        {!useMockData && (
          <TextField
            label="API Base URL"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
          />
        )}
        
        <Button
          variant="contained"
          onClick={handleChangeDataSource}
          disabled={
            currentDataSource.useMockData === useMockData && 
            (!apiBaseUrl || apiBaseUrl === 'http://localhost:3001/api')
          }
        >
          Veri Kaynağını Değiştir
        </Button>
        
        <Typography variant="body2" color="text.secondary">
          Şu anki veri kaynağı: {currentDataSource.useMockData ? "Mock Veri" : "Gerçek API"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DataSourceSelector;
