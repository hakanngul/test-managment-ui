import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import theme from './theme';
import AuthProvider from './context/AuthContext';
import AppProvider from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ServerAgent from './pages/ServerAgent';
import TestCases from './pages/TestCases';
import NewTestCase from './pages/NewTestCase';
import TestCaseDetails from './pages/TestCaseDetails';
import TestRuns from './pages/TestRuns';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SmartErrorDialog from './components/common/SmartErrorDialog';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ErrorDialogProvider } from './context/ErrorDialogContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <ErrorDialogProvider>
            <ErrorBoundary>
              <AppProvider>
                <Router>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="server-agent" element={<ServerAgent />} />
                      <Route path="test-cases" element={<TestCases />} />
                      <Route path="test-cases/new" element={<NewTestCase />} />
                      <Route path="test-cases/:id" element={<TestCaseDetails />} />
                      <Route path="test-cases/edit/:id" element={<NewTestCase />} />
                      <Route path="test-runs" element={<TestRuns />} />
                      <Route path="reports" element={<Reports />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <SmartErrorDialog />
                </Router>
              </AppProvider>
            </ErrorBoundary>
          </ErrorDialogProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
