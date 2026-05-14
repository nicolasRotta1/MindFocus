/** Evento global para sincronizar token entre localStorage e AuthProvider. */
export const AUTH_CHANGE = 'mindfocus-auth-change';

export function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE));
}
