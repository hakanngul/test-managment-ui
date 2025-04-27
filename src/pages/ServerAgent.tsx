import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Computer as ComputerIcon,
  List as ListIcon,
  HourglassTop as HourglassTopIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import api from '../services/api';

// Interface for active agents
interface ActiveAgent {
  id: string;
  browser: string;
  status: 'available' | 'busy' | 'offline';
  created: string;
  lastActivity: string;
  currentRequest: string | null;
}

// Interface for queued requests
interface QueuedRequest {
  id: string;
  testName: string;
  browser: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  queuedAt: string;
  waitTime: string;
}

// Interface for processed requests
interface ProcessedRequest {
  id: string;
  testName: string;
  browser: string;
  agentId: string;
  startTime: string;
  duration: string;
}

const ServerAgent: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // System resources state
  const [lastUpdated, setLastUpdated] = useState('');
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);

  // Agent and queue status state
  const [agentStatus, setAgentStatus] = useState({
    total: 0,
    available: 0,
    busy: 0,
    limit: 1
  });

  const [queueStatus, setQueueStatus] = useState({
    queued: 0,
    processing: 0,
    total: 0
  });

  // Data lists state
  const [activeAgents, setActiveAgents] = useState<ActiveAgent[]>([]);
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);
  const [processedRequests, setProcessedRequests] = useState<ProcessedRequest[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          systemResources,
          agentStatusData,
          queueStatusData,
          activeAgentsData,
          queuedRequestsData,
          processedRequestsData
        ] = await Promise.all([
          api.getSystemResourcesData(),
          api.getAgentStatusData(),
          api.getQueueStatusData(),
          api.getActiveAgentsData(),
          api.getQueuedRequestsData(),
          api.getProcessedRequestsData()
        ]);

        // Update state with fetched data
        setLastUpdated(systemResources.lastUpdated);
        setCpuUsage(systemResources.cpuUsage);
        setMemoryUsage(systemResources.memoryUsage);
        setAgentStatus(agentStatusData);
        setQueueStatus(queueStatusData);
        setActiveAgents(activeAgentsData);
        setQueuedRequests(queuedRequestsData);
        setProcessedRequests(processedRequestsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching server agent data:', err);
        setError('Failed to load server agent data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [processedPage, setProcessedPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);

  // Simulate data refresh
  const refreshData = () => {
    // Update last updated time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLastUpdated(`${formattedDate} ${formattedTime}`);

    // Simulate CPU and memory usage changes
    setCpuUsage(Math.round((Math.random() * 20 + 5) * 10) / 10);
    setMemoryUsage(Math.round(Math.random() * 10) / 10);
  };

  // Auto refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircleIcon fontSize="small" />;
      case 'busy': return <WarningIcon fontSize="small" />;
      case 'offline': return <CancelIcon fontSize="small" />;
      default: return <CheckCircleIcon fontSize="small" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          Server Agent
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Güncelleme: {lastUpdated}
          </Typography>
          <IconButton size="small" onClick={refreshData}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Grid container spacing={3}>
        {/* System Resources */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sistem Kaynakları
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Güncelleme: {lastUpdated}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">CPU Kullanımı</Typography>
                  <Typography variant="body2" fontWeight="medium" color={cpuUsage > 80 ? 'error.main' : cpuUsage > 50 ? 'warning.main' : 'success.main'}>
                    {cpuUsage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={cpuUsage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    mb: 3,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: cpuUsage > 80 ? theme.palette.error.main :
                              cpuUsage > 50 ? theme.palette.warning.main :
                              theme.palette.success.main
                    }
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Bellek Kullanımı</Typography>
                  <Typography variant="body2" fontWeight="medium" color={memoryUsage > 80 ? 'error.main' : memoryUsage > 50 ? 'warning.main' : 'success.main'}>
                    {memoryUsage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={memoryUsage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: memoryUsage > 80 ? theme.palette.error.main :
                              memoryUsage > 50 ? theme.palette.warning.main :
                              theme.palette.success.main
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Agent Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Agent Durumu
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="h4">{agentStatus.total}</Typography>
                    <Typography variant="body2">Toplam Agent</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="h4">{agentStatus.available}</Typography>
                    <Typography variant="body2">Müsait</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <Typography variant="h4">{agentStatus.busy}</Typography>
                    <Typography variant="body2">Meşgul</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="h4">{agentStatus.limit}</Typography>
                    <Typography variant="body2">Agent Limiti</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Queue Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Kuyruk Durumu
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <Typography variant="h4">{queueStatus.queued}</Typography>
                    <Typography variant="body2">Kuyrukta</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="h4">{queueStatus.processing}</Typography>
                    <Typography variant="body2">İşleniyor</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="h4">{queueStatus.total}</Typography>
                    <Typography variant="body2">Toplam</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs for Agents and Requests */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab
                icon={<ComputerIcon />}
                label="Aktif Agent'lar"
                iconPosition="start"
              />
              <Tab
                icon={<ListIcon />}
                label="Kuyrukta Bekleyen İstekler"
                iconPosition="start"
              />
              <Tab
                icon={<HourglassTopIcon />}
                label="İşlenen İstekler"
                iconPosition="start"
              />
            </Tabs>

            <Box sx={{ p: 2 }}>
              {/* Active Agents Tab */}
              {tabValue === 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Agent ID</TableCell>
                        <TableCell>Tarayıcı</TableCell>
                        <TableCell>Durum</TableCell>
                        <TableCell>Oluşturulma</TableCell>
                        <TableCell>Son Aktivite</TableCell>
                        <TableCell>Mevcut İstek</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeAgents.length > 0 ? (
                        activeAgents.map((agent) => (
                          <TableRow key={agent.id}>
                            <TableCell>{agent.id}</TableCell>
                            <TableCell>{agent.browser}</TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(agent.status)}
                                label={agent.status === 'available' ? 'Müsait' : agent.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'}
                                size="small"
                                color={getStatusColor(agent.status)}
                              />
                            </TableCell>
                            <TableCell>{agent.created}</TableCell>
                            <TableCell>{agent.lastActivity}</TableCell>
                            <TableCell>{agent.currentRequest || '-'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                              Aktif agent bulunmuyor
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Queued Requests Tab */}
              {tabValue === 1 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>İstek ID</TableCell>
                        <TableCell>Test Adı</TableCell>
                        <TableCell>Tarayıcı</TableCell>
                        <TableCell>Öncelik</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell>Kuyruğa Eklenme</TableCell>
                        <TableCell>Bekleme Süresi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {queuedRequests.length > 0 ? (
                        queuedRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>{request.id}</TableCell>
                            <TableCell>{request.testName}</TableCell>
                            <TableCell>{request.browser}</TableCell>
                            <TableCell>
                              <Chip
                                label={request.priority === 'high' ? 'Yüksek' : request.priority === 'medium' ? 'Orta' : 'Düşük'}
                                size="small"
                                color={getPriorityColor(request.priority)}
                              />
                            </TableCell>
                            <TableCell>{request.category}</TableCell>
                            <TableCell>{request.queuedAt}</TableCell>
                            <TableCell>{request.waitTime}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                              Kuyrukta bekleyen istek bulunmuyor
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Processed Requests Tab */}
              {tabValue === 2 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <FormControl variant="outlined" size="small" sx={{ width: 150 }}>
                      <InputLabel id="rows-per-page-label">Sayfa başına göster</InputLabel>
                      <Select
                        labelId="rows-per-page-label"
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        label="Sayfa başına göster"
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>İstek ID</TableCell>
                          <TableCell>Test Adı</TableCell>
                          <TableCell>Tarayıcı</TableCell>
                          <TableCell>Agent ID</TableCell>
                          <TableCell>Başlangıç</TableCell>
                          <TableCell>Süre</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {processedRequests.length > 0 ? (
                          processedRequests
                            .slice(processedPage * rowsPerPage, processedPage * rowsPerPage + rowsPerPage)
                            .map((request) => (
                              <TableRow key={request.id}>
                                <TableCell>{request.id}</TableCell>
                                <TableCell>{request.testName}</TableCell>
                                <TableCell>{request.browser}</TableCell>
                                <TableCell>{request.agentId}</TableCell>
                                <TableCell>{request.startTime}</TableCell>
                                <TableCell>{request.duration}</TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                İşlenen istek bulunmuyor
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    component="div"
                    count={processedRequests.length}
                    page={processedPage}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) => `Gösterilen: ${from}-${to} / ${count}`}
                    labelRowsPerPage=""
                  />
                </>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
      )}
    </Box>
  );
};

export default ServerAgent;
