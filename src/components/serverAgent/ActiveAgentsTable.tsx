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
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Agent, AgentStatus } from '../../models';

interface ActiveAgentsTableProps {
  agents: Agent[];
}

const ActiveAgentsTable: React.FC<ActiveAgentsTableProps> = ({ agents }) => {
  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircleIcon fontSize="small" />;
      case 'busy': return <WarningIcon fontSize="small" />;
      case 'offline': return <CancelIcon fontSize="small" />;
      default: return <CheckCircleIcon fontSize="small" />;
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Agent ID</TableCell>
            <TableCell>Tarayıcı</TableCell>
            <TableCell>Durum</TableCell>
            <TableCell>Oluşturulma</TableCell>
            <TableCell>Son Aktivite</TableCell>
            <TableCell>Mevcut İstek</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agents.length > 0 ? (
            agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.id}</TableCell>
                <TableCell>{agent.browser}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(agent.status)}
                    label={agent.status === 'available' ? 'Müsait' : agent.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'}
                    size="small"
                    color={getStatusColor(agent.status)}
                  />
                </TableCell>
                <TableCell>{agent.created.toLocaleString('tr-TR')}</TableCell>
                <TableCell>{agent.lastActivity.toLocaleString('tr-TR')}</TableCell>
                <TableCell>{agent.currentRequest || '-'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  Aktif agent bulunmuyor
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActiveAgentsTable;
