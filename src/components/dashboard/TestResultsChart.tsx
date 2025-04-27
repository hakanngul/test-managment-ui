import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface TestResultsChartProps {
  testCountsByDay: any[];
  last7Days: string[];
}

const TestResultsChart: React.FC<TestResultsChartProps> = ({
  testCountsByDay,
  last7Days,
}) => {
  // Test counts by day chart options
  const testCountsChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: last7Days,
    },
    colors: ['#4caf50', '#f44336', '#ff9800', '#9e9e9e'],
    legend: {
      position: 'top',
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} tests`,
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Results by Day
        </Typography>
        <Chart
          options={testCountsChartOptions}
          series={[
            { name: 'Passed', data: testCountsByDay.map((day: any) => day.passed) },
            { name: 'Failed', data: testCountsByDay.map((day: any) => day.failed) },
            { name: 'Pending', data: testCountsByDay.map((day: any) => day.pending) },
            { name: 'Blocked', data: testCountsByDay.map((day: any) => day.blocked) },
          ]}
          type="bar"
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default TestResultsChart;
