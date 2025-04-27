import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  FileOpen as FileOpenIcon
} from '@mui/icons-material';
import { ApexOptions } from 'apexcharts';
import ChartCard from './ChartCard';
import SummaryCard from './SummaryCard';

interface CoverageFile {
  id: string;
  name: string;
  path: string;
  lines: {
    total: number;
    covered: number;
    percentage: number;
  };
  branches: {
    total: number;
    covered: number;
    percentage: number;
  };
  functions: {
    total: number;
    covered: number;
    percentage: number;
  };
  statements: {
    total: number;
    covered: number;
    percentage: number;
  };
}

interface CoverageData {
  summary: {
    lines: {
      total: number;
      covered: number;
      percentage: number;
    };
    branches: {
      total: number;
      covered: number;
      percentage: number;
    };
    functions: {
      total: number;
      covered: number;
      percentage: number;
    };
    statements: {
      total: number;
      covered: number;
      percentage: number;
    };
  };
  files: CoverageFile[];
}

interface CoverageTabProps {
  coverageData: CoverageData;
  coverageTrendData: {
    options: ApexOptions;
    series: any[];
  };
  coverageByTypeData: {
    options: ApexOptions;
    series: number[];
  };
  uncoveredLinesData: {
    options: ApexOptions;
    series: any[];
  };
}

const CoverageTab: React.FC<CoverageTabProps> = ({
  coverageData,
  coverageTrendData,
  coverageByTypeData,
  uncoveredLinesData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [coverageFilter, setCoverageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFile, setSelectedFile] = useState<CoverageFile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileTabValue, setFileTabValue] = useState(0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCoverageFilterChange = (event: SelectChangeEvent<string>) => {
    setCoverageFilter(event.target.value);
    setPage(0);
  };

  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFileClick = (file: CoverageFile) => {
    setSelectedFile(file);
    setFileTabValue(0);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFileTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setFileTabValue(newValue);
  };

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'success.main';
    if (percentage >= 50) return 'warning.main';
    return 'error.main';
  };

  // Filter and sort files
  const filteredFiles = coverageData.files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          file.path.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (coverageFilter === 'all') return matchesSearch;
    if (coverageFilter === 'high') return matchesSearch && file.lines.percentage >= 80;
    if (coverageFilter === 'medium') return matchesSearch && file.lines.percentage >= 50 && file.lines.percentage < 80;
    if (coverageFilter === 'low') return matchesSearch && file.lines.percentage < 50;
    
    return matchesSearch;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'path') return a.path.localeCompare(b.path);
    if (sortBy === 'lines') return b.lines.percentage - a.lines.percentage;
    if (sortBy === 'branches') return b.branches.percentage - a.branches.percentage;
    if (sortBy === 'functions') return b.functions.percentage - a.functions.percentage;
    if (sortBy === 'statements') return b.statements.percentage - a.statements.percentage;
    return 0;
  });

  // Mock file content for the dialog
  const mockFileContent = `
import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  content: string;
}

const ExampleComponent: React.FC<Props> = ({ title, content }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const renderContent = () => {
    if (!content) return null;
    
    return (
      <Typography variant="body1">
        {content}
      </Typography>
    );
  };

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      {isOpen && renderContent()}
      <Button onClick={handleToggle}>
        {isOpen ? 'Hide' : 'Show'} Content
      </Button>
    </Box>
  );
};

export default ExampleComponent;
  `;

  // Mock coverage lines for the dialog
  const mockCoverageLines = [
    { line: 1, covered: true },
    { line: 2, covered: true },
    { line: 3, covered: true },
    { line: 4, covered: true },
    { line: 5, covered: true },
    { line: 6, covered: true },
    { line: 7, covered: true },
    { line: 8, covered: true },
    { line: 9, covered: true },
    { line: 10, covered: true },
    { line: 11, covered: true },
    { line: 12, covered: false },
    { line: 13, covered: true },
    { line: 14, covered: true },
    { line: 15, covered: false },
    { line: 16, covered: false },
    { line: 17, covered: true },
    { line: 18, covered: true },
    { line: 19, covered: true },
    { line: 20, covered: true },
    { line: 21, covered: true },
    { line: 22, covered: true },
    { line: 23, covered: true },
    { line: 24, covered: true },
    { line: 25, covered: true },
    { line: 26, covered: true },
    { line: 27, covered: true },
    { line: 28, covered: true },
    { line: 29, covered: true },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Line Coverage"
            value={`${coverageData.summary.lines.percentage}%`}
            subtitle={`${coverageData.summary.lines.covered}/${coverageData.summary.lines.total} lines`}
            color={getCoverageColor(coverageData.summary.lines.percentage)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Branch Coverage"
            value={`${coverageData.summary.branches.percentage}%`}
            subtitle={`${coverageData.summary.branches.covered}/${coverageData.summary.branches.total} branches`}
            color={getCoverageColor(coverageData.summary.branches.percentage)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Function Coverage"
            value={`${coverageData.summary.functions.percentage}%`}
            subtitle={`${coverageData.summary.functions.covered}/${coverageData.summary.functions.total} functions`}
            color={getCoverageColor(coverageData.summary.functions.percentage)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Statement Coverage"
            value={`${coverageData.summary.statements.percentage}%`}
            subtitle={`${coverageData.summary.statements.covered}/${coverageData.summary.statements.total} statements`}
            color={getCoverageColor(coverageData.summary.statements.percentage)}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <ChartCard
            title="Coverage Trend"
            options={coverageTrendData.options}
            series={coverageTrendData.series}
            type="line"
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Coverage by Type"
            options={coverageByTypeData.options}
            series={coverageByTypeData.series}
            type="radialBar"
            height={300}
          />
        </Grid>
        <Grid item xs={12}>
          <ChartCard
            title="Top Files with Uncovered Lines"
            options={uncoveredLinesData.options}
            series={uncoveredLinesData.series}
            type="bar"
            height={300}
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Files"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="coverage-filter-label">Coverage Level</InputLabel>
                <Select
                  labelId="coverage-filter-label"
                  value={coverageFilter}
                  label="Coverage Level"
                  onChange={handleCoverageFilterChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="high">High (≥80%)</MenuItem>
                  <MenuItem value="medium">Medium (50-79%)</MenuItem>
                  <MenuItem value="low">Low (&lt;50%)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortByChange}
                >
                  <MenuItem value="name">File Name</MenuItem>
                  <MenuItem value="path">File Path</MenuItem>
                  <MenuItem value="lines">Line Coverage</MenuItem>
                  <MenuItem value="branches">Branch Coverage</MenuItem>
                  <MenuItem value="functions">Function Coverage</MenuItem>
                  <MenuItem value="statements">Statement Coverage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Files
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Path</TableCell>
                  <TableCell>Line Coverage</TableCell>
                  <TableCell>Branch Coverage</TableCell>
                  <TableCell>Function Coverage</TableCell>
                  <TableCell>Statement Coverage</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFiles
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((file) => (
                    <TableRow 
                      key={file.id} 
                      hover 
                      onClick={() => handleFileClick(file)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{file.path}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={file.lines.percentage}
                              color={
                                file.lines.percentage >= 80 ? "success" :
                                file.lines.percentage >= 50 ? "warning" : "error"
                              }
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {file.lines.percentage}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={file.branches.percentage}
                              color={
                                file.branches.percentage >= 80 ? "success" :
                                file.branches.percentage >= 50 ? "warning" : "error"
                              }
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {file.branches.percentage}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={file.functions.percentage}
                              color={
                                file.functions.percentage >= 80 ? "success" :
                                file.functions.percentage >= 50 ? "warning" : "error"
                              }
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {file.functions.percentage}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={file.statements.percentage}
                              color={
                                file.statements.percentage >= 80 ? "success" :
                                file.statements.percentage >= 50 ? "warning" : "error"
                              }
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {file.statements.percentage}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View File Details">
                          <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            handleFileClick(file);
                          }}>
                            <FileOpenIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredFiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No files found matching your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredFiles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* File Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              File Coverage: {selectedFile?.name}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedFile && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Path: {selectedFile.path}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">Line Coverage</Typography>
                    <Typography variant="h4" color={getCoverageColor(selectedFile.lines.percentage)}>
                      {selectedFile.lines.percentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFile.lines.covered}/{selectedFile.lines.total} lines
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">Branch Coverage</Typography>
                    <Typography variant="h4" color={getCoverageColor(selectedFile.branches.percentage)}>
                      {selectedFile.branches.percentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFile.branches.covered}/{selectedFile.branches.total} branches
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">Function Coverage</Typography>
                    <Typography variant="h4" color={getCoverageColor(selectedFile.functions.percentage)}>
                      {selectedFile.functions.percentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFile.functions.covered}/{selectedFile.functions.total} functions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">Statement Coverage</Typography>
                    <Typography variant="h4" color={getCoverageColor(selectedFile.statements.percentage)}>
                      {selectedFile.statements.percentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFile.statements.covered}/{selectedFile.statements.total} statements
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Tabs
                value={fileTabValue}
                onChange={handleFileTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab label="Source with Coverage" />
                <Tab label="Uncovered Lines" />
                <Tab label="Coverage Report" />
              </Tabs>

              {fileTabValue === 0 && (
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    maxHeight: 400,
                    overflow: 'auto'
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {mockFileContent.split('\n').map((line, index) => (
                        <tr key={index} style={{ 
                          backgroundColor: mockCoverageLines[index]?.covered === false ? 'rgba(244, 67, 54, 0.1)' : 'transparent'
                        }}>
                          <td style={{ 
                            width: '40px', 
                            textAlign: 'right', 
                            color: 'gray',
                            paddingRight: '10px',
                            borderRight: '1px solid #ddd'
                          }}>
                            {index + 1}
                          </td>
                          <td style={{ 
                            width: '40px', 
                            textAlign: 'center',
                            color: mockCoverageLines[index]?.covered === false ? '#f44336' : '#4caf50',
                            fontWeight: 'bold'
                          }}>
                            {mockCoverageLines[index]?.covered !== undefined ? (
                              mockCoverageLines[index]?.covered ? 'Y' : 'N'
                            ) : ''}
                          </td>
                          <td style={{ paddingLeft: '10px' }}>
                            <pre style={{ margin: 0 }}>{line}</pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}

              {fileTabValue === 1 && (
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Line</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockCoverageLines
                        .filter(line => !line.covered)
                        .map((line) => (
                          <TableRow key={line.line}>
                            <TableCell>{line.line}</TableCell>
                            <TableCell>
                              <code>{mockFileContent.split('\n')[line.line - 1]}</code>
                            </TableCell>
                            <TableCell>Statement</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {fileTabValue === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Coverage Summary</Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Covered</TableCell>
                                <TableCell>Percentage</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Lines</TableCell>
                                <TableCell>{selectedFile.lines.total}</TableCell>
                                <TableCell>{selectedFile.lines.covered}</TableCell>
                                <TableCell>{selectedFile.lines.percentage}%</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Branches</TableCell>
                                <TableCell>{selectedFile.branches.total}</TableCell>
                                <TableCell>{selectedFile.branches.covered}</TableCell>
                                <TableCell>{selectedFile.branches.percentage}%</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Functions</TableCell>
                                <TableCell>{selectedFile.functions.total}</TableCell>
                                <TableCell>{selectedFile.functions.covered}</TableCell>
                                <TableCell>{selectedFile.functions.percentage}%</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Statements</TableCell>
                                <TableCell>{selectedFile.statements.total}</TableCell>
                                <TableCell>{selectedFile.statements.covered}</TableCell>
                                <TableCell>{selectedFile.statements.percentage}%</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Uncovered Functions</Typography>
                        <Typography variant="body2" color="text.secondary">
                          The following functions have no coverage:
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <code>renderContent (line 15)</code>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" color="primary">Download Report</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoverageTab;
