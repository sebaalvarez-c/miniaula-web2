import api from './api.js';
import type { Leccion } from '../types';

export const getLeccion = (id: string) => api.get(`/lecciones/${id}`).then((r) => r.data);
export const getPreguntas = (leccionId: string) => api.get(`/lecciones/${leccionId}/preguntas`).then((r) => r.data);
export const createLeccion = (cursoId: string, data: Record<string, unknown>) => api.post(`/instructor/cursos/${cursoId}/lecciones`, data).then((r) => r.data);
export const updateLeccion = (id: string, data: Record<string, unknown>) => api.patch(`/instructor/lecciones/${id}`, data).then((r) => r.data);
export const deleteLeccion = (id: string) => api.delete(`/instructor/lecciones/${id}`);
export const reordenarLecciones = (cursoId: string, orden: string[]): Promise<Leccion[]> =>
  api.patch<Leccion[]>(`/instructor/cursos/${cursoId}/lecciones/orden`, { orden }).then((r) => r.data);
export const completarLeccion = (id: string) => api.post(`/lecciones/${id}/completar`).then((r) => r.data);
export const submitIntento = (id: string, respuestas: number[]) => api.post(`/lecciones/${id}/intentos`, { respuestas }).then((r) => r.data);
