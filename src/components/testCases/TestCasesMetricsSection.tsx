import React from 'react';
import { useTestCasesData } from './TestCasesDataProvider';
import TestCaseMetrics from './TestCaseMetrics';

const TestCasesMetricsSection: React.FC = () => {
  const { metrics } = useTestCasesData();

  return (
    <TestCaseMetrics
      totalCount={metrics.totalCount}
      activeCount={metrics.activeCount}
      draftCount={metrics.draftCount}
      archivedCount={metrics.archivedCount}
      criticalCount={metrics.criticalCount}
      highCount={metrics.highCount}
      mediumCount={metrics.mediumCount}
      lowCount={metrics.lowCount}
      passRate={metrics.passRate}
      mostUsedTags={metrics.mostUsedTags}
    />
  );
};

export default TestCasesMetricsSection;
