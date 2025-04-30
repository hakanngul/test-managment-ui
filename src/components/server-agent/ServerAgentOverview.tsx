import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { useServerAgentData } from './ServerAgentDataProvider';
import {
  SystemResourcesCard,
  AgentStatusCard,
  QueueComponent,
  PerformanceMetricsCard,
  ServerVersionCard
} from './';

/**
 * Server Agent sayfasının genel bakış bölümü
 * Sistem kaynakları, agent durumu, kuyruk durumu, performans metrikleri, sağlık durumu,
 * yapılandırma ve sürüm bilgilerini gösterir
 */
const ServerAgentOverview: React.FC = () => {
  const { lastUpdated, serverAgent, connected } = useServerAgentData();

  if (!serverAgent) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Sunucu verisi bulunamadı
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Agent servisi ile bağlantı kurulamadı veya veri alınamadı.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Genel Bakış
      </Typography>

      <Grid container spacing={3}>
        {/* İlk Satır: Agent Status, Queue Status */}
        <Grid item xs={12} md={4}>
          <AgentStatusCard
            total={serverAgent.agentStatus?.total || 0}
            available={serverAgent.agentStatus?.available || 0}
            busy={serverAgent.agentStatus?.busy || 0}
            offline={serverAgent.agentStatus?.offline || 0}
            error={serverAgent.agentStatus?.error || 0}
            maintenance={serverAgent.agentStatus?.maintenance || 0}
            limit={10}
            connected={connected}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <QueueComponent />
        </Grid>

        <Grid item xs={12} md={4}>
          <PerformanceMetricsCard
            performanceMetrics={{
              ...serverAgent.performanceMetrics,
              cpuUsage: serverAgent.systemResources?.cpuUsage,
              memoryUsage: serverAgent.systemResources?.memoryUsage,
              diskUsage: serverAgent.systemResources?.diskUsage,
              networkUsage: serverAgent.systemResources?.networkUsage,
              uptime: serverAgent.systemResources?.uptime,
              activeProcesses: serverAgent.systemResources?.processes
            }}
          />
        </Grid>

        {/* İkinci Satır: System Resources, Server Version */}
        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
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
