import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
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
import { BrowserDistribution, EnvironmentDistribution } from '../../mock/reportsMock';

interface BrowserEnvironmentDistributionChartProps {
  browserData: BrowserDistribution[];
  environmentData: EnvironmentDistribution[];
}

const BrowserEnvironmentDistributionChart: React.FC<BrowserEnvironmentDistributionChartProps> = ({ 
  browserData,
  environmentData
}) => {
  const theme = useTheme();
  
  // Tarayıcı renk paleti
  const BROWSER_COLORS = [
    theme.palette.primary.main,
    theme.palette.primary.dark,
    theme.palette.primary.light,
    theme.palette.info.main,
    theme.palette.info.dark
  ];
  
  // Ortam renk paleti
  const ENVIRONMENT_COLORS = [
    theme.palette.success.main,
    theme.palette.success.dark,
    theme.palette.success.light,
    theme.palette.warning.main
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
            {data.browser || data.environment}
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
  const CustomLegend = ({ payload, data }: any) => {
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
          Tarayıcı ve Ortam Dağılımı
        </Typography>
        
        <Grid container spacing={2}>
          {/* Tarayıcı Dağılımı */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" align="center" gutterBottom>
              Tarayıcı Dağılımı
            </Typography>
            <Box sx={{ height: 250, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="browser"
                  >
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BROWSER_COLORS[index % BROWSER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend data={browserData} />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          {/* Ortam Dağılımı */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" align="center" gutterBottom>
              Ortam Dağılımı
            </Typography>
            <Box sx={{ height: 250, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={environmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="environment"
                  >
                    {environmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ENVIRONMENT_COLORS[index % ENVIRONMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend data={environmentData} />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BrowserEnvironmentDistributionChart;
