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
  getInternships: async (search?: string) => {
    return apiClient(`/students/internships${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },
  applyInternship: async (application: { internshipId: string; coverLetter: string }) => {
    return apiClient('/students/apply', {
      method: 'POST',
      body: application,
    });
  },
  getApplications: async () => {
    return apiClient('/students/applications');
  },
  withdrawApplication: async (id: string) => {
    return apiClient(`/students/application/${id}`, {
      method: 'DELETE',
    });
  },
  submitLogsheet: async (report: {
    weekNumber: number;
    startDate: string;
    endDate: string;
    tasksCompleted: string;
    challengesFaced?: string;
    hoursLogged: number;
  }) => {
    return apiClient('/students/report', {
      method: 'POST',
      body: report,
    });
  },
  updateLogsheet: async (
    id: string,
    report: {
      startDate?: string;
      endDate?: string;
      tasksCompleted?: string;
      challengesFaced?: string;
      hoursLogged?: number;
    }
  ) => {
    return apiClient(`/students/report/${id}`, {
      method: 'PUT',
      body: report,
    });
  },
  uploadDocument: async (formData: FormData) => {
    return apiClient('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },
  getReports: async () => {
    return apiClient('/students/reports');
  },
  getDocuments: async () => {
    return apiClient('/students/documents');
  },
};
