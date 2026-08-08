import { apiClient } from './api';

export const coordinatorService = {
  getDashboard: async () => {
    return apiClient('/faculty/dashboard');
  },
  getApplications: async () => {
    return apiClient('/faculty/applications');
  },
  approveApplication: async (id: string) => {
    return apiClient(`/faculty/application/${id}/approve`, {
      method: 'PUT',
    });
  },
  rejectApplication: async (id: string, feedback: string) => {
    return apiClient(`/faculty/application/${id}/reject`, {
      method: 'PUT',
      body: { feedback },
    });
  },
  getReports: async () => {
    return apiClient('/faculty/reports');
  },
  evaluateReport: async (reportEvaluation: { reportId: string; status: 'approved' | 'rejected'; comments: string }) => {
    return apiClient('/faculty/evaluation', {
      method: 'POST',
      body: reportEvaluation,
    });
  },
  submitFinalEvaluation: async (studentId: string, comments: string) => {
    return apiClient('/faculty/evaluation', {
      method: 'POST',
      body: {
        isFinal: true,
        studentId,
        comments,
      },
    });
  },
};
