import { useState, useEffect, useCallback } from 'react';
import { TestCategoryDistribution } from '../../mock/dashboardMock';
import { TestCaseCategory } from '../../models/interfaces/ITestCase';

export const useTestCategoryDistributionData = () => {
  const [distributionData, setDistributionData] = useState<TestCategoryDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistributionData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/test/category-distribution');
      // setDistributionData(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Toplam test sayısı
      const total = Math.floor(Math.random() * 100) + 150;
      
      // Kategorilere göre dağılım
      const categories = [
        TestCaseCategory.FUNCTIONAL,
        TestCaseCategory.REGRESSION,
        TestCaseCategory.INTEGRATION,
        TestCaseCategory.PERFORMANCE,
        TestCaseCategory.SECURITY,
        TestCaseCategory.USABILITY,
        TestCaseCategory.ACCEPTANCE,
        TestCaseCategory.SMOKE,
        TestCaseCategory.EXPLORATORY
      ];
      
      // Rastgele ağırlıklar oluştur
      const weights = categories.map(() => Math.random());
      const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
      
      // Normalize edilmiş ağırlıklar
      const normalizedWeights = weights.map(weight => weight / weightSum);
      
      // Her kategori için test sayısını hesapla
      const counts = normalizedWeights.map(weight => Math.round(weight * total));
      
      // Toplam sayının tam olarak eşleşmesi için son kategoriyi ayarla
      const calculatedTotal = counts.reduce((sum, count) => sum + count, 0);
      if (calculatedTotal !== total) {
        counts[counts.length - 1] += (total - calculatedTotal);
      }
      
      // Dağılım verilerini oluştur
      const mockResponse: TestCategoryDistribution[] = categories.map((category, index) => ({
        category,
        count: counts[index],
        percentage: parseFloat(((counts[index] / total) * 100).toFixed(1))
      }));
      
      // Sayıya göre sırala (en çok en üstte)
      mockResponse.sort((a, b) => b.count - a.count);
      
      setDistributionData(mockResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistributionData();
    const interval = setInterval(fetchDistributionData, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, [fetchDistributionData]);

  return { distributionData, isLoading, error, refresh: fetchDistributionData };
};