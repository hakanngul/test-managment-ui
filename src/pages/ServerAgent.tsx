import React from 'react';
import { Box, Container } from '@mui/material';

// Yeni bileşenleri içe aktarıyoruz
import {
  ServerAgentDataProvider,
  PageHeader,
  LoadingIndicator,
  ErrorDisplay,
  ServerAgentOverview,
  ServerAgentDetails,
  useServerAgentData
} from '../components/server-agent';

/**
 * ServerAgent sayfası
 *
 * Bu sayfa, test otomasyon sistemindeki server agent'ların durumunu,
 * performansını ve yapılandırmasını izlemek ve yönetmek için kullanılır.
 */
const ServerAgentContent: React.FC = () => {
  const { loading, error, lastUpdated, refreshData } = useServerAgentData();

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
