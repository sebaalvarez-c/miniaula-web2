import api from './api';

export interface Leccion {
  id: number;
  titulo: string;
  contenido: string;
  orden: number;
  duracionMinutos: number;
  videoUrl?: string;
  cursoId: number;
}

export const leccionesService = {
  async getByCurso(cursoId: number): Promise<Leccion[]> {
    const { data } = await api.get<Leccion[]>(`/lecciones/curso/${cursoId}`);
    return data;
  },

  async getById(id: number): Promise<Leccion> {
    const { data } = await api.get<Leccion>(`/lecciones/${id}`);
    return data;
  },

  async create(payload: Omit<Leccion, 'id'>): Promise<Leccion> {
    const { data } = await api.post<Leccion>('/lecciones', payload);
    return data;
  },

  async update(id: number, payload: Partial<Leccion>): Promise<Leccion> {
    const { data } = await api.patch<Leccion>(`/lecciones/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/lecciones/${id}`);
  },
};