# Test Automation Platform - MongoDB Şeması

## Koleksiyonlar ve İlişkiler

### Temel Koleksiyonlar

1. **users**
   - Kullanıcı bilgilerini içerir
   - Alanlar: id, name, email, role, avatar

2. **projects**
   - Proje bilgilerini içerir
   - Alanlar: id, name, description, status, priority, members, createdAt, updatedAt
   - İlişkiler: members -> users

3. **testCases**
   - Test case bilgilerini içerir
   - Alanlar: id, title, description, status, priority, steps, tags, projectId, browsers, createdBy, createdAt, updatedAt
   - İlişkiler: projectId -> projects, steps -> testSteps, createdBy -> users

4. **testSteps**
   - Test adımlarını içerir
   - Alanlar: id, order, action, target, targetType, value, description, expectedResult, screenshot, isManual, testCaseId
   - İlişkiler: testCaseId -> testCases

5. **testSuites**
   - Test suite bilgilerini içerir
   - Alanlar: id, name, description, status, priority, progress, testCases, projectId, tags, executionMode, browsers, createdBy, createdAt, updatedAt
   - İlişkiler: testCases -> testCases, projectId -> projects, createdBy -> users

6. **testRuns**
   - Test çalıştırma bilgilerini içerir
   - Alanlar: id, name, description, status, priority, projectId, testSuiteId, testCaseIds, environment, browsers, startTime, endTime, duration, results, createdBy, createdAt, updatedAt
   - İlişkiler: projectId -> projects, testSuiteId -> testSuites, testCaseIds -> testCases, results -> testResults, createdBy -> users

7. **testResults**
   - Test sonuçlarını içerir
   - Alanlar: id, testRunId, testCaseId, testSuiteId, status, startTime, endTime, duration, environment, browser, errorMessage, steps, createdAt
   - İlişkiler: testRunId -> testRuns, testCaseId -> testCases, testSuiteId -> testSuites, steps -> testStepResults

8. **testStepResults**
   - Test adım sonuçlarını içerir
   - Alanlar: id, testResultId, testStepId, order, description, expectedResult, actualResult, status, duration, startTime, endTime, errorMessage, screenshot, createdAt
   - İlişkiler: testResultId -> testResults, testStepId -> testSteps

### Yardımcı Koleksiyonlar

9. **testCategories**
   - Test kategorilerini içerir
   - Alanlar: id, name, description

10. **testPriorities**
    - Test önceliklerini içerir
    - Alanlar: id, name, description, color

11. **testStatuses**
    - Test durumlarını içerir
    - Alanlar: id, name, description, color

12. **testEnvironments**
    - Test ortamlarını içerir
    - Alanlar: id, name, description, url

13. **availableActions**
    - Kullanılabilir test adımı aksiyonlarını içerir
    - Alanlar: id, name, description, type

### İzleme ve Metrik Koleksiyonları

14. **systemResourcesData**
    - Sistem kaynak kullanım verilerini içerir
    - Alanlar: id, timestamp, cpu, memory, disk, network

15. **agentStatusData**
    - Test ajanı durum verilerini içerir
    - Alanlar: id, timestamp, agentId, status, lastHeartbeat, version

16. **queueStatusData**
    - Kuyruk durum verilerini içerir
    - Alanlar: id, timestamp, queueLength, processingTime, waitTime

17. **activeAgentsData**
    - Aktif test ajanlarını içerir
    - Alanlar: id, agentId, name, status, currentTest, uptime, lastHeartbeat

18. **queuedRequestsData**
    - Kuyrukta bekleyen test isteklerini içerir
    - Alanlar: id, testName, description, status, queuePosition, estimatedStartTime, queuedAt, browser, priority

19. **processedRequestsData**
    - İşlenmiş test isteklerini içerir
    - Alanlar: id, testName, testRunId, testCaseId, status, result, startTime, endTime, duration, browser, agentId

20. **detailedTestResults**
    - Detaylı test sonuçlarını içerir
    - Alanlar: id, testRunId, testCaseId, status, startTime, endTime, duration, browser, environment, errorMessage, screenshots, logs

21. **performanceMetrics**
    - Performans metriklerini içerir
    - Alanlar: id, timestamp, metric, value, tags

## Şema Diyagramı

```
users <---- projects
  ^           ^
  |           |
  |           |
  +---- testCases <---- testSteps
  |           ^
  |           |
  |           |
  +---- testSuites
  |           ^
  |           |
  |           |
  +---- testRuns <---- testResults <---- testStepResults
```

## Test Case ve Test Steps İlişkisi

Test case ve test steps arasındaki ilişki iki şekilde olabilir:

1. **Gömülü Belge (Embedded Document)**: Test adımları, test case belgesinin içinde bir dizi olarak saklanır.
   ```json
   {
     "id": "a408acf5-72f2-43d8-8d73-7f8c203c30b0",
     "title": "Test Case 1",
     "description": "Description for Test Case 1",
     "status": "active",
     "priority": "medium",
     "steps": [
       {
         "id": "step-1",
         "order": 1,
         "action": "navigate",
         "target": "https://example.com",
         "description": "Navigate to example.com",
         "expectedResult": "Page loads successfully",
         "type": "automated"
       },
       {
         "id": "step-2",
         "order": 2,
         "action": "click",
         "target": "#login-button",
         "description": "Click on login button",
         "expectedResult": "Login form appears",
         "type": "automated"
       }
     ],
     "tags": ["login", "authentication"],
     "projectId": "project-1",
     "createdBy": "John Doe",
     "createdAt": "2023-04-28T01:03:00.000Z",
     "updatedAt": "2023-04-28T01:03:00.000Z"
   }
   ```

2. **Referans (Reference)**: Test adımları ayrı bir koleksiyonda saklanır ve test case belgesinde sadece referanslar bulunur.
   ```json
   // testCases koleksiyonu
   {
     "id": "a408acf5-72f2-43d8-8d73-7f8c203c30b0",
     "title": "Test Case 1",
     "description": "Description for Test Case 1",
     "status": "active",
     "priority": "medium",
     "steps": ["step-1", "step-2", "step-3"],
     "tags": ["login", "authentication"],
     "projectId": "project-1",
     "createdBy": "John Doe",
     "createdAt": "2023-04-28T01:03:00.000Z",
     "updatedAt": "2023-04-28T01:03:00.000Z"
   }

   // testSteps koleksiyonu
   {
     "id": "step-1",
     "order": 1,
     "action": "navigate",
     "target": "https://example.com",
     "description": "Navigate to example.com",
     "expectedResult": "Page loads successfully",
     "type": "automated",
     "testCaseId": "a408acf5-72f2-43d8-8d73-7f8c203c30b0"
   }
   ```

Projede kullanılan yaklaşım, test adımlarının test case belgesinin içinde gömülü olarak saklanması gibi görünüyor. Bu durumda, test adımlarının kaybolması, API'den gelen verilerde steps dizisinin boş olması veya doğru formatta olmaması nedeniyle olabilir.
