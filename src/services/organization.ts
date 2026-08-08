import { apiClient } from './api';

export const organizationService = {
  getDashboardStats: async () => {
    return apiClient('/org/dashboard');
  },
  getMyInternships: async () => {
    return apiClient('/org/internships');
  },
  createInternship: async (internshipData: any) => {
    return apiClient('/org/internships', {
      method: 'POST',
      body: internshipData,
    });
  },
  editInternship: async (id: string, internshipData: any) => {
    return apiClient(`/org/internships/${id}`, {
      method: 'PUT',
      body: internshipData,
    });
  },
  deleteInternship: async (id: string) => {
    return apiClient(`/org/internships/${id}`, {
      method: 'DELETE',
    });
  },
  getApplicants: async () => {
    return apiClient('/org/applicants');
  },
  selectCandidate: async (id: string, status: 'accepted' | 'rejected') => {
    return apiClient(`/org/applications/${id}/select`, {
      method: 'PUT',
      body: { status },
    });
  },
  submitFeedback: async (feedback: { studentId: string; internshipId: string; rating: number; comments: string; markCompleted?: boolean }) => {
    return apiClient('/org/feedback', {
      method: 'POST',
      body: feedback,
    });
  },
};
