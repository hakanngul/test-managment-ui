import React from 'react';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  PlayArrow as PlayArrowIcon,
  AccessTime as AccessTimeIcon,
  Code as CodeIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { Grid } from '@mui/material';
import SummaryCard from '../cards/SummaryCard';
import { TestStatusSummary, TestRunSummary, AutomationCoverage, LastRunInfo } from '../../mock/dashboardMock';

interface GenericSummaryCardsProps {
  testStatusSummary: TestStatusSummary;
  testRunSummary: TestRunSummary;
  automationCoverage: AutomationCoverage;
  lastRunInfo: LastRunInfo;
}

const GenericSummaryCards: React.FC<GenericSummaryCardsProps> = ({
  testStatusSummary,
  testRunSummary,
  automationCoverage,
  lastRunInfo
}) => {
  // Tarih formatı yardımcı fonksiyonu
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Süre formatı yardımcı fonksiyonu
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} saat ${minutes % 60} dk`;
    } else if (minutes > 0) {
      return `${minutes} dk ${seconds % 60} sn`;
    } else {
      return `${seconds} sn`;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Test Durumu Kartı */}
      <SummaryCard
        title="Test Durumu"
        mainValue={testStatusSummary.total}
        mainLabel="Toplam Test"
        items={[
          {
            icon: <CheckCircleOutlineIcon color="success" fontSize="small" />,
            label: "Başarılı",
            value: testStatusSummary.passed
          },
          {
            icon: <ErrorOutlineIcon color="error" fontSize="small" />,
            label: "Başarısız",
            value: testStatusSummary.failed
          },
          {
            icon: <PauseCircleOutlineIcon color="warning" fontSize="small" />,
            label: "Engellenen",
            value: testStatusSummary.blocked
          }
        ]}
        footerChip={{
          label: `Başarı Oranı: %${testStatusSummary.passRate}`,
          color: testStatusSummary.passRate >= 80 ? 'success' : 
                 testStatusSummary.passRate >= 60 ? 'warning' : 'error'
        }}
      />

      {/* Test Çalıştırma Kartı */}
      <SummaryCard
        title="Test Çalıştırma"
        mainValue={testRunSummary.totalRuns}
        mainLabel="Toplam Çalıştırma"
        items={[
          {
            icon: <PlayArrowIcon color="primary" fontSize="small" />,
            label: "Aktif",
            value: testRunSummary.activeRuns
          },
          {
            icon: <AccessTimeIcon color="info" fontSize="small" />,
            label: "Kuyrukta",
            value: testRunSummary.queuedRuns
          },
          {
            icon: <ErrorOutlineIcon color="error" fontSize="small" />,
            label: "Başarısız",
            value: testRunSummary.failedRuns
          }
        ]}
        footerChip={{
          label: `Ort. Süre: ${formatDuration(testRunSummary.averageDuration)}`,
          color: 'primary'
        }}
      />

      {/* Otomasyon Kapsama Kartı */}
      <SummaryCard
        title="Otomasyon Kapsama"
        mainValue={`%${automationCoverage.coverageRate}`}
        mainLabel="Kapsama Oranı"
        items={[
          {
            icon: <CodeIcon color="primary" fontSize="small" />,
            label: "Otomatize",
            value: automationCoverage.automatedTestCases
          },
          {
            label: "Toplam",
            value: automationCoverage.totalTestCases
          }
        ]}
        footerChip={{
          label: `Son Güncelleme: ${formatDate(automationCoverage.lastUpdated)}`,
          color: 'default'
        }}
      />

      {/* Son Çalıştırma Kartı */}
      <SummaryCard
        title="Son Çalıştırma"
        mainValue={lastRunInfo.totalRuns}
        mainLabel="Test Çalıştırıldı"
        items={[
          {
            icon: <CalendarTodayIcon color="info" fontSize="small" />,
            label: "Tarih",
            value: formatDate(lastRunInfo.date)
          },
          {
            icon: <CheckCircleOutlineIcon color="success" fontSize="small" />,
            label: "Başarı Oranı",
            value: `%${lastRunInfo.passRate}`
          }
        ]}
        footerChip={{
          label: `Toplam Süre: ${formatDuration(lastRunInfo.duration)}`,
          color: 'primary'
        }}
      />
    </Grid>
  );
};

export default GenericSummaryCards;
