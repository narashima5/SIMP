import { apiClient } from './api';

export interface NotificationData {
  _id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async () => {
    return apiClient('/notifications');
  },
  markAsRead: async (id: string) => {
    return apiClient(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },
  markAllAsRead: async () => {
    return apiClient('/notifications/read-all', {
      method: 'PUT',
    });
  },
};
