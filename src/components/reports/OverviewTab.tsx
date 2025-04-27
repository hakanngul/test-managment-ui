import React from 'react';
import { Grid } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import SummaryCard from './SummaryCard';
import ChartCard from './ChartCard';
import TestResultsTable from './TestResultsTable';

interface TestResult {
  id: string;
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  lastRun: string;
}

interface OverviewTabProps {
  testExecutionData: {
    options: ApexOptions;
    series: any[];
  };
  testDurationData: {
    options: ApexOptions;
    series: any[];
  };
  testResults: TestResult[];
  onViewAllResults: () => void;
  onViewTestDetails: (id: string) => void;
  onDownloadTestReport: (id: string) => void;
  onShareTestReport: (id: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  testExecutionData,
  testDurationData,
  testResults,
  onViewAllResults,
  onViewTestDetails,
  onDownloadTestReport,
  onShareTestReport
}) => {
  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Total Tests"
          value="1,234"
          subtitle="Last 7 days"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Pass Rate"
          value="85%"
          subtitle="+5% from last week"
          color="success.main"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Average Duration"
          value="45m"
          subtitle="Per test suite"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SummaryCard
          title="Failed Tests"
          value="23"
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
