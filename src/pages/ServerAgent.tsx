import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  PageHeader,
  LoadingIndicator,
  ErrorDisplay
} from '../components/serverAgent';
import {
  ServerAgentDataProvider,
  useServerAgentData,
  ServerAgentOverview,
  ServerAgentDetails
} from '../components/serverAgent';

/**
 * Server Agent sayfası içeriği
 * Veri sağlayıcı tarafından sağlanan verileri kullanarak sayfayı oluşturur
 */
const ServerAgentContent: React.FC = () => {
  const { loading, error, lastUpdated, serverAgent, refreshData } = useServerAgentData();

  return (
    <Box>
      <PageHeader
        title="Server Agent"
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
      />

      {error && <ErrorDisplay message={error} />}

      {loading ? (
        <LoadingIndicator />
      ) : serverAgent ? (
        <Grid container spacing={3}>
          {/* Genel Bakış Bölümü */}
          <Grid item xs={12}>
            <ServerAgentOverview />
          </Grid>

          {/* Detaylı Bilgiler Bölümü */}
          <ServerAgentDetails />
        </Grid>
      ) : (
        <Typography variant="body1" color="error">
          Server agent verisi bulunamadı. Lütfen API bağlantınızı kontrol edin.
        </Typography>
      )}
    </Box>
  );
};

/**
 * Server Agent sayfası
 * Veri sağlayıcı ile sarmalanmış içerik bileşenini döndürür
 */
const ServerAgent: React.FC = () => {
  return (
    <ServerAgentDataProvider>
      <ServerAgentContent />
    </ServerAgentDataProvider>
  );
};

export default ServerAgent;
