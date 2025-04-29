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

/**
 * Boş bir ServerAgentSchema nesnesi oluşturur
 * Bu, API çağrıları başarısız olduğunda kullanılır
 */
export const createEmptyServerAgentSchema = (): ServerAgentSchema => {
  return {
    id: 'unknown',
    name: 'Agent Launcher',
    status: 'OFFLINE',
    version: {
      current: '1.0.0',
      updateAvailable: false
    },
    systemResources: {
      cpuUsage: 0,
      memoryUsage: 0
    },
    agentStatus: {
      total: 0,
      available: 0,
      busy: 0,
      offline: 0,
      error: 0,
      maintenance: 0
    },
    queueStatus: {
      queued: 0,
      processing: 0,
      total: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      estimatedWaitTime: 0
    },
    performanceMetrics: {
      testExecutionTime: {
        average: 0,
        min: 0,
        max: 0,
        p95: 0
      },
      requestsPerMinute: 0,
      averageResponseTime: 0,
      successRate: 0,
      errorRate: 0,
      resourceUtilization: {
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0
      },
      concurrentTests: {
        current: 0,
        max: 5
      }
    },
    healthStatus: {
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      uptime: 0,
      checks: []
    },
    config: {
      maxConcurrentTests: 5,
      queueLimit: 100,
      testTimeout: 300000,
      retryPolicy: {
        enabled: true,
        maxRetries: 3,
        retryInterval: 5000
      },
      logging: {
        level: 'info',
        retention: 7
      },
      security: {
        authEnabled: false,
        sslEnabled: false
      },
      notifications: {
        email: false,
        slack: false,
        webhook: false
      }
    },
    activeAgents: [],
    queuedRequests: [],
    processedRequests: [],
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
};

