import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayArrowIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { TestCase, TestCaseResult } from '../../models/interfaces/ITestCase';

interface TestCaseSelectorProps {
  testCases: TestCase[];
  selectedTestCase: TestCase | null;
  onSelectTestCase: (testCase: TestCase) => void;
  onRunTestCase: (testCase: TestCase) => void;
}

const TestCaseSelector: React.FC<TestCaseSelectorProps> = ({
  testCases,
  selectedTestCase,
  onSelectTestCase,
  onRunTestCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Arama terimini güncelle
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Arama terimine göre test case'leri filtrele
  const filteredTestCases = testCases.filter(testCase =>
    testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testCase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testCase.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Test case'i çalıştır
  const handleRunTestCase = (testCase: TestCase) => {
    onRunTestCase(testCase);
  };

  // Test case sonuç rengini belirle
  const getResultColor = (result?: TestCaseResult) => {
    switch (result) {
      case TestCaseResult.PASSED:
        return 'success';
      case TestCaseResult.FAILED:
        return 'error';
      case TestCaseResult.BLOCKED:
        return 'warning';
      case TestCaseResult.SKIPPED:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="medium">
          Test Case'ler
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Çalıştırmak istediğiniz test case'i seçin
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Test case ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mt: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List
        sx={{
          overflow: 'auto',
          flexGrow: 1,
          p: 0,
          '& .MuiListItemButton-root.Mui-selected': {
            bgcolor: 'primary.lighter',
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.lighter',
            },
            '& .MuiListItemText-primary': {
              fontWeight: 'bold',
            },
          },
        }}
      >
        {filteredTestCases.length > 0 ? (
          filteredTestCases.map((testCase, index) => (
            <React.Fragment key={testCase.id}>
              {index > 0 && <Divider variant="inset" component="li" />}
              <ListItem
                disablePadding
                secondaryAction={
                  <Tooltip title="Testi Çalıştır">
                    <IconButton
                      edge="end"
                      onClick={() => handleRunTestCase(testCase)}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemButton
                  selected={selectedTestCase?.id === testCase.id}
                  onClick={() => onSelectTestCase(testCase)}
                  sx={{
                    py: 1.5,
                    pl: selectedTestCase?.id === testCase.id ? 2 : 3,
                    pr: 6,
                    transition: 'all 0.2s'
                  }}
                >
                  <ListItemText
                    primary={testCase.name}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: selectedTestCase?.id === testCase.id ? 'bold' : 'medium',
                      component: 'div'
                    }}
                    secondary={
                      <React.Fragment>
                        <Box component="div" sx={{ mt: 0.5 }}>
                          {testCase.description.length > 50
                            ? `${testCase.description.substring(0, 50)}...`
                            : testCase.description}
                        </Box>
                        <Box component="div" sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {testCase.lastResult && (
                            <Chip
                              label={testCase.lastResult}
                              size="small"
                              color={getResultColor(testCase.lastResult) as any}
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                          {testCase.tags.slice(0, 2).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          ))}
                          {testCase.tags.length > 2 && (
                            <Chip
                              label={`+${testCase.tags.length - 2}`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </React.Fragment>
                    }
                    secondaryTypographyProps={{
                      component: 'div'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary="Sonuç bulunamadı"
              secondary="Lütfen arama kriterlerinizi değiştirin"
              primaryTypographyProps={{ component: 'div' }}
              secondaryTypographyProps={{ component: 'div' }}
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default TestCaseSelector;
