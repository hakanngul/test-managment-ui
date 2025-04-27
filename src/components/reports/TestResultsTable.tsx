import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { MoreVert as MoreIcon } from '@mui/icons-material';

interface TestResult {
  id: string;
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  lastRun: string;
}

interface TestResultsTableProps {
  title: string;
  results: TestResult[];
  onViewAll?: () => void;
  onViewDetails?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
}

const TestResultsTable: React.FC<TestResultsTableProps> = ({
  title,
  results,
  onViewAll,
  onViewDetails,
  onDownload,
  onShare
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedId(null);
  };

  const handleViewDetails = () => {
    if (selectedId && onViewDetails) {
      onViewDetails(selectedId);
    }
    handleMenuClose();
  };

  const handleDownload = () => {
    if (selectedId && onDownload) {
      onDownload(selectedId);
    }
    handleMenuClose();
  };

  const handleShare = () => {
    if (selectedId && onShare) {
      onShare(selectedId);
    }
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {title}
        </Typography>
        {onViewAll && (
          <Button color="primary" size="small" onClick={onViewAll}>
            View All
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Suite</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Passed</TableCell>
              <TableCell align="right">Failed</TableCell>
              <TableCell align="right">Skipped</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.name}</TableCell>
                <TableCell align="right">{result.total}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={result.passed}
                    size="small"
                    color="success"
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={result.failed}
                    size="small"
                    color="error"
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={result.skipped}
                    size="small"
                    color="warning"
                  />
                </TableCell>
                <TableCell>{result.duration}</TableCell>
                <TableCell>{result.lastRun}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, result.id)}
                  >
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
        <MenuItem onClick={handleDownload}>Download Report</MenuItem>
        <MenuItem onClick={handleShare}>Share</MenuItem>
      </Menu>
    </Box>
  );
};

export default TestResultsTable;
