export interface Instructor {
  id: string;
  nombre: string;
  email: string;
}

export interface Leccion {
  id: string;
  titulo: string;
  tipo: 'contenido' | 'cuestionario';
  orden: number;
  contenido?: string;
  videoUrl?: string;
  notaMinima?: number;
  cursoId?: string;
}

export interface Curso {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  nivel?: string;
  estado: 'borrador' | 'publicado' | 'archivado';
  instructorId: string;
  instructor?: Instructor;
  lecciones?: Leccion[];
  creadoEn?: string;
}

export interface Pregunta {
  id: string;
  enunciado: string;
  opciones: string[];
  leccionId?: string;
}

export interface InscripcionItem {
  id: string;
  cursoId: string;
}

export interface InscripcionDetalle {
  id: string;
  cursoId: string;
  porcentaje: number;
  curso: {
    titulo: string;
    categoria: string;
    instructor: { nombre: string };
  };
}

export interface ProgresoLeccionItem {
  leccionId: string;
  titulo: string;
  tipo: string;
  completada: boolean;
  orden: number;
}

export interface ProgresoData {
  porcentaje: number;
  lecciones: ProgresoLeccionItem[];
}

export interface ResultadoIntento {
  nota: number;
  mejorNota: number;
  aprobado: boolean;
  notaMinima: number;
  intentos: number;
  intentosRestantes: number;
}
