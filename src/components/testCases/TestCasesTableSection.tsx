import React, { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TestCase } from '../../types';
import TestCasesTable from './TestCasesTable';
import EmptyState from './EmptyState';

interface TestCasesTableSectionProps {
  testCases: TestCase[];
  searchQuery: string;
  selectedStatusFilter: string;
  selectedPriorityFilter: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  formatDate: (date: string | Date) => string;
  getPriorityColor: (priority: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  getStatusColor: (status: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

const TestCasesTableSection: React.FC<TestCasesTableSectionProps> = ({
  testCases,
  searchQuery,
  selectedStatusFilter,
  selectedPriorityFilter,
  sortBy,
  sortDirection,
  formatDate,
  getPriorityColor,
  getStatusColor
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter test cases
  const filteredTestCases = testCases
    .filter(testCase => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          testCase.title.toLowerCase().includes(query) ||
          testCase.description.toLowerCase().includes(query) ||
          (testCase.tags && testCase.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      return true;
    })
    .filter(testCase => {
      // Apply status filter
      if (selectedStatusFilter !== 'all') {
        return testCase.status === selectedStatusFilter;
      }
      return true;
    })
    .filter(testCase => {
      // Apply priority filter
      if (selectedPriorityFilter !== 'all') {
        return testCase.priority === selectedPriorityFilter;
      }
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - 
                      (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'updatedAt':
        default:
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle row click
  const handleViewTestCase = (id: string) => {
    navigate(`/test-cases/${id}`);
  };

  // Check if we have any test cases after filtering
  const hasFilteredTestCases = filteredTestCases.length > 0;
  const hasSearchOrFilter = searchQuery.length > 0 || selectedStatusFilter !== 'all' || selectedPriorityFilter !== 'all';

  return (
    <>
      {!hasFilteredTestCases ? (
        <EmptyState hasSearchQuery={hasSearchOrFilter} />
      ) : (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <TestCasesTable
              testCases={filteredTestCases}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              onRowClick={handleViewTestCase}
              formatDate={formatDate}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TestCasesTableSection;
