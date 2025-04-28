// Mevcut arayüzleri dışa aktarıyoruz
export * from './interfaces/IAgent';
export * from './interfaces/IQueuedRequest';
export * from './interfaces/IProcessedRequest';
export * from './interfaces/IServer';
export * from './interfaces/IProject';

// Mevcut enumları dışa aktarıyoruz
export * from './enums/AgentEnums';
export * from './enums/QueuedRequestEnums';
export * from './enums/ProcessedRequestEnums';
export * from './enums/ServerEnums';
export * from './enums/ProjectEnums';

// TestCaseEnums'dan belirli enum'ları yeniden adlandırarak dışa aktarıyoruz
import * as OldTestCaseEnums from './enums/TestCaseEnums';
export {
  OldTestCaseEnums as TestCaseEnumsOld
};

// Mevcut modelleri dışa aktarıyoruz
export * from './SystemResource';
export * from './ServerAgent';
export * from './Project';

// Dönüştürme fonksiyonları
export const toAgent = (data: any) => {
  // Burada veriyi Agent tipine dönüştürme işlemi yapılır
  return data as any;
};

export const toQueuedRequest = (data: any) => {
  // Burada veriyi QueuedRequest tipine dönüştürme işlemi yapılır
  return data as any;
};

export const toProcessedRequest = (data: any) => {
  // Burada veriyi ProcessedRequest tipine dönüştürme işlemi yapılır
  return data as any;
};

// Yeni Test Otomasyon Yönetim Aracı Enum'ları
import * as TestEnums from './enums/TestEnums';
export { TestEnums };

// Yeni Test Otomasyon Yönetim Aracı Interface'leri
export * from './interfaces/ITestPlan';
export * from './interfaces/ITestSuite';

// ITestCase'i yeniden adlandırarak dışa aktarıyoruz
import * as ITestCaseModule from './interfaces/ITestCase';
export { ITestCaseModule };

export * from './interfaces/ITestStep';
export * from './interfaces/ITestData';
export * from './interfaces/ITestExecution';
export * from './interfaces/ITestRun';
export * from './interfaces/ITestResult';
export * from './interfaces/ITestHistory';
export * from './interfaces/ITestReport';
export * from './interfaces/ITestDefect';
export * from './interfaces/ITestListener';
export * from './interfaces/IEnvironment';
export * from './interfaces/ITestConfig';
export * from './interfaces/ITestParameter';
export * from './interfaces/IUser';
export * from './interfaces/ITestScheduler';
export * from './interfaces/INotification';

// Yeni Test Otomasyon Yönetim Aracı Model Sınıfları
export * from './TestPlan';
export * from './TestSuite';

// TestCase ve TestStep sınıflarını yeniden adlandırarak dışa aktarıyoruz
import { TestCase as TestCaseModel } from './TestCase';
import { TestStep as TestStepModel } from './TestStep';
export { TestCaseModel, TestStepModel };

export * from './TestData';
export * from './TestExecution';
export * from './TestRun';
export * from './TestResult';
export * from './TestHistory';
export * from './TestReport';
export * from './TestDefect';
export * from './TestListener';
export * from './Environment';
export * from './TestConfig';
export * from './TestParameter';
export * from './User';
export * from './TestScheduler';
export * from './Notification';
