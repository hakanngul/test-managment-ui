import * as playwright from 'playwright';
import { TestStep, TestResult } from '../models/ProcessedRequest';

export class BrowserController {
  private browser: playwright.Browser | null = null;
  private context: playwright.BrowserContext | null = null;
  private page: playwright.Page | null = null;
  private browserType: string;
  
  constructor(browserType: string) {
    this.browserType = browserType;
  }
  
  public async initialize(): Promise<boolean> {
    try {
      // Browser tipine göre uygun browser'ı başlat
      switch (this.browserType.toLowerCase()) {
        case 'chrome':
        case 'chromium':
          this.browser = await playwright.chromium.launch({ headless: true });
          break;
          
        case 'firefox':
          this.browser = await playwright.firefox.launch({ headless: true });
          break;
          
        case 'webkit':
        case 'safari':
          this.browser = await playwright.webkit.launch({ headless: true });
          break;
          
        default:
          console.error(`Unsupported browser type: ${this.browserType}`);
          return false;
      }
      
      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
      
      return true;
    } catch (error) {
      console.error('Error initializing browser:', error);
      return false;
    }
  }
  
  public async runTest(test: any): Promise<any> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }
    
    try {
      const startTime = Date.now();
      const results = { passed: true, steps: [] as TestStep[] };
      
      // Test adımlarını çalıştır
      for (const step of test.steps) {
        const stepResult = await this.executeStep(step);
        results.steps.push(stepResult);
        
        if (!stepResult.result || stepResult.result === TestResult.FAILED || stepResult.result === TestResult.ERROR) {
          results.passed = false;
          if (step.stopOnFail) {
            break;
          }
        }
      }
      
      const endTime = Date.now();
      
      return {
        passed: results.passed,
        duration: endTime - startTime,
        steps: results.steps
      };
    } catch (error: any) {
      console.error('Error running test:', error);
      return {
        passed: false,
        error: {
          message: error.message,
          stack: error.stack
        }
      };
    }
  }
  
  private async executeStep(step: any): Promise<TestStep> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }
    
    try {
      const startTime = Date.now();
      
      switch (step.action) {
        case 'navigate':
          await this.page.goto(step.value);
          break;
          
        case 'click':
          await this.page.click(step.selector);
          break;
          
        case 'type':
          await this.page.fill(step.selector, step.value);
          break;
          
        case 'wait':
          await this.page.waitForTimeout(parseInt(step.value));
          break;
          
        case 'takeScreenshot':
          const screenshotBuffer = await this.page.screenshot();
          // Screenshot'ı bir yere kaydet veya sonuçlara ekle
          break;
          
        default:
          throw new Error(`Unknown step action: ${step.action}`);
      }
      
      const endTime = Date.now();
      
      return {
        id: step.id,
        name: step.name || step.action,
        action: step.action,
        selector: step.selector,
        value: step.value,
        result: TestResult.PASSED,
        duration: endTime - startTime
      };
    } catch (error: any) {
      console.error(`Error executing step ${step.id}:`, error);
      
      // Hata durumunda screenshot al
      let screenshot: string | undefined;
      if (this.page) {
        try {
          const screenshotBuffer = await this.page.screenshot();
          screenshot = screenshotBuffer.toString('base64');
        } catch (screenshotError) {
          console.error('Error taking error screenshot:', screenshotError);
        }
      }
      
      return {
        id: step.id,
        name: step.name || step.action,
        action: step.action,
        selector: step.selector,
        value: step.value,
        result: TestResult.FAILED,
        duration: 0,
        screenshot,
        error: {
          message: error.message,
          stack: error.stack
        }
      };
    }
  }
  
  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }
}
