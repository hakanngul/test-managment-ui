import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { TestRun, TestRunStatus } from '../../mock/testRunsMock';
import { TestCaseResult } from '../../models/interfaces/ITestCase';

interface RecentTestRunsTableProps {
  testRuns: TestRun[];
  onViewDetails: (id: string) => void;
  onRerun: (id: string) => void;
}

const RecentTestRunsTable: React.FC<RecentTestRunsTableProps> = ({ 
  testRuns, 
  onViewDetails, 
  onRerun 
}) => {
  // Tarihi formatla
  const formatDate = (date?: Date): string => {
    if (!date) return '-';
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Süreyi formatla
  const formatDuration = (milliseconds?: number): string => {
    if (!milliseconds) return '-';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} saat ${minutes % 60} dakika`;
    } else if (minutes > 0) {
      return `${minutes} dakika ${seconds % 60} saniye`;
    } else {
      return `${seconds} saniye`;
    }
  };

  // Durum rengini belirle
  const getStatusColor = (status: TestRunStatus) => {
    switch (status) {
      case TestRunStatus.RUNNING:
        return 'primary';
      case TestRunStatus.QUEUED:
        return 'info';
      case TestRunStatus.COMPLETED:
        return 'success';
      case TestRunStatus.FAILED:
        return 'error';
      case TestRunStatus.CANCELLED:
        return 'warning';
      case TestRunStatus.ERROR:
        return 'error';
      default:
        return 'default';
    }
  };

  // Durum adını formatla
  const formatStatus = (status: TestRunStatus): string => {
    switch (status) {
      case TestRunStatus.RUNNING:
        return 'Çalışıyor';
      case TestRunStatus.QUEUED:
        return 'Sırada';
      case TestRunStatus.COMPLETED:
        return 'Tamamlandı';
      case TestRunStatus.FAILED:
        return 'Başarısız';
      case TestRunStatus.CANCELLED:
        return 'İptal Edildi';
      case TestRunStatus.ERROR:
        return 'Hata';
      default:
        return status;
    }
  };

  // Sonuç ikonunu belirle
  const getResultIcon = (result?: TestCaseResult) => {
    if (!result) return null;

    switch (result) {
      case TestCaseResult.PASSED:
        return <CheckCircleIcon fontSize="small" color="success" />;
      case TestCaseResult.FAILED:
        return <CancelIcon fontSize="small" color="error" />;
      case TestCaseResult.BLOCKED:
        return <BlockIcon fontSize="small" color="warning" />;
      case TestCaseResult.SKIPPED:
        return <WarningIcon fontSize="small" color="info" />;
      default:
        return null;
    }
  };

  // Sonuç adını formatla
  const formatResult = (result?: TestCaseResult): string => {
    if (!result) return '-';

    switch (result) {
      case TestCaseResult.PASSED: return 'Başarılı';
      case TestCaseResult.FAILED: return 'Başarısız';
      case TestCaseResult.BLOCKED: return 'Engellendi';
      case TestCaseResult.SKIPPED: return 'Atlandı';
      case TestCaseResult.NOT_RUN: return 'Çalıştırılmadı';
      default: return result;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Son Test Çalıştırmaları
        </Typography>
        
        <Button
          variant="text"
          size="small"
          startIcon={<HistoryIcon />}
        >
          Tüm Geçmişi Görüntüle
        </Button>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Adı</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Sonuç</TableCell>
              <TableCell>Başlangıç</TableCell>
              <TableCell>Bitiş</TableCell>
              <TableCell>Süre</TableCell>
              <TableCell>Tarayıcı</TableCell>
              <TableCell>Ortam</TableCell>
              <TableCell>Çalıştıran</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testRuns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Son test çalıştırması bulunmuyor.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              testRuns.map((run) => (
                <TableRow key={run.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {run.testCaseName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {run.testCaseId}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {run.tags?.map((tag) => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={formatStatus(run.status)} 
                      color={getStatusColor(run.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getResultIcon(run.result)}
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {formatResult(run.result)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(run.startTime)}</TableCell>
                  <TableCell>{formatDate(run.endTime)}</TableCell>
                  <TableCell>{formatDuration(run.duration)}</TableCell>
                  <TableCell>{run.browser}</TableCell>
                  <TableCell>{run.environment}</TableCell>
                  <TableCell>{run.executedBy}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title="Detayları Görüntüle">
                        <IconButton 
                          size="small" 
                          onClick={() => onViewDetails(run.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Yeniden Çalıştır">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => onRerun(run.id)}
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecentTestRunsTable;
