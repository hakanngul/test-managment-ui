import React from 'react';
import { Card, Box, Tabs, Tab } from '@mui/material';
import {
  Computer as ComputerIcon,
  List as ListIcon,
  HourglassTop as HourglassTopIcon,
} from '@mui/icons-material';
import ActiveAgentsTable from './ActiveAgentsTable';
import QueuedRequestsTable from './QueuedRequestsTable';
import ProcessedRequestsTable from './ProcessedRequestsTable';

// Interfaces
interface ActiveAgent {
  id: string;
  browser: string;
  status: 'available' | 'busy' | 'offline';
  created: string;
  lastActivity: string;
  currentRequest: string | null;
}

interface QueuedRequest {
  id: string;
  testName: string;
  browser: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  queuedAt: string;
  waitTime: string;
}

interface ProcessedRequest {
  id: string;
  testName: string;
  browser: string;
  agentId: string;
  startTime: string;
  duration: string;
}

interface TabsContainerProps {
  activeAgents: ActiveAgent[];
  queuedRequests: QueuedRequest[];
  processedRequests: ProcessedRequest[];
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  processedPage: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  activeAgents,
  queuedRequests,
  processedRequests,
  tabValue,
  onTabChange,
  processedPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab
          icon={<ComputerIcon />}
          label="Aktif Agent'lar"
          iconPosition="start"
        />
        <Tab
          icon={<ListIcon />}
          label="Kuyrukta Bekleyen İstekler"
          iconPosition="start"
        />
        <Tab
          icon={<HourglassTopIcon />}
          label="İşlenen İstekler"
          iconPosition="start"
        />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {/* Active Agents Tab */}
        {tabValue === 0 && (
          <ActiveAgentsTable agents={activeAgents} />
        )}

        {/* Queued Requests Tab */}
        {tabValue === 1 && (
          <QueuedRequestsTable requests={queuedRequests} />
        )}

        {/* Processed Requests Tab */}
        {tabValue === 2 && (
          <ProcessedRequestsTable
            requests={processedRequests}
            page={processedPage}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        )}
      </Box>
    </Card>
  );
};

export default TabsContainer;
