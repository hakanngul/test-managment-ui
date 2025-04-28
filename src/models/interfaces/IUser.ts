import { UserRole } from '../enums/TestEnums';

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: string[];
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  department?: string;
  phone?: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
    emailNotifications?: boolean;
  };
}
