import api from './api.js';

export const getCatalogo = (params: Record<string, unknown>) => api.get('/cursos', { params }).then((r) => r.data);
export const getCursoDetalle = (id: string) => api.get(`/cursos/${id}`).then((r) => r.data);
export const getMisCursos = () => api.get('/instructor/cursos').then((r) => r.data);
export const createCurso = (data: Record<string, unknown>) => api.post('/instructor/cursos', data).then((r) => r.data);
export const updateCurso = (id: string, data: Record<string, unknown>) => api.patch(`/instructor/cursos/${id}`, data).then((r) => r.data);
export const updateEstado = (id: string, estado: string) => api.patch(`/instructor/cursos/${id}/estado`, { estado }).then((r) => r.data);
export const deleteCurso = (id: string) => api.delete(`/instructor/cursos/${id}`);
export const getResumen = (id: string) => api.get(`/instructor/cursos/${id}/resumen`).then((r) => r.data);
export const inscribir = (cursoId: string) => api.post('/inscripciones', { cursoId }).then((r) => r.data);
export const getProgresoCurso = (id: string) => api.get(`/cursos/${id}/progreso`).then((r) => r.data);
