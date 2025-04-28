import { ITestParameter } from './interfaces/ITestParameter';
import { TestDataType } from './enums/TestEnums';

export class TestParameter implements ITestParameter {
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

  constructor(data: Partial<ITestParameter>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.testCaseId = data.testCaseId || '';
    this.dataType = data.dataType || TestDataType.STRING;
    this.defaultValue = data.defaultValue;
    this.currentValue = data.currentValue;
    this.isRequired = data.isRequired !== undefined ? data.isRequired : true;
    this.validationRules = data.validationRules;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Varsayılan değeri güncelle
  updateDefaultValue(value: any): void {
    this.defaultValue = value;
    this.updatedAt = new Date();
  }

  // Mevcut değeri güncelle
  updateCurrentValue(value: any): void {
    this.currentValue = value;
    this.updatedAt = new Date();
  }

  // Veri tipini güncelle
  updateDataType(dataType: TestDataType): void {
    this.dataType = dataType;
    this.updatedAt = new Date();
  }

  // Gereklilik durumunu değiştir
  toggleRequired(): void {
    this.isRequired = !this.isRequired;
    this.updatedAt = new Date();
  }

  // Doğrulama kurallarını güncelle
  updateValidationRules(rules: Partial<TestParameter['validationRules']>): void {
    this.validationRules = { ...this.validationRules, ...rules };
    this.updatedAt = new Date();
  }

  // Doğrulama kuralı kaldır
  removeValidationRule(ruleName: keyof TestParameter['validationRules']): void {
    if (this.validationRules && ruleName in this.validationRules) {
      const rules = { ...this.validationRules };
      delete rules[ruleName];
      this.validationRules = Object.keys(rules).length > 0 ? rules : undefined;
      this.updatedAt = new Date();
    }
  }

  // Değeri doğrula
  validate(value: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Gereklilik kontrolü
    if (this.isRequired && (value === undefined || value === null || value === '')) {
      errors.push(`${this.name} is required`);
      return { isValid: false, errors };
    }
    
    // Değer yoksa ve gerekli değilse, geçerli kabul et
    if ((value === undefined || value === null || value === '') && !this.isRequired) {
      return { isValid: true, errors };
    }
    
    // Veri tipi kontrolü
    switch (this.dataType) {
      case TestDataType.STRING:
        if (typeof value !== 'string') {
          errors.push(`${this.name} must be a string`);
        } else if (this.validationRules) {
          // String uzunluk kontrolü
          if (this.validationRules.minLength !== undefined && value.length < this.validationRules.minLength) {
            errors.push(`${this.name} must be at least ${this.validationRules.minLength} characters`);
          }
          if (this.validationRules.maxLength !== undefined && value.length > this.validationRules.maxLength) {
            errors.push(`${this.name} must be at most ${this.validationRules.maxLength} characters`);
          }
          // Regex pattern kontrolü
          if (this.validationRules.pattern && !new RegExp(this.validationRules.pattern).test(value)) {
            errors.push(`${this.name} does not match the required pattern`);
          }
        }
        break;
      case TestDataType.NUMBER:
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`${this.name} must be a number`);
        } else if (this.validationRules) {
          // Sayı aralığı kontrolü
          if (this.validationRules.minValue !== undefined && value < this.validationRules.minValue) {
            errors.push(`${this.name} must be at least ${this.validationRules.minValue}`);
          }
          if (this.validationRules.maxValue !== undefined && value > this.validationRules.maxValue) {
            errors.push(`${this.name} must be at most ${this.validationRules.maxValue}`);
          }
        }
        break;
      case TestDataType.BOOLEAN:
        if (typeof value !== 'boolean') {
          errors.push(`${this.name} must be a boolean`);
        }
        break;
      case TestDataType.DATE:
        if (!(value instanceof Date) && isNaN(Date.parse(value))) {
          errors.push(`${this.name} must be a valid date`);
        }
        break;
      // Diğer veri tipleri için kontroller eklenebilir
    }
    
    // Enum kontrolü
    if (this.validationRules && this.validationRules.enum && !this.validationRules.enum.includes(value)) {
      errors.push(`${this.name} must be one of: ${this.validationRules.enum.join(', ')}`);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Test parametresini JSON formatına dönüştür
  toJSON(): ITestParameter {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      testCaseId: this.testCaseId,
      dataType: this.dataType,
      defaultValue: this.defaultValue,
      currentValue: this.currentValue,
      isRequired: this.isRequired,
      validationRules: this.validationRules,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
