import React from 'react';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  PauseCircleOutline as PauseCircleOutlineIcon
} from '@mui/icons-material';
import SummaryCard, { SummaryCardProps } from './SummaryCard';

// TestStatusSummary interface'i kullanılarak props tipi tanımlanıyor
interface TestStatusCardProps {
  testStatusSummary: {
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    passRate: number; // Yüzde olarak
  };
  gridProps?: SummaryCardProps['gridProps'];
}

/**
 * Test durumunu gösteren kart bileşeni (Grid içermeyen alternatif versiyon)
 * SummaryCard bileşenini kullanarak oluşturulmuştur
 */
const TestStatusCardAlt: React.FC<TestStatusCardProps> = ({ testStatusSummary, gridProps = { xs: 12 } }) => {
  return (
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
      gridProps={gridProps}
    />
  );
};

export default TestStatusCardAlt;
