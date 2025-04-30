import React from 'react';
import { Paper, Typography, Box, CircularProgress, Button, Tooltip, IconButton } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { TestCaseCategory } from '../../models/interfaces/ITestCase';
import { useTestCategoryDistributionData } from '../../hooks/cardsHooks/useTestCategoryDistributionData';

const SmartTestCategoryDistributionChart: React.FC = () => {
  const { distributionData, isLoading, error, refresh } = useTestCategoryDistributionData();

  // Kategori adları
  const CATEGORY_NAMES = {
    [TestCaseCategory.FUNCTIONAL]: 'Fonksiyonel',
    [TestCaseCategory.REGRESSION]: 'Regresyon',
    [TestCaseCategory.INTEGRATION]: 'Entegrasyon',
    [TestCaseCategory.PERFORMANCE]: 'Performans',
    [TestCaseCategory.SECURITY]: 'Güvenlik',
    [TestCaseCategory.USABILITY]: 'Kullanılabilirlik',
    [TestCaseCategory.ACCEPTANCE]: 'Kabul',
    [TestCaseCategory.SMOKE]: 'Smoke',
    [TestCaseCategory.EXPLORATORY]: 'Keşif'
  };

  // Grafik verilerini hazırla
  const chartData = distributionData.map(item => ({
    name: CATEGORY_NAMES[item.category],
    count: item.count,
    percentage: item.percentage
  }));

  // Özel tooltip içeriği
  const CustomTooltip = ({ active, payload, label }: any) => {
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
            {label}
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

  if (isLoading && distributionData.length === 0) {
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
          p: 2,
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
          Test Kategorisi Dağılımı
        </Typography>
        
        {isLoading && (
          <CircularProgress size={20} sx={{ ml: 1 }} />
        )}
        
        <Tooltip title="Yenile">
          <IconButton size="small" onClick={refresh}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ flex: 1, minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 100,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12 }}
              width={100}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#3f51b5" 
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SmartTestCategoryDistributionChart;