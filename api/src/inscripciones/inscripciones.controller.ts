import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InscripcionesService } from './inscripciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsUUID } from 'class-validator';
import { AuthUser } from '../common/types/auth-user.type';

class InscribirDto {
  @IsUUID()
  cursoId: string;
}

@ApiTags('inscripciones')
@Controller()
export class InscripcionesController {
  constructor(private inscripcionesService: InscripcionesService) {}

  @Post('inscripciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('estudiante')
  inscribir(@CurrentUser() user: AuthUser, @Body() dto: InscribirDto) {
    return this.inscripcionesService.inscribir(dto.cursoId, user.id);
  }

  @Get('inscripciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('estudiante')
  getMisInscripciones(@CurrentUser() user: AuthUser) {
    return this.inscripcionesService.getMisInscripciones(user.id);
  }

  @Get('cursos/:cursoId/progreso')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('estudiante')
  getProgreso(@Param('cursoId') cursoId: string, @CurrentUser() user: AuthUser) {
    return this.inscripcionesService.getProgresoCurso(cursoId, user.id);
  }
}
