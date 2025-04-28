import { INotification } from './interfaces/INotification';
import { NotificationType, NotificationStatus } from './enums/TestEnums';

export class Notification implements INotification {
  id: string;
  type: NotificationType;
  testRunId?: string;
  testResultId?: string;
  testDefectId?: string;
  recipient: string;
  message: string;
  status: NotificationStatus;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  subject?: string;
  template?: string;
  data?: Record<string, any>;
  readAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  retryCount?: number;
  priority?: string;

  constructor(data: Partial<INotification>) {
    this.id = data.id || '';
    this.type = data.type || NotificationType.EMAIL;
    this.testRunId = data.testRunId;
    this.testResultId = data.testResultId;
    this.testDefectId = data.testDefectId;
    this.recipient = data.recipient || '';
    this.message = data.message || '';
    this.status = data.status || NotificationStatus.PENDING;
    this.sentAt = data.sentAt;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.subject = data.subject;
    this.template = data.template;
    this.data = data.data;
    this.readAt = data.readAt;
    this.deliveredAt = data.deliveredAt;
    this.failureReason = data.failureReason;
    this.retryCount = data.retryCount;
    this.priority = data.priority;
  }

  // Bildirim durumunu güncelle
  updateStatus(status: NotificationStatus): void {
    this.status = status;
    this.updatedAt = new Date();
    
    if (status === NotificationStatus.SENT) {
      this.sentAt = new Date();
    }
  }

  // Bildirimi gönderildi olarak işaretle
  markAsSent(): void {
    this.status = NotificationStatus.SENT;
    this.sentAt = new Date();
    this.updatedAt = new Date();
  }

  // Bildirimi teslim edildi olarak işaretle
  markAsDelivered(): void {
    this.status = NotificationStatus.DELIVERED;
    this.deliveredAt = new Date();
    this.updatedAt = new Date();
  }

  // Bildirimi okundu olarak işaretle
  markAsRead(): void {
    this.status = NotificationStatus.READ;
    this.readAt = new Date();
    this.updatedAt = new Date();
  }

  // Bildirim başarısız olarak işaretle
  markAsFailed(reason?: string): void {
    this.status = NotificationStatus.FAILED;
    this.failureReason = reason;
    this.updatedAt = new Date();
  }

  // Yeniden deneme sayısını artır
  incrementRetryCount(): void {
    this.retryCount = (this.retryCount || 0) + 1;
    this.updatedAt = new Date();
  }

  // Bildirim verilerini güncelle
  updateData(data: Record<string, any>): void {
    this.data = { ...this.data, ...data };
    this.updatedAt = new Date();
  }

  // Bildirim mesajını güncelle
  updateMessage(message: string): void {
    this.message = message;
    this.updatedAt = new Date();
  }

  // Bildirim konusunu güncelle
  updateSubject(subject: string): void {
    this.subject = subject;
    this.updatedAt = new Date();
  }

  // Bildirim şablonunu güncelle
  updateTemplate(template: string): void {
    this.template = template;
    this.updatedAt = new Date();
  }

  // Bildirimi JSON formatına dönüştür
  toJSON(): INotification {
    return {
      id: this.id,
      type: this.type,
      testRunId: this.testRunId,
      testResultId: this.testResultId,
      testDefectId: this.testDefectId,
      recipient: this.recipient,
      message: this.message,
      status: this.status,
      sentAt: this.sentAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      subject: this.subject,
      template: this.template,
      data: this.data,
      readAt: this.readAt,
      deliveredAt: this.deliveredAt,
      failureReason: this.failureReason,
      retryCount: this.retryCount,
      priority: this.priority
    };
  }
}
