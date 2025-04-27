// System resource model
export interface SystemResource {
  id: string;
  cpuUsage: number; // percentage (0-100)
  memoryUsage: number; // percentage (0-100)
  lastUpdated: Date;
  serverId: string;
}

// System resource update model
export interface SystemResourceUpdate {
  cpuUsage: number;
  memoryUsage: number;
  lastUpdated: Date;
}

// Convert raw system resource data to SystemResource model
export const toSystemResource = (data: any): SystemResource => {
  return {
    id: data.id || data._id,
    cpuUsage: data.cpuUsage || 0,
    memoryUsage: data.memoryUsage || 0,
    lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
    serverId: data.serverId
  };
};

// Convert SystemResource model to raw data for API
export const fromSystemResource = (systemResource: SystemResource): any => {
  return {
    id: systemResource.id,
    cpuUsage: systemResource.cpuUsage,
    memoryUsage: systemResource.memoryUsage,
    lastUpdated: systemResource.lastUpdated.toISOString(),
    serverId: systemResource.serverId
  };
};
