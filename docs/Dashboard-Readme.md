# Dashboard Page Architecture and Database Design

## Overview
The Dashboard page provides a comprehensive overview of test automation metrics and test case statuses. It displays key performance indicators, charts for status distribution and execution time, and a table of test cases.

## Component Structure
The Dashboard page is composed of the following components:
- **MetricsCards**: Displays key metrics (total tests, pass rate, average duration, failed tests)
- **StatusDistributionChart**: Pie chart showing test status distribution
- **ExecutionTimeChart**: Line chart showing execution time trends
- **TestResultsChart**: Bar chart showing test results by day
- **TestTable**: Table displaying test cases with filtering and sorting capabilities

## Current Data Flow
1. The `useDashboardData` hook fetches data from multiple API endpoints
2. Data is transformed and processed in the Dashboard component
3. Processed data is passed to child components for rendering

## Database Requirements (NoSQL - MongoDB/Firestore)

### Collections

#### 1. TestCases Collection
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "status": "String",  // "active", "inactive", "draft", "archived" (will be mapped to "Passed", "Failed", "Pending", "Blocked")
  "priority": "String", // "high", "medium", "low"
  "tags": ["String"],
  "lastRun": "Date",
  "duration": "Number",
  "environment": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "createdBy": "String"
}
```

#### 2. TestRuns Collection
```json
{
  "_id": "ObjectId",
  "testCaseId": "ObjectId",
  "status": "String",  // "passed", "failed", "pending", "blocked"
  "startTime": "Date",
  "endTime": "Date",
  "duration": "Number",
  "environment": "String",
  "browser": "String",
  "device": "String",
  "createdAt": "Date"
}
```

#### 3. TestMetrics Collection
```json
{
  "_id": "ObjectId",
  "date": "Date",
  "totalTests": "Number",
  "passedTests": "Number",
  "failedTests": "Number",
  "pendingTests": "Number",
  "blockedTests": "Number",
  "avgDuration": "Number",
  "passRate": "Number"
}
```

#### 4. TestCategories Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String"
}
```

#### 5. TestPriorities Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String"
}
```

#### 6. TestStatuses Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String"
}
```

#### 7. TestEnvironments Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String"
}
```

### Queries for Dashboard Data

1. **Recent Test Cases**:
   ```javascript
   db.TestCases.find().sort({ updatedAt: -1 }).limit(10)
   ```

2. **Test Status Distribution**:
   ```javascript
   db.TestCases.aggregate([
     { $group: { _id: "$status", count: { $sum: 1 } } }
   ])
   ```

3. **Test Execution Time Data (Last 7 Days)**:
   ```javascript
   db.TestRuns.aggregate([
     { $match: { startTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
     { $group: { 
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
         avgDuration: { $avg: "$duration" }
       }
     },
     { $sort: { "_id": 1 } }
   ])
   ```

4. **Test Results by Day (Last 7 Days)**:
   ```javascript
   db.TestRuns.aggregate([
     { $match: { startTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
     { $group: { 
         _id: { 
           date: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
           status: "$status"
         },
         count: { $sum: 1 }
       }
     },
     { $sort: { "_id.date": 1 } }
   ])
   ```

## Implementation Changes Needed

1. **API Service Updates**:
   - Update the `fetchData` function to connect to MongoDB/Firestore instead of json-server
   - Implement proper error handling for database connection issues

2. **Data Transformation**:
   - Update the data transformation logic to handle the new database schema
   - Ensure proper mapping of status values from database to UI representation

3. **Real-time Updates**:
   - Consider implementing real-time updates using Firestore listeners or MongoDB change streams
   - Update the UI components to handle real-time data changes

4. **Performance Optimization**:
   - Implement pagination for the test cases table
   - Consider caching frequently accessed data
   - Use aggregation pipelines for complex metrics calculations

## Indexes for Performance

For MongoDB, create the following indexes to optimize query performance:

```javascript
db.TestCases.createIndex({ status: 1 })
db.TestCases.createIndex({ updatedAt: -1 })
db.TestRuns.createIndex({ startTime: -1 })
db.TestRuns.createIndex({ testCaseId: 1 })
```

For Firestore, consider similar indexing strategies based on your query patterns.
