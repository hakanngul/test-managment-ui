import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface TestCaseRelatedIssuesTabProps {
  issues?: any[];
  onLinkIssue: () => void;
}

const TestCaseRelatedIssuesTab: React.FC<TestCaseRelatedIssuesTabProps> = ({
  issues = [],
  onLinkIssue
}) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Related Issues
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
            onClick={onLinkIssue}
          >
            Link Issue
          </Button>
        </Box>

        {issues.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No issues are linked to this test case.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              onClick={onLinkIssue}
            >
              Link an Issue
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Issue list would go here */}
            <Typography>Issues would be displayed here</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseRelatedIssuesTab;
