import { apiClient } from './api';

export const studentService = {
  getProfile: async () => {
    return apiClient('/students/profile');
  },
  updateProfile: async (profileData: any) => {
    return apiClient('/students/profile', {
      method: 'PUT',
      body: profileData,
    });
  },
  applyInternship: async (application: { internshipId: string; coverLetter: string }) => {
    return apiClient('/students/applications', {
      method: 'POST',
      body: application,
    });
  },
  uploadResume: async (formData: FormData) => {
    return apiClient('/students/documents', {
      method: 'POST',
      headers: {
        // Fetch automatically configures boundary if headers are empty, so we do not hardcode content-type for multipart
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },
  submitLogsheet: async (report: { weekNumber: number; tasksCompleted: string; hoursLogged: number; challengesFaced?: string }) => {
    return apiClient('/students/reports', {
      method: 'POST',
      body: report,
    });
  },
  getApplications: async () => {
    return apiClient('/students/applications');
  },
};
