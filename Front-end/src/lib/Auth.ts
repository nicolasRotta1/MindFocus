// auth.ts
import { API_ENDPOINTS } from '../config/api';

export type IdentifierType = 'telefone' | 'email';

/**
 * Remove todos os caracteres que não sejam números
 * útil para telefone
 */
export const cleanNumber = (value: string) => value.replace(/\D/g, '');

/**
 * Consulta usuário para login no MindFocus
 */
export async function queryUser({
  identifier,
  identifierType,
  senha,
}: {
  identifier: string;
  identifierType: IdentifierType;
  senha: string;
}) {
  const value = identifierType === 'telefone' ? cleanNumber(identifier) : identifier;

  const body = {
    identificador: value,
    senha,
  };

  console.debug('Auth.login request body:', body);
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    console.debug('Auth.login response:', res.status, data);

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || (typeof data === 'string' ? data : `Erro ${res.status}`);
      console.warn('Auth error body:', data);
      throw new Error(message);
    }

    // expected shape: { token: '...' }
    if (data && typeof data === 'object' && data.token) {
      return { token: data.token, user: data.user ?? null };
    }

    throw new Error('Resposta inválida do servidor');
  } catch (error: any) {
    // normalize error
    throw new Error(error?.message || 'Erro ao efetuar login');
  }
}

const TOKEN_COOKIE_NAME = 'mf_token';

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=strict`;
}

function getCookie(name: string) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function setToken(token: string) {
  setCookie(TOKEN_COOKIE_NAME, token, 7);
}

export function getToken() {
  return getCookie(TOKEN_COOKIE_NAME) || null;
}

export function clearToken() {
  deleteCookie(TOKEN_COOKIE_NAME);
}

export async function registerUser(payload: { nome: string; email?: string; telefone?: string; senha: string }) {
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.debug('Auth.register request body:', payload);

    const text = await res.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : text; } catch { data = text; }

    console.debug('Auth.register response:', res.status, data);

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || (typeof data === 'string' ? data : `Erro ${res.status}`);
      console.warn('Auth error body:', data);
      throw new Error(message);
    }

    // return server message (string) or object
    return data ?? text;
  } catch (err: any) {
    throw new Error(err?.message || 'Erro ao registrar usuário');
  }
}

export async function logout() {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST', headers });
  clearToken();
  if (!res.ok) throw new Error('Logout falhou');
  return await res.text();
}

export async function fetchCurrentUser() {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_ENDPOINTS.USUARIO.ATUAL, { headers });
  if (!res.ok) return null;
  return await res.json();
}
