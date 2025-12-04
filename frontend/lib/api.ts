import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if using httpOnly cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // TODO: If using httpOnly cookies, remove this and set withCredentials: true
    // For now, using localStorage (not recommended for production)
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; role?: string; departmentId?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  requestPasswordReset: (email: string) => api.post('/auth/request-password-reset', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
  verifyEmail: (token: string) => api.get('/auth/verify-email', { params: { token } }),
};

// Announcements API
export const announcementsAPI = {
  getAll: (filters?: { role?: string; departmentId?: string; pinned?: boolean }) =>
    api.get('/announcements', { params: filters }),
  getById: (id: string) => api.get(`/announcements/${id}`),
  create: (data: {
    title: string;
    content: string;
    isPinned?: boolean;
    targetRole?: string;
    departmentId?: string;
    expiresAt?: string;
  }) => api.post('/announcements', data),
  update: (id: string, data: any) => api.put(`/announcements/${id}`, data),
  delete: (id: string) => api.delete(`/announcements/${id}`),
};

// Notes API
export const notesAPI = {
  getAll: (filters?: { subject?: string; semester?: number; departmentId?: string; authorId?: string }) =>
    api.get('/notes', { params: filters }),
  getById: (id: string) => api.get(`/notes/${id}`),
  create: (data: {
    title: string;
    description?: string;
    fileUrl: string;
    subject: string;
    semester: number;
    departmentId?: string;
  }) => api.post('/notes', data),
  update: (id: string, data: any) => api.put(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

// Events API
export const eventsAPI = {
  getAll: (filters?: { status?: string; departmentId?: string; upcoming?: boolean }) =>
    api.get('/events', { params: filters }),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (data: {
    title: string;
    description: string;
    date: string;
    location?: string;
    departmentId?: string;
    maxAttendees?: number;
  }) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  register: (id: string) => api.post(`/events/${id}/register`),
  markAttendance: (id: string, userId: string, attended: boolean) =>
    api.post(`/events/${id}/attendance`, { userId, attended }),
};

// Skills API
export const skillsAPI = {
  getAll: (filters?: { type?: 'offer' | 'request'; tags?: string[]; isActive?: boolean }) =>
    api.get('/skills', { params: filters }),
  getById: (id: string) => api.get(`/skills/${id}`),
  create: (data: { title: string; description: string; type: 'offer' | 'request'; tags?: string[] }) =>
    api.post('/skills', data),
  update: (id: string, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

export default api;
