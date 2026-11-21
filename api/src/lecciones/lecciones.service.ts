import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leccion } from './entities/leccion.entity';
import { CreateLeccionDto } from './dto/create-leccion.dto';
import { UpdateLeccionDto } from './dto/update-leccion.dto';

@Injectable()
export class LeccionesService {
  constructor(
    @InjectRepository(Leccion)
    private readonly leccionesRepository: Repository<Leccion>,
  ) {}

  async create(createLeccionDto: CreateLeccionDto): Promise<Leccion> {
    const leccion = this.leccionesRepository.create(createLeccionDto);
    return this.leccionesRepository.save(leccion);
  }

  async findByCurso(cursoId: number): Promise<Leccion[]> {
    return this.leccionesRepository.find({
      where: { cursoId },
      order: { orden: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Leccion> {
    const leccion = await this.leccionesRepository.findOne({
      where: { id },
    });
    if (!leccion) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada`);
    }
    return leccion;
  }

  async update(id: number, updateLeccionDto: UpdateLeccionDto): Promise<Leccion> {
    const leccion = await this.findOne(id);
    Object.assign(leccion, updateLeccionDto);
    return this.leccionesRepository.save(leccion);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const leccion = await this.findOne(id);
    await this.leccionesRepository.remove(leccion);
    return { deleted: true };
  }
}