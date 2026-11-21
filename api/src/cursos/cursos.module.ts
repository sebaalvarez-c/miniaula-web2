import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Leccion } from '../lecciones/entities/leccion.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Progreso } from '../inscripciones/entities/progreso.entity';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Leccion, Inscripcion, Progreso])],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService, TypeOrmModule],
})
export class CursosModule {}
