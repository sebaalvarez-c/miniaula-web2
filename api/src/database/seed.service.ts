import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Leccion } from '../lecciones/entities/leccion.entity';
import { Pregunta } from '../cuestionarios/entities/pregunta.entity';

const VIDEO_URLS: Record<string, { config: string; fundamentos: string; proyecto: string }> = {
  'Node.js desde cero': {
    config: 'https://www.youtube.com/embed/mG4U9t5nWG8',
    fundamentos: 'https://www.youtube.com/embed/N1XsdzNXkyg',
    proyecto: 'https://www.youtube.com/embed/OVESuyVoPkI',
  },
  'Diseño UI con Figma': {
    config: 'https://www.youtube.com/embed/KC00B8rnxq8',
    fundamentos: 'https://www.youtube.com/embed/bIK7PIdlLTU',
    proyecto: 'https://www.youtube.com/embed/7fps9ILAi-8',
  },
  'Inglés para devs': {
    config: 'https://www.youtube.com/embed/DBBtj7Q9JHo',
    fundamentos: 'https://www.youtube.com/embed/st2rk-mnoYE',
    proyecto: 'https://www.youtube.com/embed/1INpge9bNgw',
  },
};

const COURSE_QUESTIONS: Record<string, { enunciado: string; opciones: string[]; indiceCorrecto: number }[]> = {
  'Node.js desde cero': [
    { enunciado: '¿Qué método HTTP se usa para crear un recurso?', opciones: ['GET', 'POST', 'DELETE', 'PUT'], indiceCorrecto: 1 },
    { enunciado: '¿Qué código de estado indica que un recurso fue creado exitosamente?', opciones: ['200 OK', '201 Created', '204 No Content', '400 Bad Request'], indiceCorrecto: 1 },
    { enunciado: '¿Qué significa REST?', opciones: ['Remote Execution State Transfer', 'Representational State Transfer', 'Request Stateful Transfer', 'Resource State Transfer'], indiceCorrecto: 1 },
    { enunciado: '¿En qué encabezado se envía el token JWT?', opciones: ['X-Token', 'Authorization', 'Cookie', 'X-Auth'], indiceCorrecto: 1 },
    { enunciado: '¿Qué significa el código de estado HTTP 404?', opciones: ['No autorizado', 'Prohibido', 'No encontrado', 'Error interno'], indiceCorrecto: 2 },
  ],
  'Diseño UI con Figma': [
    { enunciado: '¿Qué es un "frame" en Figma?', opciones: ['Un estilo de texto', 'Un contenedor que representa una pantalla o artboard', 'Un plugin de Figma', 'Un tipo de exportación'], indiceCorrecto: 1 },
    { enunciado: '¿Para qué sirve el "Auto Layout" en Figma?', opciones: ['Para exportar diseños', 'Para organizar elementos con reglas de espaciado automático', 'Para crear animaciones', 'Para importar íconos'], indiceCorrecto: 1 },
    { enunciado: '¿Qué es un "componente" en Figma?', opciones: ['Un archivo de Figma', 'Un elemento reutilizable con instancias vinculadas al original', 'Un tipo de fuente', 'Una guía de alineación'], indiceCorrecto: 1 },
    { enunciado: '¿Qué significa UX?', opciones: ['User Xtra', 'User Experience', 'UI Extension', 'Universal Exchange'], indiceCorrecto: 1 },
    { enunciado: '¿Cuál es el formato vectorial más común para exportar íconos desde Figma?', opciones: ['PNG', 'JPG', 'SVG', 'PDF'], indiceCorrecto: 2 },
  ],
  'Inglés para devs': [
    { enunciado: '¿Qué significa "merge" en el contexto de git?', opciones: ['Eliminar una rama', 'Combinar dos ramas de código', 'Crear un nuevo repositorio', 'Revertir cambios'], indiceCorrecto: 1 },
    { enunciado: '¿Qué es el "refactoring"?', opciones: ['Reescribir el código desde cero', 'Mejorar la estructura del código sin cambiar su comportamiento', 'Corregir bugs', 'Agregar nuevas funciones'], indiceCorrecto: 1 },
    { enunciado: '¿Qué significa "deprecated"?', opciones: ['Lanzado recientemente', 'En desuso, próximo a ser eliminado en versiones futuras', 'Documentado correctamente', 'Código optimizado'], indiceCorrecto: 1 },
    { enunciado: '¿Qué es un "pull request"?', opciones: ['Descargar el repositorio', 'Una solicitud para revisar e integrar cambios al código principal', 'Un tipo de error de git', 'Un comando de terminal'], indiceCorrecto: 1 },
    { enunciado: '¿Qué significa "README"?', opciones: ['Solo para devs senior', 'Documento con información básica e instrucciones del proyecto', 'Un archivo de configuración', 'El historial de commits'], indiceCorrecto: 1 },
  ],
};

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Leccion) private leccionRepo: Repository<Leccion>,
    @InjectRepository(Pregunta) private preguntaRepo: Repository<Pregunta>,
  ) {}

  async run() {
    const [userCount, courseCount] = await Promise.all([
      this.userRepo.count(),
      this.cursoRepo.count(),
    ]);
    if (userCount > 0 && courseCount > 0) return;

    if (userCount === 0) {
      const hash = await bcrypt.hash('Test1234!', 10);

      await this.userRepo.save([
        this.userRepo.create({ nombre: 'Ana Pérez', email: 'instructor1@mini.com', passwordHash: hash, rol: 'instructor' }),
        this.userRepo.create({ nombre: 'Luis Rojas', email: 'instructor2@mini.com', passwordHash: hash, rol: 'instructor' }),
        this.userRepo.create({ nombre: 'Juan García', email: 'student1@mini.com', passwordHash: hash, rol: 'estudiante' }),
        this.userRepo.create({ nombre: 'María López', email: 'student2@mini.com', passwordHash: hash, rol: 'estudiante' }),
        this.userRepo.create({ nombre: 'Carlos Vega', email: 'student3@mini.com', passwordHash: hash, rol: 'estudiante' }),
      ]);
    }

    if (courseCount > 0) return;

    const i1 = await this.userRepo.findOne({ where: { email: 'instructor1@mini.com' } });
    const i2 = await this.userRepo.findOne({ where: { email: 'instructor2@mini.com' } });
    if (!i1 || !i2) throw new Error('No se pudieron crear los cursos: faltan instructores en la base de datos');

    const coursesData = [
      { titulo: 'Node.js desde cero', descripcion: 'Aprende a crear APIs REST con Node.js y Express desde los fundamentos.', categoria: 'Programación', nivel: 'Básico', instructorId: i1.id },
      { titulo: 'Diseño UI con Figma', descripcion: 'Domina la herramienta de diseño más usada en la industria.', categoria: 'Diseño', nivel: 'Intermedio', instructorId: i1.id },
      { titulo: 'Inglés para devs', descripcion: 'Mejora tu inglés técnico para leer docs, issues y PRs con fluidez.', categoria: 'Idiomas', nivel: 'Básico', instructorId: i2.id },
    ];

    for (const data of coursesData) {
      const curso = await this.cursoRepo.save(this.cursoRepo.create({ ...data, estado: 'publicado' }));

      const lecciones = await this.leccionRepo.save([
        this.leccionRepo.create({ titulo: 'Introducción', tipo: 'contenido', contenido: 'Bienvenido a este curso. Acá vas a aprender los fundamentos del tema, con ejemplos prácticos y ejercicios aplicados. Leé con atención cada lección antes de avanzar.', orden: 1, cursoId: curso.id }),
        this.leccionRepo.create({ titulo: 'Configuración del entorno', tipo: 'contenido', contenido: 'En esta lección instalamos y configuramos todas las herramientas necesarias. Seguí los pasos en orden y verificá que cada instalación funcione correctamente antes de continuar.', videoUrl: VIDEO_URLS[data.titulo]?.config, orden: 2, cursoId: curso.id }),
        this.leccionRepo.create({ titulo: 'Conceptos fundamentales', tipo: 'contenido', contenido: 'Ahora que tenés el entorno listo, vamos a ver los conceptos clave que vas a usar durante todo el curso. Prestá atención a las definiciones, son la base de todo lo que viene.', videoUrl: VIDEO_URLS[data.titulo]?.fundamentos, orden: 3, cursoId: curso.id }),
        this.leccionRepo.create({ titulo: 'Cuestionario 1', tipo: 'cuestionario', notaMinima: 70, orden: 4, cursoId: curso.id }),
        this.leccionRepo.create({ titulo: 'Proyecto final', tipo: 'contenido', contenido: 'Llegaste a la última lección. Es hora de aplicar todo lo aprendido en un proyecto integrador. Seguí las consignas del video y entregá tu trabajo según las instrucciones del docente.', videoUrl: VIDEO_URLS[data.titulo]?.proyecto, orden: 5, cursoId: curso.id }),
      ]);

      const quizLesson = lecciones[3];
      await this.preguntaRepo.save(
        COURSE_QUESTIONS[data.titulo].map((q) =>
          this.preguntaRepo.create({ ...q, leccionId: quizLesson.id })
        )
      );
    }

    console.log('Seed completado: 2 instructores, 3 estudiantes, 3 cursos publicados (5 lecciones por curso, una de ellas quiz)');
  }
}
