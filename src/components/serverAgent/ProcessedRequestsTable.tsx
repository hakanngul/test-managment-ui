import React from 'react';
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { ProcessedRequest } from '../../models';

interface ProcessedRequestsTableProps {
  requests: ProcessedRequest[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProcessedRequestsTable: React.FC<ProcessedRequestsTableProps> = ({
  requests,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const target = {
      value: event.target.value.toString()
    } as React.ChangeEvent<HTMLInputElement>;

    onRowsPerPageChange(target);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl variant="outlined" size="small" sx={{ width: 150 }}>
          <InputLabel id="rows-per-page-label">Sayfa başına göster</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            label="Sayfa başına göster"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İstek ID</TableCell>
              <TableCell>Test Adı</TableCell>
              <TableCell>Tarayıcı</TableCell>
              <TableCell>Agent ID</TableCell>
              <TableCell>Başlangıç</TableCell>
              <TableCell>Süre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length > 0 ? (
              requests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.testName}</TableCell>
                    <TableCell>{request.browser}</TableCell>
                    <TableCell>{request.agentId}</TableCell>
                    <TableCell>{request.startTime.toLocaleString('tr-TR')}</TableCell>
                    <TableCell>{request.duration}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    İşlenen istek bulunmuyor
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={requests.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelDisplayedRows={({ from, to, count }) => `Gösterilen: ${from}-${to} / ${count}`}
        labelRowsPerPage=""
      />
    </>
  );
};

export default ProcessedRequestsTable;
