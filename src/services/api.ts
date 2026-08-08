import axios from 'axios';

// Create internal Axios instance
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

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

// Export the expected apiClient function signature
export const apiClient = async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const method = options.method || 'GET';
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
