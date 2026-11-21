import api from './api';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'student' | 'instructor';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async register(
    nombre: string,
    email: string,
    password: string,
    rol: 'student' | 'instructor' = 'student',
  ): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      nombre,
      email,
      password,
      rol,
    });
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  },
};