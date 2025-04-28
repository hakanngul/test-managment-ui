import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  CircularProgress,
  Button
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  HourglassEmpty as HourglassEmptyIcon
} from '@mui/icons-material';
import { TestCase, TestCaseResult, TestCasePriority } from '../../models/interfaces/ITestCase';

interface TestCasesListProps {
  testCases: TestCase[];
  selectedTestCases: string[];
  onSelectTestCase: (id: string) => void;
  onSelectAllTestCases: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRunTestCase: (id: string) => void;
  isLoading: boolean;
}

const TestCasesList: React.FC<TestCasesListProps> = ({
  testCases,
  selectedTestCases,
  onSelectTestCase,
  onSelectAllTestCases,
  onRunTestCase,
  isLoading
}) => {
  const navigate = useNavigate();

  // Test case detaylarına git
  const handleNavigateToDetails = (id: string) => {
    navigate(`/test-cases/${id}`);
  };
  // Öncelik rengini belirle
  const getPriorityColor = (priority: TestCasePriority) => {
    switch (priority) {
      case TestCasePriority.LOW:
        return 'success';
      case TestCasePriority.MEDIUM:
        return 'info';
      case TestCasePriority.HIGH:
        return 'warning';
      case TestCasePriority.CRITICAL:
        return 'error';
      default:
        return 'default';
    }
  };

  // Öncelik adını formatla
  const formatPriority = (priority: TestCasePriority): string => {
    switch (priority) {
      case TestCasePriority.LOW: return 'Düşük';
      case TestCasePriority.MEDIUM: return 'Orta';
      case TestCasePriority.HIGH: return 'Yüksek';
      case TestCasePriority.CRITICAL: return 'Kritik';
      default: return priority;
    }
  };

  // Sonuç ikonunu belirle
  const getResultIcon = (result?: TestCaseResult) => {
    if (!result) return null;

    switch (result) {
      case TestCaseResult.PASSED:
        return <CheckCircleIcon fontSize="small" color="success" />;
      case TestCaseResult.FAILED:
        return <CancelIcon fontSize="small" color="error" />;
      case TestCaseResult.BLOCKED:
        return <BlockIcon fontSize="small" color="warning" />;
      case TestCaseResult.SKIPPED:
        return <WarningIcon fontSize="small" color="info" />;
      case TestCaseResult.NOT_RUN:
        return <HourglassEmptyIcon fontSize="small" color="disabled" />;
      default:
        return null;
    }
  };

  // Sonuç adını formatla
  const formatResult = (result?: TestCaseResult): string => {
    if (!result) return 'Çalıştırılmadı';

    switch (result) {
      case TestCaseResult.PASSED: return 'Başarılı';
      case TestCaseResult.FAILED: return 'Başarısız';
      case TestCaseResult.BLOCKED: return 'Engellendi';
      case TestCaseResult.SKIPPED: return 'Atlandı';
      case TestCaseResult.NOT_RUN: return 'Çalıştırılmadı';
      default: return result;
    }
  };

  // Tarihi formatla
  const formatDate = (date?: Date): string => {
    if (!date) return '-';
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedTestCases.length > 0 && selectedTestCases.length < testCases.length}
                  checked={testCases.length > 0 && selectedTestCases.length === testCases.length}
                  onChange={onSelectAllTestCases}
                  inputProps={{
                    'aria-label': 'tüm test case\'leri seç',
                  }}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Ad
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Öncelik
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Kategori
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Son Çalıştırma
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Sonuç
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Otomasyon
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Test case'ler yükleniyor...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : testCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">
                    Hiç test case bulunamadı.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Yeni bir test case oluşturun veya filtreleri temizleyin.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              testCases.map((testCase) => {
                const isSelected = selectedTestCases.includes(testCase.id);

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={testCase.id}
                    selected={isSelected}
                    sx={{ cursor: 'pointer' }}
                    onClick={(event) => {
                      // Checkbox'a tıklanmadıysa detay sayfasına git
                      if (event.target instanceof HTMLElement &&
                          !event.target.closest('.MuiCheckbox-root') &&
                          !event.target.closest('button')) {
                        handleNavigateToDetails(testCase.id);
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => onSelectTestCase(testCase.id)}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => handleNavigateToDetails(testCase.id)}
                    >
                      {testCase.id}
                    </TableCell>
                    <TableCell onClick={() => handleNavigateToDetails(testCase.id)}>
                      <Box sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {testCase.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testCase.description.length > 60
                            ? `${testCase.description.substring(0, 60)}...`
                            : testCase.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => handleNavigateToDetails(testCase.id)}>
                      <Chip
                        label={formatPriority(testCase.priority)}
                        size="small"
                        color={getPriorityColor(testCase.priority) as any}
                      />
                    </TableCell>
                    <TableCell onClick={() => handleNavigateToDetails(testCase.id)}>
                      {testCase.category}
                    </TableCell>
                    <TableCell onClick={() => handleNavigateToDetails(testCase.id)}>
                      {formatDate(testCase.lastRun)}
                    </TableCell>
                    <TableCell onClick={() => handleNavigateToDetails(testCase.id)}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getResultIcon(testCase.lastResult)}
                        <Typography variant="body2">
                          {formatResult(testCase.lastResult)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => handleNavigateToDetails(testCase.id)}>
                      <Chip
                        label={testCase.automated ? 'Otomatize' : 'Manuel'}
                        size="small"
                        color={testCase.automated ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Çalıştır">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<PlayArrowIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRunTestCase(testCase.id);
                          }}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            boxShadow: 1,
                            '&:hover': {
                              boxShadow: 2
                            }
                          }}
                        >
                          Çalıştır
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TestCasesList;
