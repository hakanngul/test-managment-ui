import { 
  Agent, 
  AgentSystemInfo, 
  AgentBrowserInfo, 
  AgentNetworkInfo, 
  AgentPerformanceMetrics, 
  AgentSecurityInfo, 
  AgentLoggingInfo, 
  AgentAuthInfo, 
  AgentHealthCheck, 
  AgentCapabilities,
  AgentStatusSummary,
  AgentPerformanceSummary
} from '../interfaces/Agent';
import { AgentStatus, AgentType, AgentOS, AgentHealthStatus, AgentLogLevel } from '../enums/AgentEnums';
import { BrowserType } from '../enums/TestCaseEnums';

// Convert raw agent data to Agent model
export const toAgent = (data: any): Agent => {
  return {
    id: data.id || data._id,
    name: data.name,
    type: data.type as AgentType,
    status: data.status as AgentStatus,
    
    // Browser information
    browser: data.browser as BrowserType,
    browserInfo: data.browserInfo,
    
    // System information
    systemInfo: data.systemInfo,
    
    // Network information
    networkInfo: {
      ipAddress: data.ipAddress || (data.networkInfo ? data.networkInfo.ipAddress : ''),
      macAddress: data.networkInfo?.macAddress,
      bandwidth: data.networkInfo?.bandwidth,
      latency: data.networkInfo?.latency,
      publicIp: data.networkInfo?.publicIp,
      dns: data.networkInfo?.dns
    },
    
    // Performance metrics
    performanceMetrics: data.performanceMetrics,
    
    // Security information
    securityInfo: data.securityInfo,
    
    // Logging information
    loggingInfo: data.loggingInfo,
    
    // Authentication information
    authInfo: data.authInfo,
    
    // Health check
    healthCheck: data.healthCheck,
    
    // Capabilities
    capabilities: data.capabilities || [],
    detailedCapabilities: data.detailedCapabilities,
    
    // Server information
    serverId: data.serverId,
    serverUrl: data.serverUrl,
    
    // Activity information
    created: data.created ? new Date(data.created) : new Date(),
    lastActivity: data.lastActivity ? new Date(data.lastActivity) : new Date(),
    currentRequest: data.currentRequest,
    
    // Version information
    version: data.version,
    updateAvailable: data.updateAvailable,
    lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : undefined
  };
};

// Convert Agent model to raw data for API
export const fromAgent = (agent: Agent): any => {
  return {
    id: agent.id,
    name: agent.name,
    type: agent.type,
    status: agent.status,
    
    // Browser information
    browser: agent.browser,
    browserInfo: agent.browserInfo,
    
    // System information
    systemInfo: agent.systemInfo,
    
    // Network information
    networkInfo: agent.networkInfo,
    ipAddress: agent.networkInfo.ipAddress, // For backward compatibility
    
    // Performance metrics
    performanceMetrics: agent.performanceMetrics ? {
      ...agent.performanceMetrics,
      lastUpdated: agent.performanceMetrics.lastUpdated?.toISOString()
    } : undefined,
    
    // Security information
    securityInfo: agent.securityInfo ? {
      ...agent.securityInfo,
      sslCertificateExpiry: agent.securityInfo.sslCertificateExpiry?.toISOString(),
      lastSecurityScan: agent.securityInfo.lastSecurityScan?.toISOString()
    } : undefined,
    
    // Logging information
    loggingInfo: agent.loggingInfo,
    
    // Authentication information
    authInfo: agent.authInfo ? {
      ...agent.authInfo,
      tokenExpiry: agent.authInfo.tokenExpiry?.toISOString()
    } : undefined,
    
    // Health check
    healthCheck: agent.healthCheck ? {
      ...agent.healthCheck,
      lastCheck: agent.healthCheck.lastCheck?.toISOString()
    } : undefined,
    
    // Capabilities
    capabilities: agent.capabilities,
    detailedCapabilities: agent.detailedCapabilities,
    
    // Server information
    serverId: agent.serverId,
    serverUrl: agent.serverUrl,
    
    // Activity information
    created: agent.created.toISOString(),
    lastActivity: agent.lastActivity.toISOString(),
    currentRequest: agent.currentRequest,
    
    // Version information
    version: agent.version,
    updateAvailable: agent.updateAvailable,
    lastUpdated: agent.lastUpdated?.toISOString()
  };
};

// Calculate agent status summary
export const calculateAgentStatusSummary = (agents: Agent[], limit: number): AgentStatusSummary => {
  const total = agents.length;
  const available = agents.filter(a => a.status === AgentStatus.AVAILABLE).length;
  const busy = agents.filter(a => a.status === AgentStatus.BUSY).length;
  const offline = agents.filter(a => a.status === AgentStatus.OFFLINE).length;
  const error = agents.filter(a => a.status === AgentStatus.ERROR).length;
  const maintenance = agents.filter(a => a.status === AgentStatus.MAINTENANCE).length;
  
  return {
    total,
    available,
    busy,
    offline,
    error,
    maintenance,
    limit
  };
};

// Calculate agent performance summary
export const calculateAgentPerformanceSummary = (agents: Agent[]): AgentPerformanceSummary => {
  const activeAgents = agents.filter(a => 
    a.status === AgentStatus.AVAILABLE || 
    a.status === AgentStatus.BUSY
  );
  
  if (activeAgents.length === 0) {
    return {
      avgCpuUsage: 0,
      avgMemoryUsage: 0,
      avgDiskUsage: 0,
      avgNetworkUsage: 0,
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      avgTestDuration: 0
    };
  }
  
  // Calculate average performance metrics
  let totalCpuUsage = 0;
  let totalMemoryUsage = 0;
  let totalDiskUsage = 0;
  let totalNetworkUsage = 0;
  let agentsWithMetrics = 0;
  
  for (const agent of activeAgents) {
    if (agent.performanceMetrics) {
      totalCpuUsage += agent.performanceMetrics.cpuUsage;
      totalMemoryUsage += agent.performanceMetrics.memoryUsage;
      totalDiskUsage += agent.performanceMetrics.diskUsage;
      totalNetworkUsage += agent.performanceMetrics.networkUsage;
      agentsWithMetrics++;
    }
  }
  
  // Placeholder for test statistics (would need to be calculated from test results)
  const totalTests = 0;
  const successfulTests = 0;
  const failedTests = 0;
  const avgTestDuration = 0;
  
  return {
    avgCpuUsage: agentsWithMetrics > 0 ? totalCpuUsage / agentsWithMetrics : 0,
    avgMemoryUsage: agentsWithMetrics > 0 ? totalMemoryUsage / agentsWithMetrics : 0,
    avgDiskUsage: agentsWithMetrics > 0 ? totalDiskUsage / agentsWithMetrics : 0,
    avgNetworkUsage: agentsWithMetrics > 0 ? totalNetworkUsage / agentsWithMetrics : 0,
    totalTests,
    successfulTests,
    failedTests,
    avgTestDuration
  };
};

// Create default browser info
export const createDefaultBrowserInfo = (type: BrowserType): AgentBrowserInfo => {
  return {
    type,
    version: '',
    userAgent: '',
    headless: true,
    extensions: [],
    arguments: []
  };
};

// Create default system info
export const createDefaultSystemInfo = (): AgentSystemInfo => {
  return {
    os: AgentOS.LINUX,
    osVersion: '',
    cpuModel: '',
    cpuCores: 0,
    totalMemory: 0,
    totalDisk: 0,
    hostname: '',
    username: ''
  };
};

// Create default network info
export const createDefaultNetworkInfo = (ipAddress: string): AgentNetworkInfo => {
  return {
    ipAddress,
    macAddress: '',
    bandwidth: 0,
    latency: 0,
    publicIp: '',
    dns: []
  };
};

// Create default performance metrics
export const createDefaultPerformanceMetrics = (): AgentPerformanceMetrics => {
  return {
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkUsage: 0,
    uptime: 0,
    lastUpdated: new Date()
  };
};

// Create default security info
export const createDefaultSecurityInfo = (): AgentSecurityInfo => {
  return {
    sslEnabled: false,
    firewallEnabled: false,
    encryptionEnabled: false,
    vulnerabilities: []
  };
};

// Create default logging info
export const createDefaultLoggingInfo = (): AgentLoggingInfo => {
  return {
    logLevel: AgentLogLevel.INFO,
    enableConsoleLogging: true,
    enableFileLogging: true,
    enableRemoteLogging: false
  };
};

// Create default health check
export const createDefaultHealthCheck = (): AgentHealthCheck => {
  return {
    status: AgentHealthStatus.UNKNOWN,
    lastCheck: new Date(),
    message: 'Initial health check pending'
  };
};

// Create default capabilities
export const createDefaultCapabilities = (browserType: BrowserType): AgentCapabilities => {
  return {
    supportedBrowsers: [browserType],
    supportedFeatures: [],
    maxConcurrentTests: 1,
    supportsMobile: false,
    supportsHeadless: true,
    supportsBrowserExtensions: false,
    supportsNetworkThrottling: false,
    supportsCpuThrottling: false,
    supportsDeviceEmulation: false,
    supportsGeolocation: false,
    supportsFileDownload: true,
    supportsFileUpload: true
  };
};
