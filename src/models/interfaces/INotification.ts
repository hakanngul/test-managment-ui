import { NotificationType, NotificationStatus } from '../enums/TestEnums';

export interface INotification {
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
}
