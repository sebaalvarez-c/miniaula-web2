import { Controller, Get, Post, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CuestionariosService } from './cuestionarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubmitIntentoDto } from './dto/submit-intento.dto';

@ApiTags('cuestionarios')
@Controller()
export class CuestionariosController {
  constructor(private cuestionariosService: CuestionariosService) {}

  @Get('lecciones/:id/preguntas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('estudiante')
  getPreguntas(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cuestionariosService.getPreguntas(id, user.id);
  }

  @Post('lecciones/:id/intentos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('estudiante')
  submitIntento(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: SubmitIntentoDto) {
    return this.cuestionariosService.submitIntento(id, user.id, dto.respuestas);
  }

  @Post('instructor/lecciones/:id/preguntas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  createPregunta(@Param('id') id: string, @CurrentUser() user: any, @Body() body: any) {
    return this.cuestionariosService.createPregunta(id, user.id, body);
  }

  @Delete('instructor/preguntas/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor')
  @HttpCode(204)
  deletePregunta(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cuestionariosService.deletePregunta(id, user.id);
  }
}
