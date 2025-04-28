import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import api from '../services/api';
import { TestCase } from '../types';
import {
  TestCaseDetailHeader,
  TestCaseDetailTabs,
  TestCaseDetailsTab,
  TestCaseStepsTab,
  TestCaseHistoryTab,
  TestCaseRelatedIssuesTab
} from '../components/testCaseDetail';
import { formatDate } from '../utils/dateUtils';

const TestCaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Fetch test case data from API
  useEffect(() => {
    const fetchTestCase = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch test case by ID directly from API
        const testCaseData = await api.getTestCaseById(id).catch(error => {
          console.error('Error fetching test case by ID:', error);
          return null;
        });

        if (testCaseData) {
          setTestCase(testCaseData);
          setError(null);
        } else {
          setError(`Test case with ID ${id} not found.`);
          setTestCase(null);
        }
      } catch (err) {
        console.error('Error fetching test case:', err);
        setError('Failed to load test case. Please try again later.');
        setTestCase(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCase();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!testCase) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="warning">Test case not found</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/test-cases')}
        >
          Back to Test Cases
        </Button>
      </Box>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };



  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(testCase.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each step
    const updatedSteps = items.map((step, index) => ({
      ...step,
      order: index + 1,
    }));

    setTestCase({
      ...testCase,
      steps: updatedSteps,
    });
  };

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle edit toggle
  const handleEditToggle = async () => {
    if (editMode && testCase) {
      try {
        // Save changes to the API
        await api.updateTestCase(testCase.id, testCase);

        // Fetch the updated test case
        const updatedTestCase = await api.getTestCaseById(testCase.id);
        setTestCase(updatedTestCase);

        console.log('Test case updated successfully:', updatedTestCase);
      } catch (error) {
        console.error('Error updating test case:', error);
        setError('Failed to update test case. Please try again later.');
      }
    }
    setEditMode(!editMode);
  };

  // Handle delete test case
  const handleDeleteTestCase = async () => {
    if (!testCase) return;

    if (window.confirm(`Are you sure you want to delete the test case "${testCase.title}"?`)) {
      try {
        const response = await api.deleteTestCase(testCase.id);
        console.log('Test case deleted successfully:', response);

        // Başarılı silme işleminden sonra test-cases sayfasına yönlendir
        if (response && response.success) {
          navigate('/test-cases');
        } else {
          // Yanıt başarılı değilse hata göster
          setError('Failed to delete test case. Unexpected response from server.');
        }
      } catch (error) {
        console.error('Error deleting test case:', error);
        setError('Failed to delete test case. Please try again later.');
      }
    }
  };

  // Handle run test
  const handleRunTest = () => {
    console.log('Running test:', testCase?.id);
    // Implement test run logic here
    alert(`Test ${testCase?.title} would be run now.`);
  };

  // Handle link issue
  const handleLinkIssue = () => {
    console.log('Linking issue to test case:', testCase?.id);
    // Implement issue linking logic here
    alert('Issue linking functionality would be implemented here.');
  };

  // Handle test case change
  const handleTestCaseChange = (updatedTestCase: TestCase) => {
    setTestCase(updatedTestCase);
  };

  return (
    <Box>
      {/* Header */}
      <TestCaseDetailHeader
        testCase={testCase}
        editMode={editMode}
        onEditToggle={handleEditToggle}
        onDeleteTestCase={handleDeleteTestCase}
        onRunTest={handleRunTest}
      />

      {/* Tabs */}
      <TestCaseDetailTabs
        tabValue={tabValue}
        onTabChange={handleTabChange}
      />

      {/* Tab Content */}
      {tabValue === 0 && (
        <TestCaseDetailsTab
          testCase={testCase}
          editMode={editMode}
          onTestCaseChange={handleTestCaseChange}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
        />
      )}

      {tabValue === 1 && (
        <TestCaseStepsTab
          testCase={testCase}
          editMode={editMode}
          onTestCaseChange={handleTestCaseChange}
        />
      )}

      {tabValue === 2 && (
        <TestCaseHistoryTab
          testCase={testCase}
        />
      )}

      {tabValue === 3 && (
        <TestCaseRelatedIssuesTab
          onLinkIssue={handleLinkIssue}
        />
      )}
    </Box>
  );
};

export default TestCaseDetail;