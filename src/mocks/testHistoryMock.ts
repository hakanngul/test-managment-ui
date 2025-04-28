import { TestResult } from '../types';

export const testHistoryMock: TestResult[] = [
  {
    id: 'result-1',
    testCaseId: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
    testRunId: 'run-1',
    status: 'passed',
    duration: 5200,
    createdAt: '2023-05-15T10:30:00.000Z',
    environment: 'production',
    browser: 'chrome'
  },
  {
    id: 'result-2',
    testCaseId: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
    testRunId: 'run-2',
    status: 'failed',
    duration: 4800,
    errorMessage: 'Element not found: #login-button',
    createdAt: '2023-05-10T14:45:00.000Z',
    environment: 'staging',
    browser: 'firefox'
  },
  {
    id: 'result-3',
    testCaseId: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
    testRunId: 'run-3',
    status: 'passed',
    duration: 5100,
    createdAt: '2023-05-05T09:15:00.000Z',
    environment: 'development',
    browser: 'chrome'
  },
  {
    id: 'result-4',
    testCaseId: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
    testRunId: 'run-4',
    status: 'passed',
    duration: 5300,
    createdAt: '2023-04-28T16:20:00.000Z',
    environment: 'production',
    browser: 'edge'
  },
  {
    id: 'result-5',
    testCaseId: 'a408acf5-72f2-43d8-8d73-7f8c203c30b0',
    testRunId: 'run-5',
    status: 'failed',
    duration: 3200,
    errorMessage: 'Timeout waiting for page load',
    createdAt: '2023-04-20T11:10:00.000Z',
    environment: 'staging',
    browser: 'chrome'
  }
];
