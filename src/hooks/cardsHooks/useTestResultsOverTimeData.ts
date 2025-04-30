import { useState, useEffect, useCallback } from 'react';
import { TestResultsOverTime } from '../../mock/dashboardMock';

export const useTestResultsOverTimeData = () => {
  const [timeData, setTimeData] = useState<TestResultsOverTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/test/results-over-time');
      // setTimeData(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Son 14 günün verilerini oluştur
      const mockData: TestResultsOverTime[] = [];
      const today = new Date();
      
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Her gün için rastgele test sonuçları
        const total = Math.floor(Math.random() * 30) + 50; // 50-80 arası test
        const passed = Math.floor(total * (0.65 + Math.random() * 0.2)); // %65-85 başarılı
        const failed = Math.floor(total * (0.05 + Math.random() * 0.1)); // %5-15 başarısız
        const blocked = Math.floor(total * (0.03 + Math.random() * 0.07)); // %3-10 engellenen
        
        // Kalan testler atlanan olsun
        const skipped = total - passed - failed - blocked;
        
        mockData.push({
          date: date.toISOString().split('T')[0], // YYYY-MM-DD formatı
          passed,
          failed,
          blocked,
          skipped,
          total
        });
      }
      
      setTimeData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimeData();
    const interval = setInterval(fetchTimeData, 60000);
    return () => clearInterval(interval);
  }, [fetchTimeData]);

  return { timeData, isLoading, error, refresh: fetchTimeData };
};