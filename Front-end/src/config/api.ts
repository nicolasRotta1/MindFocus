// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  USUARIO: {
    BASE: `${API_BASE_URL}/usuarios`,
    HABITO: `${API_BASE_URL}/usuarios/habitos`,
  }
};

export default API_BASE_URL;

