import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { TestFailureReason } from '../../mock/reportsMock';

interface TestFailureReasonsChartProps {
  data: TestFailureReason[];
}

const TestFailureReasonsChart: React.FC<TestFailureReasonsChartProps> = ({ data }) => {
  const theme = useTheme();
  
  // Renk paleti
  const COLORS = [
    theme.palette.error.main,
    theme.palette.error.dark,
    theme.palette.error.light,
    theme.palette.warning.main,
    theme.palette.warning.dark,
    theme.palette.warning.light
  ];
  
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
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {data.reason}
          </Typography>
          <Typography variant="body2">
            {data.count} test ({data.percentage}%)
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
              {entry.value}: {data[index].count} ({data[index].percentage}%)
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
          Test Başarısızlık Nedenleri
        </Typography>
        
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="reason"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Toplam {data.reduce((sum, item) => sum + item.count, 0)} başarısız test
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TestFailureReasonsChart;
