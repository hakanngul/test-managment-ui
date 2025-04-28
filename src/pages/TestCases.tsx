import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import TestCasesToolbar from '../components/test-cases/TestCasesToolbar';
import TestCasesList from '../components/test-cases/TestCasesList';
import { mockTestCases, filterTestCases } from '../mock/testCasesMock';
import { TestCase, TestCaseStatus, TestCasePriority, TestCaseCategory } from '../models/interfaces/ITestCase';

const TestCases: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
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
  const handleRunTestCase = (id: string) => {
    // Gerçek uygulamada burada API çağrısı yapılacak
    console.log(`Test case ${id} çalıştırılıyor...`);
    // Burada test case'in durumunu güncelleyebilirsiniz
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
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default TestCases;
