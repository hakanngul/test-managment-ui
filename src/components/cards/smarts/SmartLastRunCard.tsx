import React from 'react';
import SummaryCard from '../SummaryCard';
import {
  CalendarToday as CalendarTodayIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import { useLastRunData } from '../../../hooks/cardsHooks/useLastRunData';
import { CircularProgress, Box } from '@mui/material';

export const SmartLastRunCard: React.FC = () => {
  const { lastRunData, isLoading, error } = useLastRunData();

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

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours} saat ${minutes % 60} dk` : `${minutes} dk`;
  };

  return (
    <SummaryCard
      title="Son Çalıştırma"
      mainValue={lastRunData?.totalRuns || 0}
      mainLabel="Test Çalıştırıldı"
      items={[
        {
          icon: <CalendarTodayIcon color="info" fontSize="small" />,
          label: "Tarih",
          value: formatDate(lastRunData?.date || new Date())
        },
        {
          icon: <CheckCircleOutlineIcon color="success" fontSize="small" />,
          label: "Başarı Oranı",
          value: `%${lastRunData?.passRate || 0}`
        }
      ]}
      footerChip={{
        label: `Toplam Süre: ${formatDuration(lastRunData?.duration || 0)}`,
        color: 'primary'
      }}
    />
  );
};

export default SmartLastRunCard;
