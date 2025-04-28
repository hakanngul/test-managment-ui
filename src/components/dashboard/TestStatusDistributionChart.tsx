import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TestStatusDistribution } from '../../mock/dashboardMock';
import { TestCaseResult } from '../../models/interfaces/ITestCase';

interface TestStatusDistributionChartProps {
  data: TestStatusDistribution[];
}

const TestStatusDistributionChart: React.FC<TestStatusDistributionChartProps> = ({ data }) => {
  // Renk paleti
  const COLORS = {
    [TestCaseResult.PASSED]: '#4caf50',
    [TestCaseResult.FAILED]: '#f44336',
    [TestCaseResult.BLOCKED]: '#ff9800',
    [TestCaseResult.SKIPPED]: '#9e9e9e',
    [TestCaseResult.NOT_RUN]: '#2196f3'
  };

  // Durum adları
  const STATUS_NAMES = {
    [TestCaseResult.PASSED]: 'Başarılı',
    [TestCaseResult.FAILED]: 'Başarısız',
    [TestCaseResult.BLOCKED]: 'Engellenen',
    [TestCaseResult.SKIPPED]: 'Atlanan',
    [TestCaseResult.NOT_RUN]: 'Çalıştırılmayan'
  };

  // Grafik verilerini hazırla
  const chartData = data.map(item => ({
    name: STATUS_NAMES[item.status],
    value: item.count,
    percentage: item.percentage,
    color: COLORS[item.status]
  }));

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
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
        {payload.map((entry: any, index: number) => (
          <Box 
            key={`legend-${index}`} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mx: 1.5,
              mb: 1
            }}
          >
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
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
        Test Durumu Dağılımı
      </Typography>
      
      <Box sx={{ flex: 1, minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TestStatusDistributionChart;
