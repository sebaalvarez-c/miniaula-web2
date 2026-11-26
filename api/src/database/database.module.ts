import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Leccion } from '../lecciones/entities/leccion.entity';
import { Pregunta } from '../cuestionarios/entities/pregunta.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Curso, Leccion, Pregunta])],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
