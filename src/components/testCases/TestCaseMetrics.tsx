import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import {
  CheckCircleOutline as PassedIcon,
  ErrorOutline as FailedIcon,
  HourglassEmpty as PendingIcon,
  Block as BlockedIcon,
  Assignment as TotalIcon,
  Flag as PriorityIcon,
  LocalOffer as TagIcon
} from '@mui/icons-material';

interface TestCaseMetricsProps {
  totalCount: number;
  activeCount: number;
  draftCount: number;
  archivedCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  passRate: number;
  mostUsedTags: { tag: string; count: number }[];
}

const TestCaseMetrics: React.FC<TestCaseMetricsProps> = ({
  totalCount,
  activeCount,
  draftCount,
  archivedCount,
  criticalCount,
  highCount,
  mediumCount,
  lowCount,
  passRate,
  mostUsedTags
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Test Case Status */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Test Case Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TotalIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Total: <strong>{totalCount}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Chip
                label={`Active: ${activeCount}`}
                size="small"
                color="success"
                variant="outlined"
              />
              <Chip
                label={`Draft: ${draftCount}`}
                size="small"
                color="warning"
                variant="outlined"
              />
              <Chip
                label={`Archived: ${archivedCount}`}
                size="small"
                color="default"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Test Case Priority */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Test Case Priority
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Chip
                label={`Critical: ${criticalCount}`}
                size="small"
                color="error"
                variant="outlined"
                icon={<PriorityIcon />}
              />
              <Chip
                label={`High: ${highCount}`}
                size="small"
                color="warning"
                variant="outlined"
                icon={<PriorityIcon />}
              />
              <Chip
                label={`Medium: ${mediumCount}`}
                size="small"
                color="info"
                variant="outlined"
                icon={<PriorityIcon />}
              />
              <Chip
                label={`Low: ${lowCount}`}
                size="small"
                color="success"
                variant="outlined"
                icon={<PriorityIcon />}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Popular Tags */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Popular Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {mostUsedTags.map((tagItem, index) => (
                <Chip
                  key={index}
                  label={`${tagItem.tag} (${tagItem.count})`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<TagIcon />}
                />
              ))}
              {mostUsedTags.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No tags found
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TestCaseMetrics;
