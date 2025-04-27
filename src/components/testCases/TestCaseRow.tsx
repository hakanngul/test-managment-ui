import React from 'react';
import { 
  TableRow, 
  TableCell, 
  Typography, 
  Chip, 
  Box, 
  IconButton 
} from '@mui/material';
import { MoreVert as MoreIcon } from '@mui/icons-material';
import { TestCase } from '../../types';

interface TestCaseRowProps {
  testCase: TestCase;
  onRowClick: (id: string) => void;
  formatDate: (dateString: string) => string;
  getPriorityColor: (priority: string) => "success" | "warning" | "default" | "primary" | "secondary" | "error" | "info";
  getStatusColor: (status: string) => "success" | "warning" | "default" | "primary" | "secondary" | "error" | "info";
}

const TestCaseRow: React.FC<TestCaseRowProps> = ({
  testCase,
  onRowClick,
  formatDate,
  getPriorityColor,
  getStatusColor
}) => {
  return (
    <TableRow
      key={testCase.id}
      hover
      onClick={() => onRowClick(testCase.id)}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          {testCase.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {testCase.description.substring(0, 100)}
          {testCase.description.length > 100 ? '...' : ''}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
          size="small"
          color={getPriorityColor(testCase.priority)}
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Chip
          label={testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
          size="small"
          color={getStatusColor(testCase.status)}
        />
      </TableCell>
      <TableCell>{formatDate(testCase.updatedAt)}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {testCase.tags.slice(0, 2).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.75rem' }}
            />
          ))}
          {testCase.tags.length > 2 && (
            <Chip
              label={`+${testCase.tags.length - 2}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.75rem' }}
            />
          )}
        </Box>
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            // Handle menu open
          }}
        >
          <MoreIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default TestCaseRow;
