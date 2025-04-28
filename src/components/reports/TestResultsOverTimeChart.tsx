import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TestResultsOverTime } from '../../mock/reportsMock';

interface TestResultsOverTimeChartProps {
  data: TestResultsOverTime[];
}

const TestResultsOverTimeChart: React.FC<TestResultsOverTimeChartProps> = ({ data }) => {
  const theme = useTheme();
  
  // Tarihi formatla
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
  };
  
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
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {formatDate(label)}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box 
              key={`tooltip-${index}`}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                mb: 0.5
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
              <Typography variant="body2" sx={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </Typography>
            </Box>
          ))}
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Toplam: {payload[0].payload.total}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          Zaman İçinde Test Sonuçları
        </Typography>
        
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="passed" 
                name="Başarılı"
                stackId="1" 
                fill={theme.palette.success.main} 
                stroke={theme.palette.success.main}
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="failed" 
                name="Başarısız"
                stackId="1" 
                fill={theme.palette.error.main} 
                stroke={theme.palette.error.main}
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="blocked" 
                name="Engellendi"
                stackId="1" 
                fill={theme.palette.warning.main} 
                stroke={theme.palette.warning.main}
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="skipped" 
                name="Atlandı"
                stackId="1" 
                fill={theme.palette.info.main} 
                stroke={theme.palette.info.main}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Son 14 günün test sonuçları
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TestResultsOverTimeChart;
