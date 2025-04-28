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

// Test çalıştırma geçmişi için arayüz
interface TestRun {
  id: string;
  testCaseId: string;
  result: TestCaseResult;
  startTime: Date;
  endTime: Date;
  duration: number; // milisaniye cinsinden
  browser: string;
  environment: string;
  executedBy: string;
  errorMessage?: string;
  logs?: string[];
  screenshots?: string[];
}

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
          const mockTestRuns: TestRun[] = [
            {
              id: 'run-001',
              testCaseId,
              result: TestCaseResult.PASSED,
              startTime: new Date('2023-06-18T09:10:00'),
              endTime: new Date('2023-06-18T09:15:00'),
              duration: 300000, // 5 dakika
              browser: 'Chrome',
              environment: 'Production',
              executedBy: 'Hakan Gül',
              logs: [
                '09:10:00 - Test başlatıldı',
                '09:10:05 - Adım 1 başarıyla tamamlandı',
                '09:10:30 - Adım 2 başarıyla tamamlandı',
                '09:11:15 - Adım 3 başarıyla tamamlandı',
                '09:12:00 - Adım 4 başarıyla tamamlandı',
                '09:13:45 - Adım 5 başarıyla tamamlandı',
                '09:15:00 - Test başarıyla tamamlandı'
              ],
              screenshots: [
                'screenshot-1.png',
                'screenshot-2.png'
              ]
            },
            {
              id: 'run-002',
              testCaseId,
              result: TestCaseResult.FAILED,
              startTime: new Date('2023-06-15T14:20:00'),
              endTime: new Date('2023-06-15T14:25:00'),
              duration: 300000, // 5 dakika
              browser: 'Firefox',
              environment: 'Staging',
              executedBy: 'Ahmet Yılmaz',
              errorMessage: 'Element bulunamadı: #login-button',
              logs: [
                '14:20:00 - Test başlatıldı',
                '14:20:05 - Adım 1 başarıyla tamamlandı',
                '14:20:30 - Adım 2 başarıyla tamamlandı',
                '14:21:15 - Adım 3 başarıyla tamamlandı',
                '14:22:00 - HATA: Element bulunamadı: #login-button',
                '14:25:00 - Test başarısız oldu'
              ],
              screenshots: [
                'error-screenshot.png'
              ]
            },
            {
              id: 'run-003',
              testCaseId,
              result: TestCaseResult.BLOCKED,
              startTime: new Date('2023-06-10T11:30:00'),
              endTime: new Date('2023-06-10T11:32:00'),
              duration: 120000, // 2 dakika
              browser: 'Chrome',
              environment: 'Development',
              executedBy: 'Mehmet Demir',
              errorMessage: 'Test ortamına erişilemiyor',
              logs: [
                '11:30:00 - Test başlatıldı',
                '11:30:05 - HATA: Test ortamına erişilemiyor',
                '11:32:00 - Test engellendi'
              ]
            }
          ];
          
          setTestRuns(mockTestRuns);
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
