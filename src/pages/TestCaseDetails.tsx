import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { TestCase } from '../models/interfaces/ITestCase';
import testCaseService from '../services/TestCaseService';
import TestCaseHeader from '../components/test-case-details/TestCaseHeader';
import TestCaseInfo from '../components/test-case-details/TestCaseInfo';
import TestStepsList from '../components/test-case-details/TestStepsList';
import TestRunHistory from '../components/test-case-details/TestRunHistory';
import TestExecutionPanel from '../components/test-case-details/TestExecutionPanel';
import TestAttachments from '../components/test-case-details/TestAttachments';
import TestComments from '../components/test-case-details/TestComments';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`test-case-tabpanel-${index}`}
      aria-labelledby={`test-case-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const TestCaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchTestCase = async () => {
      setIsLoading(true);
      try {
        if (id) {
          // TestCaseService'den test case'i getir
          const foundTestCase = await testCaseService.getTestCaseById(id);
          setTestCase(foundTestCase);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Test case yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTestCase();
    }
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/test-cases');
  };

  const handleEdit = () => {
    if (testCase) {
      navigate(`/test-cases/edit/${testCase.id}`);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!testCase) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h5" color="error">
            Test case bulunamadı
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleBack}>
              Test Cases Sayfasına Dön
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            Ana Sayfa
          </Link>
          <Link color="inherit" href="/test-cases" onClick={(e) => { e.preventDefault(); navigate('/test-cases'); }}>
            Test Cases
          </Link>
          <Typography color="text.primary">{testCase.name}</Typography>
        </Breadcrumbs>

        {/* Başlık ve Butonlar */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Test Case Detayları
            </Typography>
          </Box>

          <IconButton onClick={handleEdit} color="primary">
            <EditIcon />
          </IconButton>
        </Box>

        {/* Test Case Header */}
        <TestCaseHeader testCase={testCase} />

        {/* Ana İçerik */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Sol Panel - Test Bilgileri */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Genel Bilgiler" id="test-case-tab-0" />
                  <Tab label="Test Adımları" id="test-case-tab-1" />
                  <Tab label="Çalıştırma Geçmişi" id="test-case-tab-2" />
                  <Tab label="Ekler" id="test-case-tab-3" />
                  <Tab label="Yorumlar" id="test-case-tab-4" />
                </Tabs>
              </Box>

              <Box sx={{ p: 3 }}>
                <TabPanel value={tabValue} index={0}>
                  <TestCaseInfo testCase={testCase} />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <TestStepsList steps={testCase.steps || []} />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <TestRunHistory testCaseId={testCase.id} />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                  <TestAttachments testCaseId={testCase.id} />
                </TabPanel>
                <TabPanel value={tabValue} index={4}>
                  <TestComments testCaseId={testCase.id} />
                </TabPanel>
              </Box>
            </Paper>
          </Grid>

          {/* Sağ Panel - Test Çalıştırma */}
          <Grid item xs={12} md={4}>
            <TestExecutionPanel testCase={testCase} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TestCaseDetails;
