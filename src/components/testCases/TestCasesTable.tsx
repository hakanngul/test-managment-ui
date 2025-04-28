import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography
} from '@mui/material';
import { TestCase } from '../../types';
import TestCaseRow from './TestCaseRow';

interface TestCasesTableProps {
  testCases: TestCase[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick: (id: string) => void;
  formatDate: (dateString: string) => string;
  getPriorityColor: (priority: string) => "success" | "warning" | "default" | "primary" | "secondary" | "error" | "info";
  getStatusColor: (status: string) => "success" | "warning" | "default" | "primary" | "secondary" | "error" | "info";
}

const TestCasesTable: React.FC<TestCasesTableProps> = ({
  testCases,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  formatDate,
  getPriorityColor,
  getStatusColor
}) => {
  const paginatedTestCases = testCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, testCases.length - page * rowsPerPage);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Case</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTestCases.map((testCase) => (
              <TestCaseRow
                key={testCase.id}
                testCase={testCase}
                onRowClick={onRowClick}
                formatDate={formatDate}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
              />
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 73 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}

            {testCases.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No test cases found matching your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={testCases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage="Rows:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
      </Box>
    </>
  );
};

export default TestCasesTable;
