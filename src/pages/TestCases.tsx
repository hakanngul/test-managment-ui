import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Snackbar, Alert } from '@mui/material';
import TestCasesToolbar from '../components/test-cases/TestCasesToolbar';
import TestCasesList from '../components/test-cases/TestCasesList';
import { mockTestCases, filterTestCases } from '../mock/testCasesMock';
import { TestCase, TestCaseStatus, TestCasePriority, TestCaseCategory } from '../models/interfaces/ITestCase';
import { testRunnerService } from '../services/TestRunnerService';
import { BrowserType } from '../models/enums/TestEnums';

const TestCases: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [runningTests, setRunningTests] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    status: TestCaseStatus[];
    priority: TestCasePriority[];
    category: TestCaseCategory[];
    automated: boolean | undefined;
    tags: string[];
  }>({
    status: [],
    priority: [],
    category: [],
    automated: undefined,
    tags: []
  });

  // Test case'leri yükle
  useEffect(() => {
    // API'den veri çekme simülasyonu
    const fetchTestCases = async () => {
      setIsLoading(true);
      try {
        // Gerçek uygulamada burada API çağrısı yapılacak
        setTimeout(() => {
          setTestCases(mockTestCases);
          setFilteredTestCases(mockTestCases);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Test case\'leri yüklerken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    fetchTestCases();
  }, []);

  // Filtreleme işlemi
  useEffect(() => {
    const filtered = filterTestCases(testCases, {
      search: searchTerm,
      status: filters.status.length > 0 ? filters.status : undefined,
      priority: filters.priority.length > 0 ? filters.priority : undefined,
      category: filters.category.length > 0 ? filters.category : undefined,
      automated: filters.automated,
      tags: filters.tags.length > 0 ? filters.tags : undefined
    });
    setFilteredTestCases(filtered);
  }, [testCases, searchTerm, filters]);

  // Test case seçme işlemi
  const handleSelectTestCase = (id: string) => {
    setSelectedTestCases(prev => {
      if (prev.includes(id)) {
        return prev.filter(testCaseId => testCaseId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Tüm test case'leri seçme/seçimi kaldırma
  const handleSelectAllTestCases = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTestCases(filteredTestCases.map(tc => tc.id));
    } else {
      setSelectedTestCases([]);
    }
  };

  // Dummy onNewTestCase fonksiyonu (artık kullanılmıyor, navigate ile değiştirildi)
  const handleOpenNewTestCase = () => {
    // Bu fonksiyon artık kullanılmıyor, sadece prop geçmek için burada
    console.log('Bu fonksiyon artık kullanılmıyor');
  };

  // Test case'i sil
  const handleDeleteTestCases = () => {
    // Gerçek uygulamada burada API çağrısı yapılacak
    setTestCases(prev => prev.filter(tc => !selectedTestCases.includes(tc.id)));
    setSelectedTestCases([]);
  };

  // Test case'i çalıştır
  const handleRunTestCase = async (id: string) => {
    try {
      // Zaten çalışıyorsa uyarı ver
      if (runningTests.includes(id)) {
        setSnackbar({
          open: true,
          message: 'Bu test zaten çalışıyor veya kuyruğa alınmış.',
          severity: 'warning'
        });
        return;
      }

      // Çalışan testler listesine ekle
      setRunningTests(prev => [...prev, id]);

      // Test case'i bul
      const testCase = testCases.find(tc => tc.id === id);
      if (!testCase) {
        throw new Error('Test case bulunamadı');
      }

      // Test çalıştırma isteği oluştur
      const testRunRequest = {
        id: `run-${Date.now()}-${id}`,
        name: testCase.name,
        description: testCase.description || '',
        browserSettings: {
          browser: 'chrome',
          headless: true,
          width: 1280,
          height: 720,
          timeout: 30000
        },
        steps: testCase.steps || [],
        testCaseId: id,
        priority: testCase.priority || 'medium',
        tags: testCase.tags || []
      };

      // Test çalıştırma isteği gönder
      const response = await testRunnerService.runTest({
        ...testRunRequest,
        browserSettings: {
          ...testRunRequest.browserSettings,
          browser: BrowserType.CHROME
        }
      });

      // Başarılı yanıt
      setSnackbar({
        open: true,
        message: `Test "${testCase.name}" başarıyla kuyruğa alındı. Kuyruk pozisyonu: ${response.queuePosition || 'N/A'}`,
        severity: 'success'
      });

      // Test case'in durumunu güncelle
      setTestCases(prev => prev.map(tc => {
        if (tc.id === id) {
          return { ...tc, status: TestCaseStatus.RUNNING };
        }
        return tc;
      }));

      // 5 saniye sonra çalışan testler listesinden çıkar (gerçek uygulamada bu webhook veya polling ile yapılır)
      setTimeout(() => {
        setRunningTests(prev => prev.filter(testId => testId !== id));

        // Test case'in durumunu güncelle
        setTestCases(prev => prev.map(tc => {
          if (tc.id === id) {
            return { ...tc, status: TestCaseStatus.COMPLETED };
          }
          return tc;
        }));
      }, 5000);

    } catch (error) {
      console.error('Test çalıştırma hatası:', error);

      // Hata mesajı göster
      setSnackbar({
        open: true,
        message: `Test çalıştırılırken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        severity: 'error'
      });

      // Çalışan testler listesinden çıkar
      setRunningTests(prev => prev.filter(testId => testId !== id));
    }
  };

  // Snackbar'ı kapat
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Arama terimini güncelle
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Filtreleri güncelle
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Test Cases
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: 0,
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
          }}
        >
          <TestCasesToolbar
            selectedCount={selectedTestCases.length}
            selectedTestCases={selectedTestCases}
            onNewTestCase={handleOpenNewTestCase}
            onDeleteTestCases={handleDeleteTestCases}
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <TestCasesList
            testCases={filteredTestCases}
            selectedTestCases={selectedTestCases}
            onSelectTestCase={handleSelectTestCase}
            onSelectAllTestCases={handleSelectAllTestCases}
            onRunTestCase={handleRunTestCase}
            isLoading={isLoading}
            runningTests={runningTests}
          />
        </Paper>
      </Box>

      {/* Bildirim */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TestCases;
