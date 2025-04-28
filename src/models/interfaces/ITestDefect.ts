import { DefectSeverity, DefectStatus } from '../enums/TestEnums';

export interface ITestDefect {
  id: string;
  testResultId: string;
  testCaseId: string;
  description: string;
  severity: DefectSeverity;
  priority: string;
  status: DefectStatus;
  assignedTo?: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  attachments?: string[]; // Ekli dosyaların URL'leri
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  externalId?: string; // Dış hata takip sistemindeki ID
  externalUrl?: string; // Dış hata takip sistemindeki URL
}
