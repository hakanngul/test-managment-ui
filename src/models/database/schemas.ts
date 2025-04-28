import { Agent } from '../interfaces/IAgent';
import { QueuedRequest, QueueStatusSummary } from '../interfaces/IQueuedRequest';
import { ProcessedRequest } from '../interfaces/IProcessedRequest';
import { SystemResource } from '../SystemResource';

/**
 * Server Agent şeması
 * 
 * Bu şema, MongoDB'deki serverAgent koleksiyonunun yapısını tanımlar
 */
export interface ServerAgentSchema {
  id: string;
  name?: string;
  status: string;
  version: {
    current: string;
    latest?: string;
    updateAvailable: boolean;
    lastUpdated?: string;
    releaseNotes?: string;
  };
  systemResources: SystemResource & {
    diskUsage?: number;
    networkUsage?: number;
    loadAverage?: number[];
    processes?: number;
    uptime?: number;
    cpuDetails?: {
      model: string;
      cores: number;
      speed: number;
    };
  };
  agentStatus: {
    total: number;
    available: number;
    busy: number;
    offline: number;
    error: number;
    maintenance: number;
  };
  queueStatus: QueueStatusSummary;
  performanceMetrics: {
    requestsPerMinute: number;
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
    testExecutionTime: {
      average: number;
      min: number;
      max: number;
      p95: number;
    };
    resourceUtilization: {
      cpu: number;
      memory: number;
      disk: number;
      network: number;
    };
    concurrentTests: {
      current: number;
      max: number;
    };
    history?: {
      timestamp: string;
      requestsPerMinute: number;
      averageResponseTime: number;
      successRate: number;
    }[];
  };
  healthStatus: {
    status: 'healthy' | 'warning' | 'critical' | 'maintenance';
    lastCheck: string;
    uptime: number;
    message?: string;
    checks: {
      name: string;
      status: 'pass' | 'warn' | 'fail';
      message?: string;
      timestamp: string;
    }[];
  };
  config: {
    maxConcurrentTests: number;
    queueLimit: number;
    testTimeout: number;
    retryPolicy: {
      enabled: boolean;
      maxRetries: number;
      retryInterval: number;
    };
    logging: {
      level: string;
      retention: number;
    };
    security: {
      authEnabled: boolean;
      sslEnabled: boolean;
    };
    notifications: {
      email: boolean;
      slack: boolean;
      webhook: boolean;
    };
  };
  activeAgents: Agent[] | string[];
  queuedRequests: QueuedRequest[] | string[];
  processedRequests: ProcessedRequest[] | string[];
  tags?: string[];
  metadata?: Record<string, any>;
  lastUpdated: string;
  createdAt: string;
}
