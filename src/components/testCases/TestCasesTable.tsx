import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper
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

  return (
    <Paper sx={{ width: '100%', borderRadius: 2 }}>
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
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={testCases.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default TestCasesTable;
