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
export * from './enums/TestSuiteEnums';
export * from './enums/TestRunEnums';
export * from './enums/AgentEnums';
export * from './enums/TestResultEnums';
export * from './enums/ProcessedRequestEnums';

// Export all interfaces
export * from './interfaces/TestCase';
export * from './interfaces/TestStep';
export * from './interfaces/TestSuite';
export * from './interfaces/TestRun';
export * from './interfaces/Agent';
export * from './interfaces/TestResult';
export * from './interfaces/TestStepResult';
export * from './interfaces/TestReportData';
export * from './interfaces/ProcessedRequest';

// Export all utils
export * from './utils/TestCaseUtils';
export * from './utils/TestStepUtils';
export * from './utils/TestSuiteUtils';
export * from './utils/TestRunUtils';

// Export Agent utils with explicit re-exports for conflicting functions
export {
  toAgent,
  fromAgent,
  calculateAgentStatusSummary,
  calculateAgentPerformanceSummary,
  createDefaultBrowserInfo,
  createDefaultSystemInfo,
  createDefaultNetworkInfo as createDefaultAgentNetworkInfo,
  createDefaultPerformanceMetrics as createDefaultAgentPerformanceMetrics,
  createDefaultSecurityInfo,
  createDefaultLoggingInfo,
  createDefaultHealthCheck,
  createDefaultCapabilities
} from './utils/AgentUtils';

// Export TestResult utils with explicit re-exports for conflicting functions
export {
  toTestResult,
  fromTestResult,
  calculateTestResultDuration,
  calculateTestResultStatus,
  createDefaultErrorDetails,
  createDefaultEnvironmentInfo,
  createDefaultTestPerformanceMetrics,
  createDefaultTestNetworkInfo,
  createDefaultRetryInfo
} from './utils/TestResultUtils';

// Export TestStepResult utils
export * from './utils/TestStepResultUtils';

// Export TestReportData utils
export * from './utils/TestReportDataUtils';

// Export ProcessedRequest utils with explicit re-exports for conflicting functions
export {
  toProcessedRequest,
  fromProcessedRequest,
  calculateDurationMs,
  formatDuration,
  createDefaultProcessedRequestError,
  createDefaultProcessedRequestPerformance,
  createDefaultProcessedRequestEnvironment,
  createDefaultProcessedRequestResources,
  createDefaultProcessedRequestLogs
} from './utils/ProcessedRequestUtils';
