import api from './api.js';

export const createPregunta = (leccionId: string, data: Record<string, unknown>) => api.post(`/instructor/lecciones/${leccionId}/preguntas`, data).then((r) => r.data);
export const updatePregunta = (id: string, data: Record<string, unknown>) => api.put(`/preguntas/${id}`, data).then((r) => r.data);
export const deletePregunta = (id: string) => api.delete(`/preguntas/${id}`);
