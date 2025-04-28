import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface StatusDistributionChartProps {
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  blockedTests: number;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  passedTests,
  failedTests,
  pendingTests,
  blockedTests,
}) => {
  // Success rate chart options
  const successRateChart: ApexOptions = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    labels: ['Başarılı', 'Başarısız', 'Beklemede', 'Engellenen'],
    colors: ['#4caf50', '#f44336', '#ff9800', '#9e9e9e'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      markers: {
        size: 12
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${value} test (${Math.round((value / (passedTests + failedTests + pendingTests + blockedTests)) * 100)}%)`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: (val) => val.toString(),
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Toplam',
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: '#373d3f',
              formatter: () => (passedTests + failedTests + pendingTests + blockedTests).toString(),
            },
          },
        },
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return Math.round(val) + '%';
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Durumu Dağılımı
        </Typography>
        <Chart
          options={successRateChart}
          series={[passedTests, failedTests, pendingTests, blockedTests]}
          type="donut"
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;
