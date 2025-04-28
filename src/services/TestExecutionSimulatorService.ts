import { 
  TestExecution, 
  TestStepExecution, 
  TestStepExecutionStatus,
  TestExecutionSettings
} from '../mock/testExecutionSimulatorMock';
import { TestCase, TestCaseResult } from '../models/interfaces/ITestCase';
import { ExecutionStatus } from '../models/enums/TestEnums';
import { v4 as uuidv4 } from 'uuid';

class TestExecutionSimulatorService {
  // Test çalıştırma işlemini başlat
  async startTestExecution(
    testCase: TestCase, 
    settings: TestExecutionSettings
  ): Promise<string> {
    // Yeni bir test çalıştırma ID'si oluştur
    const executionId = uuidv4();
    
    // Test çalıştırma nesnesini oluştur
    const execution: TestExecution = {
      id: executionId,
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      status: ExecutionStatus.QUEUED,
      browser: settings.browser,
      environment: settings.environment,
      headless: settings.headless,
      takeScreenshots: settings.takeScreenshots,
      recordVideo: settings.recordVideo,
      executedBy: 'Hakan Gül', // Gerçek uygulamada oturum açmış kullanıcıdan alınır
      steps: this.initializeTestSteps(testCase),
      logs: [`[INFO] Test kuyruğa alındı: ${testCase.name}`]
    };
    
    // Gerçek uygulamada bu veri veritabanına kaydedilir
    // Burada simülasyon amaçlı olarak sadece ID döndürüyoruz
    return executionId;
  }
  
  // Test adımlarını başlangıç durumuna getir
  private initializeTestSteps(testCase: TestCase): TestStepExecution[] {
    if (!testCase.steps) return [];
    
    return testCase.steps.map(step => ({
      id: uuidv4(),
      stepId: step.id,
      order: step.order,
      description: step.description,
      expectedResult: step.expectedResult,
      status: TestStepExecutionStatus.PENDING,
      logs: [],
    }));
  }
  
  // Test çalıştırmasını simüle et
  async simulateTestExecution(
    testCase: TestCase, 
    settings: TestExecutionSettings,
    onStepUpdate: (step: TestStepExecution) => void,
    onLogUpdate: (log: string) => void,
    onStatusUpdate: (status: ExecutionStatus) => void
  ): Promise<TestExecution> {
    // Test çalıştırma nesnesini oluştur
    const execution: TestExecution = {
      id: uuidv4(),
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      status: ExecutionStatus.QUEUED,
      browser: settings.browser,
      environment: settings.environment,
      headless: settings.headless,
      takeScreenshots: settings.takeScreenshots,
      recordVideo: settings.recordVideo,
      executedBy: 'Hakan Gül', // Gerçek uygulamada oturum açmış kullanıcıdan alınır
      steps: this.initializeTestSteps(testCase),
      logs: [],
      screenshots: []
    };
    
    // Test başlangıç zamanını kaydet
    execution.startTime = new Date();
    
    // Test durumunu güncelle
    execution.status = ExecutionStatus.RUNNING;
    onStatusUpdate(execution.status);
    
    // Log ekle
    this.addLog(execution, `[INFO] Test başlatılıyor: ${testCase.name}`, onLogUpdate);
    this.addLog(execution, `[INFO] Tarayıcı başlatılıyor: ${settings.browser}`, onLogUpdate);
    
    // Tarayıcı başlatma simülasyonu
    await this.delay(1000);
    
    this.addLog(execution, `[INFO] Tarayıcı başlatıldı`, onLogUpdate);
    this.addLog(execution, `[INFO] Test ortamı: ${settings.environment}`, onLogUpdate);
    this.addLog(execution, `[INFO] Headless mod: ${settings.headless ? 'Açık' : 'Kapalı'}`, onLogUpdate);
    this.addLog(execution, `[INFO] Ekran görüntüsü alma: ${settings.takeScreenshots ? 'Açık' : 'Kapalı'}`, onLogUpdate);
    
    // Her adımı çalıştır
    let allStepsPassed = true;
    
    if (testCase.steps) {
      for (const step of execution.steps) {
        // Adım durumunu güncelle
        step.status = TestStepExecutionStatus.RUNNING;
        step.startTime = new Date();
        onStepUpdate(step);
        
        this.addLog(execution, `[INFO] Test adımı çalıştırılıyor (${step.order}/${execution.steps.length}): ${step.description}`, onLogUpdate);
        
        // Adım çalıştırma simülasyonu
        await this.delay(1500);
        
        // Rastgele başarı/başarısızlık durumu (gerçek test simülasyonu için)
        // tc-003 ID'li test için 7. adımda hata oluştur (örnek olarak)
        let stepPassed = true;
        if (testCase.id === 'tc-003' && step.order === 7) {
          stepPassed = false;
        } else {
          // Diğer testler için %90 başarı oranı
          stepPassed = Math.random() > 0.1;
        }
        
        if (stepPassed) {
          step.status = TestStepExecutionStatus.PASSED;
          this.addLog(execution, `[INFO] Test adımı başarılı: ${step.description}`, onLogUpdate);
          
          // Ekran görüntüsü al (simülasyon)
          if (settings.takeScreenshots) {
            const screenshotName = `step-${step.order}-${Date.now()}.png`;
            execution.screenshots.push(screenshotName);
            this.addLog(execution, `[INFO] Ekran görüntüsü alındı: ${screenshotName}`, onLogUpdate);
          }
        } else {
          step.status = TestStepExecutionStatus.FAILED;
          step.error = 'Element bulunamadı veya beklenen sonuç alınamadı';
          this.addLog(execution, `[ERROR] Test adımı başarısız: ${step.description}`, onLogUpdate);
          this.addLog(execution, `[ERROR] Hata: ${step.error}`, onLogUpdate);
          
          // Ekran görüntüsü al (simülasyon)
          if (settings.takeScreenshots) {
            const screenshotName = `error-step-${step.order}-${Date.now()}.png`;
            execution.screenshots.push(screenshotName);
            this.addLog(execution, `[INFO] Hata ekran görüntüsü alındı: ${screenshotName}`, onLogUpdate);
          }
          
          allStepsPassed = false;
          
          // Hata durumunda, ayarlara göre devam et veya durdur
          if (!settings.retryOnFailure) {
            this.addLog(execution, `[INFO] Test durduruldu: Adım başarısız oldu ve yeniden deneme kapalı`, onLogUpdate);
            break;
          } else {
            this.addLog(execution, `[INFO] Adım başarısız oldu, yeniden deneniyor...`, onLogUpdate);
            // Yeniden deneme simülasyonu
            await this.delay(1000);
            
            // Yeniden deneme sonucu (örnek olarak her zaman başarısız)
            this.addLog(execution, `[ERROR] Yeniden deneme başarısız oldu`, onLogUpdate);
            break;
          }
        }
        
        step.endTime = new Date();
        step.duration = step.endTime.getTime() - step.startTime.getTime();
        onStepUpdate(step);
      }
    }
    
    // Test bitiş zamanını kaydet
    execution.endTime = new Date();
    execution.duration = execution.endTime.getTime() - execution.startTime.getTime();
    
    // Test sonucunu belirle
    if (allStepsPassed) {
      execution.status = ExecutionStatus.COMPLETED;
      execution.result = TestCaseResult.PASSED;
      this.addLog(execution, `[INFO] Test başarıyla tamamlandı`, onLogUpdate);
    } else {
      execution.status = ExecutionStatus.FAILED;
      execution.result = TestCaseResult.FAILED;
      this.addLog(execution, `[INFO] Test başarısız oldu`, onLogUpdate);
    }
    
    onStatusUpdate(execution.status);
    
    // Test sonucunu döndür
    return execution;
  }
  
  // Log ekle
  private addLog(execution: TestExecution, log: string, onLogUpdate: (log: string) => void): void {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logWithTimestamp = `${timestamp} ${log}`;
    execution.logs.push(logWithTimestamp);
    onLogUpdate(logWithTimestamp);
  }
  
  // Gecikme yardımcı fonksiyonu
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new TestExecutionSimulatorService();
