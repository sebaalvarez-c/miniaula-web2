import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeccionesService } from './lecciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateLeccionDto } from './dto/create-leccion.dto';
import { UpdateLeccionDto } from './dto/update-leccion.dto';
import { ReordenarLeccionesDto } from './dto/reordenar-lecciones.dto';
import { AuthUser } from '../common/types/auth-user.type';

@ApiTags('lecciones')
@Controller()
export class LeccionesController {
  constructor(private leccionesService: LeccionesService) {}

  @Get('lecciones/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('estudiante')
  getLeccion(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.leccionesService.getLeccionAccesible(id, user.id);
  }

  @Post('lecciones/:id/completar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('estudiante')
  completarLeccion(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.leccionesService.completarLeccion(id, user.id);
  }

  @Post('instructor/cursos/:cursoId/lecciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  createLeccion(
    @Param('cursoId') cursoId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateLeccionDto,
  ) {
    return this.leccionesService.createLeccion(cursoId, user.id, dto);
  }

  @Patch('instructor/cursos/:id/lecciones/orden')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  reordenarLecciones(
    @Param('id') cursoId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: ReordenarLeccionesDto,
  ) {
    return this.leccionesService.reordenarLecciones(cursoId, user.id, dto.orden);
  }

  @Patch('instructor/lecciones/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  updateLeccion(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateLeccionDto,
  ) {
    return this.leccionesService.updateLeccion(id, user.id, dto);
  }

  @Delete('instructor/lecciones/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  @HttpCode(204)
  deleteLeccion(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.leccionesService.deleteLeccion(id, user.id);
  }
}