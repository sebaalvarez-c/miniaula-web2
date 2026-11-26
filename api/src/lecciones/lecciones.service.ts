import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, MoreThan } from 'typeorm';
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
    @InjectRepository(Inscripcion) private inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Progreso) private progresoRepo: Repository<Progreso>,
    @InjectRepository(Pregunta) private preguntaRepo: Repository<Pregunta>,
  ) {}

  // RN-01: sequential access
  async verificarAccesoLeccion(leccionId: string, userId: string): Promise<{ leccion: Leccion; inscripcion: Inscripcion }> {
    const leccion = await this.leccionRepo.findOne({ where: { id: leccionId } });
    if (!leccion) throw new ApiException(404, 'NOT_FOUND', 'Lesson not found');

    const inscripcion = await this.inscripcionRepo.findOne({
      where: { estudianteId: userId, cursoId: leccion.cursoId },
    });
    if (!inscripcion) {
      throw new ApiException(403, 'NOT_ENROLLED', 'You are not enrolled in this course');
    }

    if (leccion.orden > 1) {
      const prevLeccion = await this.leccionRepo.findOne({
        where: { cursoId: leccion.cursoId, orden: leccion.orden - 1 },
      });
      if (prevLeccion) {
        const prevProgreso = await this.progresoRepo.findOne({
          where: { inscripcionId: inscripcion.id, leccionId: prevLeccion.id },
        });
        if (!prevProgreso?.completada) {
          throw new ApiException(403, 'LESSON_LOCKED', 'Complete the previous lesson first');
        }
      }
    }

    return { leccion, inscripcion };
  }

  async getLeccionAccesible(leccionId: string, userId: string) {
    const { leccion, inscripcion } = await this.verificarAccesoLeccion(leccionId, userId);

    if (leccion.tipo === 'cuestionario') {
      const preguntas = await this.preguntaRepo.find({ where: { leccionId } });
      const progreso = await this.progresoRepo.findOne({
        where: { inscripcionId: inscripcion.id, leccionId },
      });
      const safePreguntas = preguntas.map(({ indiceCorrecto, ...p }) => p);
      return { leccion, preguntas: safePreguntas, progreso, inscripcionId: inscripcion.id };
    }

    return { leccion, inscripcionId: inscripcion.id };
  }

  async createLeccion(cursoId: string, instructorId: string, dto: CreateLeccionDto) {
    return this.leccionRepo.manager.transaction(async (manager) => {
      const curso = await this.lockCurso(manager, cursoId);
      this.assertOwner(curso, instructorId);

      const repo = manager.getRepository(Leccion);
      const ultima = await repo.findOne({ where: { cursoId }, order: { orden: 'DESC' } });
      const leccion = repo.create({ ...dto, cursoId, orden: (ultima?.orden ?? 0) + 1 });
      return repo.save(leccion);
    });
  }

  async updateLeccion(leccionId: string, instructorId: string, dto: UpdateLeccionDto) {
    const leccion = await this.ownedLeccion(leccionId, instructorId);
    Object.assign(leccion, dto);
    return this.leccionRepo.save(leccion);
  }

  async deleteLeccion(leccionId: string, instructorId: string) {
    const leccion = await this.ownedLeccion(leccionId, instructorId);
    const { cursoId, orden } = leccion;

    await this.leccionRepo.manager.transaction(async (manager) => {
      await this.lockCurso(manager, cursoId);
      const repo = manager.getRepository(Leccion);
      await repo.remove(leccion);
      await manager.getRepository(Progreso).delete({ leccionId });

      const remaining = await repo.find({ where: { cursoId, orden: MoreThan(orden) } });
      for (const l of remaining) {
        await repo.update({ id: l.id }, { orden: -l.orden });
      }
      for (const l of remaining) {
        await repo.update({ id: l.id }, { orden: -l.orden - 1 });
      }
    });
  }

  async completarLeccion(leccionId: string, userId: string) {
    const { leccion, inscripcion } = await this.verificarAccesoLeccion(leccionId, userId);
    if (leccion.tipo !== 'contenido') {
      throw new ApiException(422, 'WRONG_TYPE', 'Use quiz endpoint for quiz lessons');
    }

    let progreso = await this.progresoRepo.findOne({
      where: { inscripcionId: inscripcion.id, leccionId },
    });
    if (!progreso) {
      progreso = this.progresoRepo.create({
        inscripcionId: inscripcion.id,
        leccionId,
        completada: false,
        intentos: 0,
      });
    }
    progreso.completada = true;
    return this.progresoRepo.save(progreso);
  }

  async reordenarLecciones(cursoId: string, instructorId: string, orden: string[]) {
    return this.leccionRepo.manager.transaction(async (manager) => {
      const curso = await this.lockCurso(manager, cursoId);
      this.assertOwner(curso, instructorId);

      const repo = manager.getRepository(Leccion);
      const lecciones = await repo.find({ where: { cursoId }, order: { orden: 'ASC' } });
      const ids = new Set(orden);
      const existentes = new Set(lecciones.map((l) => l.id));

      if (ids.size !== orden.length) {
        throw new ApiException(422, 'DUPLICATE_ORDER', 'El orden contiene IDs repetidos');
      }
      if (orden.length !== lecciones.length || orden.some((id) => !existentes.has(id))) {
        throw new ApiException(422, 'INVALID_ORDER', 'El orden debe incluir todas las lecciones del curso');
      }

      for (const l of lecciones) {
        await repo.update({ id: l.id }, { orden: -l.orden });
      }
      for (let i = 0; i < orden.length; i++) {
        await repo.update({ id: orden[i], cursoId }, { orden: i + 1 });
      }

      return repo.find({ where: { cursoId }, order: { orden: 'ASC' } });
    });
  }

  private async ownedLeccion(leccionId: string, instructorId: string) {
    const leccion = await this.leccionRepo.findOne({
      where: { id: leccionId },
      relations: ['curso'],
    });
    if (!leccion) throw new ApiException(404, 'NOT_FOUND', 'Lesson not found');
    if (leccion.curso.instructorId !== instructorId) {
      throw new ApiException(403, 'FORBIDDEN', 'Not the owner');
    }
    return leccion;
  }

  private async lockCurso(manager: EntityManager, cursoId: string): Promise<Curso> {
    const curso = await manager.getRepository(Curso)
      .createQueryBuilder('curso')
      .setLock('pessimistic_write')
      .where('curso.id = :id', { id: cursoId })
      .getOne();
    if (!curso) throw new ApiException(404, 'NOT_FOUND', 'Course not found');
    return curso;
  }

  private assertOwner(curso: Curso, instructorId: string) {
    if (curso.instructorId !== instructorId) {
      throw new ApiException(403, 'FORBIDDEN', 'Not the owner');
    }
  }
}