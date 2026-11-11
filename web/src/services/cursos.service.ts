import api from './api.js';

export const getCatalogo = (params) => api.get('/cursos', { params }).then((r) => r.data);
export const getCursoDetalle = (id) => api.get(`/cursos/${id}`).then((r) => r.data);
export const getMisCursos = () => api.get('/instructor/cursos').then((r) => r.data);
export const createCurso = (data) => api.post('/instructor/cursos', data).then((r) => r.data);
export const updateCurso = (id, data) => api.patch(`/instructor/cursos/${id}`, data).then((r) => r.data);
export const updateEstado = (id, estado) => api.patch(`/instructor/cursos/${id}/estado`, { estado }).then((r) => r.data);
export const deleteCurso = (id) => api.delete(`/instructor/cursos/${id}`);
export const getResumen = (id) => api.get(`/instructor/cursos/${id}/resumen`).then((r) => r.data);
export const inscribir = (cursoId) => api.post('/inscripciones', { cursoId }).then((r) => r.data);
export const getProgresoCurso = (id) => api.get(`/cursos/${id}/progreso`).then((r) => r.data);
