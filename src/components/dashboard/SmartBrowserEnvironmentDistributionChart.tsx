import React from 'react';
import { Paper, Typography, Box, Grid, CircularProgress, Button } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useBrowserEnvironmentDistributionData } from '../../hooks/cardsHooks/useBrowserEnvironmentDistributionData';

const SmartBrowserEnvironmentDistributionChart: React.FC = () => {
  const { browserData, environmentData, isLoading, error, refresh } = useBrowserEnvironmentDistributionData();

  // Tarayıcı renkleri
  const BROWSER_COLORS = {
    'Chrome': '#4285F4',
    'Firefox': '#FF7139',
    'Safari': '#0FB5EE',
    'Edge': '#0078D7',
    'IE': '#0076D6'
  };

  // Ortam renkleri
  const ENVIRONMENT_COLORS = ['#8bc34a', '#03a9f4', '#ff9800', '#9c27b0'];

  // Özel tooltip içeriği
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: '1px solid #ccc',
            borderRadius: 1,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="subtitle2" color="text.primary">
            {payload[0].name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sayı: {payload[0].value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Oran: %{payload[0].payload.percentage.toFixed(1)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Özel legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 1 }}>
        {payload.map((entry: any, index: number) => (
          <Box 
            key={`legend-${index}`} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mx: 1,
              mb: 0.5
            }}
          >
            <Box 
              sx={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                bgcolor: entry.color,
                mr: 0.5
              }} 
            />
            <Typography variant="body2" color="text.secondary">
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  if (isLoading && browserData.length === 0 && environmentData.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          height: '100%',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography color="error" gutterBottom>
          Veri yüklenirken hata oluştu: {error}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={refresh}
        >
          Yeniden Dene
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1
      }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Tarayıcı ve Ortam Dağılımı
        </Typography>
        
        {isLoading && (
          <CircularProgress size={20} />
        )}
      </Box>
      
      <Grid container spacing={2} sx={{ flex: 1 }}>
        {/* Tarayıcı Dağılımı */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Tarayıcı Dağılımı
          </Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={browserData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="browser"
                  labelLine={false}
                >
                  {browserData.map((entry, index) => (
                    <Cell 
                      key={`browser-cell-${index}`} 
                      fill={BROWSER_COLORS[entry.browser as keyof typeof BROWSER_COLORS] || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        {/* Ortam Dağılımı */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Ortam Dağılımı
          </Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={environmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="environment"
                  labelLine={false}
                >
                  {environmentData.map((_entry, index) => (
                    <Cell 
                      key={`env-cell-${index}`} 
                      fill={ENVIRONMENT_COLORS[index % ENVIRONMENT_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SmartBrowserEnvironmentDistributionChart;