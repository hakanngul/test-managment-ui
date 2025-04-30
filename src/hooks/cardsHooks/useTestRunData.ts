import { useState, useEffect, useCallback } from 'react';
import { TestRunSummary } from '../../mock/dashboardMock';

export const useTestRunData = () => {
  const [runData, setRunData] = useState<TestRunSummary>({
    totalRuns: 0,
    activeRuns: 0,
    queuedRuns: 0,
    failedRuns: 0,
    completedRuns: 0,
    passRate: 0,
    averageDuration: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRunData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/test/runs');
      // setRunData(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = {
        totalRuns: Math.floor(Math.random() * 100) + 500,
        activeRuns: Math.floor(Math.random() * 10) + 5,
        queuedRuns: Math.floor(Math.random() * 15) + 10,
        failedRuns: Math.floor(Math.random() * 20) + 15,
        averageDuration: Math.floor(Math.random() * 300000) + 600000, // 10-15 dk arası,
        passRate: Math.floor(Math.random() * 20) + 75,
        completedRuns: Math.floor(Math.random() * 50) + 450
      };
      setRunData(mockResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRunData();
    const interval = setInterval(fetchRunData, 60000);
    return () => clearInterval(interval);
  }, [fetchRunData]);

  return { runData, isLoading, error, refresh: fetchRunData };
};
