import { createContext, useState, useCallback, ReactNode } from 'react';
import * as authService from '../services/auth.service.js';

interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updated: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function parseUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(parseUser);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const saveSession = useCallback((data: { access_token?: string; token?: string; user: AuthUser }) => {
    const t = data.access_token ?? data.token ?? '';
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(t);
    setUser(data.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      saveSession(data);
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const register = useCallback(async (nombre: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.register({ nombre, email, password });
      saveSession(data);
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updated };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
