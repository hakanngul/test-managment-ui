import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip
} from '@mui/material';
import { QueuedRequest, RequestPriority } from '../../models';

interface QueuedRequestsTableProps {
  requests: QueuedRequest[];
}

const QueuedRequestsTable: React.FC<QueuedRequestsTableProps> = ({ requests }) => {
  // Helper function
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>İstek ID</TableCell>
            <TableCell>Test Adı</TableCell>
            <TableCell>Tarayıcı</TableCell>
            <TableCell>Öncelik</TableCell>
            <TableCell>Kategori</TableCell>
            <TableCell>Kuyruğa Eklenme</TableCell>
            <TableCell>Bekleme Süresi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <TableRow key={request.id || `queued-request-${index}`}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.testName}</TableCell>
                <TableCell>{request.browser}</TableCell>
                <TableCell>
                  <Chip
                    label={request.priority === 'high' ? 'Yüksek' : request.priority === 'medium' ? 'Orta' : 'Düşük'}
                    size="small"
                    color={getPriorityColor(request.priority)}
                  />
                </TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>{
                  request.queuedAt ? request.queuedAt.toLocaleString('tr-TR') :
                  (request.timing && request.timing.queuedAt ? request.timing.queuedAt.toLocaleString('tr-TR') : '-')
                }</TableCell>
                <TableCell>{
                  request.waitTime ||
                  (request.timing ? request.timing.waitTime : '-')
                }</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  Kuyrukta bekleyen istek bulunmuyor
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QueuedRequestsTable;
