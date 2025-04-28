// Arayüzleri dışa aktarıyoruz
export * from './interfaces/IAgent';
export * from './interfaces/IQueuedRequest';
export * from './interfaces/IProcessedRequest';
export * from './interfaces/IServer';

// Enumları dışa aktarıyoruz
export * from './enums/AgentEnums';
export * from './enums/QueuedRequestEnums';
export * from './enums/ProcessedRequestEnums';
export * from './enums/ServerEnums';
export * from './enums/TestCaseEnums';

// Modelleri dışa aktarıyoruz
export * from './SystemResource';
export * from './ServerAgent';

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
