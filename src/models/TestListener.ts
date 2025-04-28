import { ITestListener } from './interfaces/ITestListener';
import { ListenerType, HookType } from './enums/TestEnums';

export class TestListener implements ITestListener {
  id: string;
  name: string;
  type: ListenerType;
  hookType: HookType;
  testCaseId?: string;
  testSuiteId?: string;
  testRunId?: string;
  script: string;
  triggerOnEvent: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastTriggered?: Date;
  executionCount?: number;
  successCount?: number;
  failureCount?: number;

  constructor(data: Partial<ITestListener>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.type = data.type || ListenerType.BEFORE_TEST;
    this.hookType = data.hookType || HookType.SETUP;
    this.testCaseId = data.testCaseId;
    this.testSuiteId = data.testSuiteId;
    this.testRunId = data.testRunId;
    this.script = data.script || '';
    this.triggerOnEvent = data.triggerOnEvent || '';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.lastTriggered = data.lastTriggered;
    this.executionCount = data.executionCount || 0;
    this.successCount = data.successCount || 0;
    this.failureCount = data.failureCount || 0;
  }

  // Listener'ı etkinleştir/devre dışı bırak
  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  // Scripti güncelle
  updateScript(script: string): void {
    this.script = script;
    this.updatedAt = new Date();
  }

  // Listener'ı tetikle
  trigger(success: boolean = true): void {
    this.lastTriggered = new Date();
    this.executionCount = (this.executionCount || 0) + 1;
    
    if (success) {
      this.successCount = (this.successCount || 0) + 1;
    } else {
      this.failureCount = (this.failureCount || 0) + 1;
    }
    
    this.updatedAt = new Date();
  }

  // Başarı oranını hesapla
  getSuccessRate(): number {
    if (!this.executionCount || this.executionCount === 0) {
      return 0;
    }
    return ((this.successCount || 0) / this.executionCount) * 100;
  }

  // Listener tipini güncelle
  updateType(type: ListenerType): void {
    this.type = type;
    this.updatedAt = new Date();
  }

  // Hook tipini güncelle
  updateHookType(hookType: HookType): void {
    this.hookType = hookType;
    this.updatedAt = new Date();
  }

  // Test listener'ı JSON formatına dönüştür
  toJSON(): ITestListener {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      hookType: this.hookType,
      testCaseId: this.testCaseId,
      testSuiteId: this.testSuiteId,
      testRunId: this.testRunId,
      script: this.script,
      triggerOnEvent: this.triggerOnEvent,
      isActive: this.isActive,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastTriggered: this.lastTriggered,
      executionCount: this.executionCount,
      successCount: this.successCount,
      failureCount: this.failureCount
    };
  }
}
