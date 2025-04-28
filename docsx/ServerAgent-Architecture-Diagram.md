# ServerAgent Mimari Diyagramı

Bu belge, `src/models/ServerAgent.ts` dosyasının mimari yapısını görsel olarak göstermektedir.

## Sınıf Diyagramı (Mermaid)

```mermaid
classDiagram
    class ServerAgent {
        +string id
        +SystemResource systemResources
        +AgentStatusSummary agentStatus
        +QueueStatusSummary queueStatus
        +Agent[] activeAgents
        +QueuedRequest[] queuedRequests
        +ProcessedRequest[] processedRequests
        +toServerAgent(data: any): ServerAgent
        +fromServerAgent(serverAgent: ServerAgent): any
    }
    
    class SystemResource {
        +string id
        +number cpuUsage
        +number memoryUsage
        +Date lastUpdated
        +string serverId
        +toSystemResource(data: any): SystemResource
        +fromSystemResource(systemResource: SystemResource): any
    }
    
    class AgentStatusSummary {
        +number total
        +number available
        +number busy
        +number offline
        +number error
        +number maintenance
        +number limit
    }
    
    class QueueStatusSummary {
        +number queued
        +number scheduled
        +number assigned
        +number processing
        +number total
        +number highPriority
        +number mediumPriority
        +number lowPriority
        +number estimatedWaitTime
    }
    
    class Agent {
        +string id
        +string? name
        +AgentType type
        +AgentStatus status
        +BrowserType browser
        +AgentBrowserInfo? browserInfo
        +AgentSystemInfo? systemInfo
        +AgentNetworkInfo networkInfo
        +AgentPerformanceMetrics? performanceMetrics
        +AgentSecurityInfo? securityInfo
        +AgentLoggingInfo? loggingInfo
        +AgentAuthInfo? authInfo
        +AgentHealthCheck? healthCheck
        +string[] capabilities
        +AgentCapabilities? detailedCapabilities
        +string serverId
        +string? serverUrl
        +Date created
        +Date lastActivity
        +string|null currentRequest
        +string version
        +boolean? updateAvailable
        +Date? lastUpdated
    }
    
    class QueuedRequest {
        +string id
        +string testName
        +string? testRunId
        +string? testCaseId
        +string? testSuiteId
        +string? projectId
        +RequestStatus status
        +RequestPriority priority
        +RequestCategory|string category
        +RequestSource? source
        +string browser
        +RequestEnvironment? environment
        +RequestTiming timing
        +RequestDependency[]? dependencies
        +RequestRetryConfig? retryConfig
        +any? payload
        +string[]? tags
        +Record~string,any~? metadata
        +string? createdBy
        +Date? createdAt
        +Date? updatedAt
        +string? assignedAgentId
    }
    
    class ProcessedRequest {
        +string id
        +string testName
        +string? testRunId
        +string? testCaseId
        +string? testSuiteId
        +string? projectId
        +ProcessedRequestStatus status
        +any? result
        +ProcessedRequestError? error
        +string browser
        +string agentId
        +ProcessedRequestPriority? priority
        +ProcessedRequestSource? source
        +Date startTime
        +Date? endTime
        +string duration
        +number? durationMs
        +ProcessedRequestPerformance? performance
        +ProcessedRequestResources? resources
        +ProcessedRequestEnvironment? environment
        +ProcessedRequestLogs? logs
        +string[]? screenshots
        +string[]? videos
        +string[]? artifacts
        +number? retryCount
        +string[]? previousAttempts
        +number? maxRetries
        +string[]? tags
        +Record~string,any~? metadata
        +string? createdBy
        +Date? createdAt
        +Date? updatedAt
    }
    
    ServerAgent "1" -- "1" SystemResource : contains
    ServerAgent "1" -- "1" AgentStatusSummary : contains
    ServerAgent "1" -- "1" QueueStatusSummary : contains
    ServerAgent "1" -- "*" Agent : contains
    ServerAgent "1" -- "*" QueuedRequest : contains
    ServerAgent "1" -- "*" ProcessedRequest : contains
```

## İlişki Diyagramı (Mermaid)

```mermaid
graph TD
    A[ServerAgent] --> B[SystemResource]
    A --> C[AgentStatusSummary]
    A --> D[QueueStatusSummary]
    A --> E[Agent Collection]
    A --> F[QueuedRequest Collection]
    A --> G[ProcessedRequest Collection]
    
    E --> E1[Agent 1]
    E --> E2[Agent 2]
    E --> E3[Agent ...]
    
    F --> F1[QueuedRequest 1]
    F --> F2[QueuedRequest 2]
    F --> F3[QueuedRequest ...]
    
    G --> G1[ProcessedRequest 1]
    G --> G2[ProcessedRequest 2]
    G --> G3[ProcessedRequest ...]
    
    subgraph "Agent Details"
        E1 --> E1_1[Browser Info]
        E1 --> E1_2[System Info]
        E1 --> E1_3[Network Info]
        E1 --> E1_4[Performance Metrics]
        E1 --> E1_5[Security Info]
        E1 --> E1_6[Health Check]
        E1 --> E1_7[Capabilities]
    end
    
    subgraph "QueuedRequest Details"
        F1 --> F1_1[Status & Category]
        F1 --> F1_2[Environment]
        F1 --> F1_3[Timing]
        F1 --> F1_4[Dependencies]
        F1 --> F1_5[Retry Config]
        F1 --> F1_6[Metadata]
    end
    
    subgraph "ProcessedRequest Details"
        G1 --> G1_1[Status & Result]
        G1 --> G1_2[Execution Details]
        G1 --> G1_3[Timing]
        G1 --> G1_4[Performance]
        G1 --> G1_5[Environment]
        G1 --> G1_6[Logs & Artifacts]
        G1 --> G1_7[Retry Info]
        G1 --> G1_8[Metadata]
    end
```

## Veri Akış Diyagramı (Mermaid)

```mermaid
sequenceDiagram
    participant API as API
    participant ServerAgent as ServerAgent Model
    participant DB as MongoDB
    
    API->>ServerAgent: Ham veri (API'den)
    ServerAgent->>ServerAgent: toServerAgent() dönüşümü
    ServerAgent->>API: ServerAgent nesnesi
    
    API->>ServerAgent: ServerAgent nesnesi
    ServerAgent->>ServerAgent: fromServerAgent() dönüşümü
    ServerAgent->>DB: Ham veri (DB'ye)
    
    DB->>API: Ham veri (DB'den)
    API->>ServerAgent: Ham veri
    ServerAgent->>ServerAgent: toServerAgent() dönüşümü
    ServerAgent->>API: ServerAgent nesnesi
```

## Özet

ServerAgent modeli, test otomasyon sisteminin sunucu durumunu temsil eden merkezi bir modeldir. Bu model, sunucu kaynakları, ajan durumu, kuyruk durumu, aktif ajanlar, kuyrukta bekleyen istekler ve işlenmiş istekler gibi bilgileri içerir. Model, ham veriyi model yapısına ve model yapısını ham veriye dönüştürmek için fonksiyonlar sağlar.
