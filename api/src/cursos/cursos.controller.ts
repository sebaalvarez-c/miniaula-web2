import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CursosService } from './cursos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto, UpdateEstadoDto } from './dto/update-curso.dto';

@ApiTags('cursos')
@Controller()
export class CursosController {
  constructor(private cursosService: CursosService) {}

  @Get('cursos')
  getCatalogo(
    @Query('q') q?: string,
    @Query('categoria') categoria?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.cursosService.getCatalogo(q, categoria, page ? +page : 1, limit ? +limit : 9);
  }

  @Get('cursos/:id')
  getCursoDetalle(@Param('id') id: string) {
    return this.cursosService.getCursoDetalle(id);
  }

  @Get('instructor/cursos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  getMisCursos(@CurrentUser() user: any) {
    return this.cursosService.getMisCursos(user.id);
  }

  @Post('instructor/cursos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  createCurso(@CurrentUser() user: any, @Body() dto: CreateCursoDto) {
    return this.cursosService.createCurso(user.id, dto);
  }

  @Patch('instructor/cursos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  updateCurso(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateCursoDto) {
    return this.cursosService.updateCurso(id, user.id, dto);
  }

  @Patch('instructor/cursos/:id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  updateEstado(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateEstadoDto) {
    return this.cursosService.updateEstado(id, user.id, dto.estado);
  }

  @Delete('instructor/cursos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  @HttpCode(204)
  deleteCurso(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cursosService.deleteCurso(id, user.id);
  }

  @Get('instructor/cursos/:id/resumen')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  getResumen(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cursosService.getResumen(id, user.id);
  }
}
