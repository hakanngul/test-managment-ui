// Project model
export interface Project {
  id: string;
  name: string;
  description: string;
  members: string[]; // User IDs
  createdAt?: Date;
  updatedAt?: Date;
}

// Project creation model
export interface ProjectCreate {
  name: string;
  description: string;
  members: string[];
}

// Project update model
export interface ProjectUpdate {
  name?: string;
  description?: string;
  members?: string[];
}

// Project statistics
export interface ProjectStats {
  totalTestCases: number;
  totalTestSuites: number;
  totalTestRuns: number;
  passRate: number;
  failRate: number;
  pendingRate: number;
  blockedRate: number;
  lastActivity?: Date;
}

// Convert raw project data to Project model
export const toProject = (data: any): Project => {
  return {
    id: data.id || data._id,
    name: data.name,
    description: data.description,
    members: data.members || [],
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
  };
};

// Convert Project model to raw data for API
export const fromProject = (project: Project): any => {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    members: project.members,
    createdAt: project.createdAt?.toISOString(),
    updatedAt: project.updatedAt?.toISOString()
  };
};
