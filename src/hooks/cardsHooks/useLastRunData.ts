import { useState, useEffect, useCallback } from 'react';
import { LastRunInfo } from '../../mock/dashboardMock';

export const useLastRunData = () => {
  const [lastRunData, setLastRunData] = useState<LastRunInfo>({
    totalRuns: 0,
    passRate: 0,
    duration: 0,
    date: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLastRunData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/test/lastrun');
      // setLastRunData(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = {
        totalRuns: Math.floor(Math.random() * 20) + 30,
        passRate: Math.floor(Math.random() * 20) + 75,
        duration: Math.floor(Math.random() * 1800000) + 1800000, // 30-60 dk arası
        date: new Date(Date.now() - Math.floor(Math.random() * 86400000)) // son 24 saat içinde
      };
      setLastRunData(mockResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLastRunData();
    const interval = setInterval(fetchLastRunData, 60000);
    return () => clearInterval(interval);
  }, [fetchLastRunData]);

  return { lastRunData, isLoading, error, refresh: fetchLastRunData };
};
