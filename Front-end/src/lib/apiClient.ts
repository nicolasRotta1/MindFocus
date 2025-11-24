import { API_ENDPOINTS } from '../config/api';
import { getToken, clearToken } from './Auth';

export interface ApiResponse<T = any> {
  status: number;
  data?: T;
}

export async function apiRequest<T = any>(input: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(init.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    // token inválido/expirado
    clearToken();
    const err = new Error('Unauthorized');
    // @ts-ignore
    err.status = 401;
    throw err;
  }

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP error ${res.status}`);
    // @ts-ignore
    err.status = res.status;
    throw err;
  }

  return data as T;
}
