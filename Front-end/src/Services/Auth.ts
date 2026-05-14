import api, { API_ENDPOINTS } from '../config/api';
import { writeStoredToken, readStoredToken, clearStoredToken } from '../auth/tokenStorage';

export type IdentifierType = 'telefone' | 'email';

interface AuthResponse {
  token: string;
  user?: any;
}

export function setToken(token: string) {
  writeStoredToken(token);
}

export function getToken(): string | null {
  return readStoredToken();
}

export function clearToken() {
  clearStoredToken();
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

export async function updateCurrentUser(payload: Record<string, any>) {
  try {
    const { data } = await api.patch(API_ENDPOINTS.USUARIO.ATUAL, payload);
    return data ?? null;
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    throw err;
  }
}

export async function deleteCurrentUser() {
  try {
    await api.delete(API_ENDPOINTS.USUARIO.ATUAL);
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    throw err;
  }
}
