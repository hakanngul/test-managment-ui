import { ObjectId } from 'mongodb';

// Proje durumları
export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  COMPLETED = 'completed',
  PLANNING = 'planning',
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  MAINTENANCE = 'maintenance'
}

// Proje öncelikleri
export enum ProjectPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Proje kategorileri
export enum ProjectCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  API = 'api',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  ACCESSIBILITY = 'accessibility',
  INTEGRATION = 'integration',
  OTHER = 'other'
}

// Proje üye rolleri
export enum ProjectMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  TESTER = 'tester',
  VIEWER = 'viewer'
}

// Proje ortamları
export enum ProjectEnvironment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production',
  QA = 'qa',
  UAT = 'uat'
}

// Proje üyesi
export interface ProjectMember {
  userId: string;
  role: ProjectMemberRole;
  permissions?: string[];
  joinedAt?: Date;
  invitedBy?: string;
}

// Proje yapılandırması
export interface ProjectConfig {
  defaultEnvironment?: ProjectEnvironment;
  supportedEnvironments?: ProjectEnvironment[];
  defaultBrowsers?: string[];
  defaultHeadless?: boolean;
  defaultRetryCount?: number;
  defaultTimeout?: number;
  screenshotOnFailure?: boolean;
  videoRecording?: boolean;
  parallelExecution?: boolean;
  maxParallelTests?: number;
  customFields?: Record<string, any>;
}

// Proje zaman çizelgesi
export interface ProjectTimeline {
  startDate?: Date;
  endDate?: Date;
  milestones?: {
    id: string;
    name: string;
    description?: string;
    dueDate: Date;
    status: 'pending' | 'completed' | 'delayed' | 'cancelled';
  }[];
  releases?: {
    id: string;
    name: string;
    version: string;
    description?: string;
    releaseDate: Date;
    status: 'planned' | 'in_progress' | 'released' | 'cancelled';
  }[];
}

// Proje entegrasyonu
export interface ProjectIntegration {
  id: string;
  type: 'jira' | 'github' | 'gitlab' | 'bitbucket' | 'slack' | 'teams' | 'custom';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Proje istatistikleri
export interface ProjectStats {
  testCasesCount?: number;
  testSuitesCount?: number;
  testRunsCount?: number;
  passRate?: number;
  lastRun?: Date;
  avgExecutionTime?: number;
  activeTestsCount?: number;
  failedTestsCount?: number;
  pendingTestsCount?: number;
}

// Proje şeması
export interface ProjectSchema {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  
  // Durum ve kategorizasyon
  status: ProjectStatus;
  priority?: ProjectPriority;
  category?: ProjectCategory;
  tags?: string[];
  
  // Üyeler
  members: ProjectMember[];
  
  // Yapılandırma
  config?: ProjectConfig;
  
  // Zaman çizelgesi
  timeline?: ProjectTimeline;
  
  // Entegrasyonlar
  integrations?: ProjectIntegration[];
  
  // İlişkili projeler
  parentProjectId?: string;
  subProjects?: string[]; // Proje ID'leri
  relatedProjects?: {
    projectId: string;
    relationship: 'depends_on' | 'related_to' | 'blocks' | 'blocked_by';
  }[];
  
  // Metadata
  createdBy?: string; // Kullanıcı ID
  createdAt?: Date;
  updatedBy?: string; // Kullanıcı ID
  updatedAt?: Date;
  
  // İstatistikler
  stats?: ProjectStats;
}
