import { ObjectId } from 'mongodb';
import { AgentSchema, AgentStatusSummary } from './AgentSchema';
import { QueueStatusSummary } from './QueuedRequestSchema';
import { SystemResourceSchema } from './SystemResourceSchema';

// Sunucu agent şeması
export interface ServerAgentSchema {
  _id?: ObjectId;
  id: string;
  serverId: string;
  lastUpdated: Date;
  systemResources: SystemResourceSchema;
  agentStatus: AgentStatusSummary;
  queueStatus: QueueStatusSummary;
  activeAgents: AgentSchema[] | string[]; // Agent nesneleri veya Agent ID'leri
  queuedRequests: string[]; // QueuedRequest ID'leri
  processedRequests: string[]; // ProcessedRequest ID'leri
  
  // Performans metrikleri
  performanceMetrics?: {
    cpuUsage: number; // yüzde cinsinden
    memoryUsage: number; // MB cinsinden
    diskUsage: number; // MB cinsinden
    networkUsage: number; // MB cinsinden
    activeProcesses: number;
    uptime: number; // saniye cinsinden
    loadAverage: number[];
    testExecutionTime?: {
      avg: number; // ms cinsinden
      min: number; // ms cinsinden
      max: number; // ms cinsinden
      p95: number; // ms cinsinden
    };
    concurrentTests?: number;
    queueLength?: number;
  };
  
  // Sağlık durumu
  healthStatus?: {
    status: 'healthy' | 'warning' | 'critical' | 'unknown';
    lastCheck: Date;
    issues?: {
      component: string;
      status: 'healthy' | 'warning' | 'critical' | 'unknown';
      message: string;
      timestamp: Date;
    }[];
  };
  
  // Yapılandırma
  config?: {
    maxAgents: number;
    maxConcurrentTests: number;
    maxQueueSize: number;
    agentTimeout: number; // saniye cinsinden
    testTimeout: number; // saniye cinsinden
    logLevel: 'none' | 'error' | 'warning' | 'info' | 'debug' | 'trace';
    autoScaling: boolean;
    autoScalingConfig?: {
      minAgents: number;
      maxAgents: number;
      scaleUpThreshold: number; // yüzde cinsinden
      scaleDownThreshold: number; // yüzde cinsinden
      cooldownPeriod: number; // saniye cinsinden
    };
  };
  
  // Sürüm bilgileri
  version: string;
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
}
