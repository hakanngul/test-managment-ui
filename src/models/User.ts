import { IUser } from './interfaces/IUser';
import { UserRole } from './enums/TestEnums';

export class User implements IUser {
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

  constructor(data: Partial<IUser>) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.role = data.role || UserRole.VIEWER;
    this.permissions = data.permissions || [];
    this.lastLogin = data.lastLogin;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.avatar = data.avatar;
    this.department = data.department;
    this.phone = data.phone;
    this.preferences = data.preferences;
  }

  // Kullanıcı rolünü güncelle
  updateRole(role: UserRole): void {
    this.role = role;
    this.updatedAt = new Date();
  }

  // İzin ekle
  addPermission(permission: string): void {
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
      this.updatedAt = new Date();
    }
  }

  // İzin kaldır
  removePermission(permission: string): void {
    this.permissions = this.permissions.filter(p => p !== permission);
    this.updatedAt = new Date();
  }

  // Kullanıcıyı etkinleştir/devre dışı bırak
  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  // Son giriş zamanını güncelle
  updateLastLogin(): void {
    this.lastLogin = new Date();
    this.updatedAt = new Date();
  }

  // Kullanıcı tercihlerini güncelle
  updatePreferences(preferences: Partial<User['preferences']>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.updatedAt = new Date();
  }

  // Kullanıcı profilini güncelle
  updateProfile(profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    department?: string;
    phone?: string;
  }): void {
    if (profile.firstName !== undefined) this.firstName = profile.firstName;
    if (profile.lastName !== undefined) this.lastName = profile.lastName;
    if (profile.avatar !== undefined) this.avatar = profile.avatar;
    if (profile.department !== undefined) this.department = profile.department;
    if (profile.phone !== undefined) this.phone = profile.phone;
    this.updatedAt = new Date();
  }

  // Tam adı al
  getFullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
      return this.firstName;
    } else if (this.lastName) {
      return this.lastName;
    }
    return this.username;
  }

  // İzin kontrolü
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  // Kullanıcıyı JSON formatına dönüştür
  toJSON(): IUser {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      permissions: this.permissions,
      lastLogin: this.lastLogin,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      department: this.department,
      phone: this.phone,
      preferences: this.preferences
    };
  }
}
