import api, { API_ENDPOINTS } from '../config/api';

export type IdentifierType = 'telefone' | 'email';

interface AuthResponse {
  token: string;
  user?: any;
}

export function setToken(token: string) {
  localStorage.setItem('authToken', token);
}

export function getToken(): string | null {
  return localStorage.getItem('authToken');
}

export function clearToken() {
  localStorage.removeItem('authToken');
}

export async function login(identifier: string, senha: string) {
  const body = { identificador: identifier, senha };
  const { data } = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, body);
  if (data?.token) {
    setToken(data.token);
    return data.user ?? null;
  }
  throw new Error('Resposta inesperada do servidor');
}

export async function register(payload: { nome: string; email?: string; telefone?: string; senha: string }) {
  const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  return data;
}

export async function logout() {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  } finally {
    clearToken();
  }
}

export async function fetchCurrentUser() {
  try {
    const { data } = await api.get(API_ENDPOINTS.USUARIO.ATUAL);
    return data ?? null;
  } catch {
    return null;
  }
}
