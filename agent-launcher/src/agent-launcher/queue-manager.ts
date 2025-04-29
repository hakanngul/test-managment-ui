import { v4 as uuidv4 } from 'uuid';
import { QueuedRequest, RequestStatus, RequestPriority } from '../models/QueuedRequest';
import { ProcessedRequest, TestResult } from '../models/ProcessedRequest';
import { BrowserType } from '../models/Agent';

export class QueueManager {
  private queuedRequests: Map<string, QueuedRequest>;
  private processedRequests: Map<string, ProcessedRequest>;
  
  constructor() {
    this.queuedRequests = new Map();
    this.processedRequests = new Map();
  }
  
  public async getStatus(): Promise<any> {
    const queuedRequests = Array.from(this.queuedRequests.values());
    
    const totalQueued = queuedRequests.length;
    const highPriority = queuedRequests.filter(req => req.priority === RequestPriority.HIGH || req.priority === RequestPriority.CRITICAL).length;
    const normalPriority = queuedRequests.filter(req => req.priority === RequestPriority.NORMAL).length;
    const lowPriority = queuedRequests.filter(req => req.priority === RequestPriority.LOW).length;
    
    const oldestRequest = queuedRequests.reduce((oldest, current) => {
      return oldest.queuedAt < current.queuedAt ? oldest : current;
    }, queuedRequests[0]);
    
    const waitTime = oldestRequest 
      ? Math.floor((Date.now() - oldestRequest.queuedAt.getTime()) / 1000) 
      : 0;
    
    return {
      total: totalQueued,
      highPriority,
      normalPriority,
      lowPriority,
      oldestRequestTime: oldestRequest ? oldestRequest.queuedAt.toISOString() : null,
      waitTime,
      estimatedProcessingTime: this.calculateEstimatedProcessingTime()
    };
  }
  
  public async getQueuedRequests(): Promise<QueuedRequest[]> {
    return Array.from(this.queuedRequests.values())
      .sort((a, b) => a.queuePosition - b.queuePosition);
  }
  
  public async getProcessedRequests(limit: number = 10): Promise<ProcessedRequest[]> {
    return Array.from(this.processedRequests.values())
      .sort((a, b) => {
        const aTime = a.timing.completedAt || new Date();
        const bTime = b.timing.completedAt || new Date();
        return bTime.getTime() - aTime.getTime(); // Descending order (newest first)
      })
      .slice(0, limit);
  }
  
  public async getNextRequest(): Promise<QueuedRequest | null> {
    const queuedRequests = Array.from(this.queuedRequests.values())
      .filter(req => req.status === RequestStatus.QUEUED)
      .sort((a, b) => {
        // Önce önceliğe göre sırala
        if (a.priority !== b.priority) {
          const priorityOrder = {
            [RequestPriority.CRITICAL]: 0,
            [RequestPriority.HIGH]: 1,
            [RequestPriority.NORMAL]: 2,
            [RequestPriority.LOW]: 3
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Aynı öncelikte ise kuyruk pozisyonuna göre sırala
        return a.queuePosition - b.queuePosition;
      });
    
    return queuedRequests.length > 0 ? queuedRequests[0] : null;
  }
  
  public async addRequest(request: Partial<QueuedRequest>): Promise<QueuedRequest> {
    const id = request.id || uuidv4();
    const queuePosition = this.getNextQueuePosition();
    
    const newRequest: QueuedRequest = {
      id,
      testName: request.testName || 'Unnamed Test',
      description: request.description,
      status: RequestStatus.QUEUED,
      queuePosition,
      queuedAt: new Date(),
      browser: request.browser || BrowserType.CHROME,
      priority: request.priority || RequestPriority.NORMAL,
      category: request.category,
      tags: request.tags,
      userId: request.userId,
      projectId: request.projectId,
      testCaseId: request.testCaseId,
      testSuiteId: request.testSuiteId,
      parameters: request.parameters,
      timing: {
        queuedAt: new Date(),
        waitTime: 0
      }
    };
    
    this.queuedRequests.set(id, newRequest);
    this.updateQueuePositions();
    
    return newRequest;
  }
  
  public async updateRequestStatus(requestId: string, status: RequestStatus): Promise<QueuedRequest | null> {
    const request = this.queuedRequests.get(requestId);
    if (!request) {
      return null;
    }
    
    request.status = status;
    
    if (status === RequestStatus.PROCESSING) {
      request.timing.startedAt = new Date();
      request.timing.waitTime = request.timing.startedAt.getTime() - request.timing.queuedAt.getTime();
    }
    
    this.queuedRequests.set(requestId, request);
    
    return request;
  }
  
  public async completeRequest(requestId: string, result: TestResult, steps: any[] = []): Promise<ProcessedRequest | null> {
    const request = this.queuedRequests.get(requestId);
    if (!request) {
      return null;
    }
    
    // İsteği kuyruktan kaldır
    this.queuedRequests.delete(requestId);
    
    // Tamamlanma zamanını ayarla
    const completedAt = new Date();
    const startedAt = request.timing.startedAt || completedAt;
    const executionTime = completedAt.getTime() - startedAt.getTime();
    const totalTime = completedAt.getTime() - request.timing.queuedAt.getTime();
    
    // İşlenmiş istek oluştur
    const processedRequest: ProcessedRequest = {
      id: request.id,
      testName: request.testName,
      description: request.description,
      result,
      browser: request.browser,
      priority: request.priority,
      category: request.category,
      tags: request.tags,
      userId: request.userId,
      projectId: request.projectId,
      testCaseId: request.testCaseId,
      testSuiteId: request.testSuiteId,
      parameters: request.parameters,
      timing: {
        queuedAt: request.timing.queuedAt,
        startedAt,
        completedAt,
        waitTime: request.timing.waitTime,
        executionTime,
        totalTime
      },
      agentId: request.agentId || '',
      steps: steps
    };
    
    // İşlenmiş isteği kaydet
    this.processedRequests.set(requestId, processedRequest);
    
    // Kuyruk pozisyonlarını güncelle
    this.updateQueuePositions();
    
    return processedRequest;
  }
  
  private getNextQueuePosition(): number {
    const queuedRequests = Array.from(this.queuedRequests.values());
    return queuedRequests.length > 0 
      ? Math.max(...queuedRequests.map(req => req.queuePosition)) + 1 
      : 1;
  }
  
  private updateQueuePositions(): void {
    const queuedRequests = Array.from(this.queuedRequests.values())
      .filter(req => req.status === RequestStatus.QUEUED)
      .sort((a, b) => {
        // Önce önceliğe göre sırala
        if (a.priority !== b.priority) {
          const priorityOrder = {
            [RequestPriority.CRITICAL]: 0,
            [RequestPriority.HIGH]: 1,
            [RequestPriority.NORMAL]: 2,
            [RequestPriority.LOW]: 3
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Aynı öncelikte ise kuyruk zamanına göre sırala (FIFO)
        return a.queuedAt.getTime() - b.queuedAt.getTime();
      });
    
    // Kuyruk pozisyonlarını güncelle
    queuedRequests.forEach((req, index) => {
      req.queuePosition = index + 1;
      this.queuedRequests.set(req.id, req);
    });
    
    // Tahmini başlama zamanlarını güncelle
    this.updateEstimatedStartTimes();
  }
  
  private updateEstimatedStartTimes(): void {
    const averageExecutionTime = this.calculateAverageExecutionTime();
    const queuedRequests = Array.from(this.queuedRequests.values())
      .filter(req => req.status === RequestStatus.QUEUED)
      .sort((a, b) => a.queuePosition - b.queuePosition);
    
    let currentTime = Date.now();
    
    queuedRequests.forEach(req => {
      req.estimatedStartTime = new Date(currentTime + averageExecutionTime);
      currentTime += averageExecutionTime;
      this.queuedRequests.set(req.id, req);
    });
  }
  
  private calculateAverageExecutionTime(): number {
    const processedRequests = Array.from(this.processedRequests.values());
    
    if (processedRequests.length === 0) {
      return 30000; // Varsayılan 30 saniye
    }
    
    const totalExecutionTime = processedRequests.reduce((total, req) => {
      return total + (req.timing.executionTime || 0);
    }, 0);
    
    return totalExecutionTime / processedRequests.length;
  }
  
  private calculateEstimatedProcessingTime(): number {
    const queuedRequests = Array.from(this.queuedRequests.values())
      .filter(req => req.status === RequestStatus.QUEUED);
    
    if (queuedRequests.length === 0) {
      return 0;
    }
    
    const averageExecutionTime = this.calculateAverageExecutionTime();
    return queuedRequests.length * averageExecutionTime;
  }
  
  public async isHealthy(): Promise<boolean> {
    // Kuyruk sağlığını kontrol et
    const queuedRequests = Array.from(this.queuedRequests.values());
    const oldRequests = queuedRequests.filter(req => {
      const waitTime = Date.now() - req.queuedAt.getTime();
      return waitTime > 3600000; // 1 saatten fazla bekleyen istekler
    });
    
    // Kuyrukta 1 saatten fazla bekleyen istek sayısı 10'dan azsa sağlıklı kabul et
    return oldRequests.length < 10;
  }
}
