// User role types
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TESTER = 'tester',
  DEVELOPER = 'developer',
  QA_LEAD = 'qa_lead',
  AUTOMATION_ENGINEER = 'automation_engineer',
  PERFORMANCE_TESTER = 'performance_tester',
  SECURITY_TESTER = 'security_tester',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

// User status types
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  LOCKED = 'locked'
}

// User permission types
export enum UserPermission {
  // Project permissions
  CREATE_PROJECT = 'create_project',
  EDIT_PROJECT = 'edit_project',
  DELETE_PROJECT = 'delete_project',
  VIEW_PROJECT = 'view_project',

  // Test case permissions
  CREATE_TEST_CASE = 'create_test_case',
  EDIT_TEST_CASE = 'edit_test_case',
  DELETE_TEST_CASE = 'delete_test_case',
  VIEW_TEST_CASE = 'view_test_case',
  EXECUTE_TEST_CASE = 'execute_test_case',

  // Test suite permissions
  CREATE_TEST_SUITE = 'create_test_suite',
  EDIT_TEST_SUITE = 'edit_test_suite',
  DELETE_TEST_SUITE = 'delete_test_suite',
  VIEW_TEST_SUITE = 'view_test_suite',
  EXECUTE_TEST_SUITE = 'execute_test_suite',

  // Test run permissions
  CREATE_TEST_RUN = 'create_test_run',
  EDIT_TEST_RUN = 'edit_test_run',
  DELETE_TEST_RUN = 'delete_test_run',
  VIEW_TEST_RUN = 'view_test_run',

  // Report permissions
  CREATE_REPORT = 'create_report',
  EDIT_REPORT = 'edit_report',
  DELETE_REPORT = 'delete_report',
  VIEW_REPORT = 'view_report',
  EXPORT_REPORT = 'export_report',

  // User management permissions
  CREATE_USER = 'create_user',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',
  VIEW_USER = 'view_user',

  // Agent permissions
  CREATE_AGENT = 'create_agent',
  EDIT_AGENT = 'edit_agent',
  DELETE_AGENT = 'delete_agent',
  VIEW_AGENT = 'view_agent',

  // System permissions
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_LOGS = 'view_logs',
  MANAGE_INTEGRATIONS = 'manage_integrations'
}

// User profile information
export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName?: string;
  title?: string;
  department?: string;
  company?: string;
  bio?: string;
  skills?: string[];
  timezone?: string;
  language?: string;
}

// User contact information
export interface UserContact {
  email: string;
  phone?: string;
  alternativeEmail?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

// User preferences
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  dateFormat?: string;
  timeFormat?: string;
  defaultDashboard?: string;
  defaultProject?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  browserNotifications?: boolean;
  showTutorials?: boolean;
  language?: string;
}

// User session information
export interface UserSession {
  lastLogin?: Date;
  lastActive?: Date;
  currentSessionStarted?: Date;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  location?: string;
}

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string; // Only used for authentication, not stored in client
  avatar?: string;
  profile?: UserProfile;
  contact?: UserContact;
  preferences?: UserPreferences;
  permissions?: UserPermission[];
  projects?: string[]; // Project IDs the user is associated with
  teams?: string[]; // Team IDs the user is part of
  session?: UserSession;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'app' | 'sms' | 'email';
  failedLoginAttempts?: number;
  passwordLastChanged?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string; // User ID who created this user
  lastPasswordReset?: Date;
}

// User creation model
export interface UserCreate {
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  password: string;
  avatar?: string;
  profile?: UserProfile;
  contact?: UserContact;
  preferences?: UserPreferences;
  permissions?: UserPermission[];
  projects?: string[];
  teams?: string[];
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'app' | 'sms' | 'email';
  emailVerified?: boolean;
  createdBy?: string;
}

// User update model
export interface UserUpdate {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
  avatar?: string;
  profile?: UserProfile;
  contact?: UserContact;
  preferences?: UserPreferences;
  permissions?: UserPermission[];
  projects?: string[];
  teams?: string[];
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'app' | 'sms' | 'email';
  failedLoginAttempts?: number;
  passwordLastChanged?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerified?: boolean;
  emailVerificationToken?: string;
}

// User authentication model
export interface UserAuth {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

// User authentication response
export interface UserAuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  requiresTwoFactor?: boolean;
}

// User registration model
export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  inviteCode?: string;
}

// User password reset request
export interface UserPasswordResetRequest {
  email: string;
}

// User password reset
export interface UserPasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

// User email verification
export interface UserEmailVerification {
  token: string;
}

// User two-factor authentication setup
export interface UserTwoFactorSetup {
  method: 'app' | 'sms' | 'email';
  phoneNumber?: string;
  email?: string;
}

// User two-factor authentication verification
export interface UserTwoFactorVerification {
  userId: string;
  code: string;
}

// Convert raw user data to User model
export const toUser = (data: any): User => {
  return {
    id: data.id || data._id,
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
    status: data.status as UserStatus || UserStatus.ACTIVE,
    avatar: data.avatar,
    profile: data.profile,
    contact: data.contact,
    preferences: data.preferences,
    permissions: data.permissions,
    projects: data.projects,
    teams: data.teams,
    session: data.session ? {
      ...data.session,
      lastLogin: data.session.lastLogin ? new Date(data.session.lastLogin) : undefined,
      lastActive: data.session.lastActive ? new Date(data.session.lastActive) : undefined,
      currentSessionStarted: data.session.currentSessionStarted ? new Date(data.session.currentSessionStarted) : undefined
    } : undefined,
    twoFactorEnabled: data.twoFactorEnabled,
    twoFactorMethod: data.twoFactorMethod,
    failedLoginAttempts: data.failedLoginAttempts,
    passwordLastChanged: data.passwordLastChanged ? new Date(data.passwordLastChanged) : undefined,
    passwordResetToken: data.passwordResetToken,
    passwordResetExpires: data.passwordResetExpires ? new Date(data.passwordResetExpires) : undefined,
    emailVerified: data.emailVerified,
    emailVerificationToken: data.emailVerificationToken,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    createdBy: data.createdBy,
    lastPasswordReset: data.lastPasswordReset ? new Date(data.lastPasswordReset) : undefined
  };
};

// Convert User model to raw data for API
export const fromUser = (user: User): any => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar,
    profile: user.profile,
    contact: user.contact,
    preferences: user.preferences,
    permissions: user.permissions,
    projects: user.projects,
    teams: user.teams,
    session: user.session ? {
      ...user.session,
      lastLogin: user.session.lastLogin?.toISOString(),
      lastActive: user.session.lastActive?.toISOString(),
      currentSessionStarted: user.session.currentSessionStarted?.toISOString()
    } : undefined,
    twoFactorEnabled: user.twoFactorEnabled,
    twoFactorMethod: user.twoFactorMethod,
    failedLoginAttempts: user.failedLoginAttempts,
    passwordLastChanged: user.passwordLastChanged?.toISOString(),
    emailVerified: user.emailVerified,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    createdBy: user.createdBy,
    lastPasswordReset: user.lastPasswordReset?.toISOString()
  };
};

// Get default user permissions based on role
export const getDefaultPermissions = (role: UserRole): UserPermission[] => {
  switch (role) {
    case UserRole.ADMIN:
      // Admin has all permissions
      return Object.values(UserPermission);

    case UserRole.MANAGER:
      return [
        // Project permissions
        UserPermission.CREATE_PROJECT,
        UserPermission.EDIT_PROJECT,
        UserPermission.VIEW_PROJECT,

        // Test case permissions
        UserPermission.CREATE_TEST_CASE,
        UserPermission.EDIT_TEST_CASE,
        UserPermission.DELETE_TEST_CASE,
        UserPermission.VIEW_TEST_CASE,
        UserPermission.EXECUTE_TEST_CASE,

        // Test suite permissions
        UserPermission.CREATE_TEST_SUITE,
        UserPermission.EDIT_TEST_SUITE,
        UserPermission.DELETE_TEST_SUITE,
        UserPermission.VIEW_TEST_SUITE,
        UserPermission.EXECUTE_TEST_SUITE,

        // Test run permissions
        UserPermission.CREATE_TEST_RUN,
        UserPermission.EDIT_TEST_RUN,
        UserPermission.DELETE_TEST_RUN,
        UserPermission.VIEW_TEST_RUN,

        // Report permissions
        UserPermission.CREATE_REPORT,
        UserPermission.EDIT_REPORT,
        UserPermission.VIEW_REPORT,
        UserPermission.EXPORT_REPORT,

        // User management permissions
        UserPermission.VIEW_USER,

        // Agent permissions
        UserPermission.VIEW_AGENT
      ];

    case UserRole.QA_LEAD:
      return [
        // Project permissions
        UserPermission.VIEW_PROJECT,

        // Test case permissions
        UserPermission.CREATE_TEST_CASE,
        UserPermission.EDIT_TEST_CASE,
        UserPermission.VIEW_TEST_CASE,
        UserPermission.EXECUTE_TEST_CASE,

        // Test suite permissions
        UserPermission.CREATE_TEST_SUITE,
        UserPermission.EDIT_TEST_SUITE,
        UserPermission.VIEW_TEST_SUITE,
        UserPermission.EXECUTE_TEST_SUITE,

        // Test run permissions
        UserPermission.CREATE_TEST_RUN,
        UserPermission.EDIT_TEST_RUN,
        UserPermission.VIEW_TEST_RUN,

        // Report permissions
        UserPermission.CREATE_REPORT,
        UserPermission.VIEW_REPORT,
        UserPermission.EXPORT_REPORT,

        // User management permissions
        UserPermission.VIEW_USER,

        // Agent permissions
        UserPermission.VIEW_AGENT
      ];

    case UserRole.TESTER:
    case UserRole.AUTOMATION_ENGINEER:
      return [
        // Project permissions
        UserPermission.VIEW_PROJECT,

        // Test case permissions
        UserPermission.CREATE_TEST_CASE,
        UserPermission.EDIT_TEST_CASE,
        UserPermission.VIEW_TEST_CASE,
        UserPermission.EXECUTE_TEST_CASE,

        // Test suite permissions
        UserPermission.VIEW_TEST_SUITE,
        UserPermission.EXECUTE_TEST_SUITE,

        // Test run permissions
        UserPermission.CREATE_TEST_RUN,
        UserPermission.VIEW_TEST_RUN,

        // Report permissions
        UserPermission.VIEW_REPORT,
        UserPermission.EXPORT_REPORT,

        // Agent permissions
        UserPermission.VIEW_AGENT
      ];

    case UserRole.DEVELOPER:
      return [
        // Project permissions
        UserPermission.VIEW_PROJECT,

        // Test case permissions
        UserPermission.VIEW_TEST_CASE,
        UserPermission.EXECUTE_TEST_CASE,

        // Test suite permissions
        UserPermission.VIEW_TEST_SUITE,

        // Test run permissions
        UserPermission.VIEW_TEST_RUN,

        // Report permissions
        UserPermission.VIEW_REPORT
      ];

    case UserRole.VIEWER:
      return [
        // Project permissions
        UserPermission.VIEW_PROJECT,

        // Test case permissions
        UserPermission.VIEW_TEST_CASE,

        // Test suite permissions
        UserPermission.VIEW_TEST_SUITE,

        // Test run permissions
        UserPermission.VIEW_TEST_RUN,

        // Report permissions
        UserPermission.VIEW_REPORT
      ];

    case UserRole.GUEST:
      return [];

    default:
      return [];
  }
};

// Check if user has specific permission
export const hasPermission = (user: User, permission: UserPermission): boolean => {
  if (!user.permissions) {
    return false;
  }

  return user.permissions.includes(permission);
};

// Create default user preferences
export const createDefaultUserPreferences = (): UserPreferences => {
  return {
    theme: 'system',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    emailNotifications: true,
    pushNotifications: true,
    browserNotifications: true,
    showTutorials: true,
    language: 'en'
  };
};
