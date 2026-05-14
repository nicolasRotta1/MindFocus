import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { clearStoredToken } from '../auth/tokenStorage';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const API_NOTIFICATION_BASE_URL = import.meta.env.VITE_NOTIFICATION_BASE_URL || 'http://localhost:8090';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/api/auth/login`,
    REGISTER: `/api/auth/register`,
    LOGOUT: `/api/auth/logout`,
  },
  USUARIO: {
    ATUAL: `/api/usuarios/atual`,
  },
  HABITO: {
    BASE: `/api/habitos`,
    CONCLUDE: (id: number | string) => `/api/habitos/${id}/concluir`,
    UNCONCLUDE: (id: number | string) => `/api/habitos/${id}/desconcluir`,
    STATS: (id: number | string) => `/api/habitos/${id}/stats`,
    COMPLETED_TODAY: (id: number | string) => `/api/habitos/${id}/concluido-hoje`,
    HISTORY: (id: number | string, de: string, ate: string) =>
      `/api/habitos/${id}/historico?de=${de}&ate=${ate}`,
    HISTORY_PROGRESS: (id: number | string, de: string, ate: string) =>
      `/api/habitos/${id}/historico-progresso?de=${de}&ate=${ate}`,
    PROGRESS: (id: number | string) => `/api/habitos/${id}/progresso`,
    DASHBOARD_USER: `/api/habitos/dashboard/usuario`,
    OVERVIEW: `/api/habitos/dashboard/overview`,
  },
  NOTIFICATIONS: {
    LIST: `/api/notifications`,
    UNREAD_COUNT: `/api/notifications/unread/count`,
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    } else if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers as never);
    }
    (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined;
    const reqUrl = String(error.config?.url ?? '');
    const isAuthPublic =
      reqUrl.includes('/api/auth/login') ||
      reqUrl.includes('/api/auth/register');
    if (status === 401 && !isAuthPublic) {
      clearStoredToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

export default api;
