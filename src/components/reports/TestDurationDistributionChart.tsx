import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TestDurationDistribution } from '../../mock/reportsMock';

interface TestDurationDistributionChartProps {
  data: TestDurationDistribution[];
}

const TestDurationDistributionChart: React.FC<TestDurationDistributionChartProps> = ({ data }) => {
  const theme = useTheme();
  
  // Özel tooltip içeriği
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1.5, 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 1
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {label}
          </Typography>
          <Typography variant="body2">
            {payload[0].value} test
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Toplam test sayısı
  const totalTests = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          Test Çalıştırma Süresi Dağılımı
        </Typography>
        
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Test Sayısı">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={theme.palette.primary.main} 
                    fillOpacity={0.6 + (index * 0.1)} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Toplam {totalTests.toLocaleString()} test
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TestDurationDistributionChart;
