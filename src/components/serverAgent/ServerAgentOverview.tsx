import React from 'react';
import { Grid, Typography } from '@mui/material';
import { useServerAgentData } from './ServerAgentDataProvider';
import {
  SystemResourcesCard,
  AgentStatusCard,
  QueueStatusCard,
  PerformanceMetricsCard,
  HealthStatusCard,
  ConfigurationCard,
  ServerVersionCard
} from './';

/**
 * Server Agent sayfasının genel bakış bölümü
 * Sistem kaynakları, agent durumu, kuyruk durumu, performans metrikleri, sağlık durumu,
 * yapılandırma ve sürüm bilgilerini gösterir
 */
const ServerAgentOverview: React.FC = () => {
  const { lastUpdated, serverAgent } = useServerAgentData();

  if (!serverAgent) {
    return null;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Genel Bakış
      </Typography>
      
      <Grid container spacing={3}>
        {/* System Resources */}
        <Grid item xs={12} md={4}>
          <SystemResourcesCard
            lastUpdated={lastUpdated}
            cpuUsage={serverAgent.systemResources?.cpuUsage || 0}
            memoryUsage={serverAgent.systemResources?.memoryUsage || 0}
            diskUsage={serverAgent.systemResources?.diskUsage}
            networkUsage={serverAgent.systemResources?.networkUsage}
            loadAverage={serverAgent.systemResources?.loadAverage}
            processes={serverAgent.systemResources?.processes}
            uptime={serverAgent.systemResources?.uptime}
            cpuDetails={serverAgent.systemResources?.cpuDetails}
          />
        </Grid>

        {/* Agent Status */}
        <Grid item xs={12} md={4}>
          <AgentStatusCard
            total={serverAgent.agentStatus?.total || 0}
            available={serverAgent.agentStatus?.available || 0}
            busy={serverAgent.agentStatus?.busy || 0}
            offline={serverAgent.agentStatus?.offline || 0}
            error={serverAgent.agentStatus?.error || 0}
            maintenance={serverAgent.agentStatus?.maintenance || 0}
            limit={serverAgent.agentStatus?.total || 1}
          />
        </Grid>

        {/* Queue Status */}
        <Grid item xs={12} md={4}>
          <QueueStatusCard
            queued={serverAgent.queueStatus?.queued || 0}
            processing={serverAgent.queueStatus?.processing || 0}
            total={serverAgent.queueStatus?.total || 0}
            highPriority={serverAgent.queueStatus?.highPriority || 0}
            mediumPriority={serverAgent.queueStatus?.mediumPriority || 0}
            lowPriority={serverAgent.queueStatus?.lowPriority || 0}
            estimatedWaitTime={serverAgent.queueStatus?.estimatedWaitTime || 0}
          />
        </Grid>
        
        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <PerformanceMetricsCard
            performanceMetrics={serverAgent.performanceMetrics}
          />
        </Grid>
        
        {/* Health Status */}
        <Grid item xs={12} md={6}>
          <HealthStatusCard
            healthStatus={serverAgent.healthStatus}
          />
        </Grid>
        
        {/* Configuration */}
        <Grid item xs={12} md={8}>
          <ConfigurationCard
            config={serverAgent.config}
          />
        </Grid>
        
        {/* Server Version */}
        <Grid item xs={12} md={4}>
          <ServerVersionCard
            version={serverAgent.version}
            tags={serverAgent.tags}
            metadata={serverAgent.metadata}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ServerAgentOverview;
