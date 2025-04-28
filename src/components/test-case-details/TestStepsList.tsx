import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  HourglassEmpty as HourglassEmptyIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Image as ImageIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { TestStep, TestStepStatus } from '../../models/interfaces/ITestCase';

interface TestStepsListProps {
  steps: TestStep[];
}

const TestStepsList: React.FC<TestStepsListProps> = ({ steps }) => {
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [screenshotDialog, setScreenshotDialog] = useState<{
    open: boolean;
    url: string;
  }>({
    open: false,
    url: ''
  });

  // Adım durumuna göre ikon ve renk belirle
  const getStatusIcon = (status?: TestStepStatus) => {
    if (!status) return <HourglassEmptyIcon fontSize="small" color="disabled" />;

    switch (status) {
      case TestStepStatus.PASSED:
        return <CheckCircleIcon fontSize="small" color="success" />;
      case TestStepStatus.FAILED:
        return <CancelIcon fontSize="small" color="error" />;
      case TestStepStatus.BLOCKED:
        return <BlockIcon fontSize="small" color="warning" />;
      case TestStepStatus.SKIPPED:
        return <WarningIcon fontSize="small" color="info" />;
      case TestStepStatus.NOT_RUN:
        return <HourglassEmptyIcon fontSize="small" color="disabled" />;
      default:
        return <HourglassEmptyIcon fontSize="small" color="disabled" />;
    }
  };

  // Adım durumunu formatla
  const formatStatus = (status?: TestStepStatus): string => {
    if (!status) return 'Çalıştırılmadı';

    switch (status) {
      case TestStepStatus.PASSED: return 'Başarılı';
      case TestStepStatus.FAILED: return 'Başarısız';
      case TestStepStatus.BLOCKED: return 'Engellendi';
      case TestStepStatus.SKIPPED: return 'Atlandı';
      case TestStepStatus.NOT_RUN: return 'Çalıştırılmadı';
      default: return status;
    }
  };

  // Süreyi formatla
  const formatDuration = (milliseconds?: number): string => {
    if (!milliseconds) return '-';

    if (milliseconds < 1000) {
      return `${milliseconds} ms`;
    }

    const seconds = Math.floor(milliseconds / 1000);
    const remainingMs = milliseconds % 1000;

    return `${seconds}.${remainingMs} sn`;
  };

  // Satırı aç/kapat
  const toggleRow = (id: string) => {
    setOpenRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Ekran görüntüsü modalını aç
  const openScreenshot = (url: string) => {
    setScreenshotDialog({
      open: true,
      url
    });
  };

  // Ekran görüntüsü modalını kapat
  const closeScreenshot = () => {
    setScreenshotDialog({
      open: false,
      url: ''
    });
  };

  // Adımları sırala
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Test Adımları
      </Typography>

      {steps.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Bu test case için henüz adım tanımlanmamış.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="5%"></TableCell>
                <TableCell width="5%">Sıra</TableCell>
                <TableCell width="45%">Açıklama</TableCell>
                <TableCell width="25%">Beklenen Sonuç</TableCell>
                <TableCell width="10%">Durum</TableCell>
                <TableCell width="10%">Süre</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSteps.map((step) => (
                <React.Fragment key={step.id}>
                  <TableRow
                    hover
                    sx={{
                      '& > *': { borderBottom: 'unset' },
                      cursor: 'pointer',
                      bgcolor: openRows[step.id] ? 'action.hover' : 'inherit'
                    }}
                    onClick={() => toggleRow(step.id)}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(step.id);
                        }}
                      >
                        {openRows[step.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{step.order}</TableCell>
                    <TableCell>{step.description}</TableCell>
                    <TableCell>{step.expectedResult}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(step.status)}
                        <Typography variant="body2">
                          {formatStatus(step.status)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDuration(step.duration)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 0 }}>
                      <Collapse in={openRows[step.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2, px: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Detaylar
                          </Typography>

                          <Grid container spacing={2}>
                            {step.screenshot && (
                              <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <ImageIcon color="primary" fontSize="small" />
                                  <Button
                                    variant="text"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openScreenshot(step.screenshot || '');
                                    }}
                                  >
                                    Ekran Görüntüsü
                                  </Button>
                                </Box>
                              </Grid>
                            )}

                            {/* Burada adım ile ilgili ek detaylar gösterilebilir */}
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Ekran Görüntüsü Modalı */}
      <Dialog
        open={screenshotDialog.open}
        onClose={closeScreenshot}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Ekran Görüntüsü
          <IconButton
            aria-label="close"
            onClick={closeScreenshot}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <img
              src={screenshotDialog.url}
              alt="Test Adımı Ekran Görüntüsü"
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TestStepsList;
