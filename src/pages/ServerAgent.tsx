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
  const [connectionError, setConnectionError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // WebSocket bağlantı durumunu izle
  useEffect(() => {
    // Bağlantı durumu değişikliklerini dinle
    const handleConnectionChange = (connected: boolean) => {
      setConnectionError(!connected);
      setSnackbarOpen(!connected);
    };

    // Bağlantı durumu değişikliklerini dinlemek için event listener ekle
    window.addEventListener('agent-socket-connection-change', ((event: CustomEvent) => {
      handleConnectionChange(event.detail.connected);
    }) as EventListener);

    // İlk kontrol
    const isConnected = agentSocketService.isConnected();
    setConnectionError(!isConnected);
    setSnackbarOpen(!isConnected);

    // Periyodik kontrol (yedek olarak)
    const interval = setInterval(() => {
      const isConnected = agentSocketService.isConnected();
      setConnectionError(!isConnected);
      setSnackbarOpen(!isConnected);
    }, 10000); // 10 saniyede bir kontrol et (daha az sıklıkta)

    return () => {
      clearInterval(interval);
      window.removeEventListener('agent-socket-connection-change', ((event: CustomEvent) => {
        handleConnectionChange(event.detail.connected);
      }) as EventListener);
    };
  }, []);

  // Bağlantıyı yeniden kurma
  const handleReconnect = () => {
    agentSocketService.resetConnection();
    refreshData();
  };

  // Snackbar kapatma
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth={false}>
      <PageHeader
        title="Server Agent Yönetimi"
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
      />

      {/* Bağlantı hatası uyarısı */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          onClose={handleSnackbarClose}
          action={
            <Button color="inherit" size="small" onClick={handleReconnect}>
              Yeniden Bağlan
            </Button>
          }
        >
          Agent servisi ile bağlantı kurulamadı. Veriler güncel olmayabilir.
        </Alert>
      </Snackbar>

      {loading && <LoadingIndicator />}

      {error && <ErrorDisplay message={error} />}

      {!loading && !error && (
        <Box sx={{ mt: 3 }}>
          {connectionError && (
            <Alert
              severity="warning"
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={handleReconnect}>
                  Yeniden Bağlan
                </Button>
              }
            >
              Agent servisi ile bağlantı kurulamadı. Veriler güncel olmayabilir veya eksik olabilir.
            </Alert>
          )}

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
