import { apiClient } from './api';

export const adminService = {
  getUsers: async () => {
    return apiClient('/admin/users');
  },
  deactivateUser: async (id: string) => {
    return apiClient(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
  getInternships: async () => {
    return apiClient('/admin/internships');
  },
  getReports: async () => {
    return apiClient('/admin/reports');
  },
};
