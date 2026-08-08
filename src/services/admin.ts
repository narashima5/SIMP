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
  moderateInternship: async (id: string, status: string) => {
    return apiClient(`/admin/internships/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
  },
  getApplications: async () => {
    return apiClient('/admin/applications');
  },
  getReports: async () => {
    return apiClient('/admin/reports');
  },
};
