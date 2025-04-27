// Project status
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

// Project priority
export enum ProjectPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Project category
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

// Project member role
export enum ProjectMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  TESTER = 'tester',
  DEVELOPER = 'developer',
  VIEWER = 'viewer'
}

// Project environment
export enum ProjectEnvironment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production',
  QA = 'qa',
  UAT = 'uat'
}
