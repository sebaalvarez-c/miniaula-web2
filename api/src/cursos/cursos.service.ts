import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { Leccion } from '../lecciones/entities/leccion.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Progreso } from '../inscripciones/entities/progreso.entity';
import { User } from '../users/entities/user.entity';
import { ApiException } from '../common/exceptions/api.exception';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Leccion) private leccionRepo: Repository<Leccion>,
    @InjectRepository(Inscripcion) private inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Progreso) private progresoRepo: Repository<Progreso>,
  ) {}

  async getCatalogo(q?: string, categoria?: string, page = 1, limit = 9) {
    const where: FindOptionsWhere<Curso> = { estado: 'publicado' };
    if (q) where.titulo = ILike(`%${q}%`);
    if (categoria && categoria !== 'Todas') where.categoria = categoria;

    const [data, total] = await this.cursoRepo.findAndCount({
      where,
      relations: ['instructor'],
      order: { creadoEn: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const safeData = data.map((c) => ({ ...c, instructor: c.instructor ? { id: c.instructor.id, nombre: c.instructor.nombre } : null }));
    return { total, page, limit, data: safeData };
  }

  async getCursoDetalle(id: string) {
    const curso = await this.cursoRepo.findOne({
      where: { id, estado: 'publicado' },
      relations: ['instructor', 'lecciones'],
      order: { lecciones: { orden: 'ASC' } } as any,
    });
    if (!curso) throw new ApiException(404, 'NOT_FOUND', 'Course not found');

    const result = {
      ...curso,
      instructor: curso.instructor ? { id: curso.instructor.id, nombre: curso.instructor.nombre } : null,
      lecciones: curso.lecciones?.map((l) => ({ id: l.id, titulo: l.titulo, tipo: l.tipo, orden: l.orden })),
    };
    return result;
  }

  async getMisCursos(instructorId: string) {
    const cursos = await this.cursoRepo.find({
      where: { instructorId },
      relations: ['lecciones'],
      order: { creadoEn: 'DESC' },
    });

    return cursos.map((c) => ({
      ...c,
      lecciones: c.lecciones?.sort((a, b) => a.orden - b.orden),
    }));
  }

  async createCurso(instructorId: string, dto: CreateCursoDto) {
    const curso = this.cursoRepo.create({ ...dto, instructorId, estado: 'borrador' });
    return this.cursoRepo.save(curso);
  }

  async updateCurso(id: string, instructorId: string, dto: UpdateCursoDto) {
    const curso = await this.ownedCurso(id, instructorId);
    Object.assign(curso, dto);
    return this.cursoRepo.save(curso);
  }

  async updateEstado(id: string, instructorId: string, estado: string) {
    const curso = await this.ownedCurso(id, instructorId);

    if (estado === 'publicado') {
      const count = await this.leccionRepo.count({ where: { cursoId: id } });
      if (count === 0) throw new ApiException(422, 'NO_LESSONS', 'Cannot publish a course with no lessons');
    }

    curso.estado = estado;
    return this.cursoRepo.save(curso);
  }

  async deleteCurso(id: string, instructorId: string) {
    const curso = await this.ownedCurso(id, instructorId);
    const count = await this.inscripcionRepo.count({ where: { cursoId: id } });
    if (count > 0) throw new ApiException(409, 'HAS_STUDENTS', 'Course has enrolled students; archive it instead');
    await this.cursoRepo.remove(curso);
  }

  async getResumen(id: string, instructorId: string) {
    const curso = await this.ownedCurso(id, instructorId);
    const inscripciones = await this.inscripcionRepo.find({ where: { cursoId: id } });
    const lecciones = await this.leccionRepo.find({ where: { cursoId: id }, order: { orden: 'ASC' } });

    const totalLecciones = lecciones.length;
    let sumProgress = 0;
    let sumNota = 0;
    let countNotas = 0;
    const reachedCount: Record<string, number> = {};
    lecciones.forEach((l) => (reachedCount[l.id] = 0));

    for (const insc of inscripciones) {
      const progresos = await this.progresoRepo.find({ where: { inscripcionId: insc.id } });
      const completadas = progresos.filter((p) => p.completada).length;
      sumProgress += totalLecciones > 0 ? (completadas / totalLecciones) * 100 : 0;
      for (const p of progresos) {
        reachedCount[p.leccionId] = (reachedCount[p.leccionId] || 0) + 1;
        if (p.mejorNota !== null && p.mejorNota !== undefined) {
          sumNota += p.mejorNota;
          countNotas++;
        }
      }
    }

    const inscritos = inscripciones.length;
    return {
      curso: { id: curso.id, titulo: curso.titulo },
      inscritos,
      progresoPromedio: inscritos > 0 ? Math.round(sumProgress / inscritos) : 0,
      notaPromedio: countNotas > 0 ? Math.round(sumNota / countNotas) : 0,
      lecciones: lecciones.map((l) => ({ id: l.id, titulo: l.titulo, orden: l.orden, estudiantesLlegaron: reachedCount[l.id] || 0 })),
    };
  }

  async ownedCurso(id: string, instructorId: string) {
    const curso = await this.cursoRepo.findOne({ where: { id } });
    if (!curso) throw new ApiException(404, 'NOT_FOUND', 'Course not found');
    if (curso.instructorId !== instructorId) throw new ApiException(403, 'FORBIDDEN', 'Not the owner of this course');
    return curso;
  }
}
