import { fetchData } from './index';
import { UserSchema, UserRole, UserStatus } from '../../models/database/schemas';

// User API endpoints
export const userApi = {
  // Get all users
  getUsers: () => fetchData<UserSchema[]>('users'),
  
  // Get user by ID
  getUserById: (id: string) => fetchData<UserSchema>(`users/${id}`),
  
  // Create new user
  createUser: (data: Omit<UserSchema, '_id'>) => fetchData<UserSchema>('users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update user
  updateUser: (id: string, data: Partial<UserSchema>) => fetchData<UserSchema>(`users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete user
  deleteUser: (id: string) => fetchData<{ success: boolean }>(`users/${id}`, {
    method: 'DELETE',
  }),
  
  // Get users by role
  getUsersByRole: (role: UserRole) => fetchData<UserSchema[]>(`users?role=${role}`),
  
  // Get users by status
  getUsersByStatus: (status: UserStatus) => fetchData<UserSchema[]>(`users?status=${status}`),
  
  // Get users by project
  getUsersByProject: (projectId: string) => fetchData<UserSchema[]>(`users?projectId=${projectId}`),
  
  // Update user password
  updateUserPassword: (id: string, password: string) => fetchData<UserSchema>(`users/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  }),
  
  // Verify user email
  verifyUserEmail: (id: string, token: string) => fetchData<UserSchema>(`users/${id}/verify-email`, {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),
};
