import { apiClient } from './api';

export const authService = {
  login: async (credentials: { email: string; password?: string }) => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },
  
  register: async (userData: { email: string; password?: string; role: string; name: string }) => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },
  
  logout: async () => {
    localStorage.removeItem('simp_token');
    localStorage.removeItem('simp_refresh_token');
    localStorage.removeItem('simp_user');
    return apiClient('/auth/logout', { method: 'POST' }).catch(() => {});
  },
};
