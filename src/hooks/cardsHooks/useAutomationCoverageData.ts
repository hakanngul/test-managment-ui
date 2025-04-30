import { useState, useEffect, useCallback } from 'react';
import { AutomationCoverage } from '../../mock/dashboardMock';
import axios from 'axios';

export const useAutomationCoverageData = () => {
  const [coverageData, setCoverageData] = useState<AutomationCoverage>({
    totalTestCases: 300,
    automatedTestCases: 210,
    coverageRate: 70,
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverageData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // MongoDB'den veri çekme
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/automation/coverage');
      // setCoverageData(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = {
        totalTestCases: Math.floor(Math.random() * 100) + 250,
        automatedTestCases: Math.floor(Math.random() * 50) + 180,
        coverageRate: Math.floor(Math.random() * 20) + 60,
        lastUpdated: new Date()
      };
      setCoverageData(mockResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
      console.error('Veri çekme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    fetchCoverageData();
    
    // Belirli aralıklarla güncelleme (opsiyonel)
    const interval = setInterval(fetchCoverageData, 60000); // her 1 dakikada bir
    
    return () => clearInterval(interval);
  }, [fetchCoverageData]);

  return {
    coverageData,
    isLoading,
    error,
    refresh: fetchCoverageData
  };
};
