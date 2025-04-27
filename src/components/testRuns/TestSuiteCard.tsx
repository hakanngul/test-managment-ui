import React from 'react';
import { Box, Card, Typography, Chip, LinearProgress, Grid } from '@mui/material';
import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface TestSuiteResults {
  passed: number;
  failed: number;
  blocked: number;
  pending: number;
}

interface TestSuiteProps {
  id: string;
  name: string;
  dateRange?: string;
  status: string;
  progress: number;
  assignee: string;
  results: TestSuiteResults;
  onClick: (id: string) => void;
}

const TestSuiteCard: React.FC<TestSuiteProps> = ({
  id,
  name,
  dateRange,
  status,
  progress,
  assignee,
  results,
  onClick,
}) => {
  // Helper functions
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'passed':
        return <Chip label="Passed" color="success" size="small" sx={{ fontWeight: 500 }} />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" sx={{ fontWeight: 500 }} />;
      case 'in_progress':
        return <Chip label="In Progress" color="primary" size="small" sx={{ fontWeight: 500 }} />;
      case 'pending':
        return <Chip label="Pending" color="default" size="small" sx={{ fontWeight: 500 }} />;
      default:
        return null;
    }
  };

  // Get color for result type
  const getResultColor = (type: string) => {
    switch (type) {
      case 'passed': return 'success.main';
      case 'failed': return 'error.main';
      case 'blocked': return 'warning.main';
      case 'pending': return 'text.secondary';
      default: return 'text.primary';
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        '&:hover': { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
        cursor: 'pointer',
      }}
      onClick={() => onClick(id)}
    >
      <Box sx={{ p: 2 }}>
        {/* Title and expand icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <KeyboardArrowRightIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="subtitle1" fontWeight="500">
            {name}
          </Typography>
        </Box>

        {/* Date range */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 4 }}>
          <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {dateRange}
          </Typography>
        </Box>

        {/* Status chip */}
        <Box sx={{ ml: 4, mb: 2 }}>
          {getStatusChip(status)}
        </Box>

        {/* Progress section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Progress
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {progress}%
          </Typography>
        </Box>

        {/* Progress bar */}
        <Box sx={{ mx: 4, mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: status === 'failed' ? 'error.main' :
                        status === 'passed' ? 'success.main' : 'primary.main'
              }
            }}
          />
        </Box>

        {/* Assignee */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Assignee:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2">
              {assignee}
            </Typography>
          </Box>
        </Box>

        {/* Results grid */}
        <Grid container spacing={2} sx={{ ml: 2 }}>
          <Grid item xs={3}>
            <Typography variant="h6" color={getResultColor('passed')} align="center">
              {results.passed}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Passed
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color={getResultColor('failed')} align="center">
              {results.failed}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Failed
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color={getResultColor('blocked')} align="center">
              {results.blocked}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Blocked
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color={getResultColor('pending')} align="center">
              {results.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Pending
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default TestSuiteCard;
