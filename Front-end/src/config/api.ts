// Configuração da API
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
  },
};

export default API_BASE_URL;

