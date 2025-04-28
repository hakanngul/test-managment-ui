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
- Docker (for MongoDB)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

You can run the application in several ways:

#### Development Mode with MongoDB

1. Start MongoDB using Docker:

```bash
./start-mongodb.sh
```

2. Initialize the database with sample data:

```bash
npm run init-database
```

3. Run the frontend and API server concurrently:

```bash
npm run dev:all
```

This will start:
- Vite development server at http://localhost:5173
- Express API server at http://localhost:3001

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

#### API Server Only

If you want to run only the API server:

```bash
npm run api
```

## API Server

The application uses Express and MongoDB to provide a RESTful API.

### Available Endpoints

- `/api/users` - User data
- `/api/projects` - Project data
- `/api/testCases` - Test case data
- `/api/testSuites` - Test suite data
- `/api/testRuns` - Test run data
- `/api/serverAgent` - Server agent status
- `/api/notifications` - Notification data

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
  - `/models` - Data models
    - `/database` - MongoDB schemas and repositories
      - `/schemas` - MongoDB schema definitions
      - `/repository` - MongoDB repository classes
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
  - `/scripts` - Utility scripts
- `/server` - Express API server
- `/data` - Mock data for JSON Server
- `/public` - Static assets

## Technologies

- React
- TypeScript
- Material-UI
- React Router
- ApexCharts
- Express.js
- MongoDB
- JSON Server (for development)
