# Test Automation Management System - Models Architecture

This document describes the architecture of the models used in the Test Automation Management System.

## Directory Structure

```
src/models/
│
├── index.ts                  # Exports all models from a single point
│
├── User.ts                   # User model (non-modular)
│
├── enums/                    # Folder for enums
│   ├── TestCaseEnums.ts      # Test case enums
│   ├── TestStepEnums.ts      # Test step enums
│   ├── TestSuiteEnums.ts     # Test suite enums
│   ├── TestRunEnums.ts       # Test run enums
│   ├── TestResultEnums.ts    # Test result enums
│   ├── AgentEnums.ts         # Agent enums
│   ├── ProcessedRequestEnums.ts # Processed request enums
│   ├── QueuedRequestEnums.ts # Queued request enums
│   └── ProjectEnums.ts       # Project enums
│
├── interfaces/               # Folder for interfaces
│   ├── TestCase.ts           # Test case interfaces
│   ├── TestStep.ts           # Test step interfaces
│   ├── TestSuite.ts          # Test suite interfaces
│   ├── TestRun.ts            # Test run interfaces
│   ├── TestResult.ts         # Test result interfaces
│   ├── TestStepResult.ts     # Test step result interfaces
│   ├── TestReportData.ts     # Test report data interfaces
│   ├── Agent.ts              # Agent interfaces
│   ├── ProcessedRequest.ts   # Processed request interfaces
│   ├── QueuedRequest.ts      # Queued request interfaces
│   └── Project.ts            # Project interfaces
│
└── utils/                    # Folder for utility functions
    ├── TestCaseUtils.ts      # Test case utility functions
    ├── TestStepUtils.ts      # Test step utility functions
    ├── TestSuiteUtils.ts     # Test suite utility functions
    ├── TestRunUtils.ts       # Test run utility functions
    ├── TestResultUtils.ts    # Test result utility functions
    ├── TestStepResultUtils.ts # Test step result utility functions
    ├── TestReportDataUtils.ts # Test report data utility functions
    ├── AgentUtils.ts         # Agent utility functions
    ├── ProcessedRequestUtils.ts # Processed request utility functions
    ├── QueuedRequestUtils.ts # Queued request utility functions
    └── ProjectUtils.ts       # Project utility functions
```

## Model Categories

The architecture divides models into three main categories:

1. **Enums**: Define constant values and types.
2. **Interfaces**: Define data structures.
3. **Utils**: Contain conversion and helper functions.

Each model has all three categories, providing a clear separation between models and making the code more organized.

## Relationship Diagram

```
User ─────┐
          │
          ▼
Project ◄─┼─► TestSuite ◄─► TestCase ◄─► TestStep
          │       │             │
          │       ▼             ▼
          │    TestRun ◄─► TestResult ◄─► TestStepResult
          │       │
          │       ▼
          └─► QueuedRequest ─► ProcessedRequest
                  ▲
                  │
                  └─── Agent
```

## Model Relationships

- **User**: Users access projects and test processes.
- **Project**: Projects organize test suites and test cases.
- **TestSuite**: Test suites group test cases.
- **TestCase**: Test cases consist of test steps.
- **TestStep**: Test steps are the smallest unit of test cases.
- **TestRun**: Test runs execute test suites or test cases.
- **TestResult**: Test results contain the results of test runs.
- **TestStepResult**: Test step results contain the results of test steps.
- **QueuedRequest**: Queued requests represent requests for test runs.
- **ProcessedRequest**: Processed requests represent completed test requests.
- **Agent**: Agents execute test runs and process queued requests.

## Model Details

### User Model

The User model represents users of the system with different roles and permissions.

Key features:
- User roles (admin, manager, tester, etc.)
- User status (active, inactive, pending, etc.)
- User profile and contact information
- User preferences and settings
- Permission system
- Authentication and security features

### Project Model

The Project model represents projects that organize test cases and test suites.

Key features:
- Project status and categorization
- Project members and roles
- Project configuration
- Project timeline with milestones and releases
- Project integrations
- Relationships with other projects
- Project statistics

### TestCase Model

The TestCase model represents test cases that define what to test.

Key features:
- Test case status and priority
- Test steps
- Browser settings
- Tags and categorization
- Execution statistics

### TestStep Model

The TestStep model represents individual steps in a test case.

Key features:
- Action types (click, type, wait, etc.)
- Target types (CSS selector, XPath, etc.)
- Expected results
- Screenshot settings

### TestSuite Model

The TestSuite model represents collections of test cases.

Key features:
- Test suite status and priority
- Test cases included
- Execution mode (sequential, parallel)
- Retry strategy
- Browser settings
- Scheduling
- Notifications

### TestRun Model

The TestRun model represents executions of test suites or test cases.

Key features:
- Test run status and priority
- Environment information
- Execution settings
- Logging and reporting options
- Performance metrics
- Results

### TestResult Model

The TestResult model represents the results of test runs.

Key features:
- Test result status
- Error details
- Environment information
- Performance metrics
- Network information
- Media (screenshots, videos)
- Logs

### Agent Model

The Agent model represents test execution agents.

Key features:
- Agent status and type
- System information
- Browser information
- Performance metrics
- Security information
- Health status

### QueuedRequest Model

The QueuedRequest model represents test requests waiting to be processed.

Key features:
- Request status and priority
- Environment settings
- Timing information
- Dependencies
- Retry configuration

### ProcessedRequest Model

The ProcessedRequest model represents test requests that have been processed.

Key features:
- Request status and result
- Error details
- Performance metrics
- Resource usage
- Logs and artifacts

This architecture provides a comprehensive and flexible foundation for the Test Automation Management System, allowing for easy maintenance and extension of the system's capabilities.
