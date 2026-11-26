import api from './api.js';

export const getLeccion = (id) => api.get(`/lecciones/${id}`).then((r) => r.data);
export const createLeccion = (cursoId, data) => api.post(`/instructor/cursos/${cursoId}/lecciones`, data).then((r) => r.data);
export const updateLeccion = (id, data) => api.patch(`/instructor/lecciones/${id}`, data).then((r) => r.data);
export const deleteLeccion = (id) => api.delete(`/instructor/lecciones/${id}`);
export const reorderLecciones = (cursoId, orden) => api.patch(`/cursos/${cursoId}/lecciones/orden`, { orden }).then((r) => r.data);
export const completarLeccion = (id) => api.post(`/lecciones/${id}/completar`).then((r) => r.data);
export const submitIntento = (id, respuestas) => api.post(`/lecciones/${id}/intentos`, { respuestas }).then((r) => r.data);
