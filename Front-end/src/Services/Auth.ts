import api, { API_ENDPOINTS } from '../config/api';

export interface User {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface RegisterPayload {
  nome: string;
  email?: string;
  telefone?: string;
  senha: string;
}

// Token helpers (exported for reuse)
export function getToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function clearToken(): void {
  localStorage.removeItem('authToken');
}

export async function login(identifier: string, senha: string): Promise<User> {
  const body = { identificador: identifier, senha };
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, body);

  if (response?.data?.token) {
    setToken(response.data.token);
    return response.data.user;
  }
  throw new Error('Resposta inesperada do servidor');
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  clearToken();
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>(API_ENDPOINTS.USUARIO.ATUAL);
    return response.data ?? null;
  } catch {
    return null;
  }
}