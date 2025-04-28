import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';
import { useTestCasesData } from './TestCasesDataProvider';
import LoadingState from './LoadingState';
import TestCasesMetricsSection from './TestCasesMetricsSection';
import TestCasesFilterSection from './TestCasesFilterSection';
import TestCasesTableSection from './TestCasesTableSection';

/**
 * TestCases sayfasının içerik bileşeni
 * Veri sağlayıcı tarafından sağlanan verileri kullanarak sayfayı oluşturur
 */
const TestCasesContent: React.FC = () => {
  const { loading, error, testCases } = useTestCasesData();
  
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get priority color
  const getPriorityColor = (priority: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* Metrics Section */}
          <TestCasesMetricsSection />

          {/* Filter Section */}
          <TestCasesFilterSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatusFilter={selectedStatusFilter}
            setSelectedStatusFilter={setSelectedStatusFilter}
            selectedPriorityFilter={selectedPriorityFilter}
            setSelectedPriorityFilter={setSelectedPriorityFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />

          {/* Table Section */}
          <TestCasesTableSection
            testCases={testCases}
            searchQuery={searchQuery}
            selectedStatusFilter={selectedStatusFilter}
            selectedPriorityFilter={selectedPriorityFilter}
            sortBy={sortBy}
            sortDirection={sortDirection}
            formatDate={formatDate}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
        </>
      )}
    </Box>
  );
};

export default TestCasesContent;
