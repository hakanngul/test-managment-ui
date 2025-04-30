import React from 'react';
import SummaryCard from '../SummaryCard';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  PauseCircleOutline as PauseCircleOutlineIcon
} from '@mui/icons-material';
import { useTestStatusData } from '../../../hooks/cardsHooks/useTestStatusData';
import { CircularProgress, Box } from '@mui/material';

export const SmartTestStatusCard: React.FC = () => {
  const { statusData, isLoading, error } = useTestStatusData();

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

  return (
    <SummaryCard
      title="Test Durumu"
      mainValue={statusData?.total || 0}
      mainLabel="Toplam Test"
      items={[
        {
          icon: <CheckCircleOutlineIcon color="success" fontSize="small" />,
          label: "Başarılı",
          value: statusData?.passed || 0
        },
        {
          icon: <ErrorOutlineIcon color="error" fontSize="small" />,
          label: "Başarısız",
          value: statusData?.failed || 0
        },
        {
          icon: <PauseCircleOutlineIcon color="warning" fontSize="small" />,
          label: "Engellenen",
          value: statusData?.blocked || 0
        }
      ]}
      footerChip={{
        label: `Başarı Oranı: %${statusData?.passRate || 0}`,
        color: (statusData?.passRate || 0) >= 80 ? 'success' : 
               (statusData?.passRate || 0) >= 60 ? 'warning' : 'error'
      }}
    />
  );
};

export default SmartTestStatusCard;
