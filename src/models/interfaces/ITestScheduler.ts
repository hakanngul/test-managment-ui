import { ScheduleType, ScheduleStatus } from '../enums/TestEnums';

export interface ITestScheduler {
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
}
