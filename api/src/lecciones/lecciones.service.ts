import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Leccion } from './entities/leccion.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Progreso } from '../inscripciones/entities/progreso.entity';
import { Pregunta } from '../cuestionarios/entities/pregunta.entity';
import { ApiException } from '../common/exceptions/api.exception';
import { CreateLeccionDto } from './dto/create-leccion.dto';
import { UpdateLeccionDto } from './dto/update-leccion.dto';

@Injectable()
export class LeccionesService {
  constructor(
    @InjectRepository(Leccion) private leccionRepo: Repository<Leccion>,
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Inscripcion) private inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Progreso) private progresoRepo: Repository<Progreso>,
    @InjectRepository(Pregunta) private preguntaRepo: Repository<Pregunta>,
  ) {}

  // RN-01: sequential access
  async getLeccionAccesible(leccionId: string, userId: string) {
    const leccion = await this.leccionRepo.findOne({ where: { id: leccionId } });
    if (!leccion) throw new ApiException(404, 'NOT_FOUND', 'Lesson not found');

    const inscripcion = await this.inscripcionRepo.findOne({ where: { estudianteId: userId, cursoId: leccion.cursoId } });
    if (!inscripcion) throw new ApiException(403, 'NOT_ENROLLED', 'You are not enrolled in this course');

    if (leccion.orden > 1) {
      const prevLeccion = await this.leccionRepo.findOne({ where: { cursoId: leccion.cursoId, orden: leccion.orden - 1 } });
      if (prevLeccion) {
        const prevProgreso = await this.progresoRepo.findOne({ where: { inscripcionId: inscripcion.id, leccionId: prevLeccion.id } });
        if (!prevProgreso?.completada) {
          throw new ApiException(403, 'LESSON_LOCKED', 'Complete the previous lesson first');
        }
      }
    }

    if (leccion.tipo === 'cuestionario') {
      const preguntas = await this.preguntaRepo.find({ where: { leccionId } });
      const progreso = await this.progresoRepo.findOne({ where: { inscripcionId: inscripcion.id, leccionId } });
      const safePreguntas = preguntas.map(({ indiceCorrecto, ...p }) => p);
      return { leccion, preguntas: safePreguntas, progreso, inscripcionId: inscripcion.id };
    }

    return { leccion, inscripcionId: inscripcion.id };
  }

  async createLeccion(cursoId: string, instructorId: string, dto: CreateLeccionDto) {
    await this.verifyOwner(cursoId, instructorId);
    const count = await this.leccionRepo.count({ where: { cursoId } });
    const leccion = this.leccionRepo.create({ ...dto, cursoId, orden: count + 1 });
    return this.leccionRepo.save(leccion);
  }

  async updateLeccion(leccionId: string, instructorId: string, dto: UpdateLeccionDto) {
    const leccion = await this.ownedLeccion(leccionId, instructorId);
    Object.assign(leccion, dto);
    return this.leccionRepo.save(leccion);
  }

  async deleteLeccion(leccionId: string, instructorId: string) {
    const leccion = await this.ownedLeccion(leccionId, instructorId);
    const { cursoId, orden } = leccion;
    await this.leccionRepo.remove(leccion);

    const remaining = await this.leccionRepo.find({ where: { cursoId, orden: MoreThan(orden) } });
    for (const l of remaining) {
      l.orden -= 1;
      await this.leccionRepo.save(l);
    }
  }

  async completarLeccion(leccionId: string, userId: string) {
    const leccion = await this.leccionRepo.findOne({ where: { id: leccionId } });
    if (!leccion) throw new ApiException(404, 'NOT_FOUND', 'Lesson not found');
    if (leccion.tipo !== 'contenido') throw new ApiException(422, 'WRONG_TYPE', 'Use quiz endpoint for quiz lessons');

    const inscripcion = await this.inscripcionRepo.findOne({ where: { estudianteId: userId, cursoId: leccion.cursoId } });
    if (!inscripcion) throw new ApiException(403, 'NOT_ENROLLED', 'Not enrolled in this course');

    let progreso = await this.progresoRepo.findOne({ where: { inscripcionId: inscripcion.id, leccionId } });
    if (!progreso) {
      progreso = this.progresoRepo.create({ inscripcionId: inscripcion.id, leccionId, completada: false, intentos: 0 });
    }
    progreso.completada = true;
    return this.progresoRepo.save(progreso);
  }

  private async ownedLeccion(leccionId: string, instructorId: string) {
    const leccion = await this.leccionRepo.findOne({ where: { id: leccionId }, relations: ['curso'] });
    if (!leccion) throw new ApiException(404, 'NOT_FOUND', 'Lesson not found');
    if (leccion.curso.instructorId !== instructorId) throw new ApiException(403, 'FORBIDDEN', 'Not the owner');
    return leccion;
  }

  private async verifyOwner(cursoId: string, instructorId: string) {
    const curso = await this.cursoRepo.findOne({ where: { id: cursoId } });
    if (!curso) throw new ApiException(404, 'NOT_FOUND', 'Course not found');
    if (curso.instructorId !== instructorId) throw new ApiException(403, 'FORBIDDEN', 'Not the owner');
    return curso;
  }
}
