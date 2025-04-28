import { ITestData } from './interfaces/ITestData';
import { TestDataType, TestDataSource } from './enums/TestEnums';

export class TestData implements ITestData {
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

  constructor(data: Partial<ITestData>) {
    this.id = data.id || '';
    this.testCaseId = data.testCaseId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.dataType = data.dataType || TestDataType.STRING;
    this.value = data.value;
    this.isParameterized = data.isParameterized || false;
    this.isMocked = data.isMocked || false;
    this.source = data.source || TestDataSource.STATIC;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Veri değerini güncelle
  updateValue(value: any): void {
    this.value = value;
    this.updatedAt = new Date();
  }

  // Veri tipini güncelle
  updateDataType(dataType: TestDataType): void {
    this.dataType = dataType;
    this.updatedAt = new Date();
  }

  // Veri kaynağını güncelle
  updateSource(source: TestDataSource): void {
    this.source = source;
    this.updatedAt = new Date();
  }

  // Parametrize edilmiş durumunu değiştir
  toggleParameterized(): void {
    this.isParameterized = !this.isParameterized;
    this.updatedAt = new Date();
  }

  // Mock durumunu değiştir
  toggleMocked(): void {
    this.isMocked = !this.isMocked;
    this.updatedAt = new Date();
  }

  // Test verisini JSON formatına dönüştür
  toJSON(): ITestData {
    return {
      id: this.id,
      testCaseId: this.testCaseId,
      name: this.name,
      description: this.description,
      dataType: this.dataType,
      value: this.value,
      isParameterized: this.isParameterized,
      isMocked: this.isMocked,
      source: this.source,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
