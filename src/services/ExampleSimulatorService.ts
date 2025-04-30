import {
  ExampleTest,
  TestExecution,
  TestStepExecution,
  TestStepExecutionStatus,
  TestExecutionSettings
} from '../mock/exampleSimulatorMock';
import { ExecutionStatus } from '../models/enums/TestEnums';
import { v4 as uuidv4 } from 'uuid';
import { testRunnerService } from './TestRunnerService';

class ExampleSimulatorService {
  // Test adımlarını başlangıç durumuna getir
  private initializeTestSteps(test: ExampleTest): TestStepExecution[] {
    if (!test.steps) return [];

    return test.steps.map((step, index) => ({
      id: uuidv4(),
      order: index + 1,
      action: step.action,
      value: step.value,
      target: step.target,
      strategy: step.strategy,
      description: step.description,
      status: TestStepExecutionStatus.PENDING,
      logs: [],
    }));
  }

  // Test çalıştırmasını simüle et
  async simulateTestExecution(
    test: ExampleTest,
    onStepUpdate: (step: TestStepExecution) => void,
    onLogUpdate: (log: string) => void,
    onStatusUpdate: (status: ExecutionStatus) => void
  ): Promise<TestExecution> {
    // Test çalıştırma nesnesini oluştur
    const execution: TestExecution = {
      id: uuidv4(),
      testName: test.name,
      status: ExecutionStatus.QUEUED,
      browser: test.browserPreference,
      headless: test.headless,
      takeScreenshots: test.takeScreenshots,
      executedBy: 'Hakan Gül',
      steps: this.initializeTestSteps(test),
      logs: [],
      screenshots: []
    };

    // Test başlangıç zamanını kaydet
    execution.startTime = new Date();

    // Test durumunu güncelle
    execution.status = ExecutionStatus.RUNNING;
    onStatusUpdate(execution.status);

    // Log ekle
    this.addLog(execution, `[INFO] Test başlatılıyor: ${test.name}`, onLogUpdate);
    this.addLog(execution, `[INFO] Tarayıcı başlatılıyor: ${test.browserPreference}`, onLogUpdate);

    // Tarayıcı başlatma simülasyonu
    await this.delay(1000);

    this.addLog(execution, `[INFO] Tarayıcı başlatıldı`, onLogUpdate);
    this.addLog(execution, `[INFO] Headless mod: ${test.headless ? 'Açık' : 'Kapalı'}`, onLogUpdate);
    this.addLog(execution, `[INFO] Ekran görüntüsü alma: ${test.takeScreenshots ? 'Açık' : 'Kapalı'}`, onLogUpdate);

    // Her adımı çalıştır
    let allStepsPassed = true;

    if (test.steps) {
      for (const step of execution.steps) {
        // Adım durumunu güncelle
        step.status = TestStepExecutionStatus.RUNNING;
        step.startTime = new Date();
        onStepUpdate(step);

        this.addLog(execution, `[INFO] Test adımı çalıştırılıyor (${step.order}/${execution.steps.length}): ${step.description}`, onLogUpdate);

        // Adım çalıştırma simülasyonu
        await this.delay(1500);

        // Adım tipine göre log ekle
        switch (step.action) {
          case 'navigate':
            this.addLog(execution, `[INFO] URL açılıyor: ${step.value}`, onLogUpdate);
            await this.delay(500);
            this.addLog(execution, `[INFO] Sayfa yüklendi`, onLogUpdate);
            break;
          case 'wait':
            this.addLog(execution, `[INFO] Bekleniyor: ${step.value}ms`, onLogUpdate);
            await this.delay(parseInt(step.value || '500', 10) / 10); // Simülasyon için gerçek bekleme süresinin 1/10'u kadar bekle
            break;
          case 'takeScreenshot':
            if (test.takeScreenshots) {
              const screenshotName = `screenshot-${step.order}-${Date.now()}.png`;
              execution.screenshots.push(screenshotName);
              this.addLog(execution, `[INFO] Ekran görüntüsü alındı`, onLogUpdate);
            } else {
              this.addLog(execution, `[INFO] Ekran görüntüsü alma devre dışı`, onLogUpdate);
            }
            break;
          case 'click':
            this.addLog(execution, `[INFO] Element bulunuyor: ${step.target}`, onLogUpdate);

            // Rastgele başarı/başarısızlık durumu (gerçek test simülasyonu için)
            const elementFound = Math.random() > 0.1; // %90 başarı oranı

            if (elementFound) {
              this.addLog(execution, `[INFO] Element bulundu ve tıklandı`, onLogUpdate);
            } else {
              step.status = TestStepExecutionStatus.FAILED;
              step.error = `Element bulunamadı: ${step.target}`;
              this.addLog(execution, `[ERROR] ${step.error}`, onLogUpdate);
              this.addLog(execution, `[ERROR] Test adımı başarısız: ${step.description}`, onLogUpdate);

              if (test.takeScreenshots) {
                const screenshotName = `error-step-${step.order}-${Date.now()}.png`;
                execution.screenshots.push(screenshotName);
                this.addLog(execution, `[INFO] Hata ekran görüntüsü alındı: ${screenshotName}`, onLogUpdate);
              }

              allStepsPassed = false;
              this.addLog(execution, `[INFO] Test durduruldu`, onLogUpdate);
              break;
            }
            break;
          default:
            this.addLog(execution, `[INFO] Bilinmeyen eylem: ${step.action}`, onLogUpdate);
        }

        if (step.status !== TestStepExecutionStatus.FAILED) {
          step.status = TestStepExecutionStatus.PASSED;
        }

        step.endTime = new Date();
        step.duration = step.endTime.getTime() - step.startTime.getTime();
        onStepUpdate(step);

        if (!allStepsPassed) break;
      }
    }

    // Test bitiş zamanını kaydet
    execution.endTime = new Date();
    execution.duration = execution.endTime.getTime() - execution.startTime.getTime();

    // Test sonucunu belirle
    if (allStepsPassed) {
      execution.status = ExecutionStatus.COMPLETED;
      this.addLog(execution, `[INFO] Test başarıyla tamamlandı`, onLogUpdate);
    } else {
      execution.status = ExecutionStatus.FAILED;
      this.addLog(execution, `[INFO] Test başarısız oldu`, onLogUpdate);
    }

    onStatusUpdate(execution.status);

    // Test sonucunu döndür
    return execution;
  }

  // API'ye test gönder
  async sendTestToAPI(test: ExampleTest): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      this.addLogToConsole(`[INFO] Test API'ye gönderiliyor: ${test.name}`);

      // TestRunnerService'i kullanarak API'ye gönder
      const result = await testRunnerService.runExampleTest(test);

      if (result.success) {
        this.addLogToConsole(`[INFO] Test API'ye başarıyla gönderildi. Yanıt: ${JSON.stringify(result.data)}`);

        // Curl komutunu oluştur
        const curlCommand = testRunnerService.generateCurlCommand(
          testRunnerService['exampleTestApiUrl'],
          test
        );
        this.addLogToConsole(`[INFO] Eşdeğer curl komutu: ${curlCommand}`);
      } else {
        this.addLogToConsole(`[ERROR] Test API'ye gönderilirken hata oluştu: ${result.error}`);
      }

      return {
        success: result.success,
        message: result.message,
        data: result.data
      };
    } catch (error) {
      this.addLogToConsole(`[ERROR] Test API'ye gönderilirken hata oluştu: ${error}`);

      return {
        success: false,
        message: `Test API'ye gönderilirken hata oluştu: ${error}`
      };
    }
  }

  // Log ekle
  private addLog(execution: TestExecution, log: string, onLogUpdate: (log: string) => void): void {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logWithTimestamp = `${timestamp} ${log}`;
    execution.logs.push(logWithTimestamp);
    onLogUpdate(logWithTimestamp);
    this.addLogToConsole(log);
  }

  // Konsola log ekle
  private addLogToConsole(log: string): void {
    console.log(log);
  }

  // Gecikme yardımcı fonksiyonu
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ExampleSimulatorService();
