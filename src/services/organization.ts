import { apiClient } from './api';

export const organizationService = {
  createInternship: async (internshipData: any) => {
    return apiClient('/org/internships', {
      method: 'POST',
      body: internshipData,
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
  submitFeedback: async (feedback: { studentId: string; internshipId: string; rating: number; comments: string }) => {
    return apiClient('/org/feedback', {
      method: 'POST',
      body: feedback,
    });
  },
};
