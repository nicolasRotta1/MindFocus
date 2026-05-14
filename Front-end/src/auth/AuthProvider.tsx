import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_CHANGE } from './authEvents';
import { AuthContext } from './auth-context';
import { clearStoredToken, readStoredToken, writeStoredToken } from './tokenStorage';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => readStoredToken());

  const syncFromStorage = useCallback(() => {
    setTokenState(readStoredToken());
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_CHANGE, syncFromStorage);
    return () => window.removeEventListener(AUTH_CHANGE, syncFromStorage);
  }, [syncFromStorage]);

  const setToken = useCallback((t: string) => {
    writeStoredToken(t);
  }, []);

  const clearToken = useCallback(() => {
    clearStoredToken();
  }, []);

  const value = useMemo(
    () => ({ token, setToken, clearToken }),
    [token, setToken, clearToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
