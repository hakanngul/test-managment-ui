# Test Automation Platform

A modern test automation platform for managing test cases, test suites, and test runs.

## Features

- Dashboard with key metrics and recent activity
- Test case management
- Test suite creation and execution
- Test run tracking and reporting
- Server agent monitoring
- User and project management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

You can run the application in two ways:

#### Development Mode with Mock Data

Run the frontend and JSON Server concurrently:

```bash
npm run dev:all
```

This will start:
- Vite development server at http://localhost:5173
- JSON Server at http://localhost:3001

#### Frontend Only

If you want to run only the frontend:

```bash
npm run dev
```

#### JSON Server Only

If you want to run only the JSON Server:

```bash
npm run server
```

## JSON Server

The application uses JSON Server to provide a mock API. All mock data is stored in `data/db.json`.

### Available Endpoints

- `/users` - User data
- `/projects` - Project data
- `/testCases` - Test case data
- `/testSuites` - Test suite data
- `/testRuns` - Test run data
- `/serverAgent` - Server agent status
- `/notifications` - Notification data

### Example API Requests

Get all test cases:
```
GET http://localhost:3001/testCases
```

Get a specific test case:
```
GET http://localhost:3001/testCases/tc-1
```

Create a new test case:
```
POST http://localhost:3001/testCases
Content-Type: application/json

{
  "title": "New Test Case",
  "description": "Description of the new test case",
  "status": "draft",
  "priority": "medium",
  "steps": [],
  "tags": ["api", "new"],
  "projectId": "1"
}
```

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Application pages
  - `/services` - API services
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
- `/data` - Mock data for JSON Server
- `/public` - Static assets

## Technologies

- React
- TypeScript
- Material-UI
- React Router
- ApexCharts
- JSON Server
