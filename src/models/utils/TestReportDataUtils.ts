import { 
  TestResultSummary,
  TestExecutionTrendData,
  TestDurationTrendData,
  StatusDistributionData,
  DurationByStatusData,
  ErrorDistributionData,
  PerformanceMetricsData,
  TestCoverageData,
  TestReportSummary,
  TestQualityMetrics,
  ComparativeReportData,
  CustomReportConfig
} from '../interfaces/TestReportData';
import { TestResult } from '../interfaces/TestResult';
import { TestResultStatus, TestErrorType, TestErrorCategory } from '../enums/TestResultEnums';
import { ApexOptions } from 'apexcharts';

// Convert raw test result summary data to TestResultSummary model
export const toTestResultSummary = (data: any): TestResultSummary => {
  return {
    id: data.id || data._id,
    name: data.name,
    total: data.total || 0,
    passed: data.passed || 0,
    failed: data.failed || 0,
    skipped: data.skipped || 0,
    blocked: data.blocked || 0,
    pending: data.pending || 0,
    error: data.error || 0,
    duration: data.duration || '0s',
    durationMs: data.durationMs,
    lastRun: data.lastRun ? new Date(data.lastRun) : new Date(),
    passRate: data.total > 0 ? (data.passed / data.total) * 100 : 0,
    priority: data.priority,
    severity: data.severity,
    tags: data.tags,
    categories: data.categories
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
    series: data.series,
    timeRange: data.timeRange,
    interval: data.interval,
    filters: data.filters
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
    series: data.series,
    timeRange: data.timeRange,
    interval: data.interval,
    filters: data.filters
  };
};

// Convert raw status distribution data to StatusDistributionData model
export const toStatusDistributionData = (data: any): StatusDistributionData => {
  if (!data || !data.options || !data.series) {
    // Default data if none provided
    return {
      options: {
        chart: {
          type: 'pie',
          height: 350
        },
        labels: ['Passed', 'Failed', 'Skipped', 'Blocked', 'Pending', 'Error'],
        colors: ['#00E396', '#FF4560', '#FEB019', '#775DD0', '#008FFB', '#546E7A']
      },
      series: [0, 0, 0, 0, 0, 0]
    };
  }
  
  return {
    options: data.options,
    series: data.series,
    filters: data.filters
  };
};

// Convert raw duration by status data to DurationByStatusData model
export const toDurationByStatusData = (data: any): DurationByStatusData => {
  if (!data || !data.options || !data.series) {
    // Default data if none provided
    return {
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        xaxis: {
          categories: ['Passed', 'Failed', 'Skipped', 'Blocked', 'Pending', 'Error']
        },
        yaxis: {
          title: {
            text: 'Average Duration (seconds)'
          }
        },
        colors: ['#00E396', '#FF4560', '#FEB019', '#775DD0', '#008FFB', '#546E7A']
      },
      series: [
        {
          name: 'Average Duration',
          data: [0, 0, 0, 0, 0, 0]
        }
      ]
    };
  }
  
  return {
    options: data.options,
    series: data.series,
    filters: data.filters
  };
};

// Convert raw error distribution data to ErrorDistributionData model
export const toErrorDistributionData = (data: any): ErrorDistributionData => {
  if (!data || !data.options || !data.series) {
    // Default data if none provided
    return {
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        xaxis: {
          categories: ['Syntax', 'Assertion', 'Timeout', 'Network', 'Element Not Found', 'Other']
        },
        yaxis: {
          title: {
            text: 'Error Count'
          }
        }
      },
      series: [
        {
          name: 'Error Count',
          data: [0, 0, 0, 0, 0, 0]
        }
      ]
    };
  }
  
  return {
    options: data.options,
    series: data.series,
    byType: data.byType,
    byCategory: data.byCategory,
    bySeverity: data.bySeverity,
    filters: data.filters
  };
};

// Convert raw performance metrics data to PerformanceMetricsData model
export const toPerformanceMetricsData = (data: any): PerformanceMetricsData => {
  if (!data || !data.options || !data.series) {
    // Default data if none provided
    return {
      options: {
        chart: {
          type: 'line',
          height: 350
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yaxis: {
          title: {
            text: 'Load Time (ms)'
          }
        }
      },
      series: [
        {
          name: 'Load Time',
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ]
    };
  }
  
  return {
    options: data.options,
    series: data.series,
    metricType: data.metricType,
    timeRange: data.timeRange,
    interval: data.interval,
    filters: data.filters
  };
};

// Generate test report summary from test results
export const generateTestReportSummary = (
  testResults: TestResultSummary[],
  previousPassRate: number = 0
): TestReportSummary => {
  const totalTests = testResults.length;
  
  if (totalTests === 0) {
    return {
      totalTests: 0,
      passRate: 0,
      averageDuration: '0m 0s',
      averageDurationMs: 0,
      failedTests: 0,
      blockedTests: 0,
      skippedTests: 0,
      pendingTests: 0,
      errorTests: 0,
      lastUpdated: new Date(),
      trend: {
        passRate: 0,
        change: 0
      }
    };
  }
  
  const totalPassed = testResults.reduce((sum, result) => sum + result.passed, 0);
  const totalFailed = testResults.reduce((sum, result) => sum + result.failed, 0);
  const totalBlocked = testResults.reduce((sum, result) => sum + (result.blocked || 0), 0);
  const totalSkipped = testResults.reduce((sum, result) => sum + result.skipped, 0);
  const totalPending = testResults.reduce((sum, result) => sum + (result.pending || 0), 0);
  const totalError = testResults.reduce((sum, result) => sum + (result.error || 0), 0);
  
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
  
  // Calculate quality metrics (placeholder)
  const qualityMetrics: TestQualityMetrics = {
    errorDensity: totalTests > 0 ? (totalFailed + totalError) / totalTests : 0,
    testEffectiveness: totalTests > 0 ? (totalFailed + totalError) / totalTests * 100 : 0,
    testEfficiency: 0, // Would need time data to calculate
    qualityScore: passRate // Simple quality score based on pass rate
  };
  
  return {
    totalTests,
    passRate,
    averageDuration,
    averageDurationMs,
    failedTests: totalFailed,
    blockedTests: totalBlocked,
    skippedTests: totalSkipped,
    pendingTests: totalPending,
    errorTests: totalError,
    lastUpdated: new Date(),
    trend: {
      passRate,
      change
    },
    qualityMetrics
  };
};

// Generate comparative report data
export const generateComparativeReportData = (
  current: TestReportSummary,
  previous: TestReportSummary,
  reference?: TestReportSummary
): ComparativeReportData => {
  const changes = {
    passRate: current.passRate - previous.passRate,
    totalTests: current.totalTests - previous.totalTests,
    failedTests: current.failedTests - previous.failedTests,
    averageDuration: (current.averageDurationMs || 0) - (previous.averageDurationMs || 0),
    qualityScore: (current.qualityMetrics?.qualityScore || 0) - (previous.qualityMetrics?.qualityScore || 0)
  };
  
  // Identify improvement areas
  const improvementAreas: string[] = [];
  if (changes.passRate > 0) improvementAreas.push('Pass Rate');
  if (changes.failedTests < 0) improvementAreas.push('Failed Tests');
  if (changes.averageDuration < 0) improvementAreas.push('Test Duration');
  if (changes.qualityScore > 0) improvementAreas.push('Quality Score');
  
  // Identify regression areas
  const regressionAreas: string[] = [];
  if (changes.passRate < 0) regressionAreas.push('Pass Rate');
  if (changes.failedTests > 0) regressionAreas.push('Failed Tests');
  if (changes.averageDuration > 0) regressionAreas.push('Test Duration');
  if (changes.qualityScore < 0) regressionAreas.push('Quality Score');
  
  return {
    current,
    previous,
    reference,
    changes,
    improvementAreas,
    regressionAreas
  };
};

// Create default chart options
export const createDefaultChartOptions = (
  chartType: string,
  title: string,
  xAxisTitle: string,
  yAxisTitle: string
): ApexOptions => {
  return {
    chart: {
      type: chartType as any,
      height: 350,
      toolbar: {
        show: true
      }
    },
    title: {
      text: title,
      align: 'left'
    },
    xaxis: {
      title: {
        text: xAxisTitle
      }
    },
    yaxis: {
      title: {
        text: yAxisTitle
      }
    }
  };
};
