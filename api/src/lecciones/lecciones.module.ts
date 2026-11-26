import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leccion } from './entities/leccion.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Progreso } from '../inscripciones/entities/progreso.entity';
import { Pregunta } from '../cuestionarios/entities/pregunta.entity';
import { LeccionesService } from './lecciones.service';
import { LeccionesController } from './lecciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leccion, Curso, Inscripcion, Progreso, Pregunta])],
  controllers: [LeccionesController],
  providers: [LeccionesService],
  exports: [LeccionesService, TypeOrmModule],
})
export class LeccionesModule {}
