import { ListenerType, HookType } from '../enums/TestEnums';

export interface ITestListener {
  id: string;
  name: string;
  type: ListenerType;
  hookType: HookType;
  testCaseId?: string;
  testSuiteId?: string;
  testRunId?: string;
  script: string; // JavaScript/TypeScript kodu veya komut
  triggerOnEvent: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastTriggered?: Date;
  executionCount?: number;
  successCount?: number;
  failureCount?: number;
}
