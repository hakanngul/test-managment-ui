import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';

// Yeni bileşenleri içe aktarıyoruz
import {
  ServerAgentDataProvider,
  PageHeader,
  LoadingIndicator,
  ErrorDisplay,
  ServerAgentOverview,
  ServerAgentDetails,
  useServerAgentData,
  DataSourceSelector
} from '../components/server-agent';

/**
 * ServerAgent sayfası
 *
 * Bu sayfa, test otomasyon sistemindeki server agent'ların durumunu,
 * performansını ve yapılandırmasını izlemek ve yönetmek için kullanılır.
 */
const ServerAgentContent: React.FC = () => {
  const { loading, error, lastUpdated, refreshData } = useServerAgentData();
  // Sayfa ilk yüklendiğinde verileri bir kez yenile
  useEffect(() => {
    // Sayfa yüklendiğinde verileri yenile
    // refreshData() fonksiyonu zaten ServerAgentDataProvider içinde çağrılıyor
    // Bu nedenle burada tekrar çağırmaya gerek yok
  }, []);

  return (
    <Container maxWidth={false}>
      <PageHeader
        title="Server Agent Yönetimi"
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
      />

      {loading && <LoadingIndicator />}

      {error && <ErrorDisplay message={error} />}

      {!loading && !error && (
        <Box sx={{ mt: 3 }}>
          {/* Veri Kaynağı Seçici */}
          <DataSourceSelector />

          {/* Genel Bakış Bölümü */}
          <ServerAgentOverview />

          {/* Detaylı Bilgiler Bölümü */}
          <ServerAgentDetails />
        </Box>
      )}
    </Container>
  );
};

const ServerAgent: React.FC = () => {
  return (
    <ServerAgentDataProvider>
      <ServerAgentContent />
    </ServerAgentDataProvider>
  );
};

export default ServerAgent;
