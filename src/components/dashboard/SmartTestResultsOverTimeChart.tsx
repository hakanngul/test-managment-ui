import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTestResultsOverTimeData } from '../../hooks/cardsHooks/useTestResultsOverTimeData';

const SmartTestResultsOverTimeChart: React.FC = () => {
  const { timeData, isLoading, error } = useTestResultsOverTimeData();

  // Tarih formatı
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

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
          {payload.map((entry: any, index: number) => (
            <Box key={`tooltip-${index}`} sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                  mr: 1
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {entry.name}: {entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (isLoading) {
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
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography color="error">Error: {error}</Typography>
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
      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        Zaman İçinde Test Sonuçları
      </Typography>
      
      <Box sx={{ flex: 1, minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timeData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="passed"
              name="Başarılı"
              stroke="#4caf50"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="failed"
              name="Başarısız"
              stroke="#f44336"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="blocked"
              name="Engellenen"
              stroke="#ff9800"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="skipped"
              name="Atlanan"
              stroke="#9e9e9e"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SmartTestResultsOverTimeChart;