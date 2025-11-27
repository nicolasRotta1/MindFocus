import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
      config.headers = new AxiosHeaders(config.headers as any);
    }
    (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
