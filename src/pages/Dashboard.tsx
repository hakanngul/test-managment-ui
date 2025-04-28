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
    testCountsByDay = { passed: [], failed: [], pending: [], blocked: [] },

    loading: isLoading = false,
  } = useDashboardData();

  // Transform API test cases to our format
  const testCases = apiTestCases.map((test: any) => {
    // Map status values to expected values for the chart
    let mappedStatus = test.status;
    if (test.status === 'active' || test.status === 'pass') mappedStatus = 'Passed';
    else if (test.status === 'inactive' || test.status === 'fail') mappedStatus = 'Failed';
    else if (test.status === 'draft' || test.status === 'pending') mappedStatus = 'Pending';
    else if (test.status === 'archived' || test.status === 'blocked') mappedStatus = 'Blocked';
    else if (!test.status) mappedStatus = 'Pending';

    return {
      ...test,
      name: test.title || test.name || '',
      category: test.tags?.[0] || test.category || 'Uncategorized',
      feature: test.tags?.[1] || test.feature || 'General',
      status: mappedStatus,
      lastRun: test.lastRun || null,
      duration: test.duration || 0,
      environment: test.environment || 'Development'
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
  const passedTests = testCases.filter((test: TestCase) => test.status === 'Passed' || test.status === 'passed').length;
  const failedTests = testCases.filter((test: TestCase) => test.status === 'Failed' || test.status === 'failed').length;
  const pendingTests = testCases.filter((test: TestCase) => test.status === 'Pending' || test.status === 'pending').length;
  const blockedTests = testCases.filter((test: TestCase) => test.status === 'Blocked' || test.status === 'blocked').length;

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
    <Box component="div">
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

      {/* Test Summary Cards */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        <Card sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Test Özeti</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '8px solid #4caf50',
                position: 'relative'
              }}>
                <Typography variant="h4" fontWeight="bold" color="#4caf50">{passRate}%</Typography>
                <Typography variant="caption">Başarı Oranı</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#4caf50', mr: 1 }}></Box>
                  <Typography variant="body2">Başarılı: {passedTests}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#f44336', mr: 1 }}></Box>
                  <Typography variant="body2">Başarısız: {failedTests}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#ff9800', mr: 1 }}></Box>
                  <Typography variant="body2">Beklemede: {pendingTests}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: '#9e9e9e', mr: 1 }}></Box>
                  <Typography variant="body2">Engellenen: {blockedTests}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="body2" fontWeight="bold">Toplam Test: {totalTests}</Typography>
              <Box sx={{
                mt: 1,
                height: 8,
                borderRadius: 4,
                bgcolor: '#f5f5f5',
                overflow: 'hidden',
                display: 'flex'
              }}>
                <Box sx={{
                  width: `${(passedTests / totalTests) * 100}%`,
                  height: '100%',
                  bgcolor: '#4caf50'
                }}></Box>
                <Box sx={{
                  width: `${(failedTests / totalTests) * 100}%`,
                  height: '100%',
                  bgcolor: '#f44336'
                }}></Box>
                <Box sx={{
                  width: `${(pendingTests / totalTests) * 100}%`,
                  height: '100%',
                  bgcolor: '#ff9800'
                }}></Box>
                <Box sx={{
                  width: `${(blockedTests / totalTests) * 100}%`,
                  height: '100%',
                  bgcolor: '#9e9e9e'
                }}></Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Son Testler</Typography>
            {testCases.slice(0, 3).map((test: any, index: number) => (
              <Box key={index} sx={{
                mb: 1,
                pb: 1,
                borderBottom: index < 2 ? '1px solid #eee' : 'none',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Box sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  mr: 1,
                  bgcolor:
                    test.status === 'Passed' || test.status === 'passed' ? '#4caf50' :
                    test.status === 'Failed' || test.status === 'failed' ? '#f44336' :
                    test.status === 'Pending' || test.status === 'pending' ? '#ff9800' :
                    '#9e9e9e'
                }}></Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="bold">{test.name || test.title}</Typography>
                  <Typography variant="caption" color={
                    test.status === 'Passed' || test.status === 'passed' ? 'success.main' :
                    test.status === 'Failed' || test.status === 'failed' ? 'error.main' :
                    test.status === 'Pending' || test.status === 'pending' ? 'warning.main' :
                    'text.secondary'
                  }>
                    {test.status} • {test.lastRun ? new Date(test.lastRun).toLocaleString('tr-TR') : 'Henüz çalıştırılmadı'}
                  </Typography>
                </Box>
                {test.duration && (
                  <Box sx={{
                    ml: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    fontSize: '0.75rem'
                  }}>
                    {test.duration}s
                  </Box>
                )}
              </Box>
            ))}

            <Box sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Box sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}>
                <Typography variant="body2">Tüm Testleri Görüntüle</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Test Performansı</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 1,
                borderRadius: 1,
                bgcolor: 'rgba(76, 175, 80, 0.1)'
              }}>
                <Typography variant="h4" fontWeight="bold" color="#4caf50">{avgDuration}</Typography>
                <Typography variant="caption">Ortalama Süre (s)</Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 1,
                borderRadius: 1,
                bgcolor: 'rgba(33, 150, 243, 0.1)'
              }}>
                <Typography variant="h4" fontWeight="bold" color="#2196f3">
                  {executionTimeData.reduce((a: number, b: number) => a + b, 0)}
                </Typography>
                <Typography variant="caption">Son 7 Gün Toplam</Typography>
              </Box>
            </Box>

            <Typography variant="body2" fontWeight="bold" gutterBottom>Son 7 Gün Performansı</Typography>
            <Box sx={{ height: 100, display: 'flex', alignItems: 'flex-end' }}>
              {executionTimeData.map((value, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height: `${(value / Math.max(...executionTimeData, 1)) * 100}%`,
                    bgcolor: '#2196f3',
                    mx: 0.5,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                    position: 'relative',
                    '&:hover::after': {
                      content: `"${value}s"`,
                      position: 'absolute',
                      top: -20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }
                  }}
                />
              ))}
            </Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1,
              fontSize: '0.75rem',
              color: 'text.secondary'
            }}>
              {last7Days.map((day, index) => (
                <Box key={index}>{day}</Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

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
          testCountsByDay={testCountsByDay as any}
          last7Days={last7Days}
        />
      </Box>

      {/* Test Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TestTable
            testCases={testCases}
            testStatuses={testStatuses as string[]}
            testPriorities={testPriorities as string[]}
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
