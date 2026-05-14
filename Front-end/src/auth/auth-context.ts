import { createContext } from 'react';

export type AuthContextValue = {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
