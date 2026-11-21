import api from './api.js';

export const createPregunta = (leccionId, data) => api.post(`/lecciones/${leccionId}/preguntas`, data).then((r) => r.data);
export const updatePregunta = (id, data) => api.put(`/preguntas/${id}`, data).then((r) => r.data);
export const deletePregunta = (id) => api.delete(`/preguntas/${id}`);
