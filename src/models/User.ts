// User role types
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TESTER = 'tester',
  VIEWER = 'viewer'
}

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Only used for authentication, not stored in client
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// User creation model
export interface UserCreate {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  avatar?: string;
}

// User update model
export interface UserUpdate {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
  avatar?: string;
}

// User authentication model
export interface UserAuth {
  email: string;
  password: string;
}

// User authentication response
export interface UserAuthResponse {
  user: User;
  token: string;
}

// Convert raw user data to User model
export const toUser = (data: any): User => {
  return {
    id: data.id || data._id,
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
    avatar: data.avatar,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
  };
};

// Convert User model to raw data for API
export const fromUser = (user: User): any => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString()
  };
};
