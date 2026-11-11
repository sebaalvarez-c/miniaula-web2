import { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth.service.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const saveSession = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      saveSession(data);
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      await authService.register(formData);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    const next = { ...user, ...updated };
    localStorage.setItem('user', JSON.stringify(next));
    setUser(next);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
