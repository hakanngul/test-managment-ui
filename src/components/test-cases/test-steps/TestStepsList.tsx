import React from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ContentCopy as DuplicateIcon
} from '@mui/icons-material';
import { TestStep } from '../types';

interface TestStepsListProps {
  steps: TestStep[];
  onEdit: (step: TestStep) => void;
  onDelete: (id: string) => void;
  onDuplicate: (step: TestStep) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const TestStepsList: React.FC<TestStepsListProps> = ({
  steps,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown
}) => {
  // Adımları sırala
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="5%">Sıra</TableCell>
            <TableCell width="15%">İşlem</TableCell>
            <TableCell width="40%">Açıklama</TableCell>
            <TableCell width="15%">Seçici</TableCell>
            <TableCell width="15%">Değer</TableCell>
            <TableCell width="10%" align="center">İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSteps.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                  Henüz test adımı eklenmemiş. "Adım Ekle" butonuna tıklayarak test adımları ekleyebilirsiniz.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            sortedSteps.map((step, index) => (
              <TableRow key={step.id}>
                <TableCell>{step.order}</TableCell>
                <TableCell>{step.action}</TableCell>
                <TableCell>{step.description}</TableCell>
                <TableCell>{step.selector || '-'}</TableCell>
                <TableCell>{step.value || '-'}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Düzenle">
                      <IconButton size="small" onClick={() => onEdit(step)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Çoğalt">
                      <IconButton size="small" onClick={() => onDuplicate(step)}>
                        <DuplicateIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Yukarı Taşı">
                      <span>
                        <IconButton 
                          size="small" 
                          onClick={() => onMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUpIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Aşağı Taşı">
                      <span>
                        <IconButton 
                          size="small" 
                          onClick={() => onMoveDown(index)}
                          disabled={index === sortedSteps.length - 1}
                        >
                          <ArrowDownIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton size="small" onClick={() => onDelete(step.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TestStepsList;
