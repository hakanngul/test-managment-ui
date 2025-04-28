import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  HourglassEmpty as HourglassEmptyIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Computer as ComputerIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { TestCaseResult } from '../../models/interfaces/ITestCase';
import { TestRun, mockTestRuns } from '../../mock/testRunHistoryMock';

interface TestRunHistoryProps {
  testCaseId: string;
}

const TestRunHistory: React.FC<TestRunHistoryProps> = ({ testCaseId }) => {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // API'den veri çekme simülasyonu
    const fetchTestRuns = async () => {
      setIsLoading(true);
      try {
        // Gerçek uygulamada burada API çağrısı yapılacak
        setTimeout(() => {
          // Mock veri
          const testRunsForCase = mockTestRuns[testCaseId] || [];
          setTestRuns(testRunsForCase);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Test çalıştırma geçmişi yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    fetchTestRuns();
  }, [testCaseId]);

  // Sonuç ikonunu belirle
  const getResultIcon = (result: TestCaseResult) => {
    switch (result) {
      case TestCaseResult.PASSED:
        return <CheckCircleIcon fontSize="small" color="success" />;
      case TestCaseResult.FAILED:
        return <CancelIcon fontSize="small" color="error" />;
      case TestCaseResult.BLOCKED:
        return <BlockIcon fontSize="small" color="warning" />;
      case TestCaseResult.SKIPPED:
        return <WarningIcon fontSize="small" color="info" />;
      case TestCaseResult.NOT_RUN:
        return <HourglassEmptyIcon fontSize="small" color="disabled" />;
      default:
        return <HourglassEmptyIcon fontSize="small" color="disabled" />;
    }
  };

  // Sonuç adını formatla
  const formatResult = (result: TestCaseResult): string => {
    switch (result) {
      case TestCaseResult.PASSED: return 'Başarılı';
      case TestCaseResult.FAILED: return 'Başarısız';
      case TestCaseResult.BLOCKED: return 'Engellendi';
      case TestCaseResult.SKIPPED: return 'Atlandı';
      case TestCaseResult.NOT_RUN: return 'Çalıştırılmadı';
      default: return result;
    }
  };

  // Tarihi formatla
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Süreyi formatla
  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} saniye`;
    }

    return `${minutes} dakika ${remainingSeconds} saniye`;
  };

  // Satırı aç/kapat
  const toggleRow = (id: string) => {
    setOpenRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Çalıştırma Geçmişi
      </Typography>

      {isLoading ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : testRuns.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Bu test case için henüz çalıştırma geçmişi bulunmuyor.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="5%"></TableCell>
                <TableCell width="15%">Tarih</TableCell>
                <TableCell width="10%">Sonuç</TableCell>
                <TableCell width="15%">Süre</TableCell>
                <TableCell width="15%">Tarayıcı</TableCell>
                <TableCell width="15%">Ortam</TableCell>
                <TableCell width="25%">Çalıştıran</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testRuns.map((run) => (
                <React.Fragment key={run.id}>
                  <TableRow
                    hover
                    sx={{
                      '& > *': { borderBottom: 'unset' },
                      cursor: 'pointer',
                      bgcolor: openRows[run.id] ? 'action.hover' : 'inherit'
                    }}
                    onClick={() => toggleRow(run.id)}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(run.id);
                        }}
                      >
                        {openRows[run.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{formatDate(run.startTime)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getResultIcon(run.result)}
                        <Typography variant="body2">
                          {formatResult(run.result)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDuration(run.duration)}</TableCell>
                    <TableCell>{run.browser}</TableCell>
                    <TableCell>{run.environment}</TableCell>
                    <TableCell>{run.executedBy}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 0 }}>
                      <Collapse in={openRows[run.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 3, px: 3 }}>
                          <Grid container spacing={3}>
                            {/* Çalıştırma Detayları */}
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="subtitle1" gutterBottom>
                                    Çalıştırma Detayları
                                  </Typography>
                                  <Divider sx={{ mb: 2 }} />

                                  <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                          Başlangıç:
                                        </Typography>
                                        <Typography variant="body2">
                                          {formatDate(run.startTime)}
                                        </Typography>
                                      </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                          Bitiş:
                                        </Typography>
                                        <Typography variant="body2">
                                          {formatDate(run.endTime)}
                                        </Typography>
                                      </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                          Süre:
                                        </Typography>
                                        <Typography variant="body2">
                                          {formatDuration(run.duration)}
                                        </Typography>
                                      </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ComputerIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                          Tarayıcı:
                                        </Typography>
                                        <Typography variant="body2">
                                          {run.browser}
                                        </Typography>
                                      </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PublicIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                          Ortam:
                                        </Typography>
                                        <Typography variant="body2">
                                          {run.environment}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>

                                  {run.errorMessage && (
                                    <Box sx={{ mt: 2 }}>
                                      <Typography variant="subtitle2" color="error" gutterBottom>
                                        Hata Mesajı
                                      </Typography>
                                      <Typography variant="body2" color="error">
                                        {run.errorMessage}
                                      </Typography>
                                    </Box>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>

                            {/* Loglar */}
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                  <Typography variant="subtitle1" gutterBottom>
                                    Loglar
                                  </Typography>
                                  <Divider sx={{ mb: 2 }} />

                                  {run.logs && run.logs.length > 0 ? (
                                    <Box
                                      sx={{
                                        bgcolor: 'background.default',
                                        p: 2,
                                        borderRadius: 1,
                                        maxHeight: 200,
                                        overflow: 'auto',
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem'
                                      }}
                                    >
                                      {run.logs.map((log, index) => (
                                        <Box key={index} sx={{ mb: 0.5 }}>
                                          {log}
                                        </Box>
                                      ))}
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      Log kaydı bulunmuyor
                                    </Typography>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>

                            {/* Ekran Görüntüleri */}
                            {run.screenshots && run.screenshots.length > 0 && (
                              <Grid item xs={12}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                      Ekran Görüntüleri
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                      {run.screenshots.map((screenshot, index) => (
                                        <Button
                                          key={index}
                                          variant="outlined"
                                          size="small"
                                          onClick={() => {
                                            // Gerçek uygulamada burada ekran görüntüsü açılacak
                                            console.log(`Ekran görüntüsü açılıyor: ${screenshot}`);
                                          }}
                                        >
                                          Ekran Görüntüsü {index + 1}
                                        </Button>
                                      ))}
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TestRunHistory;
