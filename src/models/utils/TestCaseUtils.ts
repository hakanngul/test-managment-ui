import { TestCase } from '../interfaces/TestCase';
import { TestCaseStatus, TestCasePriority, BrowserType } from '../enums/TestCaseEnums';

// Convert raw test case data to TestCase model
export const toTestCase = (data: any): TestCase => {
  return {
    id: data.id || data._id,
    title: data.title,
    description: data.description,
    status: data.status as TestCaseStatus,
    priority: data.priority as TestCasePriority,
    steps: data.steps || [],
    tags: data.tags || [],
    projectId: data.projectId,
    browsers: data.browsers ? data.browsers.map((b: string) => b as BrowserType) : undefined,
    headless: data.headless,
    browserPool: data.browserPool,
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    executionStats: data.executionStats ? {
      totalRuns: data.executionStats.totalRuns || 0,
      passCount: data.executionStats.passCount || 0,
      failCount: data.executionStats.failCount || 0,
      passRate: data.executionStats.passRate || 0,
      lastRun: data.executionStats.lastRun ? new Date(data.executionStats.lastRun) : undefined,
      avgDuration: data.executionStats.avgDuration
    } : undefined
  };
};

// Convert TestCase model to raw data for API
export const fromTestCase = (testCase: TestCase): any => {
  return {
    id: testCase.id,
    title: testCase.title,
    description: testCase.description,
    status: testCase.status,
    priority: testCase.priority,
    steps: testCase.steps,
    tags: testCase.tags,
    projectId: testCase.projectId,
    browsers: testCase.browsers,
    headless: testCase.headless,
    browserPool: testCase.browserPool,
    createdBy: testCase.createdBy,
    createdAt: testCase.createdAt?.toISOString(),
    updatedAt: testCase.updatedAt?.toISOString(),
    executionStats: testCase.executionStats ? {
      totalRuns: testCase.executionStats.totalRuns,
      passCount: testCase.executionStats.passCount,
      failCount: testCase.executionStats.failCount,
      passRate: testCase.executionStats.passRate,
      lastRun: testCase.executionStats.lastRun?.toISOString(),
      avgDuration: testCase.executionStats.avgDuration
    } : undefined
  };
};
