import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
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
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
  };

  const handleRunTest = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log(`Run test: ${testCase.id}`);
    setMenuAnchorEl(null);
  };

  const handleEditTest = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log(`Edit test: ${testCase.id}`);
    setMenuAnchorEl(null);
  };

  const handleDuplicateTest = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log(`Duplicate test: ${testCase.id}`);
    setMenuAnchorEl(null);
  };

  const handleDeleteTest = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log(`Delete test: ${testCase.id}`);
    setMenuAnchorEl(null);
  };

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
          {testCase.tags && testCase.tags.length > 0 ? (
            <>
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
            </>
          ) : (
            <Typography variant="caption" color="text.secondary">
              No tags
            </Typography>
          )}
        </Box>
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={handleMenuClick}
          aria-label="more options"
        >
          <MoreIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleRunTest}>
            <ListItemIcon>
              <PlayIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Run Test</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleEditTest}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDuplicateTest}>
            <ListItemIcon>
              <CopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteTest}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

export default TestCaseRow;
