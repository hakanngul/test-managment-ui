import { useState, useEffect, useCallback } from 'react';
import { BrowserDistribution, EnvironmentDistribution } from '../../mock/dashboardMock';

export const useBrowserEnvironmentDistributionData = () => {
  const [browserData, setBrowserData] = useState<BrowserDistribution[]>([]);
  const [environmentData, setEnvironmentData] = useState<EnvironmentDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistributionData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/analytics/browser-environment-distribution');
      // setBrowserData(response.data.browserData);
      // setEnvironmentData(response.data.environmentData);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Tarayıcı dağılımı
      const mockBrowserData: BrowserDistribution[] = [
        { browser: 'Chrome', count: 250, percentage: 50 },
        { browser: 'Firefox', count: 100, percentage: 20 },
        { browser: 'Safari', count: 75, percentage: 15 },
        { browser: 'Edge', count: 50, percentage: 10 },
        { browser: 'IE', count: 25, percentage: 5 }
      ];
      
      // Ortam dağılımı
      const mockEnvironmentData: EnvironmentDistribution[] = [
        { environment: 'Production', count: 200, percentage: 40 },
        { environment: 'Staging', count: 150, percentage: 30 },
        { environment: 'Development', count: 100, percentage: 20 },
        { environment: 'Testing', count: 50, percentage: 10 }
      ];
      
      setBrowserData(mockBrowserData);
      setEnvironmentData(mockEnvironmentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistributionData();
    // Bu veri çok sık değişmediği için daha uzun bir aralıkla güncellenebilir
    const interval = setInterval(fetchDistributionData, 5 * 60 * 1000); // 5 dakikada bir güncelle
    return () => clearInterval(interval);
  }, [fetchDistributionData]);

  return { browserData, environmentData, isLoading, error, refresh: fetchDistributionData };
};