import { apiClient } from './api';

export const coordinatorService = {
  getApplications: async () => {
    return apiClient('/coordinator/applications');
  },
  approveApplication: async (id: string) => {
    return apiClient(`/coordinator/applications/${id}/approve`, {
      method: 'PUT',
    });
  },
  rejectApplication: async (id: string, feedback: string) => {
    return apiClient(`/coordinator/applications/${id}/reject`, {
      method: 'PUT',
      body: { feedback },
    });
  },
  getStudentsProgress: async () => {
    return apiClient('/coordinator/students');
  },
  evaluateReport: async (reportEvaluation: { reportId: string; status: 'approved' | 'rejected'; comments: string }) => {
    return apiClient('/coordinator/evaluations', {
      method: 'POST',
      body: reportEvaluation,
    });
  },
};
