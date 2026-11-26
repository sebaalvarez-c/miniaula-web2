import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateLeccionDto {
  @IsString()
  @IsNotEmpty({ message: 'El título de la lección es obligatorio' })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'El contenido de la lección es obligatorio' })
  contenido: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  orden?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  duracionMinutos?: number;

  @IsOptional()
  @IsUrl({}, { message: 'La URL del video debe ser válida' })
  videoUrl?: string;

  @IsInt()
  @IsNotEmpty({ message: 'El cursoId es obligatorio' })
  cursoId: number;
}