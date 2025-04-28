import { ObjectId } from 'mongodb';

// Sistem kaynakları şeması
export interface SystemResourceSchema {
  _id?: ObjectId;
  id?: string;
  cpuUsage: number; // yüzde cinsinden
  memoryUsage: number; // MB cinsinden
  diskUsage?: number; // yüzde cinsinden
  networkUsage?: number; // MB cinsinden
  loadAverage?: number[];
  processes?: number;
  uptime?: number; // saniye cinsinden
  lastUpdated: Date;
  
  // Detaylı CPU bilgileri
  cpuDetails?: {
    model: string;
    cores: number;
    speed: number; // MHz cinsinden
    temperature?: number; // Celsius cinsinden
    usage: {
      user: number; // yüzde cinsinden
      system: number; // yüzde cinsinden
      idle: number; // yüzde cinsinden
    };
  };
  
  // Detaylı bellek bilgileri
  memoryDetails?: {
    total: number; // MB cinsinden
    free: number; // MB cinsinden
    used: number; // MB cinsinden
    cached: number; // MB cinsinden
    buffers: number; // MB cinsinden
    swapTotal: number; // MB cinsinden
    swapUsed: number; // MB cinsinden
    swapFree: number; // MB cinsinden
  };
  
  // Detaylı disk bilgileri
  diskDetails?: {
    total: number; // MB cinsinden
    free: number; // MB cinsinden
    used: number; // MB cinsinden
    mounts: {
      path: string;
      total: number; // MB cinsinden
      free: number; // MB cinsinden
      used: number; // MB cinsinden
    }[];
  };
  
  // Detaylı ağ bilgileri
  networkDetails?: {
    interfaces: {
      name: string;
      ipAddress: string;
      macAddress: string;
      bytesReceived: number;
      bytesSent: number;
      packetsReceived: number;
      packetsSent: number;
      errors: number;
      dropped: number;
    }[];
    connections: number;
  };
  
  // Metadata
  serverId?: string;
  agentId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
