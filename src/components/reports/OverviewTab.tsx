import React from 'react';
import { Grid } from '@mui/material';
import SummaryCard from './SummaryCard';
import ChartCard from './ChartCard';
import TestResultsTable from './TestResultsTable';
import {
  TestResultSummary,
  TestExecutionTrendData,
  TestDurationTrendData,
  TestReportSummary
} from '../../models';

interface OverviewTabProps {
  testExecutionData: TestExecutionTrendData;
  testDurationData: TestDurationTrendData;
  testResults: TestResultSummary[];
  testReportSummary?: TestReportSummary;
  onViewAllResults: () => void;
  onViewTestDetails: (id: string) => void;
  onDownloadTestReport: (id: string) => void;
  onShareTestReport: (id: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  testExecutionData,
  testDurationData,
  testResults,
  testReportSummary,
  onViewAllResults,
  onViewTestDetails,
  onDownloadTestReport,
  onShareTestReport
}) => {
  // Use testReportSummary if provided, otherwise calculate from testResults
  const summary = testReportSummary || {
    totalTests: testResults.length,
    passRate: testResults.length > 0
      ? testResults.reduce((sum, result) => sum + result.passed, 0) / testResults.length
      : 0,
    averageDuration: "0m",
    failedTests: testResults.reduce((sum, result) => sum + result.failed, 0),
    lastUpdated: new Date(),
    trend: { passRate: 0, change: 0 }
  };

  // Format values for display
  const totalTestsFormatted = summary.totalTests.toLocaleString();
  const passRateFormatted = `${Math.round(summary.passRate)}%`;
  const changePrefix = summary.trend.change >= 0 ? '+' : '';
  const changeFormatted = `${changePrefix}${Math.round(summary.trend.change)}% from last week`;
  const failedTestsFormatted = summary.failedTests.toLocaleString();

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Total Tests"
          value={totalTestsFormatted}
          subtitle="Last 7 days"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Pass Rate"
          value={passRateFormatted}
          subtitle={changeFormatted}
          color={summary.trend.change >= 0 ? "success.main" : "error.main"}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Average Duration"
          value={summary.averageDuration}
          subtitle="Per test suite"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Failed Tests"
          value={failedTestsFormatted}
          subtitle="Requires attention"
          color="error.main"
        />
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={8}>
        <ChartCard
          title="Test Execution Trend"
          options={testExecutionData.options}
          series={testExecutionData.series}
          type="bar"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ChartCard
          title="Test Duration Trend"
          options={testDurationData.options}
          series={testDurationData.series}
          type="line"
        />
      </Grid>

      {/* Test Results Table */}
      <Grid item xs={12}>
        <TestResultsTable
          title="Recent Test Results"
          results={testResults}
          onViewAll={onViewAllResults}
          onViewDetails={onViewTestDetails}
          onDownload={onDownloadTestReport}
          onShare={onShareTestReport}
        />
      </Grid>
    </Grid>
  );
};

export default OverviewTab;
