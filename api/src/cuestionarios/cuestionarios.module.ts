import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeccionesModule } from '../lecciones/lecciones.module';
import { Pregunta } from './entities/pregunta.entity';
import { Leccion } from '../lecciones/entities/leccion.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Progreso } from '../inscripciones/entities/progreso.entity';
import { CuestionariosService } from './cuestionarios.service';
import { CuestionariosController } from './cuestionarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pregunta, Leccion, Inscripcion, Progreso]), LeccionesModule],
  controllers: [CuestionariosController],
  providers: [CuestionariosService],
})
export class CuestionariosModule {}
