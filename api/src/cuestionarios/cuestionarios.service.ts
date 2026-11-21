import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pregunta } from './entities/pregunta.entity';
import { SubmitIntentoDto } from './dto/submit-intento.dto';

@Injectable()
export class CuestionariosService {
  constructor(
    @InjectRepository(Pregunta)
    private readonly preguntasRepository: Repository<Pregunta>,
  ) {}

  async createPregunta(data: {
    enunciado: string;
    opciones: string[];
    respuestaCorrecta: number;
    leccionId: number;
  }): Promise<Pregunta> {
    const pregunta = this.preguntasRepository.create(data);
    return this.preguntasRepository.save(pregunta);
  }

  async findPreguntasByLeccion(leccionId: number) {
    const preguntas = await this.preguntasRepository.find({
      where: { leccionId },
      order: { id: 'ASC' },
    });

    // No exponer respuestaCorrecta al estudiante antes de responder
    return preguntas.map(({ respuestaCorrecta, ...rest }) => rest);
  }

  async evaluarIntento(dto: SubmitIntentoDto) {
    const preguntas = await this.preguntasRepository.find({
      where: { leccionId: dto.leccionId },
    });

    if (!preguntas || preguntas.length === 0) {
      throw new NotFoundException('No hay preguntas registradas para esta lección');
    }

    const mapaCorrectas = new Map<number, number>();
    preguntas.forEach((p) => mapaCorrectas.set(p.id, p.respuestaCorrecta));

    let aciertos = 0;
    const detalle = dto.respuestas.map((resp) => {
      const correcta = mapaCorrectas.get(resp.preguntaId);
      const esCorrecta = correcta !== undefined && correcta === resp.opcionSeleccionada;
      if (esCorrecta) aciertos++;
      return {
        preguntaId: resp.preguntaId,
        opcionSeleccionada: resp.opcionSeleccionada,
        esCorrecta,
      };
    });

    const total = preguntas.length;
    const puntaje = Math.round((aciertos / total) * 100);

    return {
      leccionId: dto.leccionId,
      totalPreguntas: total,
      aciertos,
      puntaje,
      aprobado: puntaje >= 70,
      detalle,
    };
  }
}