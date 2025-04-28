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
  LinearProgress,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  Stop as StopIcon,
  Visibility as VisibilityIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { TestRun, TestRunStatus } from '../../mock/testRunsMock';

interface ActiveTestRunsTableProps {
  testRuns: TestRun[];
  onViewDetails: (id: string) => void;
  onStopRun: (id: string) => void;
}

const ActiveTestRunsTable: React.FC<ActiveTestRunsTableProps> = ({ 
  testRuns, 
  onViewDetails, 
  onStopRun 
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
  const formatDuration = (startTime?: Date): string => {
    if (!startTime) return '-';
    
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    
    const seconds = Math.floor(diff / 1000);
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Aktif Test Çalıştırmaları
        </Typography>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<PlayArrowIcon />}
        >
          Yeni Test Çalıştır
        </Button>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Adı</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İlerleme</TableCell>
              <TableCell>Başlangıç</TableCell>
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
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Aktif test çalıştırması bulunmuyor.
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
                    {run.status === TestRunStatus.RUNNING ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={run.progress || 0} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {`${run.progress || 0}%`}
                          </Typography>
                        </Box>
                      </Box>
                    ) : run.status === TestRunStatus.QUEUED ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon fontSize="small" color="info" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          Bekliyor
                        </Typography>
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{formatDate(run.startTime)}</TableCell>
                  <TableCell>{formatDuration(run.startTime)}</TableCell>
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
                      
                      {run.status === TestRunStatus.RUNNING && (
                        <Tooltip title="Durdur">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => onStopRun(run.id)}
                          >
                            <StopIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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

export default ActiveTestRunsTable;
