import { Agent, AgentStatusSummary } from './Agent';
import { QueuedRequest, QueueStatusSummary } from './QueuedRequest';
import { ProcessedRequest } from './ProcessedRequest';
import { SystemResource } from './SystemResource';

// Server agent model
export interface ServerAgent {
  id: string;
  systemResources: SystemResource;
  agentStatus: AgentStatusSummary;
  queueStatus: QueueStatusSummary;
  activeAgents: Agent[];
  queuedRequests: QueuedRequest[];
  processedRequests: ProcessedRequest[];
}

// Convert raw server agent data to ServerAgent model
export const toServerAgent = (data: any): ServerAgent => {
  return {
    id: data.id || data._id || 'server-001',
    systemResources: {
      id: data.systemResources?.id || 'sys-001',
      cpuUsage: data.systemResources?.cpuUsage || 0,
      memoryUsage: data.systemResources?.memoryUsage || 0,
      lastUpdated: data.systemResources?.lastUpdated ? new Date(data.systemResources.lastUpdated) : new Date(),
      serverId: data.systemResources?.serverId || 'server-001'
    },
    agentStatus: {
      total: data.agentStatus?.total || 0,
      available: data.agentStatus?.available || 0,
      busy: data.agentStatus?.busy || 0,
      offline: data.agentStatus?.offline || 0,
      error: data.agentStatus?.error || 0,
      maintenance: data.agentStatus?.maintenance || 0,
      limit: data.agentStatus?.limit || 1
    },
    queueStatus: {
      queued: data.queueStatus?.queued || 0,
      processing: data.queueStatus?.processing || 0,
      total: data.queueStatus?.total || 0,
      scheduled: data.queueStatus?.scheduled || 0,
      assigned: data.queueStatus?.assigned || 0,
      highPriority: data.queueStatus?.highPriority || 0,
      mediumPriority: data.queueStatus?.mediumPriority || 0,
      lowPriority: data.queueStatus?.lowPriority || 0,
      estimatedWaitTime: data.queueStatus?.estimatedWaitTime || 0
    },
    activeAgents: data.activeAgents || [],
    queuedRequests: data.queuedRequests || [],
    processedRequests: data.processedRequests || []
  };
};

// Convert ServerAgent model to raw data for API
export const fromServerAgent = (serverAgent: ServerAgent): any => {
  return {
    id: serverAgent.id,
    systemResources: {
      id: serverAgent.systemResources.id,
      cpuUsage: serverAgent.systemResources.cpuUsage,
      memoryUsage: serverAgent.systemResources.memoryUsage,
      lastUpdated: serverAgent.systemResources.lastUpdated.toISOString(),
      serverId: serverAgent.systemResources.serverId
    },
    agentStatus: serverAgent.agentStatus,
    queueStatus: serverAgent.queueStatus,
    activeAgents: serverAgent.activeAgents,
    queuedRequests: serverAgent.queuedRequests,
    processedRequests: serverAgent.processedRequests
  };
};
