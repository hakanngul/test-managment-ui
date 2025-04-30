import { AgentData, AgentStatus, WebSocketState } from '../types/index';

/**
 * Agent durumunu işler
 * @param data Agent durum verisi
 * @param updateState Durum güncelleme fonksiyonu
 */
export const handleAgentStatus = (
  data: any,
  updateState: (updater: (state: WebSocketState) => WebSocketState) => void
): void => {
  updateState((state) => {
    // Mevcut agent'ı bul
    const existingAgentIndex = state.agents.findIndex(agent => agent.id === data.agentId);

    // Agent durumunu güncelle
    if (existingAgentIndex !== -1) {
      const updatedAgents = [...state.agents];
      updatedAgents[existingAgentIndex] = {
        ...updatedAgents[existingAgentIndex],
        status: data.status,
        lastSeen: new Date().toISOString()
      };

      return {
        ...state,
        agents: updatedAgents
      };
    } else {
      // Yeni agent ekle
      const newAgent: AgentData = {
        id: data.agentId,
        name: data.name || `Agent-${data.agentId}`,
        status: data.status as AgentStatus,
        lastSeen: new Date().toISOString()
      };

      return {
        ...state,
        agents: [...state.agents, newAgent]
      };
    }
  });

  // Agent durum özetini güncelle
  updateAgentStatusSummary(updateState);
};

/**
 * Agent detaylarını işler
 * @param data Agent detay verisi
 * @param updateState Durum güncelleme fonksiyonu
 */
export const handleAgentDetails = (
  data: any,
  updateState: (updater: (state: WebSocketState) => WebSocketState) => void
): void => {
  updateState((state) => {
    // Mevcut agent'ı bul
    const existingAgentIndex = state.agents.findIndex(agent => agent.id === data.agentId);

    if (existingAgentIndex !== -1) {
      const updatedAgents = [...state.agents];
      updatedAgents[existingAgentIndex] = {
        ...updatedAgents[existingAgentIndex],
        ip: data.ip,
        version: data.version,
        capabilities: data.capabilities,
        lastSeen: new Date().toISOString()
      };

      return {
        ...state,
        agents: updatedAgents
      };
    }

    return state;
  });
};

/**
 * Agent performansını işler
 * @param data Agent performans verisi
 * @param updateState Durum güncelleme fonksiyonu
 */
export const handleAgentPerformance = (
  data: any,
  updateState: (updater: (state: WebSocketState) => WebSocketState) => void
): void => {
  updateState((state) => {
    // Mevcut agent'ı bul
    const existingAgentIndex = state.agents.findIndex(agent => agent.id === data.agentId);

    if (existingAgentIndex !== -1) {
      const updatedAgents = [...state.agents];
      updatedAgents[existingAgentIndex] = {
        ...updatedAgents[existingAgentIndex],
        resources: {
          cpu: data.cpu,
          memory: data.memory,
          disk: data.disk,
          network: data.network
        },
        lastSeen: new Date().toISOString()
      };

      return {
        ...state,
        agents: updatedAgents
      };
    }

    return state;
  });

  // Agent performans özetini güncelle
  updateAgentPerformanceSummary(updateState);
};

/**
 * Agent sağlık durumunu işler
 * @param data Agent sağlık verisi
 * @param updateState Durum güncelleme fonksiyonu
 */
export const handleAgentHealth = (
  data: any,
  updateState: (updater: (state: WebSocketState) => WebSocketState) => void
): void => {
  // Agent sağlık durumunu işle
  updateState((state) => {
    // Mevcut agent'ı bul
    const existingAgentIndex = state.agents.findIndex(agent => agent.id === data.agentId);

    if (existingAgentIndex !== -1) {
      const updatedAgents = [...state.agents];
      updatedAgents[existingAgentIndex] = {
        ...updatedAgents[existingAgentIndex],
        status: data.healthy ? AgentStatus.AVAILABLE : AgentStatus.ERROR,
        error: data.healthy ? undefined : 'Sağlık kontrolü başarısız',
        lastSeen: new Date().toISOString()
      };

      return {
        ...state,
        agents: updatedAgents
      };
    }

    return state;
  });

  // Agent durum özetini güncelle
  updateAgentStatusSummary(updateState);
};

/**
 * Agent çökmesini işler
 * @param data Agent çökme verisi
 * @param updateState Durum güncelleme fonksiyonu
 */
export const handleAgentCrashed = (
  data: any,
  updateState: (updater: (state: WebSocketState) => WebSocketState) => void
): void => {
  updateState((state) => {
    // Mevcut agent'ı bul
    const existingAgentIndex = state.agents.findIndex(agent => agent.id === data.agentId);

    if (existingAgentIndex !== -1) {
      const updatedAgents = [...state.agents];
      updatedAgents[existingAgentIndex] = {
        ...updatedAgents[existingAgentIndex],
        status: AgentStatus.ERROR,
        error: data.error || 'Agent çöktü',
        lastSeen: new Date().toISOString()
      };

      return {
        ...state,
        agents: updatedAgents
      };
    }

    return state;
  });

  // Agent durum özetini güncelle
  updateAgentStatusSummary(updateState);
};

/**
 * Agent durum değişikliğini işler
 * @param data Agent durum değişikliği verisi
 * @param updateState Durum güncelleme fonksiyonu
 */
export const handleAgentStateChanged = (
  data: any,
  updateState: (updater: (state: WebSocketState) => WebSocketState) => void
): void => {
  updateState((state) => {
    // Mevcut agent'ı bul
    const existingAgentIndex = state.agents.findIndex(agent => agent.id === data.agentId);

    if (existingAgentIndex !== -1) {
      const updatedAgents = [...state.agents];
      updatedAgents[existingAgentIndex] = {
        ...updatedAgents[existingAgentIndex],
        status: data.newState as AgentStatus,
        lastSeen: new Date().toISOString()
      };

      return {
        ...state,
        agents: updatedAgents
      };
    }

    return state;
  });

  // Agent durum özetini güncelle
  updateAgentStatusSummary(updateState);
};

/**
 * Agent durum özetini günceller
 * @param updateState Durum güncelleme fonksiyonu
 */
const updateAgentStatusSummary = (
  updateState: (updater: (state: WebSocketState) => WebSocketState) => void
): void => {
  updateState((state) => {
    const available = state.agents.filter(agent => agent.status === AgentStatus.AVAILABLE).length;
    const busy = state.agents.filter(agent => agent.status === AgentStatus.BUSY).length;
    const offline = state.agents.filter(agent => agent.status === AgentStatus.OFFLINE).length;
    const error = state.agents.filter(agent => agent.status === AgentStatus.ERROR).length;
    const maintenance = state.agents.filter(agent => agent.status === AgentStatus.MAINTENANCE).length;

    return {
      ...state,
      agentStatusSummary: {
        ...state.agentStatusSummary,
        total: state.agents.length,
        available,
        busy,
        offline,
        error,
        maintenance
      }
    };
  });
};

/**
 * Agent performans özetini günceller
 * @param updateState Durum güncelleme fonksiyonu
 */
const updateAgentPerformanceSummary = (
  updateState: (updater: (state: WebSocketState) => WebSocketState) => void
): void => {
  updateState((state) => {
    // CPU kullanımı ortalaması
    const cpuValues = state.agents
      .filter(agent => agent.resources?.cpu !== undefined)
      .map(agent => agent.resources!.cpu!);

    const avgCpuUsage = cpuValues.length > 0
      ? cpuValues.reduce((sum, value) => sum + value, 0) / cpuValues.length
      : 0;

    // Bellek kullanımı ortalaması
    const memoryValues = state.agents
      .filter(agent => agent.resources?.memory !== undefined)
      .map(agent => agent.resources!.memory!);

    const avgMemoryUsage = memoryValues.length > 0
      ? memoryValues.reduce((sum, value) => sum + value, 0) / memoryValues.length
      : 0;

    // Disk kullanımı ortalaması
    const diskValues = state.agents
      .filter(agent => agent.resources?.disk !== undefined)
      .map(agent => agent.resources!.disk!);

    const avgDiskUsage = diskValues.length > 0
      ? diskValues.reduce((sum, value) => sum + value, 0) / diskValues.length
      : 0;

    // Ağ kullanımı ortalaması
    const networkValues = state.agents
      .filter(agent => agent.resources?.network !== undefined)
      .map(agent => agent.resources!.network!);

    const avgNetworkUsage = networkValues.length > 0
      ? networkValues.reduce((sum, value) => sum + value, 0) / networkValues.length
      : 0;

    return {
      ...state,
      agentPerformanceSummary: {
        ...state.agentPerformanceSummary,
        avgCpuUsage,
        avgMemoryUsage,
        avgDiskUsage,
        avgNetworkUsage
      }
    };
  });
};

/**
 * Agent'ları ID'ye göre bulur
 * @param agents Agent listesi
 * @param id Agent ID
 * @returns Bulunan agent veya undefined
 */
export const getAgentById = (agents: AgentData[], id: string): AgentData | undefined => {
  return agents.find(agent => agent.id === id);
};

/**
 * Agent'ları duruma göre filtreler
 * @param agents Agent listesi
 * @param status Agent durumu
 * @returns Filtrelenmiş agent listesi
 */
export const getAgentsByStatus = (agents: AgentData[], status: AgentStatus): AgentData[] => {
  return agents.filter(agent => agent.status === status);
};

/**
 * Agent'ları tipine göre filtreler
 * @param agents Agent listesi
 * @param type Agent tipi
 * @returns Filtrelenmiş agent listesi
 */
export const getAgentsByType = (agents: AgentData[], type: AgentType): AgentData[] => {
  return agents.filter(agent => agent.type === type);
};

/**
 * Agent'ları tarayıcı tipine göre filtreler
 * @param agents Agent listesi
 * @param browser Tarayıcı tipi
 * @returns Filtrelenmiş agent listesi
 */
export const getAgentsByBrowser = (agents: AgentData[], browser: BrowserType): AgentData[] => {
  return agents.filter(agent => agent.browser === browser);
};

/**
 * Agent'ları sağlık durumuna göre filtreler
 * @param agents Agent listesi
 * @param health Sağlık durumu
 * @returns Filtrelenmiş agent listesi
 */
export const getAgentsByHealth = (agents: AgentData[], health: AgentHealthStatus): AgentData[] => {
  return agents.filter(agent => agent.healthCheck?.status === health);
};

// Agent işleyicileri
export const agentHandlers = {
  handleAgentStatus,
  handleAgentDetails,
  handleAgentPerformance,
  handleAgentHealth,
  handleAgentCrashed,
  handleAgentStateChanged,
  getAgentById,
  getAgentsByStatus,
  getAgentsByType,
  getAgentsByBrowser,
  getAgentsByHealth
};
