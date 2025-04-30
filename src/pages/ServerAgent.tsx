import React, { useEffect } from 'react';
import { Box, Container, Alert, Chip } from '@mui/material';

// Yeni bileşenleri içe aktarıyoruz
import {
  ServerAgentDataProvider,
  PageHeader,
  LoadingIndicator,
  ErrorDisplay,
  ServerAgentOverview,
  useServerAgentData
} from '../components/server-agent';

/**
 * ServerAgent sayfası
 *
 * Bu sayfa, test otomasyon sistemindeki server agent'ların durumunu,
 * performansını ve yapılandırmasını izlemek ve yönetmek için kullanılır.
 */
const ServerAgentContent: React.FC = () => {
  const { loading, error, lastUpdated, refreshData, connected } = useServerAgentData();
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

      {/* Bağlantı durumu */}
      <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <Chip
          label={connected ? "Bağlantı Kuruldu" : "Bağlantı Kesildi"}
          color={connected ? "success" : "error"}
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
        />
        {!connected && (
          <Alert severity="warning" sx={{ ml: 1, flex: 1 }}>
            WebSocket sunucusuna bağlantı kurulamadı. Gerçek zamanlı güncellemeler alınamıyor. Varsayılan değerler gösteriliyor.
          </Alert>
        )}
      </Box>

      {loading && <LoadingIndicator />}

      {error && <ErrorDisplay message={error} />}

      {!loading && !error && (
        <Box sx={{ mt: 3 }}>
          {/* Genel Bakış Bölümü */}
          <ServerAgentOverview />

          {/* Detaylı Bilgiler Bölümü */}
        {/* <ServerAgentDetails />  */}
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
