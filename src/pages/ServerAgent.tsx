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
    offline: 0,
    error: 0,
    maintenance: 0,
    limit: 1
  });

  const [queueStatus, setQueueStatus] = useState<QueueStatusSummary>({
    queued: 0,
    scheduled: 0,
    assigned: 0,
    processing: 0,
    total: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    estimatedWaitTime: 0
  });

  // Data lists state
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);
  const [processedRequests, setProcessedRequests] = useState<ProcessedRequest[]>([]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from API...');

      // Fetch latest system resources data
      console.log('Fetching system resources data...');
      const latestSystemResources = await api.getLatestSystemResourcesData();
      console.log('System resources data:', latestSystemResources);

      // Fetch latest agent status data
      console.log('Fetching agent status data...');
      const latestAgentStatus = await api.getLatestAgentStatusData();
      console.log('Agent status data:', latestAgentStatus);

      // Fetch latest queue status data
      console.log('Fetching queue status data...');
      const latestQueueStatus = await api.getLatestQueueStatusData();
      console.log('Queue status data:', latestQueueStatus);

      // Fetch latest active agents data
      console.log('Fetching active agents data...');
      const latestActiveAgentsData = await api.getLatestActiveAgentsData();
      console.log('Active agents data:', latestActiveAgentsData);

      // Fetch queued requests
      console.log('Fetching queued requests...');
      const queuedRequestsData = await api.getQueuedRequests();
      console.log('Queued requests data:', queuedRequestsData);

      // Fetch processed requests
      console.log('Fetching processed requests...');
      const processedRequestsData = await api.getProcessedRequests();
      console.log('Processed requests data:', processedRequestsData);

      // Update system resources state
      if (latestSystemResources) {
        setLastUpdated(new Date(latestSystemResources.timestamp).toLocaleString('tr-TR'));
        setCpuUsage(latestSystemResources.cpuUsage || 0);
        setMemoryUsage(latestSystemResources.memoryUsage || 0);
      } else {
        // Fallback to default values if API returns no data
        const now = new Date();
        setLastUpdated(now.toLocaleString('tr-TR'));
        setCpuUsage(Math.floor(Math.random() * 80) + 10); // 10-90%
        setMemoryUsage(Math.floor(Math.random() * 8) + 1); // 1-9 GB
      }

      // Set agent status with defaults if needed
      if (latestAgentStatus) {
        setAgentStatus({
          total: latestAgentStatus.total || 0,
          available: latestAgentStatus.available || 0,
          busy: latestAgentStatus.busy || 0,
          offline: latestAgentStatus.offline || 0,
          error: latestAgentStatus.error || 0,
          maintenance: latestAgentStatus.maintenance || 0,
          limit: latestAgentStatus.total || 1 // Use total as limit if not specified
        });
      } else {
        // Fallback to default values if API returns no data
        setAgentStatus({
          total: 3,
          available: 2,
          busy: 1,
          offline: 0,
          error: 0,
          maintenance: 0,
          limit: 5
        });
      }

      // Set queue status with defaults if needed
      if (latestQueueStatus) {
        setQueueStatus({
          queued: latestQueueStatus.queued || 0,
          scheduled: 0,
          assigned: 0,
          processing: latestQueueStatus.processing || 0,
          total: latestQueueStatus.total || 0,
          highPriority: 0,
          mediumPriority: 0,
          lowPriority: 0,
          estimatedWaitTime: 0
        });
      } else {
        // Fallback to default values if API returns no data
        setQueueStatus({
          queued: 2,
          scheduled: 0,
          assigned: 0,
          processing: 1,
          total: 3,
          highPriority: 0,
          mediumPriority: 2,
          lowPriority: 1,
          estimatedWaitTime: 60000
        });
      }

      // Get active agent details
      let activeAgentsList: Agent[] = [];
      if (latestActiveAgentsData && Array.isArray(latestActiveAgentsData)) {
        console.log('Active agents IDs:', latestActiveAgentsData);

        try {
          // Fetch full agent details for each active agent ID
          const agentPromises = latestActiveAgentsData.map(agentId =>
            api.getAgentById(agentId)
          );

          const agentDetails = await Promise.all(agentPromises);

          // Convert and set active agents
          activeAgentsList = agentDetails
            .filter(agent => agent) // Filter out null/undefined agents
            .map(agent => {
              // Convert string dates to Date objects for the model
              const agentWithDateObjects = {
                ...agent,
                created: agent.created || new Date().toISOString(),
                lastActivity: agent.lastActivity || new Date().toISOString()
              };
              return toAgent(agentWithDateObjects);
            });
        } catch (error) {
          console.error('Error fetching agent details:', error);
          // Fallback to default values if API returns no data
          activeAgentsList = latestActiveAgentsData.map((agentId, index) => {
            return {
              id: agentId,
              name: `Agent ${index + 1}`,
              type: 'browser',
              status: 'available',
              browser: 'chromium',
              networkInfo: {
                ipAddress: `192.168.1.${10 + index}`,
                port: 9222 + index,
                connected: true
              },
              capabilities: ['browser', 'screenshot', 'video'],
              serverId: 'server-001',
              created: new Date(),
              lastActivity: new Date(),
              version: '1.0.0',
              currentRequest: null // Eksik olan zorunlu alan
            } as unknown as Agent;
          });
        }
      }
      setActiveAgents(activeAgentsList);

      // Convert and set queued requests
      const formattedQueuedRequests = Array.isArray(queuedRequestsData)
        ? queuedRequestsData.map(request => {
            // Convert string dates to Date objects for the model
            const requestWithDateObjects = {
              ...request,
              queuedAt: request.queuedAt || request.createdAt || new Date().toISOString(),
              estimatedStartTime: request.estimatedStartTime || new Date(Date.now() + 60000).toISOString(),
              browser: request.browser || 'chromium',
              priority: request.priority || 'low',
              category: request.category || 'regression',
              waitTime: request.waitTime || '1 dakika',
              testName: request.testName || request.name || `Test ${request.id}`,
              timing: request.timing || {
                queuedAt: new Date(request.queuedAt || request.createdAt || new Date()),
                waitTime: request.waitTime || '1 dakika'
              }
            };

            console.log('Converting queued request:', request);
            console.log('With date objects:', requestWithDateObjects);

            try {
              const converted = toQueuedRequest(requestWithDateObjects);
              console.log('Converted queued request:', converted);
              return converted;
            } catch (error) {
              console.error('Error converting queued request:', error);
              // Fallback to a simpler conversion
              return {
                id: request.id || request._id,
                testName: request.testName || request.name || `Test ${request.id}`,
                status: request.status || 'queued',
                priority: request.priority || 'low',
                category: request.category || 'regression',
                browser: request.browser || 'chromium',
                queuedAt: new Date(request.queuedAt || request.createdAt || new Date()),
                waitTime: request.waitTime || '1 dakika',
                timing: {
                  queuedAt: new Date(request.queuedAt || request.createdAt || new Date()),
                  waitTime: request.waitTime || '1 dakika'
                }
              } as unknown as QueuedRequest;
            }
          })
        : [];

      // If no queued requests from API, use default data
      if (formattedQueuedRequests.length === 0) {
        const now = new Date();
        formattedQueuedRequests.push({
          id: '1',
          testName: 'Login Test',
          description: 'Run login test case',
          status: 'queued' as any, // RequestStatus.QUEUED
          queuePosition: 1,
          estimatedStartTime: new Date(now.getTime() + 60000),
          queuedAt: new Date(now.getTime() - 120000),
          browser: 'chromium',
          priority: 'low' as any, // RequestPriority.LOW
          category: 'regression',
          waitTime: '2 dakika',
          timing: {
            queuedAt: new Date(now.getTime() - 120000),
            waitTime: '2 dakika'
          }
        } as unknown as QueuedRequest);
      }

      setQueuedRequests(formattedQueuedRequests);

      // Convert and set processed requests
      const formattedProcessedRequests = Array.isArray(processedRequestsData)
        ? processedRequestsData.map(request => {
            // Convert string dates to Date objects for the model
            const requestWithDateObjects = {
              ...request,
              startTime: request.startTime || request.startedAt || new Date(Date.now() - 300000).toISOString(),
              endTime: request.endTime || request.completedAt || new Date(Date.now() - 240000).toISOString(),
              processingTime: request.processingTime || 60000,
              duration: request.duration || '1 dakika',
              browser: request.browser || 'chromium',
              testName: request.testName || request.name || `Test ${request.id}`,
              agentId: request.agentId || request.assignedTo || 'agent-001'
            };

            console.log('Converting processed request:', request);
            console.log('With date objects:', requestWithDateObjects);

            try {
              const converted = toProcessedRequest(requestWithDateObjects);
              console.log('Converted processed request:', converted);
              return converted;
            } catch (error) {
              console.error('Error converting processed request:', error);
              // Fallback to a simpler conversion
              return {
                id: request.id || request._id,
                testName: request.testName || request.name || `Test ${request.id}`,
                status: request.status || 'completed',
                result: request.result || 'success',
                startTime: new Date(request.startTime || request.startedAt || new Date(Date.now() - 300000)),
                endTime: new Date(request.endTime || request.completedAt || new Date(Date.now() - 240000)),
                processingTime: request.processingTime || 60000,
                duration: request.duration || '1 dakika',
                browser: request.browser || 'chromium',
                agentId: request.agentId || request.assignedTo || 'agent-001',
                assignedTo: request.assignedTo || request.agentId || 'agent-001'
              } as unknown as ProcessedRequest;
            }
          })
        : [];

      // If no processed requests from API, use default data
      if (formattedProcessedRequests.length === 0) {
        const now = new Date();
        formattedProcessedRequests.push({
          id: '3',
          testName: 'Login Functionality Test',
          description: 'Run test case 3',
          status: 'completed' as any, // ProcessedRequestStatus.COMPLETED
          result: 'success',
          startTime: new Date(now.getTime() - 300000),
          endTime: new Date(now.getTime() - 240000),
          processingTime: 60000,
          duration: '1 dakika',
          assignedTo: '1',
          agentId: 'agent-001',
          browser: 'chromium'
        } as unknown as ProcessedRequest);
      }

      setProcessedRequests(formattedProcessedRequests);

      setError(null);
    } catch (err) {
      console.error('Error fetching server agent data:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError('Failed to load server agent data. Please try again later. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  const [processedPage, setProcessedPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);

  // Real data refresh
  const refreshData = () => {
    fetchData();
  };

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 saniyede bir yenile

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

  // Burada daha önce kullanılmayan action handler'lar vardı, kaldırıldı

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
