import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TestCategoryDistribution } from '../../mock/dashboardMock';
import { TestCaseCategory } from '../../models/interfaces/ITestCase';

interface TestCategoryDistributionChartProps {
  data: TestCategoryDistribution[];
}

const TestCategoryDistributionChart: React.FC<TestCategoryDistributionChartProps> = ({ data }) => {
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
  const chartData = data.map(item => ({
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
      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        Test Kategorisi Dağılımı
      </Typography>
      
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
            <Tooltip content={<CustomTooltip />} />
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

export default TestCategoryDistributionChart;
