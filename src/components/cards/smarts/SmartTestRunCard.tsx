import React from 'react';
import SummaryCard from '../SummaryCard';
import {
  PlayArrow as PlayArrowIcon,
  AccessTime as AccessTimeIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import { useTestRunData } from '../../../hooks/cardsHooks/useTestRunData';
import { CircularProgress, Box } from '@mui/material';

export const SmartTestRunCard: React.FC = () => {
  const { runData, isLoading, error } = useTestRunData();

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

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours} saat ${minutes % 60} dk` : `${minutes} dk`;
  };

  return (
    <SummaryCard
      title="Test Çalıştırma"
      mainValue={runData?.totalRuns || 0}
      mainLabel="Toplam Çalıştırma"
      items={[
        {
          icon: <PlayArrowIcon color="primary" fontSize="small" />,
          label: "Aktif",
          value: runData?.activeRuns || 0
        },
        {
          icon: <AccessTimeIcon color="info" fontSize="small" />,
          label: "Kuyrukta",
          value: runData?.queuedRuns || 0
        },
        {
          icon: <ErrorOutlineIcon color="error" fontSize="small" />,
          label: "Başarısız",
          value: runData?.failedRuns || 0
        }
      ]}
      footerChip={{
        label: `Ort. Süre: ${formatDuration(runData?.averageDuration || 0)}`,
        color: 'primary'
      }}
    />
  );
};

export default SmartTestRunCard;
