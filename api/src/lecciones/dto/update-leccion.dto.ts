import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLeccionDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsIn(['contenido', 'cuestionario'])
  tipo?: string;

  @IsOptional()
  @IsString()
  contenido?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  notaMinima?: number;
}
