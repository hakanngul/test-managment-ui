import { TestDataType } from '../enums/TestEnums';

export interface ITestParameter {
  id: string;
  name: string;
  description: string;
  testCaseId: string;
  dataType: TestDataType;
  defaultValue: any;
  currentValue?: any;
  isRequired: boolean;
  validationRules?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    enum?: any[];
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
