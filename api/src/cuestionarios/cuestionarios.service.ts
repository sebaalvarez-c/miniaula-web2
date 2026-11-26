import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pregunta } from './entities/pregunta.entity';
import { Leccion } from '../lecciones/entities/leccion.entity';
import { Progreso } from '../inscripciones/entities/progreso.entity';
import { ApiException } from '../common/exceptions/api.exception';
import { LeccionesService } from '../lecciones/lecciones.service';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';

@Injectable()
export class CuestionariosService {
  constructor(
    @InjectRepository(Pregunta) private preguntaRepo: Repository<Pregunta>,
    @InjectRepository(Leccion) private leccionRepo: Repository<Leccion>,
    @InjectRepository(Progreso) private progresoRepo: Repository<Progreso>,
    private leccionesService: LeccionesService,
  ) {}

  async getPreguntas(leccionId: string, userId: string) {
    await this.leccionesService.verificarAccesoLeccion(leccionId, userId);

    const preguntas = await this.preguntaRepo.find({ where: { leccionId } });
    return preguntas.map(({ indiceCorrecto, ...p }) => p);
  }

  async createPregunta(leccionId: string, instructorId: string, data: { enunciado: string; opciones: string[]; indiceCorrecto: number }) {
    const leccion = await this.leccionRepo.findOne({ where: { id: leccionId }, relations: ['curso'] });
    if (!leccion) throw new ApiException(404, 'NOT_FOUND', 'Lesson not found');
    if (leccion.curso?.instructorId !== instructorId) throw new ApiException(403, 'FORBIDDEN', 'Not your course');
    if (leccion.tipo !== 'cuestionario') throw new ApiException(422, 'WRONG_TYPE', 'Lesson is not a quiz');
    return this.preguntaRepo.save(this.preguntaRepo.create({ ...data, leccionId }));
  }

  async updatePregunta(preguntaId: string, instructorId: string, data: CreatePreguntaDto) {
    const pregunta = await this.preguntaRepo.findOne({
      where: { id: preguntaId },
      relations: ['leccion', 'leccion.curso'],
    });
    if (!pregunta) throw new ApiException(404, 'NOT_FOUND', 'Question not found');
    if (pregunta.leccion?.curso?.instructorId !== instructorId) {
      throw new ApiException(403, 'FORBIDDEN', 'Not your course');
    }
    if (data.indiceCorrecto >= data.opciones.length) {
      throw new ApiException(422, 'INVALID_INDEX', 'Correct answer index is out of range');
    }
    Object.assign(pregunta, data);
    return this.preguntaRepo.save(pregunta);
  }

  async deletePregunta(preguntaId: string, instructorId: string) {
    const pregunta = await this.preguntaRepo.findOne({ where: { id: preguntaId }, relations: ['leccion', 'leccion.curso'] });
    if (!pregunta) throw new ApiException(404, 'NOT_FOUND', 'Question not found');
    if (pregunta.leccion?.curso?.instructorId !== instructorId) throw new ApiException(403, 'FORBIDDEN', 'Not your course');
    await this.preguntaRepo.remove(pregunta);
  }

  // RN-02 and RN-03
  async submitIntento(leccionId: string, userId: string, respuestas: number[]) {
    const { leccion, inscripcion } = await this.leccionesService.verificarAccesoLeccion(leccionId, userId);
    if (leccion.tipo !== 'cuestionario') throw new ApiException(422, 'WRONG_TYPE', 'This lesson is not a quiz');

    let progreso = await this.progresoRepo.findOne({ where: { inscripcionId: inscripcion.id, leccionId } });
    if (!progreso) {
      progreso = this.progresoRepo.create({ inscripcionId: inscripcion.id, leccionId, completada: false, intentos: 0, mejorNota: null });
    }

    if (progreso.intentos >= 3) {
      throw new ApiException(422, 'MAX_INTENTOS', 'Maximum attempts (3) reached', { intentos: progreso.intentos, mejorNota: progreso.mejorNota });
    }

    const preguntas = await this.preguntaRepo.find({ where: { leccionId } });
    if (preguntas.length === 0) throw new ApiException(422, 'NO_QUESTIONS', 'Quiz has no questions');
    if (respuestas.length !== preguntas.length) {
      throw new ApiException(400, 'WRONG_ANSWER_COUNT', `Expected ${preguntas.length} answers, got ${respuestas.length}`);
    }

    let correctas = 0;
    for (let i = 0; i < preguntas.length; i++) {
      if (respuestas[i] === preguntas[i].indiceCorrecto) correctas++;
    }

    const nota = Math.round((correctas / preguntas.length) * 100);
    const notaMinima = leccion.notaMinima ?? 60;
    const aprobado = nota >= notaMinima;
    const nuevosIntentos = progreso.intentos + 1;
    const mejorNota = progreso.mejorNota !== null ? Math.max(progreso.mejorNota, nota) : nota;

    progreso.intentos = nuevosIntentos;
    progreso.mejorNota = mejorNota;
    progreso.completada = aprobado || progreso.completada;
    await this.progresoRepo.save(progreso);

    return { nota, aprobado, mejorNota, intentos: nuevosIntentos, intentosRestantes: 3 - nuevosIntentos, notaMinima };
  }
}
