import { TestCaseResult } from '../models/interfaces/ITestCase';
import { TestRun } from '../models/interfaces/ITestRunHistory';

// Test çalıştırma geçmişi için arayüz


// Test çalıştırma geçmişi mock verileri
export const mockTestRuns: Record<string, TestRun[]> = {
  'tc-001': [
    {
      id: 'run-001',
      testCaseId: 'tc-001',
      result: TestCaseResult.PASSED,
      startTime: new Date('2023-06-18T09:10:00'),
      endTime: new Date('2023-06-18T09:15:00'),
      duration: 300000, // 5 dakika
      browser: 'Chrome',
      environment: 'Production',
      executedBy: 'Hakan Gül',
      logs: [
        '09:10:00 - Test başlatıldı',
        '09:10:05 - Adım 1 başarıyla tamamlandı',
        '09:10:30 - Adım 2 başarıyla tamamlandı',
        '09:11:15 - Adım 3 başarıyla tamamlandı',
        '09:12:00 - Adım 4 başarıyla tamamlandı',
        '09:13:45 - Adım 5 başarıyla tamamlandı',
        '09:15:00 - Test başarıyla tamamlandı'
      ],
      screenshots: [
        'screenshot-1.png',
        'screenshot-2.png'
      ]
    },
    {
      id: 'run-002',
      testCaseId: 'tc-001',
      result: TestCaseResult.FAILED,
      startTime: new Date('2023-06-15T14:20:00'),
      endTime: new Date('2023-06-15T14:25:00'),
      duration: 300000, // 5 dakika
      browser: 'Firefox',
      environment: 'Staging',
      executedBy: 'Ahmet Yılmaz',
      errorMessage: 'Element bulunamadı: #login-button',
      logs: [
        '14:20:00 - Test başlatıldı',
        '14:20:05 - Adım 1 başarıyla tamamlandı',
        '14:20:30 - Adım 2 başarıyla tamamlandı',
        '14:21:15 - Adım 3 başarıyla tamamlandı',
        '14:22:00 - HATA: Element bulunamadı: #login-button',
        '14:25:00 - Test başarısız oldu'
      ],
      screenshots: [
        'error-screenshot.png'
      ]
    },
    {
      id: 'run-003',
      testCaseId: 'tc-001',
      result: TestCaseResult.BLOCKED,
      startTime: new Date('2023-06-10T11:30:00'),
      endTime: new Date('2023-06-10T11:32:00'),
      duration: 120000, // 2 dakika
      browser: 'Chrome',
      environment: 'Development',
      executedBy: 'Mehmet Demir',
      errorMessage: 'Test ortamına erişilemiyor',
      logs: [
        '11:30:00 - Test başlatıldı',
        '11:30:05 - HATA: Test ortamına erişilemiyor',
        '11:32:00 - Test engellendi'
      ]
    }
  ],
  'tc-002': [
    {
      id: 'run-004',
      testCaseId: 'tc-002',
      result: TestCaseResult.PASSED,
      startTime: new Date('2023-06-17T10:00:00'),
      endTime: new Date('2023-06-17T10:03:00'),
      duration: 180000, // 3 dakika
      browser: 'Chrome',
      environment: 'Testing',
      executedBy: 'Hakan Gül',
      logs: [
        '10:00:00 - Test başlatıldı',
        '10:00:30 - Adım 1 başarıyla tamamlandı',
        '10:01:15 - Adım 2 başarıyla tamamlandı',
        '10:02:00 - Adım 3 başarıyla tamamlandı',
        '10:03:00 - Test başarıyla tamamlandı'
      ],
      screenshots: [
        'tc-002-screenshot-1.png',
        'tc-002-screenshot-2.png'
      ]
    }
  ],
  'tc-003': [
    {
      id: 'run-005',
      testCaseId: 'tc-003',
      result: TestCaseResult.SKIPPED,
      startTime: new Date('2023-06-16T15:00:00'),
      endTime: new Date('2023-06-16T15:01:00'),
      duration: 60000, // 1 dakika
      browser: 'Edge',
      environment: 'Development',
      executedBy: 'Ayşe Kaya',
      logs: [
        '15:00:00 - Test başlatıldı',
        '15:00:30 - Bağımlı test başarısız olduğu için test atlandı',
        '15:01:00 - Test atlandı'
      ]
    }
  ]
};
