import { useState, useEffect, useCallback } from 'react';
import { FailedTest } from '../../mock/dashboardMock';
import { TestCaseCategory, TestCasePriority } from '../../models/interfaces/ITestCase';

export const useFailedTestsData = () => {
  const [failedTests, setFailedTests] = useState<FailedTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rerunningTests, setRerunningTests] = useState<string[]>([]);

  const fetchFailedTests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/test/failed-tests');
      // setFailedTests(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Rastgele başarısız testler oluştur
      const mockData: FailedTest[] = [];
      const now = new Date();
      
      const testNames = [
        'Kullanıcı Girişi Doğrulama',
        'Ödeme İşlemi Tamamlama',
        'Sipariş Onayı Kontrolü',
        'Şifre Sıfırlama Maili',
        'Ürün Arama Sonuçları',
        'Sepet Tutarı Hesaplama',
        'Kullanıcı Kaydı Doğrulama',
        'Adres Bilgileri Kaydetme'
      ];
      
      const errorMessages = [
        'Element bulunamadı: #login-button',
        'Beklenen değer "Başarılı" alınamadı, alınan: "Hata"',
        'Sayfa yüklenme zaman aşımı (30s)',
        'API yanıt vermedi (504 Gateway Timeout)',
        'Beklenen metin bulunamadı: "Siparişiniz alındı"',
        'Hesaplanan toplam (1250.75) beklenen değerle (1240.50) eşleşmiyor',
        'Null referans hatası: user.address',
        'Veritabanı bağlantı hatası: Connection refused'
      ];
      
      // 5-8 arası başarısız test oluştur
      const testCount = Math.floor(Math.random() * 4) + 5;
      
      for (let i = 0; i < testCount; i++) {
        const lastRun = new Date(now);
        lastRun.setHours(now.getHours() - Math.floor(Math.random() * 24));
        
        const failureCount = Math.floor(Math.random() * 5) + 1;
        
        // Rastgele kategori ve öncelik
        const categories = Object.values(TestCaseCategory);
        const priorities = Object.values(TestCasePriority);
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        mockData.push({
          id: `fail-${100 + i}`,
          name: testNames[i % testNames.length],
          category,
          priority,
          lastRun,
          failureCount,
          errorMessage: errorMessages[i % errorMessages.length]
        });
      }
      
      // Önceliğe göre sırala (Kritik > Yüksek > Orta > Düşük)
      mockData.sort((a, b) => {
        const priorityOrder = {
          [TestCasePriority.CRITICAL]: 0,
          [TestCasePriority.HIGH]: 1,
          [TestCasePriority.MEDIUM]: 2,
          [TestCasePriority.LOW]: 3
        };
        
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      
      setFailedTests(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Testi yeniden çalıştır
  const rerunTest = useCallback(async (testId: string) => {
    try {
      // Zaten çalışıyorsa işlemi iptal et
      if (rerunningTests.includes(testId)) {
        return;
      }
      
      // Çalışan testler listesine ekle
      setRerunningTests(prev => [...prev, testId]);
      
      // TODO: API hazır olduğunda gerçek çağrı yapılacak
      // await axios.post(`/api/test/rerun/${testId}`);
      
      // Mock API çağrısı
      console.log(`Test yeniden çalıştırılıyor: ${testId}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Başarılı olduğunda testi listeden kaldır
      setFailedTests(prev => prev.filter(test => test.id !== testId));
      
    } catch (err) {
      console.error('Test yeniden çalıştırma hatası:', err);
      // Hata durumunda bildirim gösterilebilir
    } finally {
      // Çalışan testler listesinden çıkar
      setRerunningTests(prev => prev.filter(id => id !== testId));
    }
  }, [rerunningTests]);

  useEffect(() => {
    fetchFailedTests();
    const interval = setInterval(fetchFailedTests, 60000); // 60 saniyede bir güncelle
    return () => clearInterval(interval);
  }, [fetchFailedTests]);

  return { 
    failedTests, 
    isLoading, 
    error, 
    refresh: fetchFailedTests,
    rerunTest,
    rerunningTests
  };
};