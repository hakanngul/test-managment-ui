import React from 'react';
import { Box } from '@mui/material';
import {
  TestCasesHeader,
  TestCasesDataProvider,
  TestCasesContent
} from '../components/testCases';

/**
 * TestCases sayfası
 * Veri sağlayıcı ile sarmalanmış içerik bileşenini döndürür
 */
const TestCases: React.FC = () => {
  return (
    <TestCasesDataProvider>
      <Box>
        <TestCasesHeader title="Test Cases" />
        <TestCasesContent />
      </Box>
    </TestCasesDataProvider>
  );
};

export default TestCases;
