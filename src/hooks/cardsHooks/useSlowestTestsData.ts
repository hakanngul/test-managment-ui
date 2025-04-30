import { useState, useEffect, useCallback } from 'react';
import { SlowestTest } from '../../mock/dashboardMock';
import { TestCaseCategory } from '../../models/interfaces/ITestCase';

export const useSlowestTestsData = () => {
  const [slowestTests, setSlowestTests] = useState<SlowestTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlowestTests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/tests/slowest');
      // setSlowestTests(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rastgele en yavaş testler oluştur
      const testNames = [
        'Kullanıcı Kaydı Testi',
        'Ödeme İşlemi Testi',
        'Sipariş Onayı Testi',
        'Ürün Arama Testi',
        'Sepet İşlemleri Testi',
        'Kullanıcı Profili Güncelleme',
        'Şifre Sıfırlama Testi',
        'Ürün Filtreleme Testi',
        'Adres Bilgileri Kaydetme',
        'Favorilere Ekleme Testi'
      ];
      
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
      
      const mockData: SlowestTest[] = [];
      const now = new Date();
      
      // 10 yavaş test oluştur
      for (let i = 0; i < 10; i++) {
        const lastRun = new Date(now);
        // Son 7 gün içinde rastgele bir tarih
        lastRun.setDate(lastRun.getDate() - Math.floor(Math.random() * 7));
        
        // Rastgele süre (10 saniye ile 5 dakika arası)
        const duration = Math.floor(Math.random() * (300000 - 10000) + 10000);
        
        mockData.push({
          id: `test-${i + 1}`,
          name: testNames[i % testNames.length],
          averageDuration: duration,
          lastRun,
          category: categories[Math.floor(Math.random() * categories.length)]
        });
      }
      
      // Süreye göre sırala (en yavaş en üstte)
      mockData.sort((a, b) => b.averageDuration - a.averageDuration);
      
      setSlowestTests(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlowestTests();
    const interval = setInterval(fetchSlowestTests, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, [fetchSlowestTests]);

  return { slowestTests, isLoading, error, refresh: fetchSlowestTests };
};