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
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { TopFailingTest } from '../../mock/reportsMock';

interface TopFailingTestsTableProps {
  data: TopFailingTest[];
  onViewDetails: (id: string) => void;
  onRerun: (id: string) => void;
}

const TopFailingTestsTable: React.FC<TopFailingTestsTableProps> = ({ 
  data,
  onViewDetails,
  onRerun
}) => {
  // Tarihi formatla
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          En Çok Başarısız Olan Testler
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Test ID</TableCell>
                <TableCell>Test Adı</TableCell>
                <TableCell align="center">Başarısızlık Sayısı</TableCell>
                <TableCell align="center">Başarısızlık Oranı</TableCell>
                <TableCell>Son Başarısızlık</TableCell>
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
                      label={test.failureCount} 
                      color="error" 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={test.failureRate} 
                          color="error"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {`${test.failureRate}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(test.lastFailure)}</TableCell>
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
                      <Tooltip title="Yeniden Çalıştır">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => onRerun(test.id)}
                        >
                          <RefreshIcon fontSize="small" />
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

export default TopFailingTestsTable;
