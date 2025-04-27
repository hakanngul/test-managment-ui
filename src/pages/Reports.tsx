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
        // For array data, ensure we have an array
        setTestResults(Array.isArray(results) ? results : []);
        setDetailedResults(Array.isArray(detailedResultsData) ? detailedResultsData : []);
        setPerformanceMetrics(Array.isArray(performance) ? performance : []);

        // For object data with options and series, ensure we have valid structure
        setTestExecutionData(executionData && executionData.options && executionData.series ?
          executionData : { options: {}, series: [] });

        setTestDurationData(durationData && durationData.options && durationData.series ?
          durationData : { options: {}, series: [] });

        setStatusDistributionData(statusDistribution && statusDistribution.options && statusDistribution.series ?
          statusDistribution : { options: {}, series: [] });

        setDurationByStatusData(durationByStatus && durationByStatus.options && durationByStatus.series ?
          durationByStatus : { options: {}, series: [] });

        setCoverageData(coverage && coverage.summary ?
          coverage : {
            summary: {
              lines: { total: 0, covered: 0, percentage: 0 },
              branches: { total: 0, covered: 0, percentage: 0 },
              functions: { total: 0, covered: 0, percentage: 0 },
              statements: { total: 0, covered: 0, percentage: 0 }
            },
            files: []
          });

        setCoverageTrendData(coverageTrend && coverageTrend.options && coverageTrend.series ?
          coverageTrend : { options: {}, series: [] });

        setCoverageByTypeData(coverageByType && coverageByType.options && coverageByType.series ?
          coverageByType : { options: {}, series: [] });

        setUncoveredLinesData(uncoveredLines && uncoveredLines.options && uncoveredLines.series ?
          uncoveredLines : { options: {}, series: [] });

        setLoadTimeData(loadTime && loadTime.options && loadTime.series ?
          loadTime : { options: {}, series: [] });

        setResponseTimeData(responseTime && responseTime.options && responseTime.series ?
          responseTime : { options: {}, series: [] });

        setResourceUsageData(resourceUsage && resourceUsage.options && resourceUsage.series ?
          resourceUsage : { options: {}, series: [] });

        setBrowserComparisonData(browserComparison && browserComparison.options && browserComparison.series ?
          browserComparison : { options: {}, series: [] });

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
