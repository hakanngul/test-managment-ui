import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { useTestSuites } from '../hooks/useApi';
import api from '../services_old/api';
import {
  PageHeader,
  TestSuiteCard,
  EmptyState,
  LoadingState,
  NewTestRunDialog
} from '../components/testRuns';

interface TestSuite {
  id: string;
  name: string;
  dateRange?: string;
  status: string;
  progress: number;
  assignee: string;
  results: {
    passed: number;
    failed: number;
    blocked: number;
    pending: number;
  };
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

const TestRuns: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [newRunDialogOpen, setNewRunDialogOpen] = useState(false);
  const [newRunData, setNewRunData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    assignee: '',
  });

  // Fetch test suites from API
  const { data: testSuites, loading: isLoading, error } = useTestSuites();
  const [formattedTestSuites, setFormattedTestSuites] = useState<TestSuite[]>([]);

  // Format test suites data
  useEffect(() => {
    if (testSuites) {
      const formatted = testSuites.map((suite: any) => {
        // Calculate date range from startDate and endDate
        let dateRange = '';
        if (suite.startDate && suite.endDate) {
          const start = new Date(suite.startDate);
          const end = new Date(suite.endDate);
          dateRange = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }

        return {
          ...suite,
          dateRange: suite.dateRange || dateRange
        };
      });

      setFormattedTestSuites(formatted);
    }
  }, [testSuites]);

  // Filter test suites based on search query
  const filteredTestSuites = formattedTestSuites.filter(suite =>
    suite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suite.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle new test run dialog
  const handleOpenNewRunDialog = () => {
    navigate('/test-runs/create');
  };

  const handleCloseNewRunDialog = () => {
    setNewRunDialogOpen(false);
  };

  const handleNewRunChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewRunData({
        ...newRunData,
        [name]: value,
      });
    }
  };

  const handleCreateNewRun = async () => {
    try {
      // Create new test run object
      const newTestRun = {
        name: newRunData.name,
        startDate: newRunData.startDate,
        endDate: newRunData.endDate,
        assignee: newRunData.assignee,
        status: 'pending',
        progress: 0,
        results: {
          passed: 0,
          failed: 0,
          blocked: 0,
          pending: 0
        },
        createdAt: new Date().toISOString()
      };

      // Send to API
      await api.createTestSuite(newTestRun);

      // Close dialog and reset form
      handleCloseNewRunDialog();
      setNewRunData({
        name: '',
        startDate: '',
        endDate: '',
        assignee: '',
      });

      // Navigate to test runs page
      navigate('/test-runs');
    } catch (error) {
      console.error('Error creating test run:', error);
    }
  };

  // Handle test suite click
  const handleTestSuiteClick = (id: string) => {
    navigate(`/test-runs/${id}`);
  };

  return (
    <Box>
      {/* Header with search and new button */}
      <PageHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onNewTestRunClick={handleOpenNewRunDialog}
      />

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Error State */}
      {error && !isLoading && (
        <EmptyState
          hasSearchQuery={false}
          onCreateClick={handleOpenNewRunDialog}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredTestSuites.length === 0 && (
        <EmptyState
          hasSearchQuery={searchQuery.length > 0}
          onCreateClick={handleOpenNewRunDialog}
        />
      )}

      {/* Test Suite Cards */}
      <Stack spacing={2}>
        {!isLoading && !error && filteredTestSuites.map((suite) => (
          <TestSuiteCard
            key={suite.id}
            id={suite.id}
            name={suite.name}
            dateRange={suite.dateRange}
            status={suite.status}
            progress={suite.progress}
            assignee={suite.assignee}
            results={suite.results}
            onClick={handleTestSuiteClick}
          />
        ))}
      </Stack>

      {/* New Test Run Dialog */}
      <NewTestRunDialog
        open={newRunDialogOpen}
        data={newRunData}
        onClose={handleCloseNewRunDialog}
        onChange={handleNewRunChange}
        onSubmit={handleCreateNewRun}
      />
    </Box>
  );
};

export default TestRuns;
