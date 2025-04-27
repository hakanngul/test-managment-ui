import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { useDashboardData } from '../hooks/useApi';
import {
  MetricsCards,
  StatusDistributionChart,
  ExecutionTimeChart,
  TestResultsChart,
  TestTable,
} from '../components/dashboard';

// Interface for test data
interface TestCase {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tags?: string[];
  name?: string;
  lastRun?: string | null;
  duration?: number;
  category?: string;
  feature?: string;
  environment?: string;
}

const Dashboard: React.FC = () => {
  // Fetch data from API
  const {
    testCases: apiTestCases = [],
    testPriorities = [],
    testStatuses = [],
    executionTimeData = [],
    testCountsByDay = [],
    loading: isLoading = false,
  } = useDashboardData();

  // Transform API test cases to our format
  const testCases = apiTestCases.map((test: any) => {
    // Map status values to expected values for the chart
    let mappedStatus = test.status;
    if (test.status === 'active') mappedStatus = 'Passed';
    else if (test.status === 'inactive') mappedStatus = 'Failed';
    else if (test.status === 'draft') mappedStatus = 'Pending';
    else if (test.status === 'archived') mappedStatus = 'Blocked';

    return {
      ...test,
      name: test.title || '',
      category: test.tags?.[0] || 'Uncategorized',
      feature: test.tags?.[1] || 'General',
      status: mappedStatus,
      lastRun: null,
      duration: 0,
      environment: 'Development'
    };
  });

  // Get last 7 days for chart
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  // Calculate metrics for dashboard
  const totalTests = testCases.length;

  // Count tests by status
  let passedTests = testCases.filter((test: TestCase) => test.status === 'Passed' || test.status === 'passed').length;
  let failedTests = testCases.filter((test: TestCase) => test.status === 'Failed' || test.status === 'failed').length;
  let pendingTests = testCases.filter((test: TestCase) => test.status === 'Pending' || test.status === 'pending').length;
  let blockedTests = testCases.filter((test: TestCase) => test.status === 'Blocked' || test.status === 'blocked').length;

  // Use sample data for the chart if needed
  if (passedTests + failedTests + pendingTests + blockedTests === 0) {
    passedTests = 35;
    failedTests = 12;
    pendingTests = 8;
    blockedTests = 5;
  }

  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  // Calculate average duration
  const totalDuration = testCases.reduce((sum: number, test: TestCase) => sum + (test.duration || 0), 0);
  const avgDuration = totalTests > 0 ? Math.round(totalDuration / totalTests) : 0;

  // Action handlers
  const handleTestClick = (test: any) => {
    console.log('Test clicked', test);
  };

  const handleRunTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    console.log('Run test', testId);
  };

  const handleEditTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    console.log('Edit test', testId);
  };

  const handleDeleteTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    console.log('Delete test', testId);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Metrics Cards */}
      <MetricsCards
        totalTests={totalTests}
        passRate={passRate}
        avgDuration={avgDuration}
        failedTests={failedTests}
      />

      {/* Charts */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <StatusDistributionChart
            passedTests={passedTests}
            failedTests={failedTests}
            pendingTests={pendingTests}
            blockedTests={blockedTests}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
          <ExecutionTimeChart
            executionTimeData={executionTimeData}
            last7Days={last7Days}
          />
        </Box>
      </Box>

      {/* Test Results by Day */}
      <Box sx={{ mb: 4 }}>
        <TestResultsChart
          testCountsByDay={testCountsByDay}
          last7Days={last7Days}
        />
      </Box>

      {/* Test Table */}
      <Card>
        <CardContent>
          <TestTable
            testCases={testCases}
            testStatuses={testStatuses}
            testPriorities={testPriorities}
            isLoading={isLoading}
            onTestClick={handleTestClick}
            onRunTest={handleRunTest}
            onEditTest={handleEditTest}
            onDeleteTest={handleDeleteTest}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
