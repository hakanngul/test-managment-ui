import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import { FailedTest } from '../../mock/dashboardMock';
import { TestCaseCategory, TestCasePriority } from '../../models/interfaces/ITestCase';

interface FailedTestsTableProps {
  data: FailedTest[];
  onViewDetails: (id: string) => void;
  onRerun: (id: string) => void;
  onViewError: (id: string, errorMessage: string) => void;
}

const FailedTestsTable: React.FC<FailedTestsTableProps> = ({
  data,
  onViewDetails,
  onRerun,
  onViewError
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

  // Kategori adları
  const CATEGORY_NAMES = {
    [TestCaseCategory.FUNCTIONAL]: 'Fonksiyonel',
    [TestCaseCategory.REGRESSION]: 'Regresyon',
    [TestCaseCategory.INTEGRATION]: 'Entegrasyon',
    [TestCaseCategory.PERFORMANCE]: 'Performans',
    [TestCaseCategory.SECURITY]: 'Güvenlik',
    [TestCaseCategory.USABILITY]: 'Kullanılabilirlik',
    [TestCaseCategory.ACCEPTANCE]: 'Kabul',
    [TestCaseCategory.SMOKE]: 'Smoke',
    [TestCaseCategory.EXPLORATORY]: 'Keşif'
  };

  // Öncelik adları ve renkleri
  const PRIORITY_CONFIG = {
    [TestCasePriority.CRITICAL]: { label: 'Kritik', color: 'error' },
    [TestCasePriority.HIGH]: { label: 'Yüksek', color: 'warning' },
    [TestCasePriority.MEDIUM]: { label: 'Orta', color: 'info' },
    [TestCasePriority.LOW]: { label: 'Düşük', color: 'success' }
  };

  // Öncelik etiketi
  const getPriorityChip = (priority: TestCasePriority) => {
    const config = PRIORITY_CONFIG[priority];
    return (
      <Chip
        label={config.label}
        color={config.color as 'error' | 'warning' | 'info' | 'success'}
        size="small"
        sx={{ minWidth: 70 }}
      />
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Başarısız Testler
        </Typography>
      </Box>
      
      <TableContainer sx={{ maxHeight: 350 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Test Adı</TableCell>
              <TableCell align="center">Öncelik</TableCell>
              <TableCell align="center">Kategori</TableCell>
              <TableCell align="center">Son Çalıştırma</TableCell>
              <TableCell align="center">Başarısızlık Sayısı</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((test) => (
              <TableRow key={test.id} hover>
                <TableCell>{test.name}</TableCell>
                <TableCell align="center">{getPriorityChip(test.priority)}</TableCell>
                <TableCell align="center">{CATEGORY_NAMES[test.category]}</TableCell>
                <TableCell align="center">{formatDate(test.lastRun)}</TableCell>
                <TableCell align="center">{test.failureCount}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Detayları Görüntüle">
                    <IconButton
                      size="small"
                      onClick={() => onViewDetails(test.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Yeniden Çalıştır">
                    <IconButton
                      size="small"
                      onClick={() => onRerun(test.id)}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hata Mesajını Görüntüle">
                    <IconButton
                      size="small"
                      onClick={() => onViewError(test.id, test.errorMessage)}
                    >
                      <ErrorOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FailedTestsTable;
