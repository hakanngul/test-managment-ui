import { IEnvironment } from './interfaces/IEnvironment';
import { EnvironmentType } from './enums/TestEnums';

export class Environment implements IEnvironment {
  id: string;
  name: string;
  description: string;
  type: EnvironmentType;
  baseUrl: string;
  variables: Record<string, string>;
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
    token?: string;
  };
  dbConnections?: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    type: string;
  }[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IEnvironment>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || EnvironmentType.DEVELOPMENT;
    this.baseUrl = data.baseUrl || '';
    this.variables = data.variables || {};
    this.credentials = data.credentials;
    this.dbConnections = data.dbConnections;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Ortamı etkinleştir/devre dışı bırak
  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  // Değişken ekle veya güncelle
  setVariable(key: string, value: string): void {
    this.variables[key] = value;
    this.updatedAt = new Date();
  }

  // Değişken sil
  removeVariable(key: string): void {
    if (key in this.variables) {
      delete this.variables[key];
      this.updatedAt = new Date();
    }
  }

  // Kimlik bilgilerini güncelle
  updateCredentials(credentials: Partial<Environment['credentials']>): void {
    this.credentials = { ...this.credentials, ...credentials };
    this.updatedAt = new Date();
  }

  // Veritabanı bağlantısı ekle
  addDbConnection(connection: Environment['dbConnections'][0]): void {
    if (!this.dbConnections) {
      this.dbConnections = [];
    }
    this.dbConnections.push(connection);
    this.updatedAt = new Date();
  }

  // Veritabanı bağlantısı kaldır
  removeDbConnection(index: number): void {
    if (this.dbConnections && index >= 0 && index < this.dbConnections.length) {
      this.dbConnections.splice(index, 1);
      this.updatedAt = new Date();
    }
  }

  // Ortam tipini güncelle
  updateType(type: EnvironmentType): void {
    this.type = type;
    this.updatedAt = new Date();
  }

  // Değişkeni değeriyle birlikte al
  getVariable(key: string): string | undefined {
    return this.variables[key];
  }

  // Ortamı JSON formatına dönüştür
  toJSON(): IEnvironment {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      baseUrl: this.baseUrl,
      variables: this.variables,
      credentials: this.credentials,
      dbConnections: this.dbConnections,
      isActive: this.isActive,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
