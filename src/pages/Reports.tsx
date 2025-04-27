import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import api from '../services/api';
import {
  PageHeader,
  LoadingIndicator,
  ErrorAlert,
  OverviewTab,
  TestResultsTab,
  CoverageTab,
  PerformanceTab
} from '../components/reports';

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API data state
  const [testExecutionData, setTestExecutionData] = useState<any>({
    options: {},
    series: []
  });

  const [testDurationData, setTestDurationData] = useState<any>({
    options: {},
    series: []
  });

  const [testResults, setTestResults] = useState<any[]>([]);

  // Additional data for new tabs
  const [detailedResults, setDetailedResults] = useState<any[]>([]);
  const [statusDistributionData, setStatusDistributionData] = useState<any>({
    options: {},
    series: []
  });
  const [durationByStatusData, setDurationByStatusData] = useState<any>({
    options: {},
    series: []
  });
  const [coverageData, setCoverageData] = useState<any>({
    summary: {
      lines: { total: 0, covered: 0, percentage: 0 },
      branches: { total: 0, covered: 0, percentage: 0 },
      functions: { total: 0, covered: 0, percentage: 0 },
      statements: { total: 0, covered: 0, percentage: 0 }
    },
    files: []
  });
  const [coverageTrendData, setCoverageTrendData] = useState<any>({
    options: {},
    series: []
  });
  const [coverageByTypeData, setCoverageByTypeData] = useState<any>({
    options: {},
    series: []
  });
  const [uncoveredLinesData, setUncoveredLinesData] = useState<any>({
    options: {},
    series: []
  });
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [loadTimeData, setLoadTimeData] = useState<any>({
    options: {},
    series: []
  });
  const [responseTimeData, setResponseTimeData] = useState<any>({
    options: {},
    series: []
  });
  const [resourceUsageData, setResourceUsageData] = useState<any>({
    options: {},
    series: []
  });
  const [browserComparisonData, setBrowserComparisonData] = useState<any>({
    options: {},
    series: []
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all required data from the API
        const [
          executionData,
          durationData,
          results,
          detailedResultsData,
          statusDistribution,
          durationByStatus,
          coverage,
          coverageTrend,
          coverageByType,
          uncoveredLines,
          performance,
          loadTime,
          responseTime,
          resourceUsage,
          browserComparison
        ] = await Promise.all([
          api.getTestExecutionData(),
          api.getTestDurationData(),
          api.getTestResults(),
          api.getDetailedTestResults(),
          api.getStatusDistributionData(),
          api.getDurationByStatusData(),
          api.getCoverageData(),
          api.getCoverageTrendData(),
          api.getCoverageByTypeData(),
          api.getUncoveredLinesData(),
          api.getPerformanceMetrics(),
          api.getLoadTimeData(),
          api.getResponseTimeData(),
          api.getResourceUsageData(),
          api.getBrowserComparisonData()
        ]);

        // Update state with fetched data
        setTestExecutionData(executionData);
        setTestDurationData(durationData);
        setTestResults(results);
        setDetailedResults(detailedResultsData);
        setStatusDistributionData(statusDistribution);
        setDurationByStatusData(durationByStatus);
        setCoverageData(coverage);
        setCoverageTrendData(coverageTrend);
        setCoverageByTypeData(coverageByType);
        setUncoveredLinesData(uncoveredLines);
        setPerformanceMetrics(performance);
        setLoadTimeData(loadTime);
        setResponseTimeData(responseTime);
        setResourceUsageData(resourceUsage);
        setBrowserComparisonData(browserComparison);

        setError(null);
      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError('Failed to load reports data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExport = () => {
    console.log('Exporting report...');
  };

  const handleShare = () => {
    console.log('Sharing report...');
  };

  const handleGenerateReport = () => {
    console.log('Generating report...');
  };

  const handleViewAllResults = () => {
    setTabValue(1); // Switch to Test Results tab
  };

  const handleViewTestDetails = (id: string) => {
    console.log('Viewing test details for:', id);
    setTabValue(1); // Switch to Test Results tab
  };

  const handleDownloadTestReport = (id: string) => {
    console.log('Downloading test report for:', id);
  };

  const handleShareTestReport = (id: string) => {
    console.log('Sharing test report for:', id);
  };

  return (
    <Box>
      <PageHeader
        title="Reports"
        onExport={handleExport}
        onShare={handleShare}
        onGenerateReport={handleGenerateReport}
      />

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Overview" />
            <Tab label="Test Results" />
            <Tab label="Coverage" />
            <Tab label="Performance" />
          </Tabs>

          {tabValue === 0 && (
            <OverviewTab
              testExecutionData={testExecutionData}
              testDurationData={testDurationData}
              testResults={testResults}
              onViewAllResults={handleViewAllResults}
              onViewTestDetails={handleViewTestDetails}
              onDownloadTestReport={handleDownloadTestReport}
              onShareTestReport={handleShareTestReport}
            />
          )}

          {tabValue === 1 && (
            <TestResultsTab
              detailedResults={detailedResults}
              statusDistributionData={statusDistributionData}
              durationByStatusData={durationByStatusData}
            />
          )}

          {tabValue === 2 && (
            <CoverageTab
              coverageData={coverageData}
              coverageTrendData={coverageTrendData}
              coverageByTypeData={coverageByTypeData}
              uncoveredLinesData={uncoveredLinesData}
            />
          )}

          {tabValue === 3 && (
            <PerformanceTab
              performanceMetrics={performanceMetrics}
              loadTimeData={loadTimeData}
              responseTimeData={responseTimeData}
              resourceUsageData={resourceUsageData}
              browserComparisonData={browserComparisonData}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Reports;
