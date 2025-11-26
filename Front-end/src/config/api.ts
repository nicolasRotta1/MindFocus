import axios, { AxiosHeaders } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  USUARIO: {
    BASE: `${API_BASE_URL}/api/usuarios`,
    ATUAL: `${API_BASE_URL}/api/usuarios/atual`,
  },
  HABITO: {
    BASE: `${API_BASE_URL}/api/habitos`,
    CONCLUDE: (id: number) => `${API_BASE_URL}/api/habitos/${id}/concluir`,
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});


export default API_BASE_URL;
