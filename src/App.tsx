import React from 'react';
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
import TestCases from './pages/TestCases';
import TestRuns from './pages/TestRuns';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import TestCaseDetail from './pages/TestCaseDetail';
import TestRunDetail from './pages/TestRunDetail';
import NewTestCase from './pages/NewTestCase';
import CreateTestSuite from './pages/CreateTestSuite';
import ServerAgent from './pages/ServerAgent';
import TestPage from './pages/TestPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <AppProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="test-cases" element={<TestCases />} />
                  <Route path="test-cases/new" element={<NewTestCase />} />
                  <Route path="test-cases/:id" element={<TestCaseDetail />} />
                  <Route path="test-runs" element={<TestRuns />} />
                  <Route path="test-runs/create" element={<CreateTestSuite />} />
                  <Route path="test-runs/:id" element={<TestRunDetail />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="server-agent" element={<ServerAgent />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="test-page" element={<TestPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AppProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;