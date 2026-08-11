import axios from 'axios';
import {
  mockStudentProfile,
  mockStudentReports,
  mockStudentApplications,
  mockStudentDocuments,
  mockCoordinatorDashboard,
  mockCoordinatorApplications,
  mockCoordinatorReports,
  mockOrgDashboard,
  mockOrgInternships,
  mockOrgApplicants,
  mockAdminUsers,
  mockAdminInternships,
  mockAdminApplications,
  mockAdminStats,
  mockNotifications,
  mockInternshipListings,
} from './mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Interceptor
// Returns canned responses when the sandbox mock token is in localStorage.
// All write operations (POST, PUT, DELETE) return a success acknowledgement so
// the dashboard UI can exercise its full interaction flow offline.
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_TOKEN = 'mock_jwt_token_for_development';

/** Wraps mock payload in the same `{ data: ... }` envelope the real API uses */
const ok = (data: unknown) => ({ data, success: true });

/** Simulates a short network delay so spinners are visible */
const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

// Route-pattern → mock-response mapper
const mockRoutes: Array<{ match: RegExp | string; method?: string; response: () => unknown }> = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  { match: '/auth/login',   method: 'POST',   response: () => ok({ token: MOCK_TOKEN, refreshToken: 'mock_refresh', user: mockStudentProfile }) },
  { match: '/auth/logout',  method: 'POST',   response: () => ok({ message: 'Logged out' }) },
  { match: '/auth/refresh', method: 'POST',   response: () => ok({ token: MOCK_TOKEN }) },

  // ── Student ───────────────────────────────────────────────────────────────
  { match: '/students/profile',                         response: () => ok(mockStudentProfile) },
  { match: '/students/profile',        method: 'PUT',   response: () => ok(mockStudentProfile) },
  { match: '/students/reports',                         response: () => ok(mockStudentReports) },
  { match: '/students/report',         method: 'POST',  response: () => ok({ ...mockStudentReports[0], _id: `log_new_${Date.now()}`, status: 'pending' }) },
  { match: /\/students\/report\/.+/,   method: 'PUT',   response: () => ok({ success: true }) },
  { match: '/students/applications',                    response: () => ok(mockStudentApplications) },
  { match: '/students/apply',          method: 'POST',  response: () => ok({ _id: `app_new_${Date.now()}`, status: 'pending' }) },
  { match: /\/students\/application\/.+/, method: 'DELETE', response: () => ok({ success: true }) },
  { match: '/students/internships',                     response: () => ok(mockInternshipListings) },
  { match: '/students/documents',                       response: () => ok(mockStudentDocuments) },
  { match: '/upload',                  method: 'POST',  response: () => ok({ url: '#', originalName: 'uploaded_file.pdf', category: 'resume' }) },

  // ── Coordinator ───────────────────────────────────────────────────────────
  { match: '/faculty/dashboard',                        response: () => ok(mockCoordinatorDashboard) },
  { match: '/faculty/applications',                     response: () => ok(mockCoordinatorApplications) },
  { match: /\/faculty\/application\/.+\/approve/,       method: 'PUT',  response: () => ok({ success: true }) },
  { match: /\/faculty\/application\/.+\/reject/,        method: 'PUT',  response: () => ok({ success: true }) },
  { match: '/faculty/reports',                          response: () => ok(mockCoordinatorReports) },
  { match: '/faculty/evaluation',      method: 'POST',  response: () => ok({ success: true }) },

  // ── Organization ──────────────────────────────────────────────────────────
  { match: '/org/dashboard',                            response: () => ok(mockOrgDashboard) },
  { match: '/org/internships',                          response: () => ok(mockOrgInternships) },
  { match: '/org/internships',         method: 'POST',  response: () => ok({ ...mockOrgInternships[0], _id: `oint_new_${Date.now()}` }) },
  { match: /\/org\/internships\/.+/,   method: 'PUT',   response: () => ok({ success: true }) },
  { match: /\/org\/internships\/.+/,   method: 'DELETE',response: () => ok({ success: true }) },
  { match: '/org/applicants',                           response: () => ok(mockOrgApplicants) },
  { match: /\/org\/applications\/.+\/select/, method: 'PUT', response: () => ok({ success: true }) },
  { match: '/org/feedback',            method: 'POST',  response: () => ok({ success: true }) },

  // ── Admin ─────────────────────────────────────────────────────────────────
  { match: '/admin/users',                              response: () => ok(mockAdminUsers) },
  { match: /\/admin\/users\/.+/,       method: 'DELETE',response: () => ok({ success: true }) },
  { match: '/admin/internships',                        response: () => ok(mockAdminInternships) },
  { match: /\/admin\/internships\/.+\/status/, method: 'PUT', response: () => ok({ success: true }) },
  { match: '/admin/applications',                       response: () => ok(mockAdminApplications) },
  { match: '/admin/reports',                            response: () => ok(mockAdminStats) },

  // ── Notifications ─────────────────────────────────────────────────────────
  { match: '/notifications',                            response: () => ok(mockNotifications) },
  { match: /\/notifications\/.+\/read/,  method: 'PUT', response: () => ok({ success: true }) },
  { match: '/notifications/read-all',  method: 'PUT',  response: () => ok({ success: true }) },
];

/**
 * Resolve a mock response for the given endpoint + method.
 * Returns `null` if no match is found.
 */
const resolveMock = (endpoint: string, method: string): unknown | null => {
  for (const route of mockRoutes) {
    const methodMatches = !route.method || route.method.toUpperCase() === method.toUpperCase();
    const pathMatches =
      typeof route.match === 'string'
        ? endpoint === route.match || endpoint.startsWith(route.match + '?')
        : route.match.test(endpoint);

    if (methodMatches && pathMatches) {
      return route.response();
    }
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Real Axios Instance (used when NOT in mock mode)
// ─────────────────────────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: automatically inject bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('simp_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: handle token refresh and auto-logout on expiration
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to expired access token (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Do not try to refresh if it's already a refresh or login request
      if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/auth/login') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('simp_refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        // Broadcast token expiration for AuthContext to catch
        window.dispatchEvent(new Event('simp_auth_expired'));
        return Promise.reject(error);
      }

      try {
        // Use standard axios to avoid recursion
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const newToken = response.data?.token || response.data?.data?.token;

        if (newToken) {
          localStorage.setItem('simp_token', newToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('No token returned from refresh endpoint');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        // Broadcast token expiration
        window.dispatchEvent(new Event('simp_auth_expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Unified API Client
// ─────────────────────────────────────────────────────────────────────────────

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export const apiClient = async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const method = options.method || 'GET';

  // ── Sandbox / Mock Mode ──────────────────────────────────────────────────
  const token = localStorage.getItem('simp_token');
  if (token === MOCK_TOKEN) {
    await delay();
    const mockResult = resolveMock(endpoint, method);
    if (mockResult !== null) {
      return mockResult as T;
    }
    // If no mock route matched, return a generic success so the UI doesn't break
    console.warn(`[SIMP Mock] No mock defined for: ${method} ${endpoint} — returning empty data`);
    return { data: [], success: true } as unknown as T;
  }

  // ── Live Backend Mode ────────────────────────────────────────────────────
  const headers = { ...(options.headers || {}) };
  const data = options.body;

  // Let Axios set boundary for multipart requests automatically
  if (headers['Content-Type'] === 'multipart/form-data') {
    delete headers['Content-Type'];
  }

  const response = await axiosInstance({
    url: endpoint,
    method,
    headers,
    data,
  });

  // response is already response.data thanks to the interceptor
  return response as unknown as T;
};
