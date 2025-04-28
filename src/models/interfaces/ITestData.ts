import { TestDataType, TestDataSource } from '../enums/TestEnums';

export interface ITestData {
  id: string;
  testCaseId: string;
  name: string;
  description: string;
  dataType: TestDataType;
  value: any;
  isParameterized: boolean;
  isMocked: boolean;
  source: TestDataSource;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
