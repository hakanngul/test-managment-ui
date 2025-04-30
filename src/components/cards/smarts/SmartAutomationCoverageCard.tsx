import React from 'react';
import SummaryCard from '../SummaryCard';
import { Code as CodeIcon } from '@mui/icons-material';
import { useAutomationCoverageData } from '../../../hooks/cardsHooks/useAutomationCoverageData';
import { CircularProgress, Box } from '@mui/material';

export const SmartAutomationCoverageCard: React.FC = () => {
  const { coverageData, isLoading, error } = useAutomationCoverageData();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <div>Error: {error}</div>
      </Box>
    );
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <SummaryCard
      title="Otomasyon Kapsama"
      mainValue={`%${coverageData?.coverageRate || 0}`}
      mainLabel="Kapsama Oranı"
      items={[
        {
          icon: <CodeIcon color="primary" fontSize="small" />,
          label: "Otomatize",
          value: coverageData?.automatedTestCases || 0
        },
        {
          label: "Toplam",
          value: coverageData?.totalTestCases || 0
        }
      ]}
      footerChip={{
        label: `Son Güncelleme: ${formatDate(coverageData?.lastUpdated || new Date())}`,
        color: 'default'
      }}
    />
  );
};

export default SmartAutomationCoverageCard;
