import { useState, useEffect, useCallback } from 'react';
import { TestStatusDistribution } from '../../mock/dashboardMock';
import { TestCaseResult } from '../../models/interfaces/ITestCase';

export const useTestStatusDistributionData = () => {
  const [distributionData, setDistributionData] = useState<TestStatusDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistributionData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/test/status-distribution');
      // setDistributionData(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Toplam test sayısı
      const total = Math.floor(Math.random() * 100) + 200;
      
      // Rastgele dağılım oluştur
      const passed = Math.floor(total * (0.6 + Math.random() * 0.2)); // %60-80 başarılı
      const failed = Math.floor(total * (0.05 + Math.random() * 0.1)); // %5-15 başarısız
      const blocked = Math.floor(total * (0.03 + Math.random() * 0.07)); // %3-10 engellenen
      const skipped = Math.floor(total * (0.02 + Math.random() * 0.05)); // %2-7 atlanan
      
      // Kalan testler çalıştırılmayan olsun
      const notRun = total - passed - failed - blocked - skipped;
      
      const mockResponse: TestStatusDistribution[] = [
        {
          status: TestCaseResult.PASSED,
          count: passed,
          percentage: parseFloat(((passed / total) * 100).toFixed(1))
        },
        {
          status: TestCaseResult.FAILED,
          count: failed,
          percentage: parseFloat(((failed / total) * 100).toFixed(1))
        },
        {
          status: TestCaseResult.BLOCKED,
          count: blocked,
          percentage: parseFloat(((blocked / total) * 100).toFixed(1))
        },
        {
          status: TestCaseResult.SKIPPED,
          count: skipped,
          percentage: parseFloat(((skipped / total) * 100).toFixed(1))
        },
        {
          status: TestCaseResult.NOT_RUN,
          count: notRun,
          percentage: parseFloat(((notRun / total) * 100).toFixed(1))
        }
      ];
      
      setDistributionData(mockResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistributionData();
    const interval = setInterval(fetchDistributionData, 60000);
    return () => clearInterval(interval);
  }, [fetchDistributionData]);

  return { distributionData, isLoading, error, refresh: fetchDistributionData };
};