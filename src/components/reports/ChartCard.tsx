import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartCardProps {
  title: string;
  options?: ApexOptions;
  series?: any[];
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'treemap';
  height?: number;
}

// Default chart options and series
const defaultOptions: ApexOptions = {
  chart: {
    toolbar: {
      show: false
    }
  },
  xaxis: {
    categories: ['No Data']
  }
};

const defaultSeries = [
  {
    name: 'No Data',
    data: [0]
  }
];

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  options,
  series,
  type,
  height = 350
}) => {
  // Check if data is available and valid for ApexCharts
  const isDataAvailable = options &&
                         series &&
                         Array.isArray(series) &&
                         series.length > 0 &&
                         typeof options === 'object' &&
                         Object.keys(options).length > 0;

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {isDataAvailable ? (
          <Chart
            options={options}
            series={series}
            type={type}
            height={height}
          />
        ) : (
          <Box
            sx={{
              height: height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'text.secondary'
            }}
          >
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2">Loading chart data...</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
