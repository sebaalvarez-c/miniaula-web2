import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LeccionesService } from './lecciones.service';
import { CreateLeccionDto } from './dto/create-leccion.dto';
import { UpdateLeccionDto } from './dto/update-leccion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lecciones')
export class LeccionesController {
  constructor(private readonly leccionesService: LeccionesService) {}

  @Roles('instructor')
  @Post()
  create(@Body() createLeccionDto: CreateLeccionDto) {
    return this.leccionesService.create(createLeccionDto);
  }

  @Get('curso/:cursoId')
  findByCurso(@Param('cursoId', ParseIntPipe) cursoId: number) {
    return this.leccionesService.findByCurso(cursoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leccionesService.findOne(id);
  }

  @Roles('instructor')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeccionDto: UpdateLeccionDto,
  ) {
    return this.leccionesService.update(id, updateLeccionDto);
  }

  @Roles('instructor')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leccionesService.remove(id);
  }
}