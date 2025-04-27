import { ProjectStatus, ProjectPriority, ProjectCategory, ProjectMemberRole, ProjectEnvironment } from '../enums/ProjectEnums';

// Project member
export interface ProjectMember {
  userId: string;
  role: ProjectMemberRole;
  joinedAt: Date;
  invitedBy?: string; // User ID
  permissions?: string[];
}

// Project configuration
export interface ProjectConfig {
  defaultEnvironment?: ProjectEnvironment;
  supportedEnvironments?: ProjectEnvironment[];
  defaultBrowsers?: string[];
  defaultHeadless?: boolean;
  defaultRetryCount?: number;
  defaultTimeout?: number; // in milliseconds
  screenshotOnFailure?: boolean;
  videoRecording?: boolean;
  parallelExecution?: boolean;
  maxParallelTests?: number;
  customSettings?: Record<string, any>;
}

// Project timeline
export interface ProjectTimeline {
  startDate?: Date;
  endDate?: Date;
  milestones?: {
    id: string;
    name: string;
    description?: string;
    dueDate: Date;
    completed: boolean;
    completedAt?: Date;
  }[];
  releases?: {
    id: string;
    version: string;
    name: string;
    description?: string;
    releaseDate: Date;
    status: 'planned' | 'in_progress' | 'released' | 'cancelled';
  }[];
}

// Project integration
export interface ProjectIntegration {
  type: 'github' | 'gitlab' | 'bitbucket' | 'jira' | 'slack' | 'teams' | 'custom';
  name: string;
  url: string;
  token?: string;
  enabled: boolean;
  settings?: Record<string, any>;
}

// Project statistics
export interface ProjectStats {
  totalTestCases: number;
  totalTestSuites: number;
  totalTestRuns: number;
  passRate: number;
  failRate: number;
  pendingRate: number;
  blockedRate: number;
  avgExecutionTime?: number; // in milliseconds
  testCasesByStatus?: Record<string, number>;
  testCasesByPriority?: Record<string, number>;
  testCasesByCategory?: Record<string, number>;
  testRunsByDate?: Record<string, number>;
  lastActivity?: Date;
  lastSuccessfulRun?: Date;
  lastFailedRun?: Date;
  trendsData?: {
    dates: string[];
    passRates: number[];
    failRates: number[];
    executionTimes: number[];
  };
}

// Project model
export interface Project {
  id: string;
  name: string;
  description: string;
  
  // Status and categorization
  status: ProjectStatus;
  priority?: ProjectPriority;
  category?: ProjectCategory;
  tags?: string[];
  
  // Members
  members: ProjectMember[];
  
  // Configuration
  config?: ProjectConfig;
  
  // Timeline
  timeline?: ProjectTimeline;
  
  // Integrations
  integrations?: ProjectIntegration[];
  
  // Related projects
  parentProjectId?: string;
  subProjects?: string[]; // Project IDs
  relatedProjects?: {
    projectId: string;
    relationship: 'depends_on' | 'related_to' | 'blocks' | 'blocked_by';
  }[];
  
  // Metadata
  createdBy?: string; // User ID
  createdAt?: Date;
  updatedBy?: string; // User ID
  updatedAt?: Date;
  
  // Statistics
  stats?: ProjectStats;
}

// Project creation model
export interface ProjectCreate {
  name: string;
  description: string;
  
  // Status and categorization
  status: ProjectStatus;
  priority?: ProjectPriority;
  category?: ProjectCategory;
  tags?: string[];
  
  // Members
  members: ProjectMember[];
  
  // Configuration
  config?: ProjectConfig;
  
  // Timeline
  timeline?: ProjectTimeline;
  
  // Integrations
  integrations?: ProjectIntegration[];
  
  // Related projects
  parentProjectId?: string;
  subProjects?: string[];
  relatedProjects?: {
    projectId: string;
    relationship: 'depends_on' | 'related_to' | 'blocks' | 'blocked_by';
  }[];
  
  // Metadata
  createdBy?: string;
}

// Project update model
export interface ProjectUpdate {
  name?: string;
  description?: string;
  
  // Status and categorization
  status?: ProjectStatus;
  priority?: ProjectPriority;
  category?: ProjectCategory;
  tags?: string[];
  
  // Members
  members?: ProjectMember[];
  
  // Configuration
  config?: ProjectConfig;
  
  // Timeline
  timeline?: ProjectTimeline;
  
  // Integrations
  integrations?: ProjectIntegration[];
  
  // Related projects
  parentProjectId?: string;
  subProjects?: string[];
  relatedProjects?: {
    projectId: string;
    relationship: 'depends_on' | 'related_to' | 'blocks' | 'blocked_by';
  }[];
  
  // Metadata
  updatedBy?: string;
}
