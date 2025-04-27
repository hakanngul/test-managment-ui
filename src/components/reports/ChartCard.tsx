import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartCardProps {
  title: string;
  options: ApexOptions;
  series: any[];
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'treemap';
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  options,
  series,
  type,
  height = 350
}) => {
  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Chart
          options={options}
          series={series}
          type={type}
          height={height}
        />
      </CardContent>
    </Card>
  );
};

export default ChartCard;
