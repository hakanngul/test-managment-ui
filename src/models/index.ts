// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TEST_CASES: 'testCases',
  TEST_SUITES: 'testSuites',
  TEST_RUNS: 'testRuns',
  SERVER_AGENT: 'serverAgent',
  NOTIFICATIONS: 'notifications',
  TEST_CATEGORIES: 'testCategories',
  TEST_PRIORITIES: 'testPriorities',
  TEST_STATUSES: 'testStatuses',
  TEST_ENVIRONMENTS: 'testEnvironments',
  AVAILABLE_ACTIONS: 'availableActions',
  TEST_FEATURES: 'testFeatures',
  EXECUTION_TIME_DATA: 'executionTimeData',
  TEST_COUNTS_BY_DAY: 'testCountsByDay',
  TEST_RESULTS: 'testResults',
  SYSTEM_RESOURCES_DATA: 'systemResourcesData',
  AGENT_STATUS_DATA: 'agentStatusData',
  QUEUE_STATUS_DATA: 'queueStatusData',
  ACTIVE_AGENTS_DATA: 'activeAgentsData',
  QUEUED_REQUESTS_DATA: 'queuedRequestsData',
  PROCESSED_REQUESTS_DATA: 'processedRequestsData',
  DETAILED_TEST_RESULTS: 'detailedTestResults',
  PERFORMANCE_METRICS: 'performanceMetrics'
};

// Export all models
export * from './User';
export * from './Project';
export * from './TestCase';
export * from './TestStep';
export * from './TestSuite';
export * from './TestRun';
export * from './TestResult';
export * from './TestStepResult';
export * from './Agent';
export * from './SystemResource';
export * from './QueuedRequest';
export * from './ProcessedRequest';
export * from './ServerAgent';
export * from './TestReportData';

// Export all enums
export * from './enums/TestCaseEnums';
export * from './enums/TestStepEnums';

// Export all interfaces
export * from './interfaces/TestCase';
export * from './interfaces/TestStep';

// Export all utils
export * from './utils/TestCaseUtils';
export * from './utils/TestStepUtils';
