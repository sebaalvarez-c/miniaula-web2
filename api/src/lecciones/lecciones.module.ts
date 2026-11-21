import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leccion } from './entities/leccion.entity';
import { LeccionesService } from './lecciones.service';
import { LeccionesController } from './lecciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leccion])],
  controllers: [LeccionesController],
  providers: [LeccionesService],
  exports: [LeccionesService, TypeOrmModule],
})
export class LeccionesModule {}