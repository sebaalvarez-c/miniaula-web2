import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Progreso } from './entities/progreso.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Leccion } from '../lecciones/entities/leccion.entity';
import { User } from '../users/entities/user.entity';
import { ApiException } from '../common/exceptions/api.exception';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion) private inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Progreso) private progresoRepo: Repository<Progreso>,
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Leccion) private leccionRepo: Repository<Leccion>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async inscribir(cursoId: string, estudianteId: string) {
    const curso = await this.cursoRepo.findOne({ where: { id: cursoId, estado: 'publicado' } });
    if (!curso) throw new ApiException(404, 'NOT_FOUND', 'Published course not found');

    const existing = await this.inscripcionRepo.findOne({ where: { estudianteId, cursoId } });
    if (existing) throw new ApiException(409, 'ALREADY_ENROLLED', 'Already enrolled in this course');

    const inscripcion = this.inscripcionRepo.create({ estudianteId, cursoId });
    return this.inscripcionRepo.save(inscripcion);
  }

  async getMisInscripciones(estudianteId: string) {
    const inscripciones = await this.inscripcionRepo.find({
      where: { estudianteId },
      relations: ['curso'],
    });

    const result = await Promise.all(
      inscripciones.map(async (insc) => {
        const totalLecciones = await this.leccionRepo.count({ where: { cursoId: insc.cursoId } });
        const completadas = await this.progresoRepo.count({ where: { inscripcionId: insc.id, completada: true } });
        const porcentaje = totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0;

        const instructor = insc.curso?.instructorId
          ? await this.userRepo.findOne({ where: { id: insc.curso.instructorId } })
          : null;

        return {
          ...insc,
          porcentaje,
          curso: insc.curso
            ? { ...insc.curso, instructor: instructor ? { nombre: instructor.nombre } : null }
            : null,
        };
      })
    );

    return result;
  }

  async getProgresoCurso(cursoId: string, userId: string) {
    const inscripcion = await this.inscripcionRepo.findOne({ where: { estudianteId: userId, cursoId } });
    if (!inscripcion) throw new ApiException(403, 'NOT_ENROLLED', 'Not enrolled in this course');

    const lecciones = await this.leccionRepo.find({ where: { cursoId }, order: { orden: 'ASC' } });
    const progresos = await this.progresoRepo.find({ where: { inscripcionId: inscripcion.id } });
    const progresoMap = Object.fromEntries(progresos.map((p) => [p.leccionId, p]));

    const result = lecciones.map((l) => ({
      leccionId: l.id,
      titulo: l.titulo,
      tipo: l.tipo,
      orden: l.orden,
      ...(progresoMap[l.id]
        ? { completada: progresoMap[l.id].completada, intentos: progresoMap[l.id].intentos, mejorNota: progresoMap[l.id].mejorNota }
        : { completada: false, intentos: 0, mejorNota: null }),
    }));

    const completadas = result.filter((r) => r.completada).length;
    return {
      porcentaje: lecciones.length > 0 ? Math.round((completadas / lecciones.length) * 100) : 0,
      lecciones: result,
    };
  }
}
