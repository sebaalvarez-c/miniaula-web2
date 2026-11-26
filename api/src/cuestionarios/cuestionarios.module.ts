import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pregunta } from './entities/pregunta.entity';
import { CuestionariosService } from './cuestionarios.service';
import { CuestionariosController } from './cuestionarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pregunta])],
  controllers: [CuestionariosController],
  providers: [CuestionariosService],
  exports: [CuestionariosService, TypeOrmModule],
})
export class CuestionariosModule {}