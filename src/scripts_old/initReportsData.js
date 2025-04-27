import { MongoClient } from 'mongodb';

// MongoDB connection string
const MONGODB_URI = 'mongodb://admin:admin@localhost:27017/testautomationdb?authSource=admin';

// Database name
const DB_NAME = 'testautomationdb';

// Reports data
const reportsData = {
  testExecutionData: {
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Number of Tests'
        }
      },
      colors: ['#4caf50', '#f44336', '#ff9800', '#9e9e9e'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: false
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top'
      }
    },
    series: [
      {
        name: 'Passed',
        data: [12, 15, 10, 18, 20, 16, 14]
      },
      {
        name: 'Failed',
        data: [3, 2, 5, 2, 1, 2, 3]
      },
      {
        name: 'Pending',
        data: [2, 3, 1, 0, 2, 1, 2]
      },
      {
        name: 'Blocked',
        data: [1, 0, 2, 1, 0, 0, 1]
      }
    ]
  },
  testDurationData: {
    options: {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Duration (minutes)'
        }
      },
      colors: ['#2196f3'],
      markers: {
        size: 4
      }
    },
    series: [
      {
        name: 'Average Duration',
        data: [45, 52, 38, 41, 35, 30, 43]
      }
    ]
  },
  testResults: [
    {
      id: '1',
      name: 'Login Test Suite',
      total: 15,
      passed: 13,
      failed: 2,
      skipped: 0,
      duration: '10:25',
      lastRun: '2023-05-10 09:30'
    },
    {
      id: '2',
      name: 'Payment Processing',
      total: 25,
      passed: 22,
      failed: 1,
      skipped: 2,
      duration: '15:40',
      lastRun: '2023-05-10 10:15'
    },
    {
      id: '3',
      name: 'User Management',
      total: 18,
      passed: 16,
      failed: 0,
      skipped: 2,
      duration: '12:30',
      lastRun: '2023-05-10 11:00'
    }
  ],
  detailedTestResults: [
    {
      id: 'dtr-1',
      name: 'Login Test Suite',
      status: 'passed',
      total: 15,
      passed: 13,
      failed: 2,
      skipped: 0,
      duration: '10:25',
      startTime: '2023-05-10 09:30',
      endTime: '2023-05-10 09:55',
      environment: 'Staging',
      browser: 'Chrome'
    },
    {
      id: 'dtr-2',
      name: 'Payment Processing',
      status: 'passed',
      total: 25,
      passed: 22,
      failed: 1,
      skipped: 2,
      duration: '15:40',
      startTime: '2023-05-10 10:15',
      endTime: '2023-05-10 10:55',
      environment: 'Staging',
      browser: 'Firefox'
    },
    {
      id: 'dtr-3',
      name: 'User Management',
      status: 'passed',
      total: 18,
      passed: 16,
      failed: 0,
      skipped: 2,
      duration: '12:30',
      startTime: '2023-05-10 11:00',
      endTime: '2023-05-10 11:30',
      environment: 'Development',
      browser: 'Chrome'
    },
    {
      id: 'dtr-4',
      name: 'Product Search',
      status: 'failed',
      total: 12,
      passed: 8,
      failed: 4,
      skipped: 0,
      duration: '08:15',
      startTime: '2023-05-10 12:00',
      endTime: '2023-05-10 12:30',
      environment: 'Staging',
      browser: 'Safari'
    },
    {
      id: 'dtr-5',
      name: 'Checkout Process',
      status: 'blocked',
      total: 20,
      passed: 0,
      failed: 0,
      skipped: 20,
      duration: '00:00',
      startTime: '2023-05-10 13:00',
      endTime: '2023-05-10 13:00',
      environment: 'Production',
      browser: 'Chrome'
    }
  ],
  statusDistributionData: {
    options: {
      chart: {
        type: 'donut'
      },
      labels: ['Passed', 'Failed', 'Pending', 'Blocked'],
      colors: ['#4caf50', '#f44336', '#ff9800', '#9e9e9e'],
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(1) + '%';
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%'
          }
        }
      }
    },
    series: [75, 15, 7, 3]
  },
  durationByStatusData: {
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['Passed', 'Failed', 'Pending', 'Blocked'],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Average Duration (minutes)'
        }
      },
      colors: ['#4caf50', '#f44336', '#ff9800', '#9e9e9e'],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      }
    },
    series: [
      {
        name: 'Average Duration',
        data: [12, 18, 5, 0]
      }
    ]
  },
  coverageData: {
    summary: {
      lines: { total: 1250, covered: 1050, percentage: 84 },
      branches: { total: 450, covered: 360, percentage: 80 },
      functions: { total: 320, covered: 288, percentage: 90 },
      statements: { total: 1500, covered: 1275, percentage: 85 }
    },
    files: [
      {
        path: 'src/components/auth/Login.js',
        lines: { total: 120, covered: 110, percentage: 91.7 },
        branches: { total: 45, covered: 40, percentage: 88.9 },
        functions: { total: 25, covered: 24, percentage: 96 },
        statements: { total: 150, covered: 140, percentage: 93.3 },
        uncoveredLines: [45, 67, 89, 120, 145]
      },
      {
        path: 'src/components/checkout/Payment.js',
        lines: { total: 180, covered: 140, percentage: 77.8 },
        branches: { total: 60, covered: 42, percentage: 70 },
        functions: { total: 35, covered: 28, percentage: 80 },
        statements: { total: 220, covered: 170, percentage: 77.3 },
        uncoveredLines: [23, 45, 67, 89, 120, 145, 167, 189, 210, 230]
      }
    ]
  },
  coverageTrendData: {
    options: {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: ['Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'Apr 30', 'May 5', 'May 10'],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Coverage (%)'
        },
        min: 60,
        max: 100
      },
      colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
      markers: {
        size: 4
      },
      legend: {
        position: 'top'
      }
    },
    series: [
      {
        name: 'Lines',
        data: [75, 78, 80, 79, 82, 83, 84]
      },
      {
        name: 'Branches',
        data: [70, 72, 75, 74, 77, 78, 80]
      },
      {
        name: 'Functions',
        data: [85, 86, 87, 88, 89, 89, 90]
      },
      {
        name: 'Statements',
        data: [78, 80, 81, 82, 83, 84, 85]
      }
    ]
  },
  coverageByTypeData: {
    options: {
      chart: {
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px'
            },
            value: {
              fontSize: '16px'
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function() {
                return '85%';
              }
            }
          }
        }
      },
      labels: ['Lines', 'Branches', 'Functions', 'Statements'],
      colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0']
    },
    series: [84, 80, 90, 85]
  },
  uncoveredLinesData: {
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: [
          'src/components/checkout/Payment.js',
          'src/services/api.js',
          'src/components/products/Search.js',
          'src/utils/validation.js',
          'src/components/auth/Login.js'
        ],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Uncovered Lines'
        }
      },
      colors: ['#f44336'],
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      }
    },
    series: [
      {
        name: 'Uncovered Lines',
        data: [25, 18, 15, 12, 10]
      }
    ]
  },
  performanceMetrics: [
    {
      id: 'pm-1',
      testName: 'Login Page Load',
      status: 'good',
      loadTime: 1.2,
      responseTime: 0.8,
      cpuUsage: 15,
      memoryUsage: 45,
      networkRequests: 12,
      browser: 'Chrome',
      device: 'Desktop',
      timestamp: '2023-05-10 09:30'
    },
    {
      id: 'pm-2',
      testName: 'Product Search',
      status: 'warning',
      loadTime: 2.5,
      responseTime: 1.5,
      cpuUsage: 35,
      memoryUsage: 60,
      networkRequests: 25,
      browser: 'Firefox',
      device: 'Desktop',
      timestamp: '2023-05-10 10:15'
    },
    {
      id: 'pm-3',
      testName: 'Checkout Process',
      status: 'critical',
      loadTime: 4.8,
      responseTime: 3.2,
      cpuUsage: 65,
      memoryUsage: 85,
      networkRequests: 40,
      browser: 'Safari',
      device: 'Mobile',
      timestamp: '2023-05-10 11:00'
    }
  ],
  loadTimeData: {
    options: {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: ['Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'Apr 30', 'May 5', 'May 10'],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Load Time (seconds)'
        }
      },
      colors: ['#2196f3'],
      markers: {
        size: 4
      }
    },
    series: [
      {
        name: 'Average Load Time',
        data: [2.8, 2.5, 2.3, 2.4, 2.0, 1.8, 1.5]
      }
    ]
  },
  responseTimeData: {
    options: {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: ['Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'Apr 30', 'May 5', 'May 10'],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Response Time (seconds)'
        }
      },
      colors: ['#ff9800'],
      markers: {
        size: 4
      }
    },
    series: [
      {
        name: 'Average Response Time',
        data: [1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9]
      }
    ]
  },
  resourceUsageData: {
    options: {
      chart: {
        type: 'area',
        stacked: false,
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: ['Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'Apr 30', 'May 5', 'May 10'],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Usage'
        }
      },
      colors: ['#4caf50', '#ff9800'],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.1
        }
      },
      legend: {
        position: 'top'
      }
    },
    series: [
      {
        name: 'CPU Usage (%)',
        data: [45, 42, 50, 48, 35, 40, 38]
      },
      {
        name: 'Memory Usage (MB)',
        data: [250, 230, 280, 270, 220, 240, 230]
      }
    ]
  },
  browserComparisonData: {
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        labels: {
          style: {
            colors: '#777'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Load Time (seconds)'
        }
      },
      colors: ['#2196f3', '#ff9800', '#4caf50'],
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top'
      }
    },
    series: [
      {
        name: 'Desktop',
        data: [1.2, 1.5, 1.8, 1.4]
      },
      {
        name: 'Tablet',
        data: [1.8, 2.1, 2.5, 2.0]
      },
      {
        name: 'Mobile',
        data: [2.5, 2.8, 3.2, 2.7]
      }
    ]
  }
};

async function initReportsData() {
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Insert reports data into MongoDB
    for (const [key, value] of Object.entries(reportsData)) {
      // Check if collection exists and has data
      const count = await db.collection(key).countDocuments();
      
      if (count === 0) {
        // Collection is empty, insert data
        if (Array.isArray(value)) {
          await db.collection(key).insertMany(value);
          console.log(`Inserted ${value.length} documents into collection: ${key}`);
        } else {
          await db.collection(key).insertOne(value);
          console.log(`Inserted 1 document into collection: ${key}`);
        }
      } else {
        console.log(`Collection ${key} already has ${count} document(s), skipping`);
      }
    }
    
    console.log('Reports data initialization completed successfully');
  } catch (error) {
    console.error('Error initializing reports data:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the initialization
initReportsData();
