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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { RecentTestRun } from '../../mock/dashboardMock';
import { TestCaseResult } from '../../models/interfaces/ITestCase';
import { TestRunStatus } from '../../mock/testRunsMock';

interface RecentTestRunsTableProps {
  data: RecentTestRun[];
  onViewDetails: (id: string) => void;
  onRerun: (id: string) => void;
}

const RecentTestRunsTable: React.FC<RecentTestRunsTableProps> = ({
  data,
  onViewDetails,
  onRerun
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
    
    if (minutes > 0) {
      return `${minutes} dk ${seconds % 60} sn`;
    } else {
      return `${seconds} sn`;
    }
  };

  // Durum rengi ve etiketi
  const getStatusChip = (status: TestRunStatus, result?: TestCaseResult) => {
    let color: 'success' | 'error' | 'warning' | 'info' | 'default' = 'default';
    let label = '';

    if (status === TestRunStatus.COMPLETED) {
      if (result === TestCaseResult.PASSED) {
        color = 'success';
        label = 'Başarılı';
      } else if (result === TestCaseResult.FAILED) {
        color = 'error';
        label = 'Başarısız';
      } else if (result === TestCaseResult.BLOCKED) {
        color = 'warning';
        label = 'Engellendi';
      } else if (result === TestCaseResult.SKIPPED) {
        color = 'info';
        label = 'Atlandı';
      }
    } else if (status === TestRunStatus.RUNNING) {
      color = 'info';
      label = 'Çalışıyor';
    } else if (status === TestRunStatus.QUEUED) {
      color = 'default';
      label = 'Kuyrukta';
    } else if (status === TestRunStatus.FAILED || status === TestRunStatus.ERROR) {
      color = 'error';
      label = 'Hata';
    } else if (status === TestRunStatus.CANCELLED) {
      color = 'warning';
      label = 'İptal Edildi';
    }

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        sx={{ minWidth: 80 }}
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
          Son Çalıştırılan Testler
        </Typography>
      </Box>
      
      <TableContainer sx={{ maxHeight: 350 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Test Adı</TableCell>
              <TableCell align="center">Durum</TableCell>
              <TableCell align="center">Başlangıç</TableCell>
              <TableCell align="center">Süre</TableCell>
              <TableCell align="center">Çalıştıran</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((run) => (
              <TableRow key={run.id} hover>
                <TableCell>{run.testCaseName}</TableCell>
                <TableCell align="center">{getStatusChip(run.status, run.result)}</TableCell>
                <TableCell align="center">{formatDate(run.startTime)}</TableCell>
                <TableCell align="center">{formatDuration(run.duration)}</TableCell>
                <TableCell align="center">{run.executedBy}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Detayları Görüntüle">
                    <IconButton
                      size="small"
                      onClick={() => onViewDetails(run.testCaseId)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Yeniden Çalıştır">
                    <IconButton
                      size="small"
                      onClick={() => onRerun(run.testCaseId)}
                    >
                      <RefreshIcon fontSize="small" />
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

export default RecentTestRunsTable;
