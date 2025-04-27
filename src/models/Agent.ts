// Agent status
export enum AgentStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

// Browser type
export enum BrowserType {
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  EDGE = 'edge',
  IE = 'ie'
}

// Agent model
export interface Agent {
  id: string;
  browser: BrowserType;
  status: AgentStatus;
  created: Date;
  lastActivity: Date;
  currentRequest: string | null; // Request ID
  serverId: string;
  ipAddress: string;
  version: string;
  capabilities: string[];
}

// Agent creation model
export interface AgentCreate {
  browser: BrowserType;
  serverId: string;
  ipAddress: string;
  version: string;
  capabilities: string[];
}

// Agent update model
export interface AgentUpdate {
  status?: AgentStatus;
  lastActivity?: Date;
  currentRequest?: string | null;
  version?: string;
  capabilities?: string[];
}

// Agent status summary
export interface AgentStatusSummary {
  total: number;
  available: number;
  busy: number;
  limit: number;
}

// Convert raw agent data to Agent model
export const toAgent = (data: any): Agent => {
  return {
    id: data.id || data._id,
    browser: data.browser as BrowserType,
    status: data.status as AgentStatus,
    created: data.created ? new Date(data.created) : new Date(),
    lastActivity: data.lastActivity ? new Date(data.lastActivity) : new Date(),
    currentRequest: data.currentRequest,
    serverId: data.serverId,
    ipAddress: data.ipAddress,
    version: data.version,
    capabilities: data.capabilities || []
  };
};

// Convert Agent model to raw data for API
export const fromAgent = (agent: Agent): any => {
  return {
    id: agent.id,
    browser: agent.browser,
    status: agent.status,
    created: agent.created.toISOString(),
    lastActivity: agent.lastActivity.toISOString(),
    currentRequest: agent.currentRequest,
    serverId: agent.serverId,
    ipAddress: agent.ipAddress,
    version: agent.version,
    capabilities: agent.capabilities
  };
};
