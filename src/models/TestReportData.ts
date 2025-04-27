import { ApexOptions } from 'apexcharts';
import { TestResultStatus } from './TestResult';

// Test result summary for reports
export interface TestResultSummary {
  id: string;
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  durationMs?: number;
  lastRun: Date;
  passRate?: number;
}

// Test execution trend data
export interface TestExecutionTrendData {
  options: ApexOptions;
  series: any[];
}

// Test duration trend data
export interface TestDurationTrendData {
  options: ApexOptions;
  series: any[];
}

// Status distribution data
export interface StatusDistributionData {
  options: ApexOptions;
  series: any[];
}

// Duration by status data
export interface DurationByStatusData {
  options: ApexOptions;
  series: any[];
}

// Test report summary
export interface TestReportSummary {
  totalTests: number;
  passRate: number;
  averageDuration: string;
  averageDurationMs?: number;
  failedTests: number;
  lastUpdated: Date;
  trend: {
    passRate: number;
    change: number;
  };
}

// Convert raw test result summary data to TestResultSummary model
export const toTestResultSummary = (data: any): TestResultSummary => {
  return {
    id: data.id || data._id,
    name: data.name,
    total: data.total || 0,
    passed: data.passed || 0,
    failed: data.failed || 0,
    skipped: data.skipped || 0,
    duration: data.duration || '0s',
    durationMs: data.durationMs,
    lastRun: data.lastRun ? new Date(data.lastRun) : new Date(),
    passRate: data.total > 0 ? (data.passed / data.total) * 100 : 0
  };
};

// Convert raw test execution trend data to TestExecutionTrendData model
export const toTestExecutionTrendData = (data: any): TestExecutionTrendData => {
  if (!data || !data.options || !data.series) {
    // Default data if none provided
    return {
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          }
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      },
      series: [
        {
          name: 'Passed',
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Failed',
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Skipped',
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ]
    };
  }
  
  return {
    options: data.options,
    series: data.series
  };
};

// Convert raw test duration trend data to TestDurationTrendData model
export const toTestDurationTrendData = (data: any): TestDurationTrendData => {
  if (!data || !data.options || !data.series) {
    // Default data if none provided
    return {
      options: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: true
          }
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yaxis: {
          title: {
            text: 'Duration (minutes)'
          }
        }
      },
      series: [
        {
          name: 'Duration',
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ]
    };
  }
  
  return {
    options: data.options,
    series: data.series
  };
};

// Generate test report summary from test results
export const generateTestReportSummary = (
  testResults: TestResultSummary[],
  previousPassRate: number = 0
): TestReportSummary => {
  const totalTests = testResults.length;
  const totalPassed = testResults.reduce((sum, result) => sum + result.passed, 0);
  const totalFailed = testResults.reduce((sum, result) => sum + result.failed, 0);
  
  // Calculate pass rate
  const passRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
  
  // Calculate average duration
  const totalDurationMs = testResults.reduce((sum, result) => {
    if (result.durationMs) {
      return sum + result.durationMs;
    }
    return sum;
  }, 0);
  
  const averageDurationMs = totalTests > 0 ? totalDurationMs / totalTests : 0;
  
  // Format average duration
  const minutes = Math.floor(averageDurationMs / 60000);
  const seconds = Math.floor((averageDurationMs % 60000) / 1000);
  const averageDuration = `${minutes}m ${seconds}s`;
  
  // Calculate pass rate change
  const change = passRate - previousPassRate;
  
  return {
    totalTests,
    passRate,
    averageDuration,
    averageDurationMs,
    failedTests: totalFailed,
    lastUpdated: new Date(),
    trend: {
      passRate,
      change
    }
  };
};
