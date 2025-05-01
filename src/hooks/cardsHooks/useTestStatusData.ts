import { useState, useEffect, useCallback } from 'react';
import { TestStatusSummary } from '../../models/interfaces/IDashboard';

export const useTestStatusData = () => {
  const [statusData, setStatusData] = useState<TestStatusSummary>({
    total: 0,
    passed: 0,
    failed: 0,
    blocked: 0,
    passRate: 0,
    skipped: 0,
    notRun: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatusData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/test/status');
      // setStatusData(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = {
        total: Math.floor(Math.random() * 50) + 150,
        passed: Math.floor(Math.random() * 30) + 100,
        failed: Math.floor(Math.random() * 10) + 10,
        blocked: Math.floor(Math.random() * 10) + 5,
        passRate: Math.floor(Math.random() * 20) + 70,
        skipped: Math.floor(Math.random() * 5) + 5,
        notRun: Math.floor(Math.random() * 5) + 5
      };
      setStatusData(mockResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatusData();
    const interval = setInterval(fetchStatusData, 60000);
    return () => clearInterval(interval);
  }, [fetchStatusData]);

  return { statusData, isLoading, error, refresh: fetchStatusData };
};
