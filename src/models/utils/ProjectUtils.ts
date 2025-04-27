import { 
  Project, 
  ProjectCreate, 
  ProjectUpdate,
  ProjectMember,
  ProjectConfig,
  ProjectTimeline,
  ProjectIntegration,
  ProjectStats
} from '../interfaces/Project';
import { 
  ProjectStatus, 
  ProjectPriority, 
  ProjectCategory, 
  ProjectMemberRole, 
  ProjectEnvironment 
} from '../enums/ProjectEnums';

// Convert raw project data to Project model
export const toProject = (data: any): Project => {
  return {
    id: data.id || data._id,
    name: data.name,
    description: data.description,
    
    // Status and categorization
    status: data.status as ProjectStatus || ProjectStatus.ACTIVE,
    priority: data.priority as ProjectPriority,
    category: data.category as ProjectCategory,
    tags: data.tags || [],
    
    // Members
    members: data.members ? data.members.map((m: any) => ({
      userId: m.userId,
      role: m.role as ProjectMemberRole,
      joinedAt: m.joinedAt ? new Date(m.joinedAt) : new Date(),
      invitedBy: m.invitedBy,
      permissions: m.permissions
    })) : [],
    
    // Configuration
    config: data.config,
    
    // Timeline
    timeline: data.timeline ? {
      startDate: data.timeline.startDate ? new Date(data.timeline.startDate) : undefined,
      endDate: data.timeline.endDate ? new Date(data.timeline.endDate) : undefined,
      milestones: data.timeline.milestones ? data.timeline.milestones.map((m: any) => ({
        ...m,
        dueDate: m.dueDate ? new Date(m.dueDate) : new Date(),
        completedAt: m.completedAt ? new Date(m.completedAt) : undefined
      })) : undefined,
      releases: data.timeline.releases ? data.timeline.releases.map((r: any) => ({
        ...r,
        releaseDate: r.releaseDate ? new Date(r.releaseDate) : new Date()
      })) : undefined
    } : undefined,
    
    // Integrations
    integrations: data.integrations,
    
    // Related projects
    parentProjectId: data.parentProjectId,
    subProjects: data.subProjects,
    relatedProjects: data.relatedProjects,
    
    // Metadata
    createdBy: data.createdBy,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedBy: data.updatedBy,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    
    // Statistics
    stats: data.stats ? {
      ...data.stats,
      lastActivity: data.stats.lastActivity ? new Date(data.stats.lastActivity) : undefined,
      lastSuccessfulRun: data.stats.lastSuccessfulRun ? new Date(data.stats.lastSuccessfulRun) : undefined,
      lastFailedRun: data.stats.lastFailedRun ? new Date(data.stats.lastFailedRun) : undefined
    } : undefined
  };
};

// Convert Project model to raw data for API
export const fromProject = (project: Project): any => {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    
    // Status and categorization
    status: project.status,
    priority: project.priority,
    category: project.category,
    tags: project.tags,
    
    // Members
    members: project.members ? project.members.map(m => ({
      ...m,
      joinedAt: m.joinedAt.toISOString()
    })) : [],
    
    // Configuration
    config: project.config,
    
    // Timeline
    timeline: project.timeline ? {
      startDate: project.timeline.startDate?.toISOString(),
      endDate: project.timeline.endDate?.toISOString(),
      milestones: project.timeline.milestones ? project.timeline.milestones.map(m => ({
        ...m,
        dueDate: m.dueDate.toISOString(),
        completedAt: m.completedAt?.toISOString()
      })) : undefined,
      releases: project.timeline.releases ? project.timeline.releases.map(r => ({
        ...r,
        releaseDate: r.releaseDate.toISOString()
      })) : undefined
    } : undefined,
    
    // Integrations
    integrations: project.integrations,
    
    // Related projects
    parentProjectId: project.parentProjectId,
    subProjects: project.subProjects,
    relatedProjects: project.relatedProjects,
    
    // Metadata
    createdBy: project.createdBy,
    createdAt: project.createdAt?.toISOString(),
    updatedBy: project.updatedBy,
    updatedAt: project.updatedAt?.toISOString(),
    
    // Statistics
    stats: project.stats ? {
      ...project.stats,
      lastActivity: project.stats.lastActivity?.toISOString(),
      lastSuccessfulRun: project.stats.lastSuccessfulRun?.toISOString(),
      lastFailedRun: project.stats.lastFailedRun?.toISOString()
    } : undefined
  };
};

// Calculate project statistics
export const calculateProjectStats = (
  testCases: any[],
  testSuites: any[],
  testRuns: any[]
): ProjectStats => {
  // Default stats
  const stats: ProjectStats = {
    totalTestCases: testCases.length,
    totalTestSuites: testSuites.length,
    totalTestRuns: testRuns.length,
    passRate: 0,
    failRate: 0,
    pendingRate: 0,
    blockedRate: 0,
    testCasesByStatus: {},
    testCasesByPriority: {},
    testCasesByCategory: {},
    testRunsByDate: {}
  };
  
  // Skip calculation if no data
  if (testRuns.length === 0) {
    return stats;
  }
  
  // Calculate pass/fail rates
  let totalResults = 0;
  let passCount = 0;
  let failCount = 0;
  let pendingCount = 0;
  let blockedCount = 0;
  let totalExecutionTime = 0;
  
  // Process test runs
  testRuns.forEach(run => {
    if (run.results && run.results.length > 0) {
      totalResults += run.results.length;
      passCount += run.results.filter((r: any) => r.status === 'passed').length;
      failCount += run.results.filter((r: any) => r.status === 'failed').length;
      pendingCount += run.results.filter((r: any) => r.status === 'pending').length;
      blockedCount += run.results.filter((r: any) => r.status === 'blocked').length;
    }
    
    if (run.duration) {
      totalExecutionTime += run.duration;
    }
    
    // Group runs by date
    const runDate = new Date(run.startTime || run.createdAt).toISOString().split('T')[0];
    stats.testRunsByDate = stats.testRunsByDate || {};
    stats.testRunsByDate[runDate] = (stats.testRunsByDate[runDate] || 0) + 1;
  });
  
  // Calculate rates
  if (totalResults > 0) {
    stats.passRate = (passCount / totalResults) * 100;
    stats.failRate = (failCount / totalResults) * 100;
    stats.pendingRate = (pendingCount / totalResults) * 100;
    stats.blockedRate = (blockedCount / totalResults) * 100;
  }
  
  // Calculate average execution time
  if (testRuns.length > 0) {
    stats.avgExecutionTime = totalExecutionTime / testRuns.length;
  }
  
  // Group test cases by status
  stats.testCasesByStatus = {};
  testCases.forEach(tc => {
    const status = tc.status || 'unknown';
    stats.testCasesByStatus![status] = (stats.testCasesByStatus![status] || 0) + 1;
  });
  
  // Group test cases by priority
  stats.testCasesByPriority = {};
  testCases.forEach(tc => {
    const priority = tc.priority || 'unknown';
    stats.testCasesByPriority![priority] = (stats.testCasesByPriority![priority] || 0) + 1;
  });
  
  // Group test cases by category
  stats.testCasesByCategory = {};
  testCases.forEach(tc => {
    const category = tc.category || 'unknown';
    stats.testCasesByCategory![category] = (stats.testCasesByCategory![category] || 0) + 1;
  });
  
  // Find last activity dates
  const runDates = testRuns.map(r => new Date(r.startTime || r.createdAt));
  if (runDates.length > 0) {
    stats.lastActivity = new Date(Math.max(...runDates.map(d => d.getTime())));
    
    const successfulRuns = testRuns.filter(r => r.status === 'completed' || r.status === 'passed');
    if (successfulRuns.length > 0) {
      const successDates = successfulRuns.map(r => new Date(r.startTime || r.createdAt));
      stats.lastSuccessfulRun = new Date(Math.max(...successDates.map(d => d.getTime())));
    }
    
    const failedRuns = testRuns.filter(r => r.status === 'failed');
    if (failedRuns.length > 0) {
      const failDates = failedRuns.map(r => new Date(r.startTime || r.createdAt));
      stats.lastFailedRun = new Date(Math.max(...failDates.map(d => d.getTime())));
    }
  }
  
  // Calculate trends data (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentRuns = testRuns.filter(r => {
    const runDate = new Date(r.startTime || r.createdAt);
    return runDate >= thirtyDaysAgo && runDate <= today;
  });
  
  if (recentRuns.length > 0) {
    // Group by day
    const runsByDay: Record<string, any[]> = {};
    recentRuns.forEach(run => {
      const dateStr = new Date(run.startTime || run.createdAt).toISOString().split('T')[0];
      runsByDay[dateStr] = runsByDay[dateStr] || [];
      runsByDay[dateStr].push(run);
    });
    
    // Generate dates array (last 30 days)
    const dates: string[] = [];
    const passRates: number[] = [];
    const failRates: number[] = [];
    const executionTimes: number[] = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(dateStr);
      
      const dayRuns = runsByDay[dateStr] || [];
      if (dayRuns.length > 0) {
        let dayPassCount = 0;
        let dayFailCount = 0;
        let dayTotalResults = 0;
        let dayTotalTime = 0;
        
        dayRuns.forEach(run => {
          if (run.results && run.results.length > 0) {
            dayTotalResults += run.results.length;
            dayPassCount += run.results.filter((r: any) => r.status === 'passed').length;
            dayFailCount += run.results.filter((r: any) => r.status === 'failed').length;
          }
          
          if (run.duration) {
            dayTotalTime += run.duration;
          }
        });
        
        passRates.push(dayTotalResults > 0 ? (dayPassCount / dayTotalResults) * 100 : 0);
        failRates.push(dayTotalResults > 0 ? (dayFailCount / dayTotalResults) * 100 : 0);
        executionTimes.push(dayRuns.length > 0 ? dayTotalTime / dayRuns.length : 0);
      } else {
        passRates.push(0);
        failRates.push(0);
        executionTimes.push(0);
      }
    }
    
    stats.trendsData = {
      dates,
      passRates,
      failRates,
      executionTimes
    };
  }
  
  return stats;
};

// Create default project configuration
export const createDefaultProjectConfig = (): ProjectConfig => {
  return {
    defaultEnvironment: ProjectEnvironment.TESTING,
    supportedEnvironments: [
      ProjectEnvironment.DEVELOPMENT,
      ProjectEnvironment.TESTING,
      ProjectEnvironment.STAGING,
      ProjectEnvironment.PRODUCTION
    ],
    defaultBrowsers: ['chromium'],
    defaultHeadless: true,
    defaultRetryCount: 1,
    defaultTimeout: 30000, // 30 seconds
    screenshotOnFailure: true,
    videoRecording: false,
    parallelExecution: false,
    maxParallelTests: 1
  };
};

// Create default project timeline
export const createDefaultProjectTimeline = (): ProjectTimeline => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(today.getMonth() + 3); // 3 months from now
  
  return {
    startDate: today,
    endDate: endDate,
    milestones: [],
    releases: []
  };
};

// Create a new project member
export const createProjectMember = (
  userId: string,
  role: ProjectMemberRole = ProjectMemberRole.TESTER,
  invitedBy?: string
): ProjectMember => {
  return {
    userId,
    role,
    joinedAt: new Date(),
    invitedBy,
    permissions: []
  };
};

// Check if user has specific role in project
export const hasProjectRole = (
  project: Project,
  userId: string,
  roles: ProjectMemberRole[]
): boolean => {
  const member = project.members.find(m => m.userId === userId);
  if (!member) {
    return false;
  }
  
  return roles.includes(member.role);
};

// Check if user is project owner or admin
export const isProjectAdmin = (project: Project, userId: string): boolean => {
  return hasProjectRole(project, userId, [ProjectMemberRole.OWNER, ProjectMemberRole.ADMIN]);
};
