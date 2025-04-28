import { fetchData } from './index';

// Notifications API endpoints
export const notificationsApi = {
  // Get all notifications
  getNotifications: () => fetchData<any[]>('notifications').catch(() => []),
  
  // Get notification by ID
  getNotificationById: (id: string) => fetchData<any>(`notifications/${id}`),
  
  // Get notifications by user ID
  getNotificationsByUserId: (userId: string) => fetchData<any[]>(`notifications?userId=${userId}`),
  
  // Get unread notifications by user ID
  getUnreadNotificationsByUserId: (userId: string) => fetchData<any[]>(`notifications?userId=${userId}&read=false`),
  
  // Get notifications by type
  getNotificationsByType: (type: string) => fetchData<any[]>(`notifications?type=${type}`),
  
  // Get notifications by date range
  getNotificationsByDateRange: (startDate: Date, endDate: Date) => 
    fetchData<any[]>(`notifications?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
  
  // Create new notification
  createNotification: (data: any) => fetchData<any>('notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update notification
  updateNotification: (id: string, data: any) => fetchData<any>(`notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete notification
  deleteNotification: (id: string) => fetchData<{ success: boolean }>(`notifications/${id}`, {
    method: 'DELETE',
  }),
  
  // Mark notification as read
  markNotificationAsRead: (id: string) => fetchData<any>(`notifications/${id}/read`, {
    method: 'PUT',
    body: JSON.stringify({ read: true }),
  }),
  
  // Mark all notifications as read for a user
  markAllNotificationsAsRead: (userId: string) => fetchData<{ success: boolean }>(`notifications/read-all`, {
    method: 'PUT',
    body: JSON.stringify({ userId }),
  }),
};
