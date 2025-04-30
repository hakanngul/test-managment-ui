// WebSocket bağlantı durumu
export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

// Test durumu
export enum TestStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ABORTED = 'aborted'
}

// Log seviyesi
export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

// Test adımı
export interface TestStep {
  current: number;
  total: number;
  description: string;
}

// Test logu
export interface TestLog {
  level: LogLevel;
  message: string;
  timestamp: string;
}

// Test bilgisi
export interface Test {
  id: string;
  name: string;
  status: TestStatus;
  startTime: string;
  endTime?: string;
  currentStep: number;
  totalSteps: number;
  error?: string;
}

// WebSocket olayları
export interface WebSocketEvents {
  // Bağlantı olayları
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
  
  // Test olayları
  testStarted: (data: any) => void;
  test_started: (data: any) => void;
  testCompleted: (data: any) => void;
  test_completed: (data: any) => void;
  testFailed: (data: any) => void;
  test_failed: (data: any) => void;
  
  // Log olayları
  testLog: (data: any) => void;
  test_log: (data: any) => void;
  agent_log: (data: any) => void;
  
  // Adım olayları
  testStepStarted: (data: any) => void;
  test_step_started: (data: any) => void;
  testStepCompleted: (data: any) => void;
  test_step_completed: (data: any) => void;
}

// WebSocketManager için yapılandırma
export interface WebSocketConfig {
  url: string;
  options?: {
    transports?: string[];
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    timeout?: number;
    autoConnect?: boolean;
    query?: Record<string, string>;
  };
}

// WebSocketManager durumu
export interface WebSocketState {
  status: ConnectionStatus;
  tests: Record<string, Test>;
  logs: Record<string, TestLog[]>;
  steps: Record<string, { step: TestStep }>;
  error?: Error;
}

// WebSocketManager için dinleyici
export interface WebSocketListener {
  onStatusChange?: (status: ConnectionStatus) => void;
  onTestsChange?: (tests: Record<string, Test>) => void;
  onLogsChange?: (logs: Record<string, TestLog[]>) => void;
  onStepsChange?: (steps: Record<string, { step: TestStep }>) => void;
  onError?: (error: Error) => void;
}
