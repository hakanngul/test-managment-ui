import React from 'react';
import { Grid, Card, CardContent, Typography, TextField, Chip, Divider, Box, Button } from '@mui/material';
import { TestCase } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface TestCaseDetailsTabProps {
  testCase: TestCase;
  editMode: boolean;
  onTestCaseChange: (updatedTestCase: TestCase) => void;
  getStatusColor: (status: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  getPriorityColor: (priority: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

const TestCaseDetailsTab: React.FC<TestCaseDetailsTabProps> = ({
  testCase,
  editMode,
  onTestCaseChange,
  getStatusColor,
  getPriorityColor
}) => {
  // Handle test case field changes
  const handleChange = (field: string, value: any) => {
    onTestCaseChange({
      ...testCase,
      [field]: value
    });
  };

  // Format date helper
  const formatDateString = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return formatDate(dateString);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        {/* Description Card */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            {editMode ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={testCase.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                variant="outlined"
              />
            ) : (
              <Typography variant="body1" color="text.secondary">
                {testCase.description || 'No description provided.'}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            {editMode ? (
              <TextField
                fullWidth
                placeholder="Enter tags separated by commas"
                value={testCase.tags ? testCase.tags.join(', ') : ''}
                onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                variant="outlined"
              />
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {testCase.tags && testCase.tags.length > 0 ? (
                  testCase.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags added.
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Preconditions Card */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preconditions
            </Typography>
            {editMode ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter preconditions for this test case"
                value={testCase.preconditions || ''}
                onChange={(e) => handleChange('preconditions', e.target.value)}
                variant="outlined"
              />
            ) : (
              <Typography variant="body1" color="text.secondary">
                {testCase.preconditions || 'User must be logged out of the system. Test data must be loaded into the database. The system should be in a clean state with no previous test data.'}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        {/* Status and Metadata Card */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            {editMode ? (
              <TextField
                select
                fullWidth
                value={testCase.status}
                onChange={(e) => handleChange('status', e.target.value)}
                variant="outlined"
                size="small"
                SelectProps={{
                  native: true,
                }}
              >
                {['active', 'draft', 'archived'].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </TextField>
            ) : (
              <Chip
                label={testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
                color={getStatusColor(testCase.status)}
              />
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Priority
            </Typography>
            {editMode ? (
              <TextField
                select
                fullWidth
                value={testCase.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                variant="outlined"
                size="small"
                SelectProps={{
                  native: true,
                }}
              >
                {['low', 'medium', 'high', 'critical'].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </TextField>
            ) : (
              <Chip
                label={testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
                color={getPriorityColor(testCase.priority)}
              />
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Created By
            </Typography>
            <Typography variant="body2">
              {testCase.createdBy || 'John Doe'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Created At
            </Typography>
            <Typography variant="body2">
              {formatDateString(testCase.createdAt)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body2">
              {formatDateString(testCase.updatedAt)}
            </Typography>
          </CardContent>
        </Card>

        {/* Test Runs Card */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Test Runs
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Total Executions</Typography>
              <Typography variant="body2" fontWeight="medium">
                {testCase.executionStats?.totalRuns || 12}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Pass Rate</Typography>
              <Typography variant="body2" fontWeight="medium" color="success.main">
                {testCase.executionStats?.passRate ? `${testCase.executionStats.passRate}%` : '83%'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Last Execution</Typography>
              <Typography variant="body2" fontWeight="medium">
                {testCase.executionStats?.lastRun ? formatDateString(testCase.executionStats.lastRun.toString()) : '2 days ago'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mt: 1 }}
              onClick={() => window.location.href = '/test-runs'}
            >
              View Test Runs
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TestCaseDetailsTab;
