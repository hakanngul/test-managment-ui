import { RequestPriority, RequestStatus, RequestCategory, RequestSource, RequestRetryStrategy } from '../enums/QueuedRequestEnums';
import { BrowserType } from '../enums/TestCaseEnums';

// Request environment
export interface RequestEnvironment {
  browser: BrowserType;
  browserVersion?: string;
  platform?: string;
  platformVersion?: string;
  viewport?: string;
  deviceName?: string;
  deviceType?: string;
  networkConditions?: string;
  location?: string;
  timezone?: string;
}

// Request timing
export interface RequestTiming {
  queuedAt: Date;
  scheduledAt?: Date;
  assignedAt?: Date;
  startedAt?: Date;
  estimatedStartTime?: Date;
  estimatedDuration?: number; // in milliseconds
  timeout?: number; // in milliseconds
  waitTime: string; // formatted wait time
  waitTimeMs?: number; // wait time in milliseconds
}

// Request dependency
export interface RequestDependency {
  requestId: string;
  type: 'before' | 'after' | 'with';
  required: boolean;
}

// Request retry configuration
export interface RequestRetryConfig {
  strategy: RequestRetryStrategy;
  maxRetries: number;
  currentRetry: number;
  retryDelay: number; // in milliseconds
  lastRetryAt?: Date;
  retryReason?: string;
}

// Queue status summary
export interface QueueStatusSummary {
  queued: number;
  scheduled: number;
  assigned: number;
  processing: number;
  total: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  estimatedWaitTime: number; // in milliseconds
}

// Queued request model
export interface QueuedRequest {
  [x: string]: any;
  queuedAt: any;
  id: string;
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  testSuiteId?: string;
  projectId?: string;
  
  // Status and category
  status: RequestStatus;
  priority: RequestPriority;
  category: RequestCategory | string;
  source?: RequestSource;
  
  // Environment
  browser: string;
  environment?: RequestEnvironment;
  
  // Timing
  timing: RequestTiming;
  
  // Dependencies and retry
  dependencies?: RequestDependency[];
  retryConfig?: RequestRetryConfig;
  
  // Payload and metadata
  payload?: any; // test data
  tags?: string[];
  metadata?: Record<string, any>;
  
  // User information
  createdBy?: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
  
  // Agent assignment
  assignedAgentId?: string;
}

// Queued request creation model
export interface QueuedRequestCreate {
  testName: string;
  testRunId?: string;
  testCaseId?: string;
  testSuiteId?: string;
  projectId?: string;
  
  // Status and category
  status?: RequestStatus;
  priority: RequestPriority;
  category: RequestCategory | string;
  source?: RequestSource;
  
  // Environment
  browser: string;
  environment?: RequestEnvironment;
  
  // Timing
  estimatedDuration?: number;
  timeout?: number;
  
  // Dependencies and retry
  dependencies?: RequestDependency[];
  retryConfig?: RequestRetryConfig;
  
  // Payload and metadata
  payload?: any;
  tags?: string[];
  metadata?: Record<string, any>;
  
  // User information
  createdBy?: string;
}

// Queued request update model
export interface QueuedRequestUpdate {
  status?: RequestStatus;
  priority?: RequestPriority;
  
  // Timing
  scheduledAt?: Date;
  assignedAt?: Date;
  startedAt?: Date;
  estimatedStartTime?: Date;
  
  // Dependencies and retry
  dependencies?: RequestDependency[];
  retryConfig?: RequestRetryConfig;
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
  
  // Agent assignment
  assignedAgentId?: string;
  
  updatedAt?: Date;
}
