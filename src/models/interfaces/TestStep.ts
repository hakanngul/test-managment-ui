import { TestStepActionType, TestStepTargetType } from '../enums/TestStepEnums';

// Test adımı için model
export interface TestStep {
  id: string;
  order: number;
  action: TestStepActionType;
  target?: string;
  targetType?: TestStepTargetType;
  value?: string;
  description?: string;
  expectedResult?: string;
  screenshot?: boolean;
  isManual?: boolean;
}
