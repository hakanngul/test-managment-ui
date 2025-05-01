import { TestStepActionType } from "../../components/test-cases";

export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: TestCaseStatus;
  priority: TestCasePriority;
  category: TestCaseCategory;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  lastResult?: TestCaseResult;
  browser?: string;
  environment?: string;
  headless?: boolean;
  takeScreenshots?: boolean;
  estimatedDuration?: number; // saniye cinsinden
  actualDuration?: number; // saniye cinsinden
  steps?: TestStep[];
  prerequisites?: string[];
  testSuiteId?: string;
  projectId: string;
  automated: boolean;
}

export interface TestStep {
  action: TestStepActionType;
  selector: any;
  value: any;
  id: string;
  order: number;
  description: string;
  expectedResult: string;
  status?: TestStepStatus;
  screenshot?: string;
  duration?: number; // milisaniye cinsinden
}

export enum TestCaseStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED"
}

export enum TestCasePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TestCaseCategory {
  FUNCTIONAL = 'functional',
  REGRESSION = 'regression',
  INTEGRATION = 'integration',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  USABILITY = 'usability',
  ACCEPTANCE = 'acceptance',
  SMOKE = 'smoke',
  EXPLORATORY = 'exploratory'
}

export enum TestCaseResult {
  PASSED = 'passed',
  FAILED = 'failed',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
  NOT_RUN = 'not_run'
}

export enum TestStepStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
  NOT_RUN = 'not_run'
}
