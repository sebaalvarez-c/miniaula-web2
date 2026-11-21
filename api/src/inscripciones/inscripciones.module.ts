import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Progreso } from './entities/progreso.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Leccion } from '../lecciones/entities/leccion.entity';
import { User } from '../users/entities/user.entity';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Progreso, Curso, Leccion, User])],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
})
export class InscripcionesModule {}
