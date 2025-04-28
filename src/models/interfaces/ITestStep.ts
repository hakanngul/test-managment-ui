import { TestStepStatus } from '../enums/TestEnums';

export interface ITestStep {
  id: string;
  testCaseId: string;
  stepNumber: number;
  description: string;
  action: string;
  expectedResult: string;
  actualResult?: string;
  status?: TestStepStatus;
  screenshot?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
