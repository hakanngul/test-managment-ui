import { useState, useEffect, useCallback } from 'react';
import { RecentTestRun } from '../../mock/dashboardMock';
import { TestRunStatus } from '../../mock/testRunsMock';
import { TestCaseResult } from '../../models/interfaces/ITestCase';

export const useRecentTestRunsData = () => {
  const [recentRuns, setRecentRuns] = useState<RecentTestRun[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentRuns = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/test/recent-runs');
      // setRecentRuns(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rastgele test çalıştırmaları oluştur
      const mockData: RecentTestRun[] = [];
      const now = new Date();
      
      const testNames = [
        'Kullanıcı Girişi Testi',
        'Ürün Arama Testi',
        'Sepete Ekleme Testi',
        'Ödeme İşlemi Testi',
        'Şifre Sıfırlama Testi',
        'Profil Güncelleme Testi',
        'Sipariş Takibi Testi',
        'Ürün Filtreleme Testi',
        'Favorilere Ekleme Testi',
        'Yorum Ekleme Testi'
      ];
      
      const users = [
        'Ahmet Yılmaz',
        'Mehmet Kaya',
        'Ayşe Demir',
        'Fatma Şahin',
        'Hakan Gül'
      ];
      
      // Son 10 test çalıştırması
      for (let i = 0; i < 10; i++) {
        const startTime = new Date(now);
        startTime.setMinutes(now.getMinutes() - (i * 15) - Math.floor(Math.random() * 10));
        
        const duration = Math.floor(Math.random() * 180000) + 30000; // 30sn - 3.5dk arası
        
        // Rastgele durum ve sonuç
        let status: TestRunStatus;
        let result: TestCaseResult | undefined;
        let endTime: Date | undefined;
        
        const statusRandom = Math.random();
        if (statusRandom < 0.7) {
          status = TestRunStatus.COMPLETED;
          
          // Tamamlanan testler için bitiş zamanı oluştur
          endTime = new Date(startTime);
          endTime.setMilliseconds(endTime.getMilliseconds() + duration);
          
          const resultRandom = Math.random();
          if (resultRandom < 0.7) {
            result = TestCaseResult.PASSED;
          } else if (resultRandom < 0.9) {
            result = TestCaseResult.FAILED;
          } else if (resultRandom < 0.95) {
            result = TestCaseResult.BLOCKED;
          } else {
            result = TestCaseResult.SKIPPED;
          }
        } else if (statusRandom < 0.85) {
          status = TestRunStatus.RUNNING;
          result = undefined;
          endTime = undefined;
        } else if (statusRandom < 0.95) {
          status = TestRunStatus.QUEUED;
          result = undefined;
          endTime = undefined;
        } else {
          status = TestRunStatus.FAILED;
          result = undefined;
          endTime = undefined;
        }
        
        mockData.push({
          id: `run-${100 + i}`,
          testCaseId: `tc-${i + 1}`,
          testCaseName: testNames[i % testNames.length],
          status,
          result,
          startTime,
          endTime,
          duration: status === TestRunStatus.COMPLETED ? duration : 0,
          executedBy: users[Math.floor(Math.random() * users.length)]
        });
      }
      
      setRecentRuns(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentRuns();
    const interval = setInterval(fetchRecentRuns, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, [fetchRecentRuns]);

  return { recentRuns, isLoading, error, refresh: fetchRecentRuns };
};
