import { ITestScheduler } from './interfaces/ITestScheduler';
import { ScheduleType, ScheduleStatus } from './enums/TestEnums';

export class TestScheduler implements ITestScheduler {
  id: string;
  name: string;
  description: string;
  testRunId?: string;
  testSuiteId?: string;
  testPlanId?: string;
  scheduleType: ScheduleType;
  cronExpression?: string;
  startDate: Date;
  endDate?: Date;
  lastRun?: Date;
  nextRun?: Date;
  status: ScheduleStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  timezone?: string;
  emailNotification?: boolean;
  notificationRecipients?: string[];
  retryOnFailure?: boolean;
  maxRetries?: number;
  environmentId?: string;
  configId?: string;

  constructor(data: Partial<ITestScheduler>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.testRunId = data.testRunId;
    this.testSuiteId = data.testSuiteId;
    this.testPlanId = data.testPlanId;
    this.scheduleType = data.scheduleType || ScheduleType.ONE_TIME;
    this.cronExpression = data.cronExpression;
    this.startDate = data.startDate || new Date();
    this.endDate = data.endDate;
    this.lastRun = data.lastRun;
    this.nextRun = data.nextRun;
    this.status = data.status || ScheduleStatus.ACTIVE;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.timezone = data.timezone;
    this.emailNotification = data.emailNotification;
    this.notificationRecipients = data.notificationRecipients;
    this.retryOnFailure = data.retryOnFailure;
    this.maxRetries = data.maxRetries;
    this.environmentId = data.environmentId;
    this.configId = data.configId;
  }

  // Zamanlayıcı durumunu güncelle
  updateStatus(status: ScheduleStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // Zamanlayıcı tipini güncelle
  updateScheduleType(type: ScheduleType, cronExpression?: string): void {
    this.scheduleType = type;
    if (type === ScheduleType.CUSTOM && cronExpression) {
      this.cronExpression = cronExpression;
    } else if (type !== ScheduleType.CUSTOM) {
      this.cronExpression = undefined;
    }
    this.updatedAt = new Date();
  }

  // Son çalıştırma zamanını güncelle
  updateLastRun(date: Date = new Date()): void {
    this.lastRun = date;
    this.updatedAt = new Date();
  }

  // Sonraki çalıştırma zamanını güncelle
  updateNextRun(date: Date): void {
    this.nextRun = date;
    this.updatedAt = new Date();
  }

  // Zamanlayıcıyı etkinleştir
  activate(): void {
    this.status = ScheduleStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  // Zamanlayıcıyı duraksat
  pause(): void {
    this.status = ScheduleStatus.PAUSED;
    this.updatedAt = new Date();
  }

  // Zamanlayıcıyı tamamlandı olarak işaretle
  complete(): void {
    this.status = ScheduleStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  // E-posta bildirimlerini etkinleştir/devre dışı bırak
  toggleEmailNotification(): void {
    this.emailNotification = !this.emailNotification;
    this.updatedAt = new Date();
  }

  // Bildirim alıcısı ekle
  addNotificationRecipient(email: string): void {
    if (!this.notificationRecipients) {
      this.notificationRecipients = [];
    }
    if (!this.notificationRecipients.includes(email)) {
      this.notificationRecipients.push(email);
      this.updatedAt = new Date();
    }
  }

  // Bildirim alıcısı kaldır
  removeNotificationRecipient(email: string): void {
    if (this.notificationRecipients) {
      this.notificationRecipients = this.notificationRecipients.filter(e => e !== email);
      this.updatedAt = new Date();
    }
  }

  // Başarısızlık durumunda yeniden deneme ayarını değiştir
  toggleRetryOnFailure(): void {
    this.retryOnFailure = !this.retryOnFailure;
    this.updatedAt = new Date();
  }

  // Maksimum yeniden deneme sayısını güncelle
  updateMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
    this.updatedAt = new Date();
  }

  // Test zamanlayıcısını JSON formatına dönüştür
  toJSON(): ITestScheduler {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      testRunId: this.testRunId,
      testSuiteId: this.testSuiteId,
      testPlanId: this.testPlanId,
      scheduleType: this.scheduleType,
      cronExpression: this.cronExpression,
      startDate: this.startDate,
      endDate: this.endDate,
      lastRun: this.lastRun,
      nextRun: this.nextRun,
      status: this.status,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      timezone: this.timezone,
      emailNotification: this.emailNotification,
      notificationRecipients: this.notificationRecipients,
      retryOnFailure: this.retryOnFailure,
      maxRetries: this.maxRetries,
      environmentId: this.environmentId,
      configId: this.configId
    };
  }
}
