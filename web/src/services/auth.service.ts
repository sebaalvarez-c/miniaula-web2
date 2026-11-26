import api from './api.js';

export const register = (data: Record<string, unknown>) => api.post('/auth/register', data).then((r) => r.data);
export const login = (data: Record<string, unknown>) => api.post('/auth/login', data).then((r) => r.data);
export const getMe = () => api.get('/users/me').then((r) => r.data);
export const updateMe = (data: Record<string, unknown>) => api.put('/users/me', data).then((r) => r.data);
