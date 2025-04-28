import { fetchData } from './index';
import { ProjectSchema, ProjectStatus, ProjectPriority, ProjectCategory } from '../../models/database/schemas';

// Project API endpoints
export const projectApi = {
  // Get all projects
  getProjects: () => fetchData<ProjectSchema[]>('projects'),
  
  // Get project by ID
  getProjectById: (id: string) => fetchData<ProjectSchema>(`projects/${id}`),
  
  // Create new project
  createProject: (data: Omit<ProjectSchema, '_id'>) => fetchData<ProjectSchema>('projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update project
  updateProject: (id: string, data: Partial<ProjectSchema>) => fetchData<ProjectSchema>(`projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete project
  deleteProject: (id: string) => fetchData<{ success: boolean }>(`projects/${id}`, {
    method: 'DELETE',
  }),
  
  // Get projects by status
  getProjectsByStatus: (status: ProjectStatus) => fetchData<ProjectSchema[]>(`projects?status=${status}`),
  
  // Get projects by priority
  getProjectsByPriority: (priority: ProjectPriority) => fetchData<ProjectSchema[]>(`projects?priority=${priority}`),
  
  // Get projects by category
  getProjectsByCategory: (category: ProjectCategory) => fetchData<ProjectSchema[]>(`projects?category=${category}`),
  
  // Get projects by user
  getProjectsByUser: (userId: string) => fetchData<ProjectSchema[]>(`projects?userId=${userId}`),
  
  // Add member to project
  addMemberToProject: (projectId: string, userId: string, role: string) => fetchData<ProjectSchema>(`projects/${projectId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  }),
  
  // Remove member from project
  removeMemberFromProject: (projectId: string, userId: string) => fetchData<ProjectSchema>(`projects/${projectId}/members/${userId}`, {
    method: 'DELETE',
  }),
  
  // Update project stats
  updateProjectStats: (projectId: string, stats: any) => fetchData<ProjectSchema>(`projects/${projectId}/stats`, {
    method: 'PUT',
    body: JSON.stringify(stats),
  }),
};
