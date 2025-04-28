import { EnvironmentType } from '../enums/TestEnums';

export interface IEnvironment {
  id: string;
  name: string;
  description: string;
  type: EnvironmentType;
  baseUrl: string;
  variables: Record<string, string>; // Ortam değişkenleri
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
    type: string; // mysql, postgres, mongodb, etc.
  }[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
