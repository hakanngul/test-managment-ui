import { ITestDefect } from './interfaces/ITestDefect';
import { DefectSeverity, DefectStatus } from './enums/TestEnums';

export class TestDefect implements ITestDefect {
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
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  externalId?: string;
  externalUrl?: string;

  constructor(data: Partial<ITestDefect>) {
    this.id = data.id || '';
    this.testResultId = data.testResultId || '';
    this.testCaseId = data.testCaseId || '';
    this.description = data.description || '';
    this.severity = data.severity || DefectSeverity.MEDIUM;
    this.priority = data.priority || 'medium';
    this.status = data.status || DefectStatus.NEW;
    this.assignedTo = data.assignedTo;
    this.stepsToReproduce = data.stepsToReproduce || '';
    this.expectedBehavior = data.expectedBehavior || '';
    this.actualBehavior = data.actualBehavior || '';
    this.attachments = data.attachments || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.resolvedAt = data.resolvedAt;
    this.resolvedBy = data.resolvedBy;
    this.resolution = data.resolution;
    this.externalId = data.externalId;
    this.externalUrl = data.externalUrl;
  }

  // Hata durumunu güncelle
  updateStatus(status: DefectStatus): void {
    this.status = status;
    this.updatedAt = new Date();
    
    if (status === DefectStatus.FIXED || 
        status === DefectStatus.VERIFIED || 
        status === DefectStatus.CLOSED || 
        status === DefectStatus.REJECTED || 
        status === DefectStatus.DEFERRED) {
      this.resolvedAt = new Date();
    }
  }

  // Hatayı atama
  assignTo(userId: string): void {
    this.assignedTo = userId;
    this.status = this.status === DefectStatus.NEW ? DefectStatus.ASSIGNED : this.status;
    this.updatedAt = new Date();
  }

  // Ek dosya ekle
  addAttachment(attachmentUrl: string): void {
    if (!this.attachments) {
      this.attachments = [];
    }
    if (!this.attachments.includes(attachmentUrl)) {
      this.attachments.push(attachmentUrl);
      this.updatedAt = new Date();
    }
  }

  // Ek dosya kaldır
  removeAttachment(attachmentUrl: string): void {
    if (this.attachments) {
      this.attachments = this.attachments.filter(url => url !== attachmentUrl);
      this.updatedAt = new Date();
    }
  }

  // Hatayı çöz
  resolve(resolution: string, resolvedBy: string): void {
    this.status = DefectStatus.FIXED;
    this.resolution = resolution;
    this.resolvedBy = resolvedBy;
    this.resolvedAt = new Date();
    this.updatedAt = new Date();
  }

  // Hatayı doğrula
  verify(): void {
    this.status = DefectStatus.VERIFIED;
    this.updatedAt = new Date();
  }

  // Hatayı yeniden aç
  reopen(): void {
    this.status = DefectStatus.REOPENED;
    this.resolvedAt = undefined;
    this.updatedAt = new Date();
  }

  // Dış sistem bilgilerini güncelle
  updateExternalInfo(externalId: string, externalUrl: string): void {
    this.externalId = externalId;
    this.externalUrl = externalUrl;
    this.updatedAt = new Date();
  }

  // Test hatasını JSON formatına dönüştür
  toJSON(): ITestDefect {
    return {
      id: this.id,
      testResultId: this.testResultId,
      testCaseId: this.testCaseId,
      description: this.description,
      severity: this.severity,
      priority: this.priority,
      status: this.status,
      assignedTo: this.assignedTo,
      stepsToReproduce: this.stepsToReproduce,
      expectedBehavior: this.expectedBehavior,
      actualBehavior: this.actualBehavior,
      attachments: this.attachments,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
      resolvedBy: this.resolvedBy,
      resolution: this.resolution,
      externalId: this.externalId,
      externalUrl: this.externalUrl
    };
  }
}
