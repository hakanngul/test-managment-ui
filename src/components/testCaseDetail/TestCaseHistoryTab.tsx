import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import { TestCase, TestResult } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import api from '../../services/api';

interface TestCaseHistoryTabProps {
  testCase: TestCase;
}

const TestCaseHistoryTab: React.FC<TestCaseHistoryTabProps> = ({
  testCase
}) => {
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test history
  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        setLoading(true);
        const history = await api.getTestHistoryByTestCase(testCase.id);
        setTestHistory(history);
        setError(null);
      } catch (err) {
        console.error('Error fetching test history:', err);
        setError('Failed to load test history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestHistory();
  }, [testCase.id]);

  // Format date helper
  const formatDateString = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return formatDate(dateString);
  };

  // Format duration helper (milliseconds to readable format)
  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';

    if (duration < 1000) {
      return `${duration}ms`;
    } else if (duration < 60000) {
      return `${(duration / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(duration / 60000);
      const seconds = ((duration % 60000) / 1000).toFixed(0);
      return `${minutes}m ${seconds}s`;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'skipped': return 'warning';
      case 'blocked': return 'default';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Case History
        </Typography>

        {/* Test Case Creation and Update History */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Test Case Changes
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">
              Created on {formatDateString(testCase.createdAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Test case created by {testCase.createdBy || 'Admin'}
            </Typography>
          </Paper>
          {testCase.updatedAt && testCase.updatedAt !== testCase.createdAt && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2,
              }}
            >
              <Typography variant="subtitle2">
                Updated on {formatDateString(testCase.updatedAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Test case updated by {testCase.updatedBy || 'Admin'}
              </Typography>
            </Paper>
          )}
          {testCase.steps && testCase.steps.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2">
                Test Steps
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testCase.steps.length} steps defined
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Test Execution History */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Test Execution History
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : error ? (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'error.light',
                color: 'error.contrastText',
                border: '1px solid',
                borderColor: 'error.main',
              }}
            >
              <Typography variant="body2">{error}</Typography>
            </Paper>
          ) : testHistory.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No test execution history available.
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Test Execution Summary */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2">
                  Last Run: {formatDateString(testHistory[0]?.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Runs: {testHistory.length},
                  Pass Rate: {Math.round((testHistory.filter(result => result.status === 'passed').length / testHistory.length) * 100)}%
                </Typography>
              </Paper>

              {/* Test Execution Table */}
              <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Environment</TableCell>
                      <TableCell>Browser</TableCell>
                      <TableCell>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testHistory.map((result) => (
                      <TableRow key={result.id} hover>
                        <TableCell>{formatDateString(result.createdAt)}</TableCell>
                        <TableCell>
                          <Chip
                            label={result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                            color={getStatusColor(result.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDuration(result.duration)}</TableCell>
                        <TableCell>{result.environment || 'N/A'}</TableCell>
                        <TableCell>{result.browser || 'N/A'}</TableCell>
                        <TableCell>
                          {result.errorMessage ? (
                            <Typography variant="body2" color="error" noWrap sx={{ maxWidth: 200 }}>
                              {result.errorMessage}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestCaseHistoryTab;
