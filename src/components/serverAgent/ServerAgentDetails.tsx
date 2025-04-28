import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useServerAgentData } from './ServerAgentDataProvider';
import { TabsContainer } from './';

/**
 * Server Agent sayfasının detaylı bilgiler bölümü
 * Aktif agent'lar, kuyrukta bekleyen istekler ve işlenen istekler için sekmeleri gösterir
 */
const ServerAgentDetails: React.FC = () => {
  const { activeAgents, queuedRequests, processedRequests } = useServerAgentData();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  const [processedPage, setProcessedPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setProcessedPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setProcessedPage(0);
  };

  return (
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
        Detaylı Bilgiler
      </Typography>
      
      <TabsContainer
        activeAgents={activeAgents}
        queuedRequests={queuedRequests}
        processedRequests={processedRequests}
        tabValue={tabValue}
        onTabChange={handleTabChange}
        processedPage={processedPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

export default ServerAgentDetails;
