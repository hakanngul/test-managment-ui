import { ObjectId } from 'mongodb';

// Kullanıcı rolleri
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TESTER = 'tester',
  VIEWER = 'viewer'
}

// Kullanıcı durumları
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

// Kullanıcı profili
export interface UserProfile {
  firstName?: string;
  lastName?: string;
  title?: string;
  department?: string;
  company?: string;
  bio?: string;
  skills?: string[];
  timezone?: string;
  language?: string;
}

// Kullanıcı iletişim bilgileri
export interface UserContact {
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  alternativeEmail?: string;
}

// Kullanıcı tercihleri
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  emailNotifications?: boolean;
  dashboardLayout?: string;
  defaultProject?: string;
  defaultTestSuite?: string;
  defaultEnvironment?: string;
  defaultBrowser?: string;
}

// Kullanıcı izinleri
export interface UserPermission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'manage';
  constraints?: Record<string, any>;
}

// Kullanıcı oturum bilgileri
export interface UserSession {
  token?: string;
  lastLogin?: Date;
  lastActivity?: Date;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
}

// Kullanıcı şeması
export interface UserSchema {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string; // Sadece kimlik doğrulama için kullanılır, istemcide saklanmaz
  avatar?: string;
  profile?: UserProfile;
  contact?: UserContact;
  preferences?: UserPreferences;
  permissions?: UserPermission[];
  projects?: string[]; // Kullanıcının ilişkili olduğu proje ID'leri
  teams?: string[]; // Kullanıcının parçası olduğu takım ID'leri
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
}
