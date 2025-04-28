import { Agent } from '../models/interfaces/IAgent';
import { AgentStatus, AgentType, AgentOS, AgentHealthStatus } from '../models/enums/AgentEnums';
import { BrowserType } from '../models/enums/TestCaseEnums';
import { RequestStatus, RequestPriority, RequestCategory, RequestSource } from '../models/enums/QueuedRequestEnums';
import { ProcessedRequestStatus, ProcessedRequestErrorType, ProcessedRequestPriority, ProcessedRequestSource } from '../models/enums/ProcessedRequestEnums';
import { QueueStatusSummary } from '../models/interfaces/IQueuedRequest';
import { SystemResource } from '../models/SystemResource';
import { ServerAgent } from '../models/ServerAgent';

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
    id: '0aea406b-dff1-4df9-a613-cfa4a92e56e3',
    name: 'Chrome-Agent-1',
    type: AgentType.BROWSER,
    status: AgentStatus.AVAILABLE,
    browser: BrowserType.CHROME,
    networkInfo: {
      ipAddress: '192.168.1.100',
    },
    capabilities: ['chrome', 'headless', 'screenshot', 'video'],
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
    id: '4dd16532-17b6-4e06-9575-56acfd862d50',
    name: 'Firefox-Agent-1',
    type: AgentType.BROWSER,
    status: AgentStatus.BUSY,
    browser: BrowserType.FIREFOX,
    networkInfo: {
      ipAddress: '192.168.1.101',
    },
    capabilities: ['firefox', 'screenshot', 'video', 'network-monitor'],
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
    id: 'b8dad830-3ed6-4464-859f-f720d460c6a5',
    name: 'API-Agent-1',
    type: AgentType.API,
    status: AgentStatus.OFFLINE,
    browser: BrowserType.CHROME,
    networkInfo: {
      ipAddress: '192.168.1.102',
    },
    capabilities: ['api', 'rest', 'graphql', 'soap', 'jwt-auth'],
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
    id: '34088356-e30a-446c-a38c-3dbcf12d53f6',
    name: 'Mobile-Agent-1',
    type: AgentType.MOBILE,
    status: AgentStatus.ERROR,
    browser: BrowserType.SAFARI,
    networkInfo: {
      ipAddress: '192.168.1.103',
    },
    capabilities: ['ios', 'safari', 'screenshot', 'touch-events', 'device-orientation'],
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
    id: '3d2a4748-5d43-45dd-b200-59ecd6901f3e',
    name: 'Edge-Agent-1',
    type: AgentType.BROWSER,
    status: AgentStatus.AVAILABLE,
    browser: BrowserType.EDGE,
    networkInfo: {
      ipAddress: '192.168.1.104',
    },
    capabilities: ['edge', 'headless', 'screenshot', 'video', 'network-monitor', 'performance-metrics'],
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
  },
  {
    id: '7f8a9b2c-1d3e-4f5a-6b7c-8d9e0f1a2b3c',
    name: 'Chrome-Agent-2',
    type: AgentType.BROWSER,
    status: AgentStatus.MAINTENANCE,
    browser: BrowserType.CHROME,
    networkInfo: {
      ipAddress: '192.168.1.105',
    },
    capabilities: ['chrome', 'headless', 'screenshot', 'video', 'performance-metrics'],
    serverId: 'server-001',
    created: new Date('2023-03-22T08:30:00'),
    lastActivity: new Date('2023-06-19T16:45:00'),
    currentRequest: null,
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.WINDOWS,
      osVersion: '11',
      cpuModel: 'Intel Core i5-11600K',
      cpuCores: 6,
      totalMemory: 32768, // 32 GB
      totalDisk: 1024000, // 1 TB
      hostname: 'DESKTOP-DEF456',
      username: 'testuser'
    },
    performanceMetrics: {
      cpuUsage: 5,
      memoryUsage: 20,
      diskUsage: 55,
      networkUsage: 2,
      uptime: 129600, // 1.5 gün
      lastUpdated: new Date('2023-06-19T16:45:00')
    },
    healthCheck: {
      status: AgentHealthStatus.MAINTENANCE,
      lastCheck: new Date('2023-06-19T16:45:00'),
      message: 'Scheduled maintenance'
    }
  },
  {
    id: '4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d',
    name: 'Firefox-Agent-2',
    type: AgentType.BROWSER,
    status: AgentStatus.BUSY,
    browser: BrowserType.FIREFOX,
    networkInfo: {
      ipAddress: '192.168.1.106',
    },
    capabilities: ['firefox', 'screenshot', 'video', 'network-monitor', 'console-capture'],
    serverId: 'server-001',
    created: new Date('2023-04-05T11:20:00'),
    lastActivity: new Date(),
    currentRequest: 'req-002',
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.LINUX,
      osVersion: 'Debian 11',
      cpuModel: 'AMD Ryzen 5 5600X',
      cpuCores: 6,
      totalMemory: 16384, // 16 GB
      totalDisk: 512000, // 500 GB
      hostname: 'debian-server',
      username: 'testuser'
    },
    performanceMetrics: {
      cpuUsage: 65,
      memoryUsage: 50,
      diskUsage: 35,
      networkUsage: 25,
      uptime: 345600, // 4 gün
      lastUpdated: new Date()
    },
    healthCheck: {
      status: AgentHealthStatus.HEALTHY,
      lastCheck: new Date(),
      message: 'Agent is healthy'
    }
  },
  {
    id: '9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f',
    name: 'Safari-Agent-1',
    type: AgentType.BROWSER,
    status: AgentStatus.AVAILABLE,
    browser: BrowserType.SAFARI,
    networkInfo: {
      ipAddress: '192.168.1.107',
    },
    capabilities: ['safari', 'screenshot', 'video', 'performance-metrics'],
    serverId: 'server-001',
    created: new Date('2023-05-10T09:45:00'),
    lastActivity: new Date('2023-06-20T13:15:00'),
    currentRequest: null,
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.MACOS,
      osVersion: 'Ventura 13.2',
      cpuModel: 'Apple M2',
      cpuCores: 8,
      totalMemory: 16384, // 16 GB
      totalDisk: 512000, // 500 GB
      hostname: 'macbook-air',
      username: 'testuser'
    },
    performanceMetrics: {
      cpuUsage: 20,
      memoryUsage: 35,
      diskUsage: 45,
      networkUsage: 8,
      uptime: 172800, // 2 gün
      lastUpdated: new Date('2023-06-20T13:15:00')
    },
    healthCheck: {
      status: AgentHealthStatus.HEALTHY,
      lastCheck: new Date('2023-06-20T13:15:00'),
      message: 'Agent is healthy'
    }
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    name: 'Android-Agent-1',
    type: AgentType.MOBILE,
    status: AgentStatus.AVAILABLE,
    browser: BrowserType.CHROME,
    networkInfo: {
      ipAddress: '192.168.1.108',
    },
    capabilities: ['android', 'chrome', 'screenshot', 'video', 'touch-events', 'device-orientation'],
    serverId: 'server-001',
    created: new Date('2023-05-25T14:20:00'),
    lastActivity: new Date('2023-06-20T11:45:00'),
    currentRequest: null,
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.ANDROID,
      osVersion: '12',
      cpuModel: 'Snapdragon 8 Gen 1',
      cpuCores: 8,
      totalMemory: 8192, // 8 GB
      totalDisk: 256000, // 256 GB
      hostname: 'samsung-s22',
      username: 'mobile-user'
    },
    performanceMetrics: {
      cpuUsage: 30,
      memoryUsage: 45,
      diskUsage: 60,
      networkUsage: 15,
      uptime: 86400, // 1 gün
      lastUpdated: new Date('2023-06-20T11:45:00')
    },
    healthCheck: {
      status: AgentHealthStatus.HEALTHY,
      lastCheck: new Date('2023-06-20T11:45:00'),
      message: 'Agent is healthy'
    }
  },
  {
    id: 'r8s9t0u1-v2w3-x4y5-z6a7-b8c9d0e1f2g3',
    name: 'API-Agent-2',
    type: AgentType.API,
    status: AgentStatus.AVAILABLE,
    browser: BrowserType.CHROME,
    networkInfo: {
      ipAddress: '192.168.1.109',
    },
    capabilities: ['api', 'rest', 'graphql', 'oauth', 'performance-testing'],
    serverId: 'server-001',
    created: new Date('2023-06-01T10:30:00'),
    lastActivity: new Date('2023-06-20T15:00:00'),
    currentRequest: null,
    version: '1.2.3',
    systemInfo: {
      os: AgentOS.LINUX,
      osVersion: 'Alpine 3.16',
      cpuModel: 'Intel Xeon E5-2680',
      cpuCores: 8,
      totalMemory: 8192, // 8 GB
      totalDisk: 256000, // 256 GB
      hostname: 'api-server',
      username: 'apiuser'
    },
    performanceMetrics: {
      cpuUsage: 10,
      memoryUsage: 25,
      diskUsage: 30,
      networkUsage: 40,
      uptime: 432000, // 5 gün
      lastUpdated: new Date('2023-06-20T15:00:00')
    },
    healthCheck: {
      status: AgentHealthStatus.HEALTHY,
      lastCheck: new Date('2023-06-20T15:00:00'),
      message: 'Agent is healthy'
    }
  }
];

// İşlenmiş istekler mock verisi
export const mockProcessedRequests = [
  {
    id: 'pr-001-a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    testName: 'Giriş Testi',
    testCaseId: 'tc-001',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.SUCCESS,
    browser: BrowserType.CHROME,
    agentId: '0aea406b-dff1-4df9-a613-cfa4a92e56e3', // Chrome-Agent-1
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
    },
    description: 'Kullanıcı giriş işleminin test edilmesi',
    tags: ['regression', 'ui', 'authentication'],
    result: {
      passed: true,
      failedAssertions: 0,
      totalAssertions: 12,
      screenshots: ['login-form.png', 'dashboard-after-login.png'],
      logs: ['Giriş formu görüntülendi', 'Kullanıcı bilgileri girildi', 'Giriş başarılı', 'Dashboard sayfasına yönlendirildi']
    }
  },
  {
    id: 'pr-002-b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
    testName: 'Ürün Arama',
    testCaseId: 'tc-002',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.FAILED,
    error: {
      type: ProcessedRequestErrorType.ASSERTION,
      message: 'Ürün sayısının 5 olması bekleniyordu, ancak 3 bulundu',
      timestamp: new Date('2023-06-20T09:32:45'),
      stackTrace: 'at ProductSearchTest.validateProductCount (ProductSearchTest.js:45:12)'
    },
    browser: BrowserType.FIREFOX,
    agentId: '4dd16532-17b6-4e06-9575-56acfd862d50', // Firefox-Agent-1
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
    },
    description: 'Ürün arama işlevinin test edilmesi',
    tags: ['regression', 'ui', 'search'],
    result: {
      passed: false,
      failedAssertions: 1,
      totalAssertions: 8,
      screenshots: ['search-results.png', 'error-state.png'],
      logs: ['Arama formu görüntülendi', 'Arama terimi girildi', 'Arama sonuçları görüntülendi', 'HATA: Ürün sayısı beklenen değerle eşleşmiyor']
    }
  },
  {
    id: 'pr-003-c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    testName: 'Ödeme İşlemi',
    testCaseId: 'tc-003',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.SUCCESS,
    browser: BrowserType.CHROME,
    agentId: '0aea406b-dff1-4df9-a613-cfa4a92e56e3', // Chrome-Agent-1
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
    },
    description: 'Ödeme işlemi akışının test edilmesi',
    tags: ['critical', 'ui', 'payment', 'checkout'],
    result: {
      passed: true,
      failedAssertions: 0,
      totalAssertions: 18,
      screenshots: ['cart.png', 'shipping-info.png', 'payment-info.png', 'order-confirmation.png'],
      logs: ['Sepet görüntülendi', 'Teslimat bilgileri girildi', 'Ödeme bilgileri girildi', 'Sipariş onaylandı', 'Sipariş onay sayfası görüntülendi']
    }
  },
  {
    id: 'pr-004-d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    testName: 'Kullanıcı Kaydı',
    testCaseId: 'tc-004',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.TIMEOUT,
    error: {
      type: ProcessedRequestErrorType.TIMEOUT,
      message: 'Test yürütmesi 5 dakika sonra zaman aşımına uğradı',
      timestamp: new Date('2023-06-20T11:05:00'),
      stackTrace: 'at TestRunner.executeTest (TestRunner.js:120:18)'
    },
    browser: BrowserType.EDGE,
    agentId: '3d2a4748-5d43-45dd-b200-59ecd6901f3e', // Edge-Agent-1
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
    },
    description: 'Yeni kullanıcı kaydı işleminin test edilmesi',
    tags: ['regression', 'ui', 'registration'],
    result: {
      passed: false,
      failedAssertions: 0,
      totalAssertions: 5,
      screenshots: ['registration-form.png', 'loading-state.png'],
      logs: ['Kayıt formu görüntülendi', 'Kullanıcı bilgileri girildi', 'Kayıt butonu tıklandı', 'HATA: E-posta doğrulama sayfası 5 dakika içinde yüklenemedi']
    }
  },
  {
    id: 'pr-005-e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0',
    testName: 'API Kimlik Doğrulama',
    testCaseId: 'tc-005',
    testSuiteId: 'ts-003',
    projectId: 'proj-002',
    status: ProcessedRequestStatus.SUCCESS,
    browser: BrowserType.CHROME,
    agentId: 'b8dad830-3ed6-4464-859f-f720d460c6a5', // API-Agent-1
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
    },
    description: 'API kimlik doğrulama mekanizmasının test edilmesi',
    tags: ['api', 'authentication', 'security'],
    result: {
      passed: true,
      failedAssertions: 0,
      totalAssertions: 10,
      screenshots: [],
      logs: ['Token isteği gönderildi', 'Token başarıyla alındı', 'Token ile korumalı endpoint erişimi test edildi', 'Geçersiz token ile erişim reddedildi']
    }
  },
  {
    id: 'pr-006-f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1',
    testName: 'Kullanıcı Profil Güncelleme',
    testCaseId: 'tc-007',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.SUCCESS,
    browser: BrowserType.FIREFOX,
    agentId: '4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d', // Firefox-Agent-2
    priority: ProcessedRequestPriority.MEDIUM,
    source: ProcessedRequestSource.SCHEDULED,
    startTime: new Date('2023-06-20T11:45:00'),
    endTime: new Date('2023-06-20T11:47:30'),
    duration: '2m 30s',
    durationMs: 150000,
    performance: {
      setupTime: 2000,
      executionTime: 146000,
      teardownTime: 2000,
      totalTime: 150000,
      cpuUsage: 40,
      memoryUsage: 280,
      networkUsage: 7
    },
    description: 'Kullanıcı profil bilgilerinin güncellenmesi ve doğrulanması',
    tags: ['regression', 'ui', 'user-profile'],
    result: {
      passed: true,
      failedAssertions: 0,
      totalAssertions: 14,
      screenshots: ['profile-page.png', 'edit-form.png', 'updated-profile.png'],
      logs: ['Profil sayfası görüntülendi', 'Düzenleme formu açıldı', 'Profil bilgileri güncellendi', 'Değişiklikler kaydedildi', 'Güncellenmiş profil görüntülendi']
    }
  },
  {
    id: 'pr-007-g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2',
    testName: 'Ürün Filtreleme',
    testCaseId: 'tc-006',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.PARTIAL_SUCCESS,
    error: {
      type: ProcessedRequestErrorType.ASSERTION,
      message: 'Fiyat filtresi doğru sonuçları göstermedi',
      timestamp: new Date('2023-06-20T12:05:15'),
      stackTrace: 'at ProductFilterTest.validatePriceFilter (ProductFilterTest.js:78:10)'
    },
    browser: BrowserType.CHROME,
    agentId: '7f8a9b2c-1d3e-4f5a-6b7c-8d9e0f1a2b3c', // Chrome-Agent-2
    priority: ProcessedRequestPriority.HIGH,
    source: ProcessedRequestSource.MANUAL,
    startTime: new Date('2023-06-20T12:00:00'),
    endTime: new Date('2023-06-20T12:05:15'),
    duration: '5m 15s',
    durationMs: 315000,
    performance: {
      setupTime: 2500,
      executionTime: 310000,
      teardownTime: 2500,
      totalTime: 315000,
      cpuUsage: 50,
      memoryUsage: 350,
      networkUsage: 10
    },
    description: 'Ürün filtreleme özelliğinin tüm filtre kombinasyonlarıyla test edilmesi',
    tags: ['regression', 'ui', 'filters'],
    result: {
      passed: false,
      failedAssertions: 1,
      totalAssertions: 20,
      screenshots: ['category-filter.png', 'brand-filter.png', 'price-filter.png', 'combined-filters.png'],
      logs: ['Kategori filtresi test edildi', 'Marka filtresi test edildi', 'HATA: Fiyat filtresi beklenen sonuçları göstermedi', 'Kombinasyon filtreleri test edildi']
    }
  },
  {
    id: 'pr-008-h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3',
    testName: 'Mobil Duyarlı Düzen',
    testCaseId: 'tc-009',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.SUCCESS,
    browser: BrowserType.SAFARI,
    agentId: '9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f', // Safari-Agent-1
    priority: ProcessedRequestPriority.LOW,
    source: ProcessedRequestSource.MANUAL,
    startTime: new Date('2023-06-20T12:15:00'),
    endTime: new Date('2023-06-20T12:20:30'),
    duration: '5m 30s',
    durationMs: 330000,
    performance: {
      setupTime: 3000,
      executionTime: 325000,
      teardownTime: 2000,
      totalTime: 330000,
      cpuUsage: 35,
      memoryUsage: 260,
      networkUsage: 8
    },
    description: 'Farklı ekran boyutlarında mobil duyarlı düzenin test edilmesi',
    tags: ['ui', 'responsive', 'mobile'],
    result: {
      passed: true,
      failedAssertions: 0,
      totalAssertions: 25,
      screenshots: ['desktop-view.png', 'tablet-view.png', 'mobile-view.png', 'small-mobile-view.png'],
      logs: ['Desktop görünümü test edildi', 'Tablet görünümü test edildi', 'Mobil görünüm test edildi', 'Küçük mobil görünüm test edildi']
    }
  },
  {
    id: 'pr-009-i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4',
    testName: 'Oturum Yönetimi',
    testCaseId: 'tc-011',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: ProcessedRequestStatus.SUCCESS,
    browser: BrowserType.EDGE,
    agentId: '3d2a4748-5d43-45dd-b200-59ecd6901f3e', // Edge-Agent-1
    priority: ProcessedRequestPriority.HIGH,
    source: ProcessedRequestSource.SCHEDULED,
    startTime: new Date('2023-06-20T12:30:00'),
    endTime: new Date('2023-06-20T12:34:45'),
    duration: '4m 45s',
    durationMs: 285000,
    performance: {
      setupTime: 2000,
      executionTime: 280000,
      teardownTime: 3000,
      totalTime: 285000,
      cpuUsage: 45,
      memoryUsage: 320,
      networkUsage: 12
    },
    description: 'Oturum yönetimi ve güvenlik kontrollerinin test edilmesi',
    tags: ['security', 'session-management', 'authentication'],
    result: {
      passed: true,
      failedAssertions: 0,
      totalAssertions: 22,
      screenshots: ['login.png', 'session-timeout.png', 'concurrent-login.png', 'logout.png'],
      logs: ['Oturum açma test edildi', 'Oturum zaman aşımı test edildi', 'Eşzamanlı oturum açma test edildi', 'Oturum kapatma test edildi']
    }
  },
  {
    id: 'pr-010-j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5',
    testName: 'API Hız Sınırlama',
    testCaseId: 'tc-010',
    testSuiteId: 'ts-003',
    projectId: 'proj-002',
    status: ProcessedRequestStatus.FAILED,
    error: {
      type: ProcessedRequestErrorType.SYSTEM,
      message: 'Test sırasında beklenmeyen bir sistem hatası oluştu',
      timestamp: new Date('2023-06-20T12:45:30'),
      stackTrace: 'at ApiRateLimitTest.executeRequests (ApiRateLimitTest.js:56:22)'
    },
    browser: BrowserType.CHROME,
    agentId: 'r8s9t0u1-v2w3-x4y5-z6a7-b8c9d0e1f2g3', // API-Agent-2
    priority: ProcessedRequestPriority.MEDIUM,
    source: ProcessedRequestSource.MANUAL,
    startTime: new Date('2023-06-20T12:40:00'),
    endTime: new Date('2023-06-20T12:45:30'),
    duration: '5m 30s',
    durationMs: 330000,
    performance: {
      setupTime: 2000,
      executionTime: 325000,
      teardownTime: 3000,
      totalTime: 330000,
      cpuUsage: 70,
      memoryUsage: 450,
      networkUsage: 25
    },
    description: 'API hız sınırlama mekanizmasının test edilmesi',
    tags: ['api', 'performance', 'rate-limiting'],
    result: {
      passed: false,
      failedAssertions: 1,
      totalAssertions: 15,
      screenshots: [],
      logs: ['API endpoint hazırlandı', 'Hız sınırlama testi başlatıldı', 'HATA: Beklenmeyen sistem hatası oluştu', 'Test sonlandırıldı']
    }
  }
];

// Kuyrukta bekleyen istekler mock verisi
export const mockQueuedRequests = [
  {
    id: 'qr-001-a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    testName: 'Ürün Filtreleme Testi',
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
    createdAt: new Date('2023-06-20T12:00:00'),
    description: 'Ürün filtreleme özelliğinin tüm filtre kombinasyonlarıyla test edilmesi',
    tags: ['regression', 'ui', 'filters']
  },
  {
    id: 'qr-002-b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
    testName: 'Kullanıcı Profil Güncelleme',
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
    createdAt: new Date('2023-06-20T12:05:00'),
    description: 'Kullanıcı profil bilgilerinin güncellenmesi ve doğrulanması',
    tags: ['regression', 'ui', 'user-profile']
  },
  {
    id: 'qr-003-c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    testName: 'Ödeme Geçidi Entegrasyonu',
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
    assignedAgentId: '0aea406b-dff1-4df9-a613-cfa4a92e56e3', // Chrome-Agent-1
    createdBy: 'ci-pipeline',
    createdAt: new Date('2023-06-20T12:10:00'),
    description: 'Ödeme geçidi entegrasyonunun farklı ödeme yöntemleriyle test edilmesi',
    tags: ['critical', 'integration', 'payment']
  },
  {
    id: 'qr-004-d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    testName: 'Mobil Duyarlı Düzen Testi',
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
    createdAt: new Date('2023-06-20T12:15:00'),
    description: 'Farklı ekran boyutlarında mobil duyarlı düzenin test edilmesi',
    tags: ['ui', 'responsive', 'mobile']
  },
  {
    id: 'qr-005-e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0',
    testName: 'API Hız Sınırlama Testi',
    testCaseId: 'tc-010',
    testSuiteId: 'ts-003',
    projectId: 'proj-002',
    status: RequestStatus.PROCESSING,
    priority: RequestPriority.MEDIUM,
    category: RequestCategory.API_TEST,
    source: RequestSource.MANUAL,
    browser: BrowserType.CHROME,
    timing: {
      queuedAt: new Date('2023-06-20T12:20:00'),
      assignedAt: new Date('2023-06-20T12:25:00'),
      startedAt: new Date('2023-06-20T12:25:30'),
      waitTime: '5m 30s',
      waitTimeMs: 330000
    },
    assignedAgentId: '4dd16532-17b6-4e06-9575-56acfd862d50', // Firefox-Agent-1
    createdBy: 'user-001',
    createdAt: new Date('2023-06-20T12:20:00'),
    description: 'API hız sınırlama mekanizmasının test edilmesi',
    tags: ['api', 'performance', 'rate-limiting']
  },
  {
    id: 'qr-006-f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1',
    testName: 'Oturum Yönetimi Testi',
    testCaseId: 'tc-011',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: RequestStatus.QUEUED,
    priority: RequestPriority.HIGH,
    category: RequestCategory.SECURITY_TEST,
    source: RequestSource.SCHEDULED,
    browser: BrowserType.EDGE,
    timing: {
      queuedAt: new Date('2023-06-20T12:30:00'),
      estimatedStartTime: new Date('2023-06-20T13:15:00'),
      waitTime: '45m',
      waitTimeMs: 2700000
    },
    createdBy: 'system',
    createdAt: new Date('2023-06-20T12:30:00'),
    description: 'Oturum yönetimi ve güvenlik kontrollerinin test edilmesi',
    tags: ['security', 'session-management', 'authentication']
  },
  {
    id: 'qr-007-g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2',
    testName: 'Performans Yük Testi',
    testCaseId: 'tc-012',
    testSuiteId: 'ts-004',
    projectId: 'proj-002',
    status: RequestStatus.QUEUED,
    priority: RequestPriority.MEDIUM,
    category: RequestCategory.PERFORMANCE_TEST,
    source: RequestSource.MANUAL,
    browser: BrowserType.CHROME,
    timing: {
      queuedAt: new Date('2023-06-20T12:35:00'),
      estimatedStartTime: new Date('2023-06-20T14:00:00'),
      waitTime: '1h 25m',
      waitTimeMs: 5100000
    },
    createdBy: 'user-003',
    createdAt: new Date('2023-06-20T12:35:00'),
    description: 'Yüksek kullanıcı yükü altında sistem performansının test edilmesi',
    tags: ['performance', 'load-testing', 'stress-testing']
  },
  {
    id: 'qr-008-h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3',
    testName: 'Çoklu Dil Desteği Testi',
    testCaseId: 'tc-013',
    testSuiteId: 'ts-002',
    projectId: 'proj-001',
    status: RequestStatus.SCHEDULED,
    priority: RequestPriority.LOW,
    category: RequestCategory.UI_TEST,
    source: RequestSource.SCHEDULED,
    browser: BrowserType.FIREFOX,
    timing: {
      queuedAt: new Date('2023-06-20T12:40:00'),
      scheduledAt: new Date('2023-06-20T15:00:00'),
      estimatedStartTime: new Date('2023-06-20T15:00:00'),
      waitTime: '2h 20m',
      waitTimeMs: 8400000
    },
    createdBy: 'system',
    createdAt: new Date('2023-06-20T12:40:00'),
    description: 'Farklı dil seçeneklerinin ve çevirilerin doğruluğunun test edilmesi',
    tags: ['ui', 'localization', 'i18n']
  },
  {
    id: 'qr-009-i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4',
    testName: 'Veri Tabanı Yedekleme Testi',
    testCaseId: 'tc-014',
    testSuiteId: 'ts-003',
    projectId: 'proj-002',
    status: RequestStatus.QUEUED,
    priority: RequestPriority.CRITICAL,
    category: RequestCategory.SYSTEM_TEST,
    source: RequestSource.MANUAL,
    browser: BrowserType.CHROME,
    timing: {
      queuedAt: new Date('2023-06-20T12:45:00'),
      estimatedStartTime: new Date('2023-06-20T13:30:00'),
      waitTime: '45m',
      waitTimeMs: 2700000
    },
    createdBy: 'user-001',
    createdAt: new Date('2023-06-20T12:45:00'),
    description: 'Veri tabanı yedekleme ve geri yükleme işlemlerinin test edilmesi',
    tags: ['system', 'database', 'backup', 'critical']
  },
  {
    id: 'qr-010-j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5',
    testName: 'Bildirim Sistemi Testi',
    testCaseId: 'tc-015',
    testSuiteId: 'ts-001',
    projectId: 'proj-001',
    status: RequestStatus.ASSIGNED,
    priority: RequestPriority.MEDIUM,
    category: RequestCategory.INTEGRATION_TEST,
    source: RequestSource.CI_CD,
    browser: BrowserType.EDGE,
    timing: {
      queuedAt: new Date('2023-06-20T12:50:00'),
      assignedAt: new Date('2023-06-20T12:55:00'),
      estimatedStartTime: new Date('2023-06-20T13:00:00'),
      waitTime: '10m',
      waitTimeMs: 600000
    },
    assignedAgentId: '3d2a4748-5d43-45dd-b200-59ecd6901f3e', // Edge-Agent-1
    createdBy: 'ci-pipeline',
    createdAt: new Date('2023-06-20T12:50:00'),
    description: 'E-posta, SMS ve push bildirim sistemlerinin entegrasyonunun test edilmesi',
    tags: ['integration', 'notifications', 'email', 'sms', 'push']
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
export const mockServerAgentSchema = {
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
  // Doğrudan agent ID'lerini kullan
  activeAgents: [
    '0aea406b-dff1-4df9-a613-cfa4a92e56e3',
    '4dd16532-17b6-4e06-9575-56acfd862d50',
    'b8dad830-3ed6-4464-859f-f720d460c6a5',
    '34088356-e30a-446c-a38c-3dbcf12d53f6',
    '3d2a4748-5d43-45dd-b200-59ecd6901f3e',
    '7f8a9b2c-1d3e-4f5a-6b7c-8d9e0f1a2b3c',
    '4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d',
    '9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f',
    '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    'r8s9t0u1-v2w3-x4y5-z6a7-b8c9d0e1f2g3'
  ],
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

// ServerAgent nesnesi (API servisi tarafından kullanılır)
export const mockServerAgent: ServerAgent = {
  id: 'server-001',
  systemResources: mockSystemResource,
  agentStatus: mockAgentStatusSummary,
  queueStatus: mockQueueStatusSummary,
  activeAgents: mockAgents,
  queuedRequests: mockQueuedRequests as any,
  processedRequests: mockProcessedRequests as any
};
