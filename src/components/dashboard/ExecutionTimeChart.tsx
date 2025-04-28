import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ExecutionTimeChartProps {
  executionTimeData: number[];
  last7Days: string[];
}

const ExecutionTimeChart: React.FC<ExecutionTimeChartProps> = ({
  executionTimeData,
  last7Days,
}) => {
  // Performance metrics chart options
  const executionTimeChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: ['#4caf50'],
    xaxis: {
      categories: last7Days,
    },
    yaxis: {
      title: {
        text: 'Çalıştırma Süresi (saniye)',
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} saniye`,
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Çalıştırma Süresi (Son 7 Gün)
        </Typography>
        <Chart
          options={executionTimeChartOptions}
          series={[{ name: 'Çalıştırma Süresi', data: executionTimeData }]}
          type="line"
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default ExecutionTimeChart;
