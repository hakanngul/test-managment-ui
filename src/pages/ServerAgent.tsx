import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import api from '../services/api';
import {
  PageHeader,
  SystemResourcesCard,
  AgentStatusCard,
  QueueStatusCard,
  TabsContainer,
  LoadingIndicator,
  ErrorDisplay
} from '../components/serverAgent';
import {
  Agent,
  QueuedRequest,
  ProcessedRequest,
  AgentStatusSummary,
  QueueStatusSummary,
  toAgent,
  toQueuedRequest,
  toProcessedRequest
} from '../models';

const ServerAgent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // System resources state
  const [lastUpdated, setLastUpdated] = useState('');
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);

  // Agent and queue status state
  const [agentStatus, setAgentStatus] = useState<AgentStatusSummary>({
    total: 0,
    available: 0,
    busy: 0,
    limit: 1
  });

  const [queueStatus, setQueueStatus] = useState<QueueStatusSummary>({
    queued: 0,
    processing: 0,
    total: 0
  });

  // Data lists state
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);
  const [processedRequests, setProcessedRequests] = useState<ProcessedRequest[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          systemResources,
          agentStatusData,
          queueStatusData,
          activeAgentsData,
          queuedRequestsData,
          processedRequestsData
        ] = await Promise.all([
          api.getSystemResourcesData(),
          api.getAgentStatusData(),
          api.getQueueStatusData(),
          api.getActiveAgentsData(),
          api.getQueuedRequestsData(),
          api.getProcessedRequestsData()
        ]);

        // Update system resources state
        setLastUpdated(systemResources?.lastUpdated || new Date().toLocaleString('tr-TR'));
        setCpuUsage(systemResources?.cpuUsage || 0);
        setMemoryUsage(systemResources?.memoryUsage || 0);

        // Set agent status with defaults if needed
        setAgentStatus({
          total: agentStatusData?.total || 0,
          available: agentStatusData?.available || 0,
          busy: agentStatusData?.busy || 0,
          limit: agentStatusData?.limit || 1
        });

        // Set queue status with defaults if needed
        setQueueStatus({
          queued: queueStatusData?.queued || 0,
          processing: queueStatusData?.processing || 0,
          total: queueStatusData?.total || 0
        });

        // Convert and set active agents
        const formattedAgents = Array.isArray(activeAgentsData)
          ? activeAgentsData.map(agent => {
              // Convert string dates to Date objects for the model
              const agentWithDateObjects = {
                ...agent,
                created: agent.created || new Date().toISOString(),
                lastActivity: agent.lastActivity || new Date().toISOString()
              };
              return toAgent(agentWithDateObjects);
            })
          : [];
        setActiveAgents(formattedAgents);

        // Convert and set queued requests
        const formattedQueuedRequests = Array.isArray(queuedRequestsData)
          ? queuedRequestsData.map(request => {
              // Convert string dates to Date objects for the model
              const requestWithDateObjects = {
                ...request,
                queuedAt: request.queuedAt || new Date().toISOString()
              };
              return toQueuedRequest(requestWithDateObjects);
            })
          : [];
        setQueuedRequests(formattedQueuedRequests);

        // Convert and set processed requests
        const formattedProcessedRequests = Array.isArray(processedRequestsData)
          ? processedRequestsData.map(request => {
              // Convert string dates to Date objects for the model
              const requestWithDateObjects = {
                ...request,
                startTime: request.startTime || new Date().toISOString(),
                endTime: request.endTime
              };
              return toProcessedRequest(requestWithDateObjects);
            })
          : [];
        setProcessedRequests(formattedProcessedRequests);
        setError(null);
      } catch (err) {
        console.error('Error fetching server agent data:', err);
        setError('Failed to load server agent data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [processedPage, setProcessedPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);

  // Simulate data refresh
  const refreshData = () => {
    // Update last updated time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLastUpdated(`${formattedDate} ${formattedTime}`);

    // Simulate CPU and memory usage changes
    setCpuUsage(Math.round((Math.random() * 20 + 5) * 10) / 10);
    setMemoryUsage(Math.round(Math.random() * 10) / 10);
  };

  // Auto refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setProcessedPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setProcessedPage(0);
  };

  // Action handlers
  const handleTestClick = (testId: string) => {
    console.log('Test clicked', testId);
  };

  const handleRunTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    console.log('Run test', testId);
  };

  const handleEditTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    console.log('Edit test', testId);
  };

  const handleDeleteTest = (testId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    console.log('Delete test', testId);
  };

  return (
    <Box>
      <PageHeader
        title="Server Agent"
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
      />

      {error && <ErrorDisplay message={error} />}

      {loading ? (
        <LoadingIndicator />
      ) : (
        <Grid container spacing={3}>
          {/* System Resources */}
          <Grid item xs={12} md={4}>
            <SystemResourcesCard
              lastUpdated={lastUpdated}
              cpuUsage={cpuUsage}
              memoryUsage={memoryUsage}
            />
          </Grid>

          {/* Agent Status */}
          <Grid item xs={12} md={4}>
            <AgentStatusCard
              total={agentStatus.total}
              available={agentStatus.available}
              busy={agentStatus.busy}
              limit={agentStatus.limit}
            />
          </Grid>

          {/* Queue Status */}
          <Grid item xs={12} md={4}>
            <QueueStatusCard
              queued={queueStatus.queued}
              processing={queueStatus.processing}
              total={queueStatus.total}
            />
          </Grid>

          {/* Tabs for Agents and Requests */}
          <Grid item xs={12}>
            <TabsContainer
              activeAgents={activeAgents}
              queuedRequests={queuedRequests}
              processedRequests={processedRequests}
              tabValue={tabValue}
              onTabChange={handleTabChange}
              processedPage={processedPage}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ServerAgent;
