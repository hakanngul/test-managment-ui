import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Speed as SpeedIcon
} from '@mui/icons-material';
import { SlowestTest } from '../../mock/reportsMock';

interface SlowestTestsTableProps {
  data: SlowestTest[];
  onViewDetails: (id: string) => void;
  onAnalyzePerformance: (id: string) => void;
}

const SlowestTestsTable: React.FC<SlowestTestsTableProps> = ({ 
  data,
  onViewDetails,
  onAnalyzePerformance
}) => {
  // Süreyi formatla
  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds} saniye`;
    }
    
    return `${minutes} dakika ${remainingSeconds} saniye`;
  };

  // Süre rengini belirle
  const getDurationColor = (milliseconds: number) => {
    if (milliseconds > 180000) { // 3 dakikadan fazla
      return 'error';
    } else if (milliseconds > 60000) { // 1 dakikadan fazla
      return 'warning';
    } else {
      return 'success';
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          En Yavaş Testler
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Test ID</TableCell>
                <TableCell>Test Adı</TableCell>
                <TableCell align="center">Ortalama Süre</TableCell>
                <TableCell align="center">Son Süre</TableCell>
                <TableCell align="center">Çalıştırma Sayısı</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((test) => (
                <TableRow key={test.id} hover>
                  <TableCell>{test.id}</TableCell>
                  <TableCell>{test.name}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={formatDuration(test.averageDuration)} 
                      color={getDurationColor(test.averageDuration) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {formatDuration(test.lastDuration)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{test.executions}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title="Detayları Görüntüle">
                        <IconButton 
                          size="small" 
                          onClick={() => onViewDetails(test.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Performans Analizi">
                        <IconButton 
                          size="small" 
                          color="warning"
                          onClick={() => onAnalyzePerformance(test.id)}
                        >
                          <SpeedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default SlowestTestsTable;
