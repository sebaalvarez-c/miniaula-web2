import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { CuestionariosService } from './cuestionarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubmitIntentoDto } from './dto/submit-intento.dto';

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
}
