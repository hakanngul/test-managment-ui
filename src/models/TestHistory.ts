import { ITestHistory } from './interfaces/ITestHistory';
import { TestResultStatus } from './enums/TestEnums';

export class TestHistory implements ITestHistory {
  id: string;
  testCaseId: string;
  testRunId: string;
  testResultId: string;
  previousStatus: TestResultStatus;
  newStatus: TestResultStatus;
  changedAt: Date;
  changedBy: string;
  reason?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ITestHistory>) {
    this.id = data.id || '';
    this.testCaseId = data.testCaseId || '';
    this.testRunId = data.testRunId || '';
    this.testResultId = data.testResultId || '';
    this.previousStatus = data.previousStatus || TestResultStatus.NOT_RUN;
    this.newStatus = data.newStatus || TestResultStatus.NOT_RUN;
    this.changedAt = data.changedAt || new Date();
    this.changedBy = data.changedBy || '';
    this.reason = data.reason;
    this.comments = data.comments;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Yorum ekle
  addComment(comment: string): void {
    this.comments = this.comments ? `${this.comments}\n${comment}` : comment;
    this.updatedAt = new Date();
  }

  // Değişiklik nedenini güncelle
  updateReason(reason: string): void {
    this.reason = reason;
    this.updatedAt = new Date();
  }

  // Test geçmişini JSON formatına dönüştür
  toJSON(): ITestHistory {
    return {
      id: this.id,
      testCaseId: this.testCaseId,
      testRunId: this.testRunId,
      testResultId: this.testResultId,
      previousStatus: this.previousStatus,
      newStatus: this.newStatus,
      changedAt: this.changedAt,
      changedBy: this.changedBy,
      reason: this.reason,
      comments: this.comments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Durum değişikliğini açıklayan metin oluştur
  getStatusChangeDescription(): string {
    return `Status changed from ${this.previousStatus} to ${this.newStatus} on ${this.changedAt.toLocaleString()} by ${this.changedBy}${this.reason ? ` - Reason: ${this.reason}` : ''}`;
  }
}
