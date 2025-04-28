import { v4 as uuidv4 } from 'uuid';
import { Agent } from '../models/interfaces/IAgent';
import { AgentStatus, AgentType, AgentOS, AgentHealthStatus } from '../models/enums/AgentEnums';
import { BrowserType } from '../models/enums/TestCaseEnums';
import { ServerStatus, ServerType } from '../models/enums/ServerEnums';
import { RequestStatus, RequestPriority, RequestCategory, RequestSource } from '../models/enums/QueuedRequestEnums';
import { ProcessedRequestStatus, ProcessedRequestErrorType, ProcessedRequestPriority, ProcessedRequestSource } from '../models/enums/ProcessedRequestEnums';
import { QueueStatusSummary } from '../models/interfaces/IQueuedRequest';
import { SystemResource } from '../models/SystemResource';
import { ServerAgent } from '../models/ServerAgent';
import { ServerAgentSchema } from '../models/database/schemas';

// Sistem kaynakları mock verisi
export const mockSystemResource: SystemResource = {
  id: 'sys-001',
  cpuUsage: 45,
  memoryUsage: 62,
  lastUpdated: new Date(),
  serverId: 'server-001'
};

// Agent durumu özeti mock verisi
export const mockAgentStatusSummary = {
  total: 5,
  available: 2,
  busy: 1,
  offline: 1,
  error: 1,
  maintenance: 0,
  limit: 10
};

// Sunucu durumu özeti mock verisi
export const mockServerStatusSummary = {
  total: 2,
  online: 2,
  offline: 0,
  maintenance: 0,
  error: 0
};

// Kuyruk durumu özeti mock verisi
export const mockQueueStatusSummary: QueueStatusSummary = {
  queued: 8,
  scheduled: 3,
  assigned: 2,
  processing: 5,
  total: 18,
  highPriority: 4,
  mediumPriority: 10,
  lowPriority: 4,
  estimatedWaitTime: 300000 // 5 dakika (milisaniye cinsinden)
};

// Aktif agent'lar mock verisi
export const mockAgents: Agent[] = [
  {
    id: uuidv4(),
    name: 'Agent-1',
    type: AgentType.BROWSER,
    status: AgentStatus.AVAILABLE,
    browser: BrowserType.CHROME,
    networkInfo: {
      ipAddress: '192.168.1.100',
    },
    capabilities: ['chrome', 'headless', 'screenshot'],
    serverId: 'server-001',
    created: new Date('2023-01-15T10:00:00'),
    lastActivity: new Date('2023-06-20T15:30:00'),
    currentRequest: null,
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.WINDOWS,
      osVersion: '10',
      cpuModel: 'Intel Core i7-10700K',
      cpuCores: 8,
      totalMemory: 16384, // 16 GB
      totalDisk: 512000, // 500 GB
      hostname: 'DESKTOP-ABC123',
      username: 'testuser'
    },
    performanceMetrics: {
      cpuUsage: 25,
      memoryUsage: 40,
      diskUsage: 65,
      networkUsage: 10,
      uptime: 86400, // 1 gün
      lastUpdated: new Date()
    },
    healthCheck: {
      status: AgentHealthStatus.HEALTHY,
      lastCheck: new Date(),
      message: 'Agent is healthy'
    }
  },
  {
    id: uuidv4(),
    name: 'Agent-2',
    type: AgentType.BROWSER,
    status: AgentStatus.BUSY,
    browser: BrowserType.FIREFOX,
    networkInfo: {
      ipAddress: '192.168.1.101',
    },
    capabilities: ['firefox', 'screenshot', 'video'],
    serverId: 'server-001',
    created: new Date('2023-02-10T09:15:00'),
    lastActivity: new Date(),
    currentRequest: 'req-001',
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.LINUX,
      osVersion: 'Ubuntu 20.04',
      cpuModel: 'AMD Ryzen 7 3700X',
      cpuCores: 8,
      totalMemory: 32768, // 32 GB
      totalDisk: 1024000, // 1 TB
      hostname: 'ubuntu-server',
      username: 'testuser'
    },
    performanceMetrics: {
      cpuUsage: 75,
      memoryUsage: 60,
      diskUsage: 45,
      networkUsage: 30,
      uptime: 172800, // 2 gün
      lastUpdated: new Date()
    },
    healthCheck: {
      status: AgentHealthStatus.WARNING,
      lastCheck: new Date(),
      message: 'High CPU usage'
    }
  },
  {
    id: uuidv4(),
    name: 'Agent-3',
    type: AgentType.API,
    status: AgentStatus.OFFLINE,
    browser: BrowserType.CHROME,
    networkInfo: {
      ipAddress: '192.168.1.102',
    },
    capabilities: ['api', 'rest', 'graphql'],
    serverId: 'server-001',
    created: new Date('2023-03-05T14:30:00'),
    lastActivity: new Date('2023-06-19T08:45:00'),
    currentRequest: null,
    version: '1.2.2',
    systemInfo: {
      os: AgentOS.MACOS,
      osVersion: 'Monterey 12.4',
      cpuModel: 'Apple M1 Pro',
      cpuCores: 10,
      totalMemory: 16384, // 16 GB
      totalDisk: 512000, // 500 GB
      hostname: 'macbook-pro',
      username: 'testuser'
    },
    performanceMetrics: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 70,
      networkUsage: 0,
      uptime: 0, // Offline
      lastUpdated: new Date('2023-06-19T08:45:00')
    },
    healthCheck: {
      status: AgentHealthStatus.UNKNOWN,
      lastCheck: new Date('2023-06-19T08:45:00'),
      message: 'Agent is offline'
    }
  },
  {
    id: uuidv4(),
    name: 'Agent-4',
    type: AgentType.MOBILE,
    status: AgentStatus.ERROR,
    browser: BrowserType.SAFARI,
    networkInfo: {
      ipAddress: '192.168.1.103',
    },
    capabilities: ['ios', 'safari', 'screenshot'],
    serverId: 'server-001',
    created: new Date('2023-04-20T11:20:00'),
    lastActivity: new Date('2023-06-20T10:15:00'),
    currentRequest: null,
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.IOS,
      osVersion: '15.5',
      cpuModel: 'Apple A15',
      cpuCores: 6,
      totalMemory: 4096, // 4 GB
      totalDisk: 128000, // 128 GB
      hostname: 'iPhone-13',
      username: 'mobile-user'
    },
    performanceMetrics: {
      cpuUsage: 90,
      memoryUsage: 85,
      diskUsage: 50,
      networkUsage: 5,
      uptime: 43200, // 12 saat
      lastUpdated: new Date('2023-06-20T10:15:00')
    },
    healthCheck: {
      status: AgentHealthStatus.CRITICAL,
      lastCheck: new Date('2023-06-20T10:15:00'),
      message: 'Memory leak detected'
    }
  },
  {
    id: uuidv4(),
    name: 'Agent-5',
    type: AgentType.BROWSER,
    status: AgentStatus.AVAILABLE,
    browser: BrowserType.EDGE,
    networkInfo: {
      ipAddress: '192.168.1.104',
    },
    capabilities: ['edge', 'headless', 'screenshot', 'video'],
    serverId: 'server-001',
    created: new Date('2023-05-15T16:45:00'),
    lastActivity: new Date('2023-06-20T14:30:00'),
    currentRequest: null,
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.WINDOWS,
      osVersion: '11',
      cpuModel: 'Intel Core i9-12900K',
      cpuCores: 16,
      totalMemory: 65536, // 64 GB
      totalDisk: 2048000, // 2 TB
      hostname: 'DESKTOP-XYZ789',
      username: 'testuser'
    },
    performanceMetrics: {
      cpuUsage: 15,
      memoryUsage: 30,
      diskUsage: 40,
      networkUsage: 5,
      uptime: 259200, // 3 gün
      lastUpdated: new Date('2023-06-20T14:30:00')
    },
    healthCheck: {
      status: AgentHealthStatus.HEALTHY,
      lastCheck: new Date('2023-06-20T14:30:00'),
      message: 'Agent is healthy'
    }
  }
];

// İşlenmiş istekler mock verisi
export const mockProcessedRequests = [
  {
    id: uuidv4(),
    testName: 'Login Test',
    testCaseId: 'tc-001',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.SUCCESS,
    browser: BrowserType.CHROME,
    agentId: mockAgents[0].id,
    priority: ProcessedRequestPriority.HIGH,
    source: ProcessedRequestSource.MANUAL,
    startTime: new Date('2023-06-20T09:00:00'),
    endTime: new Date('2023-06-20T09:01:30'),
    duration: '1m 30s',
    durationMs: 90000,
    performance: {
      setupTime: 2000,
      executionTime: 85000,
      teardownTime: 3000,
      totalTime: 90000,
      cpuUsage: 35,
      memoryUsage: 250,
      networkUsage: 5
    }
  },
  {
    id: uuidv4(),
    testName: 'Product Search',
    testCaseId: 'tc-002',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.FAILED,
    error: {
      type: ProcessedRequestErrorType.ASSERTION,
      message: 'Expected product count to be 5, but got 3',
      timestamp: new Date('2023-06-20T09:32:45')
    },
    browser: BrowserType.FIREFOX,
    agentId: mockAgents[1].id,
    priority: ProcessedRequestPriority.MEDIUM,
    source: ProcessedRequestSource.SCHEDULED,
    startTime: new Date('2023-06-20T09:30:00'),
    endTime: new Date('2023-06-20T09:32:45'),
    duration: '2m 45s',
    durationMs: 165000,
    performance: {
      setupTime: 3000,
      executionTime: 160000,
      teardownTime: 2000,
      totalTime: 165000,
      cpuUsage: 45,
      memoryUsage: 320,
      networkUsage: 8
    }
  },
  {
    id: uuidv4(),
    testName: 'Checkout Process',
    testCaseId: 'tc-003',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.SUCCESS,
    browser: BrowserType.CHROME,
    agentId: mockAgents[0].id,
    priority: ProcessedRequestPriority.CRITICAL,
    source: ProcessedRequestSource.MANUAL,
    startTime: new Date('2023-06-20T10:15:00'),
    endTime: new Date('2023-06-20T10:18:30'),
    duration: '3m 30s',
    durationMs: 210000,
    performance: {
      setupTime: 2500,
      executionTime: 205000,
      teardownTime: 2500,
      totalTime: 210000,
      cpuUsage: 55,
      memoryUsage: 380,
      networkUsage: 12
    }
  },
  {
    id: uuidv4(),
    testName: 'User Registration',
    testCaseId: 'tc-004',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.TIMEOUT,
    error: {
      type: ProcessedRequestErrorType.TIMEOUT,
      message: 'Test execution timed out after 5 minutes',
      timestamp: new Date('2023-06-20T11:05:00')
    },
    browser: BrowserType.EDGE,
    agentId: mockAgents[4].id,
    priority: ProcessedRequestPriority.HIGH,
    source: ProcessedRequestSource.CI_CD,
    startTime: new Date('2023-06-20T11:00:00'),
    endTime: new Date('2023-06-20T11:05:00'),
    duration: '5m 0s',
    durationMs: 300000,
    performance: {
      setupTime: 3000,
      executionTime: 295000,
      teardownTime: 2000,
      totalTime: 300000,
      cpuUsage: 65,
      memoryUsage: 420,
      networkUsage: 15
    }
  },
  {
    id: uuidv4(),
    testName: 'API Authentication',
    testCaseId: 'tc-005',
    testSuiteId: 'ts-003',
    projectId: 'proj-002',
    status: ProcessedRequestStatus.SUCCESS,
    browser: 'N/A',
    agentId: mockAgents[2].id,
    priority: ProcessedRequestPriority.MEDIUM,
    source: ProcessedRequestSource.API,
    startTime: new Date('2023-06-20T11:30:00'),
    endTime: new Date('2023-06-20T11:30:45'),
    duration: '0m 45s',
    durationMs: 45000,
    performance: {
      setupTime: 1000,
      executionTime: 43000,
      teardownTime: 1000,
      totalTime: 45000,
      cpuUsage: 25,
      memoryUsage: 150,
      networkUsage: 3
    }
  }
];

// Kuyrukta bekleyen istekler mock verisi
export const mockQueuedRequests = [
  {
    id: uuidv4(),
    testName: 'Product Filter Test',
    testCaseId: 'tc-006',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: RequestStatus.QUEUED,
    priority: RequestPriority.HIGH,
    category: RequestCategory.UI_TEST,
    source: RequestSource.MANUAL,
    browser: BrowserType.CHROME,
    timing: {
      queuedAt: new Date('2023-06-20T12:00:00'),
      estimatedStartTime: new Date('2023-06-20T12:15:00'),
      waitTime: '15m',
      waitTimeMs: 900000
    },
    createdBy: 'user-001',
    createdAt: new Date('2023-06-20T12:00:00')
  },
  {
    id: uuidv4(),
    testName: 'User Profile Update',
    testCaseId: 'tc-007',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: RequestStatus.SCHEDULED,
    priority: RequestPriority.MEDIUM,
    category: RequestCategory.UI_TEST,
    source: RequestSource.SCHEDULED,
    browser: BrowserType.FIREFOX,
    timing: {
      queuedAt: new Date('2023-06-20T12:05:00'),
      scheduledAt: new Date('2023-06-20T13:00:00'),
      estimatedStartTime: new Date('2023-06-20T13:00:00'),
      waitTime: '55m',
      waitTimeMs: 3300000
    },
    createdBy: 'system',
    createdAt: new Date('2023-06-20T12:05:00')
  },
  {
    id: uuidv4(),
    testName: 'Payment Gateway Integration',
    testCaseId: 'tc-008',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: RequestStatus.ASSIGNED,
    priority: RequestPriority.CRITICAL,
    category: RequestCategory.INTEGRATION_TEST,
    source: RequestSource.CI_CD,
    browser: BrowserType.CHROME,
    timing: {
      queuedAt: new Date('2023-06-20T12:10:00'),
      assignedAt: new Date('2023-06-20T12:12:00'),
      estimatedStartTime: new Date('2023-06-20T12:12:30'),
      waitTime: '2m 30s',
      waitTimeMs: 150000
    },
    assignedAgentId: mockAgents[0].id,
    createdBy: 'ci-pipeline',
    createdAt: new Date('2023-06-20T12:10:00')
  },
  {
    id: uuidv4(),
    testName: 'Mobile Responsive Layout',
    testCaseId: 'tc-009',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: RequestStatus.QUEUED,
    priority: RequestPriority.LOW,
    category: RequestCategory.UI_TEST,
    source: RequestSource.MANUAL,
    browser: BrowserType.SAFARI,
    timing: {
      queuedAt: new Date('2023-06-20T12:15:00'),
      estimatedStartTime: new Date('2023-06-20T12:45:00'),
      waitTime: '30m',
      waitTimeMs: 1800000
    },
    createdBy: 'user-002',
    createdAt: new Date('2023-06-20T12:15:00')
  },
  {
    id: uuidv4(),
    testName: 'API Rate Limiting',
    testCaseId: 'tc-010',
    testSuiteId: 'ts-003',
    projectId: 'proj-002',
    status: RequestStatus.PROCESSING,
    priority: RequestPriority.MEDIUM,
    category: RequestCategory.API_TEST,
    source: RequestSource.MANUAL,
    browser: 'N/A',
    timing: {
      queuedAt: new Date('2023-06-20T12:20:00'),
      assignedAt: new Date('2023-06-20T12:25:00'),
      startedAt: new Date('2023-06-20T12:25:30'),
      waitTime: '5m 30s',
      waitTimeMs: 330000
    },
    assignedAgentId: mockAgents[1].id,
    createdBy: 'user-001',
    createdAt: new Date('2023-06-20T12:20:00')
  }
];

// Sistem kaynakları geçmiş verisi
export const mockSystemResourcesHistory = Array.from({ length: 24 }, (_, i) => {
  const timestamp = new Date();
  timestamp.setHours(timestamp.getHours() - (23 - i));

  return {
    timestamp: timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    cpu: Math.floor(Math.random() * 40) + 20, // %20-60 arası
    memory: Math.floor(Math.random() * 30) + 40, // %40-70 arası
    disk: Math.floor(Math.random() * 20) + 10, // %10-30 arası
    network: Math.floor(Math.random() * 50) + 10, // %10-60 arası
  };
});

// Performans metrikleri mock verisi
export const mockPerformanceMetrics = {
  requestsPerMinute: 42,
  averageResponseTime: 320, // ms
  successRate: 92.5, // %
  errorRate: 7.5, // %

  resourceUtilization: {
    cpu: 45, // %
    memory: 62, // %
    disk: 28, // %
    network: 35 // %
  },
  concurrentTests: {
    current: 5,
    max: 20
  },
  history: Array.from({ length: 24 }, (_, i) => {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - (23 - i));

    return {
      timestamp: timestamp.toISOString(),
      requestsPerMinute: Math.floor(Math.random() * 30) + 20,
      averageResponseTime: Math.floor(Math.random() * 200) + 200,
      successRate: Math.floor(Math.random() * 10) + 85
    };
  })
};

// Sağlık durumu mock verisi
export const mockHealthStatus = {
  status: 'healthy', // 'healthy', 'warning', 'critical', 'maintenance'
  lastCheck: new Date().toISOString(),
  uptime: 1209600, // 14 gün (saniye cinsinden)
  message: 'System is operating normally',
  checks: [
    {
      name: 'Database Connection',
      status: 'pass',
      message: 'Connected to database',
      timestamp: new Date().toISOString()
    },
    {
      name: 'API Response Time',
      status: 'pass',
      message: 'API response time is within acceptable limits',
      timestamp: new Date().toISOString()
    },
    {
      name: 'Disk Space',
      status: 'pass',
      message: 'Sufficient disk space available',
      timestamp: new Date().toISOString()
    },
    {
      name: 'Memory Usage',
      status: 'warn',
      message: 'Memory usage is higher than normal',
      timestamp: new Date().toISOString()
    },
    {
      name: 'Agent Connectivity',
      status: 'pass',
      message: 'All active agents are connected',
      timestamp: new Date().toISOString()
    }
  ]
};



// Sürüm bilgisi mock verisi
export const mockVersion = {
  current: '2.5.3',
  latest: '2.6.0',
  updateAvailable: true,
  lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 gün önce
  releaseNotes: 'https://example.com/release-notes/2.6.0'
};

// ServerAgent mock verisi (ServerAgentSchema tipinde)
export const mockServerAgent = {
  id: 'server-001',
  name: 'Test Automation Server',
  status: 'online',
  version: mockVersion,
  systemResources: {
    ...mockSystemResource,
    diskUsage: 28,
    networkUsage: 35,
    loadAverage: [1.2, 1.5, 1.8],
    processes: 124,
    uptime: 1209600, // 14 gün (saniye cinsinden)
    cpuDetails: {
      model: 'Intel Xeon E5-2680 v4',
      cores: 14,
      speed: 2.4
    }
  },
  agentStatus: mockAgentStatusSummary,
  queueStatus: mockQueueStatusSummary,
  performanceMetrics: mockPerformanceMetrics,
  healthStatus: mockHealthStatus,
  activeAgents: mockAgents.map(agent => agent.id),
  queuedRequests: mockQueuedRequests.map(req => req.id),
  processedRequests: mockProcessedRequests.map(req => req.id),
  tags: ['production', 'main', 'europe'],
  metadata: {
    location: 'Frankfurt',
    environment: 'Production',
    responsible: 'DevOps Team',
    contact: 'devops@example.com'
  },
  lastUpdated: new Date().toISOString(),
  createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString() // 180 gün önce
};

// Orijinal ServerAgent nesnesi (eski bileşenler için)
export const mockServerAgentOriginal: ServerAgent = {
  id: 'server-001',
  systemResources: mockSystemResource,
  agentStatus: mockAgentStatusSummary,
  queueStatus: mockQueueStatusSummary,
  activeAgents: mockAgents,
  queuedRequests: mockQueuedRequests as any,
  processedRequests: mockProcessedRequests as any
};
