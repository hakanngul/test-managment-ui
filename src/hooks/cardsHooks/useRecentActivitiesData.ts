import { useState, useEffect, useCallback } from 'react';
import { Activity } from '../../mock/dashboardMock';

export const useRecentActivitiesData = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: API hazır olduğunda comment'i kaldır
      // const response = await axios.get('/api/activities/recent');
      // setActivities(response.data);

      // Mock data (API hazır olduğunda kaldırılacak)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Rastgele aktiviteler oluştur
      const mockData: Activity[] = [];
      const now = new Date();
      
      const activityDescriptions = [
        'Test çalıştırıldı: Kullanıcı Girişi Testi',
        'Test güncellendi: Ödeme İşlemi Testi',
        'Yeni test oluşturuldu: Sipariş Onayı Kontrolü',
        'Test çalıştırıldı: Şifre Sıfırlama Testi',
        'Test güncellendi: Ürün Arama Sonuçları',
        'Kullanıcı giriş yaptı',
        'Test çalıştırıldı: Sepet Tutarı Hesaplama',
        'Yeni test oluşturuldu: Kullanıcı Kaydı Doğrulama',
        'Test güncellendi: Adres Bilgileri Kaydetme',
        'Test çalıştırıldı: Ürün Filtreleme Testi',
        'Kullanıcı giriş yaptı',
        'Test çalıştırıldı: Favorilere Ekleme Testi'
      ];
      
      const users = [
        'Ahmet Yılmaz',
        'Mehmet Kaya',
        'Ayşe Demir',
        'Fatma Şahin',
        'Hakan Gül'
      ];
      
      const activityTypes = [
        'test_run',
        'test_updated',
        'test_created',
        'user_login'
      ] as const;
      
      // 15 aktivite oluştur
      for (let i = 0; i < 15; i++) {
        const timestamp = new Date(now);
        
        // Rastgele bir zaman farkı ekle (son 7 gün içinde)
        const randomMinutes = Math.floor(Math.random() * 10080); // 7 gün = 10080 dakika
        timestamp.setMinutes(timestamp.getMinutes() - randomMinutes);
        
        // Aktivite tipini belirle
        const typeIndex = Math.floor(Math.random() * activityTypes.length);
        const type = activityTypes[typeIndex];
        
        // Aktivite açıklamasını belirle
        let description;
        if (type === 'user_login') {
          description = 'Kullanıcı giriş yaptı';
        } else {
          description = activityDescriptions[Math.floor(Math.random() * (activityDescriptions.length - 1))];
        }
        
        // Kullanıcıyı belirle
        const user = users[Math.floor(Math.random() * users.length)];
        
        // İlgili ID'yi belirle (test_run, test_updated, test_created için)
        const relatedId = type !== 'user_login' ? `tc-${Math.floor(Math.random() * 100) + 1}` : undefined;
        
        mockData.push({
          id: `activity-${i + 1}`,
          type,
          description,
          user,
          timestamp,
          relatedId
        });
      }
      
      // Zamana göre sırala (en yeni en üstte)
      mockData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setActivities(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri çekilemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, [fetchActivities]);

  return { activities, isLoading, error, refresh: fetchActivities };
};
