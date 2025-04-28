import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TestResultDistribution } from '../../mock/reportsMock';

interface TestResultDistributionChartProps {
  data: TestResultDistribution;
}

const TestResultDistributionChart: React.FC<TestResultDistributionChartProps> = ({ data }) => {
  const theme = useTheme();
  
  // Veriyi grafik için formatlama
  const chartData = [
    { name: 'Başarılı', value: data.passed, color: theme.palette.success.main },
    { name: 'Başarısız', value: data.failed, color: theme.palette.error.main },
    { name: 'Engellendi', value: data.blocked, color: theme.palette.warning.main },
    { name: 'Atlandı', value: data.skipped, color: theme.palette.info.main },
    { name: 'Çalıştırılmadı', value: data.notRun, color: theme.palette.grey[400] }
  ];
  
  // Toplam test sayısı
  const totalTests = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Özel tooltip içeriği
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1.5, 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 1
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: data.color }}>
            {data.name}
          </Typography>
          <Typography variant="body2">
            {data.value} test ({((data.value / totalTests) * 100).toFixed(1)}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };
  
  // Özel legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        gap: 2,
        mt: 2
      }}>
        {payload.map((entry: any, index: number) => (
          <Box 
            key={`legend-${index}`}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%',
                bgcolor: entry.color
              }} 
            />
            <Typography variant="body2" color="text.secondary">
              {entry.value}: {chartData[index].value} ({((chartData[index].value / totalTests) * 100).toFixed(1)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          Test Sonuçları Dağılımı
        </Typography>
        
        <Box sx={{ height: 300, width: '100%' }}>
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
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Toplam {totalTests.toLocaleString()} test
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TestResultDistributionChart;
