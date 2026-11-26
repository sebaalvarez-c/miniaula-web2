import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CuestionariosService } from './cuestionarios.service';
import { SubmitIntentoDto } from './dto/submit-intento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cuestionarios')
export class CuestionariosController {
  constructor(private readonly cuestionariosService: CuestionariosService) {}

  @Roles('instructor')
  @Post('preguntas')
  createPregunta(
    @Body()
    body: {
      enunciado: string;
      opciones: string[];
      respuestaCorrecta: number;
      leccionId: number;
    },
  ) {
    return this.cuestionariosService.createPregunta(body);
  }

  @Get('leccion/:leccionId')
  getPreguntasByLeccion(@Param('leccionId', ParseIntPipe) leccionId: number) {
    return this.cuestionariosService.findPreguntasByLeccion(leccionId);
  }

  @Post('intentos')
  submitIntento(@Body() submitIntentoDto: SubmitIntentoDto) {
    return this.cuestionariosService.evaluarIntento(submitIntentoDto);
  }
}