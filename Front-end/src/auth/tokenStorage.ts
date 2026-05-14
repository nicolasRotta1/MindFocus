import { notifyAuthChange } from './authEvents';

const KEY = 'authToken';

export function readStoredToken(): string | null {
  return localStorage.getItem(KEY);
}

export function writeStoredToken(token: string) {
  localStorage.setItem(KEY, token);
  notifyAuthChange();
}

export function clearStoredToken() {
  localStorage.removeItem(KEY);
  notifyAuthChange();
}
