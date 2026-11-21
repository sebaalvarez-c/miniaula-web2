import api from './api';

export interface Pregunta {
  id: number;
  enunciado: string;
  opciones: string[];
  leccionId: number;
}

export interface RespuestaItem {
  preguntaId: number;
  opcionSeleccionada: number;
}

export interface ResultadoIntento {
  leccionId: number;
  totalPreguntas: number;
  aciertos: number;
  puntaje: number;
  aprobado: boolean;
  detalle: {
    preguntaId: number;
    opcionSeleccionada: number;
    esCorrecta: boolean;
  }[];
}

export const preguntasService = {
  async getByLeccion(leccionId: number): Promise<Pregunta[]> {
    const { data } = await api.get<Pregunta[]>(`/cuestionarios/leccion/${leccionId}`);
    return data;
  },

  async submitIntento(
    leccionId: number,
    respuestas: RespuestaItem[],
  ): Promise<ResultadoIntento> {
    const { data } = await api.post<ResultadoIntento>('/cuestionarios/intentos', {
      leccionId,
      respuestas,
    });
    return data;
  },
};